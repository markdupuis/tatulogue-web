// Syncs the Printful store catalog into content/store/products.json.
// Usage: PRINTFUL_API_KEY=... npm run sync:store
// Node 18+ (native fetch), no dependencies.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PRINTFUL_API_BASE = 'https://api.printful.com';
const PAGE_LIMIT = 100;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT_PATH = join(ROOT, 'content', 'store', 'products.json');
const COPY_PATH = join(ROOT, 'content', 'store', 'copy.json');
const ENV_LOCAL_PATH = join(ROOT, '.env.local');

// Marketing/SEO copy keyed by slug — Printful has no description field,
// so we merge our own (committed, survives every re-sync).
function loadCopy() {
  if (!existsSync(COPY_PATH)) return {};
  try {
    return JSON.parse(readFileSync(COPY_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function loadEnvLocal() {
  if (!existsSync(ENV_LOCAL_PATH)) return;
  for (const line of readFileSync(ENV_LOCAL_PATH, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, '');
  }
}

function getApiKey() {
  loadEnvLocal();
  const key = process.env.PRINTFUL_API_KEY;
  if (!key) {
    console.error(
      'ERROR: PRINTFUL_API_KEY is not set. Export it or add it to .env.local:\n' +
      '  PRINTFUL_API_KEY=your-printful-token'
    );
    process.exit(1);
  }
  return key;
}

async function printfulGet(apiKey, path) {
  const res = await fetch(`${PRINTFUL_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (res.status === 401 || res.status === 403) {
    console.error(`ERROR: Printful rejected the API key (HTTP ${res.status}). Check PRINTFUL_API_KEY.`);
    process.exit(1);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Printful GET ${path} failed: HTTP ${res.status} ${body}`);
  }
  return res.json();
}

async function fetchAllProductSummaries(apiKey) {
  const summaries = [];
  let offset = 0;
  for (;;) {
    const page = await printfulGet(apiKey, `/store/products?limit=${PAGE_LIMIT}&offset=${offset}`);
    summaries.push(...(page.result ?? []));
    const paging = page.paging ?? { total: summaries.length };
    offset += PAGE_LIMIT;
    if (offset >= paging.total) break;
  }
  return summaries;
}

function toKebabCase(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseColorSize(variant) {
  // Printful variant names are usually "Product Name - Color / Size".
  // Prefer explicit options when present.
  let color = '';
  let size = variant.size ?? '';
  for (const opt of variant.options ?? []) {
    if (opt.id === 'color' && typeof opt.value === 'string') color = opt.value;
    if (opt.id === 'size' && typeof opt.value === 'string') size = opt.value;
  }
  if (!color || !size) {
    const tail = variant.name.includes(' - ')
      ? variant.name.slice(variant.name.lastIndexOf(' - ') + 3)
      : variant.name;
    const parts = tail.split('/').map((p) => p.trim());
    if (parts.length === 2) {
      color = color || parts[0];
      size = size || parts[1];
    } else if (parts.length === 1) {
      color = color || parts[0];
    }
  }
  return { color, size };
}

function pickVariantImage(variant, fallbackThumbnail) {
  const preview = (variant.files ?? []).find((f) => f.type === 'preview');
  return preview?.preview_url ?? fallbackThumbnail ?? '';
}

function variantDisplayName(color, size, rawName) {
  if (color && size) return `${color} / ${size}`;
  return color || size || rawName;
}

function mapProduct(detail) {
  const syncProduct = detail.sync_product;
  const thumbnail = syncProduct.thumbnail_url ?? '';
  const variants = (detail.sync_variants ?? []).map((variant) => {
    const { color, size } = parseColorSize(variant);
    return {
      sync_variant_id: variant.id,
      name: variantDisplayName(color, size, variant.name),
      size,
      color,
      price_cents: Math.round(parseFloat(variant.retail_price) * 100),
      image: pickVariantImage(variant, thumbnail),
    };
  });
  const slug = toKebabCase(syncProduct.name);
  const copy = COPY[slug] ?? {};
  return {
    id: syncProduct.id,
    slug,
    name: syncProduct.name,
    description: copy.description ?? syncProduct.description ?? '',
    seo_title: copy.seo_title ?? null,
    thumbnail,
    variants,
  };
}

const COPY = loadCopy();

async function main() {
  const apiKey = getApiKey();
  console.log('Fetching Printful store products…');
  const summaries = await fetchAllProductSummaries(apiKey);
  console.log(`Found ${summaries.length} product(s). Fetching variants…`);

  const products = [];
  for (const summary of summaries) {
    const detail = await printfulGet(apiKey, `/store/products/${summary.id}`);
    const product = mapProduct(detail.result);
    products.push(product);
    console.log(`  • ${product.name} (${product.variants.length} variant(s))`);
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(products, null, 2) + '\n', 'utf8');

  const variantCount = products.reduce((sum, p) => sum + p.variants.length, 0);
  console.log(`\nWrote ${products.length} product(s) / ${variantCount} variant(s) to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(`ERROR: ${err.message}`);
  process.exit(1);
});
