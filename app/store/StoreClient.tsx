'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { CartProvider, useCart, type CartItem } from '@/lib/store/cart';
import { startCheckout } from '@/lib/store/checkout';

export interface ProductVariant {
  sync_variant_id: number;
  name: string;
  size: string;
  color: string;
  price_cents: number;
  image: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  thumbnail: string;
  variants: ProductVariant[];
}

const GRAD_BLUE = 'linear-gradient(135deg, #2B5876, #4E4376)';
const ZIP_PATTERN = /^\d{5}(-\d{4})?$/;
const SHIPPING_STORAGE_KEY = 'tatu_ship_v1';

const US_STATES: { code: string; label: string }[] = [
  { code: 'AL', label: 'Alabama' },
  { code: 'AK', label: 'Alaska' },
  { code: 'AZ', label: 'Arizona' },
  { code: 'AR', label: 'Arkansas' },
  { code: 'CA', label: 'California' },
  { code: 'CO', label: 'Colorado' },
  { code: 'CT', label: 'Connecticut' },
  { code: 'DE', label: 'Delaware' },
  { code: 'DC', label: 'District of Columbia' },
  { code: 'FL', label: 'Florida' },
  { code: 'GA', label: 'Georgia' },
  { code: 'HI', label: 'Hawaii' },
  { code: 'ID', label: 'Idaho' },
  { code: 'IL', label: 'Illinois' },
  { code: 'IN', label: 'Indiana' },
  { code: 'IA', label: 'Iowa' },
  { code: 'KS', label: 'Kansas' },
  { code: 'KY', label: 'Kentucky' },
  { code: 'LA', label: 'Louisiana' },
  { code: 'ME', label: 'Maine' },
  { code: 'MD', label: 'Maryland' },
  { code: 'MA', label: 'Massachusetts' },
  { code: 'MI', label: 'Michigan' },
  { code: 'MN', label: 'Minnesota' },
  { code: 'MS', label: 'Mississippi' },
  { code: 'MO', label: 'Missouri' },
  { code: 'MT', label: 'Montana' },
  { code: 'NE', label: 'Nebraska' },
  { code: 'NV', label: 'Nevada' },
  { code: 'NH', label: 'New Hampshire' },
  { code: 'NJ', label: 'New Jersey' },
  { code: 'NM', label: 'New Mexico' },
  { code: 'NY', label: 'New York' },
  { code: 'NC', label: 'North Carolina' },
  { code: 'ND', label: 'North Dakota' },
  { code: 'OH', label: 'Ohio' },
  { code: 'OK', label: 'Oklahoma' },
  { code: 'OR', label: 'Oregon' },
  { code: 'PA', label: 'Pennsylvania' },
  { code: 'RI', label: 'Rhode Island' },
  { code: 'SC', label: 'South Carolina' },
  { code: 'SD', label: 'South Dakota' },
  { code: 'TN', label: 'Tennessee' },
  { code: 'TX', label: 'Texas' },
  { code: 'UT', label: 'Utah' },
  { code: 'VT', label: 'Vermont' },
  { code: 'VA', label: 'Virginia' },
  { code: 'WA', label: 'Washington' },
  { code: 'WV', label: 'West Virginia' },
  { code: 'WI', label: 'Wisconsin' },
  { code: 'WY', label: 'Wyoming' },
];

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function minPriceCents(product: Product): number {
  return Math.min(...product.variants.map((v) => v.price_cents));
}

// ── Page chrome (Style A — matches app/page.tsx) ───────────────────────

function BrandStyles() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,600;0,800;0,900;1,800&family=Space+Grotesk:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .font-display { font-family: 'Archivo', system-ui, sans-serif; }
        .font-body { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .tl-surface { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); }
        .tl-text-grad-blue {
          background: linear-gradient(135deg, #4E4376, #2B5876);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .tl-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .5;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.32'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
        }
        .tl-card { transition: transform .4s cubic-bezier(.2,.8,.2,1), border-color .4s; }
        .tl-card:hover { transform: translateY(-8px); border-color: rgba(78,67,118,0.55); }
        .tl-card-img { transition: transform .7s cubic-bezier(.2,.8,.2,1); }
        .tl-card:hover .tl-card-img { transform: scale(1.06); }
        .tl-btn-energy { background: linear-gradient(135deg, #F12711, #F5AF19); transition: filter .35s ease; }
        .tl-btn-energy:hover { filter: brightness(1.08) saturate(1.1); }
        .tl-btn-blue { background: linear-gradient(135deg, #2B5876, #4E4376); transition: filter .35s ease; }
        .tl-btn-blue:hover { filter: brightness(1.12); }
        ::selection { background: #4E4376; color: #fff; }
        a:focus-visible, button:focus-visible { outline: 2px solid #F5AF19; outline-offset: 2px; }
        @keyframes tl-spin { to { transform: rotate(360deg); } }
        .tl-spinner {
          width: 1rem; height: 1rem; border-radius: 9999px;
          border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
          animation: tl-spin .7s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .tl-card, .tl-card-img { transition: none; }
        }
      `}</style>
    </>
  );
}

function StoreNav({ onOpenCart }: { onOpenCart: () => void }) {
  const { count } = useCart();
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="backdrop-blur-xl bg-[#07070d]/60 border-b border-white/[0.08]">
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <a href="/" className="font-display font-black tracking-[-0.04em] text-xl sm:text-2xl">TATULOGUE</a>
          <div className="hidden md:flex items-center gap-9 text-sm text-white/60">
            <a href="/blog" className="hover:text-white transition-colors">Articles</a>
            <a href="/artists" className="hover:text-white transition-colors">Artists</a>
            <a href="/store" className="text-white transition-colors">Store</a>
            <a href="/about" className="hover:text-white transition-colors">About</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
            className="relative flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] hover:border-[#F5AF19] hover:text-[#F5AF19] px-5 py-2.5 text-sm font-medium transition-colors min-h-[44px]"
          >
            Cart
            {count > 0 && (
              <span className="tl-btn-energy absolute -top-2 -right-2 min-w-[1.35rem] h-[1.35rem] px-1 rounded-full text-[11px] font-bold text-white flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

function StoreFooter() {
  return (
    <footer className="border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <a href="/" className="font-display font-black tracking-[-0.04em] text-2xl">TATULOGUE</a>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/50">
            <a href="/blog" className="hover:text-white transition-colors">Articles</a>
            <a href="/artists" className="hover:text-white transition-colors">Artists</a>
            <a href="/store" className="hover:text-white transition-colors">Store</a>
            <a href="/about" className="hover:text-white transition-colors">About</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
          </nav>
        </div>
        <p className="mt-10 text-xs text-white/30">© 2026 Tatulogue. Tattoo culture, education, and the artists shaping it.</p>
      </div>
    </footer>
  );
}

// ── Empty-catalog hero ─────────────────────────────────────────────────

function ComingSoonHero() {
  return (
    <section className="relative min-h-[70svh] flex items-center overflow-hidden tl-grain">
      <div
        className="absolute -bottom-20 -left-20 w-[34rem] h-[34rem] rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(43,88,118,0.45), transparent 70%)' }}
        aria-hidden
      />
      <div
        className="absolute top-10 right-0 w-[26rem] h-[26rem] rounded-full blur-[150px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(241,39,17,0.18), transparent 70%)' }}
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-28 w-full">
        <p className="tl-text-grad-blue text-xs sm:text-sm tracking-[0.35em] font-medium mb-6">STORE</p>
        <h1 className="font-display font-black leading-[0.92] tracking-[-0.035em] text-5xl sm:text-7xl max-w-4xl">
          Merch drop coming soon.
        </h1>
        <p className="mt-7 max-w-xl text-base sm:text-lg text-white/60 leading-relaxed">
          Tees, hoodies, and hats made for the chair and the street. The first run is in the works —
          get on the list and you&apos;ll hear about it first.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="/#early-access"
            className="tl-btn-energy rounded-full px-7 py-3.5 font-semibold text-white shadow-[0_0_40px_-10px_rgba(241,39,17,0.8)]"
          >
            Get notified
          </a>
          <a
            href="/blog"
            className="rounded-full border border-white/20 hover:border-[#F5AF19] hover:text-[#F5AF19] hover:bg-white/5 px-7 py-3.5 font-medium transition-colors"
          >
            Read the articles
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Product grid ───────────────────────────────────────────────────────

function ProductGrid({ products, onSelect }: { products: Product[]; onSelect: (p: Product) => void }) {
  return (
    <section className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-32 pb-24">
      <div className="mb-14">
        <p className="tl-text-grad-blue text-xs sm:text-sm tracking-[0.35em] font-medium mb-5">STORE</p>
        <h1 className="font-display font-black tracking-[-0.035em] leading-[0.95] text-4xl sm:text-6xl">
          Official Tatulogue merch.
        </h1>
        <p className="mt-5 max-w-xl text-white/60 leading-relaxed">
          Printed on demand and shipped to your door, anywhere in the US.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <button
            key={product.slug}
            type="button"
            onClick={() => onSelect(product)}
            className="tl-card group tl-surface rounded-2xl overflow-hidden flex flex-col text-left"
          >
            <div className="relative aspect-square overflow-hidden bg-white/[0.02]">
              <img
                src={product.thumbnail}
                alt={product.name}
                loading="lazy"
                className="tl-card-img w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex items-end justify-between gap-4">
              <h2 className="font-display font-bold text-lg leading-tight tracking-[-0.01em] group-hover:text-[#F5AF19] transition-colors">
                {product.name}
              </h2>
              <p className="text-sm text-white/40 whitespace-nowrap">
                from <span className="text-white font-semibold">{formatPrice(minPriceCents(product))}</span>
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ── Product detail panel ───────────────────────────────────────────────

function uniqueInOrder(values: string[]): string[] {
  return values.filter((v, i) => v && values.indexOf(v) === i);
}

function ProductDetail({
  product,
  onClose,
  onAdded,
}: {
  product: Product;
  onClose: () => void;
  onAdded: () => void;
}) {
  const { add } = useCart();
  const colors = useMemo(() => uniqueInOrder(product.variants.map((v) => v.color)), [product]);
  const [color, setColor] = useState(colors[0] ?? '');
  const sizes = useMemo(
    () => uniqueInOrder(product.variants.filter((v) => !color || v.color === color).map((v) => v.size)),
    [product, color]
  );
  const [size, setSize] = useState(sizes[0] ?? '');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!sizes.includes(size)) setSize(sizes[0] ?? '');
  }, [sizes, size]);

  const variant =
    product.variants.find((v) => (!color || v.color === color) && (!size || v.size === size)) ??
    product.variants[0];

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleAdd() {
    add(
      {
        sync_variant_id: variant.sync_variant_id,
        product_slug: product.slug,
        name: product.name,
        variant_name: variant.name,
        price_cents: variant.price_cents,
        image: variant.image || product.thumbnail,
      },
      qty
    );
    setAdded(true);
    // Close the product modal and reveal the cart so the add is obvious.
    onAdded();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <button type="button" aria-label="Close product details" onClick={onClose} className="absolute inset-0 bg-[#07070d]/80 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="relative w-full sm:max-w-3xl max-h-[92svh] overflow-y-auto tl-surface bg-[#0c0c14] rounded-t-2xl sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full border border-white/15 bg-[#07070d]/70 text-white/70 hover:text-white hover:border-[#F5AF19] transition-colors"
        >
          ✕
        </button>

        <div className="grid sm:grid-cols-2">
          <div className="aspect-square bg-white/[0.02] overflow-hidden">
            <img
              src={variant.image || product.thumbnail}
              alt={`${product.name} — ${variant.name}`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-8 flex flex-col gap-6">
            <div>
              <p className="tl-text-grad-blue text-xs tracking-[0.3em] font-medium mb-3">STORE</p>
              <h2 className="font-display font-black text-2xl sm:text-3xl tracking-[-0.02em] leading-tight">
                {product.name}
              </h2>
              <p className="mt-3 text-sm text-white/50 leading-relaxed">{product.description}</p>
            </div>

            {colors.length > 0 && (
              <fieldset>
                <legend className="text-xs tracking-[0.2em] text-white/40 mb-2.5">COLOR</legend>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      aria-pressed={c === color}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors min-h-[44px] ${
                        c === color
                          ? 'border-[#4E4376] text-white'
                          : 'border-white/15 text-white/60 hover:border-white/40'
                      }`}
                      style={c === color ? { background: GRAD_BLUE } : undefined}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {sizes.length > 0 && sizes[0] !== '' && (
              <fieldset>
                <legend className="text-xs tracking-[0.2em] text-white/40 mb-2.5">SIZE</legend>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      aria-pressed={s === size}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors min-w-[44px] min-h-[44px] ${
                        s === size
                          ? 'border-[#4E4376] text-white'
                          : 'border-white/15 text-white/60 hover:border-white/40'
                      }`}
                      style={s === size ? { background: GRAD_BLUE } : undefined}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="flex items-center justify-between gap-4 mt-auto">
              <p className="font-display font-extrabold text-2xl">{formatPrice(variant.price_cents)}</p>
              <QtyStepper qty={qty} onChange={setQty} label={`Quantity of ${product.name}`} />
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="tl-btn-energy w-full py-4 rounded-xl text-white font-bold shadow-[0_0_30px_-8px_rgba(241,39,17,0.7)]"
            >
              {added ? 'Added ✓' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QtyStepper({
  qty,
  onChange,
  label,
}: {
  qty: number;
  onChange: (qty: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-white/15" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, qty - 1))}
        aria-label="Decrease quantity"
        className="w-11 h-11 text-white/60 hover:text-white transition-colors"
      >
        −
      </button>
      <span className="min-w-[1.5rem] text-center text-sm font-semibold" aria-live="polite">{qty}</span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label="Increase quantity"
        className="w-11 h-11 text-white/60 hover:text-white transition-colors"
      >
        +
      </button>
    </div>
  );
}

// ── Cart drawer ────────────────────────────────────────────────────────

function CartLine({ item }: { item: CartItem }) {
  const { setQty, remove } = useCart();
  return (
    <li className="flex gap-4 py-5 border-b border-white/[0.08]">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 rounded-xl object-cover bg-white/[0.02] border border-white/[0.08]"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold leading-snug truncate">{item.name}</p>
        <p className="text-sm text-white/40 mt-0.5">{item.variant_name}</p>
        <div className="flex items-center justify-between mt-3">
          <QtyStepper
            qty={item.qty}
            onChange={(q) => setQty(item.sync_variant_id, q)}
            label={`Quantity of ${item.name}`}
          />
          <button
            type="button"
            onClick={() => remove(item.sync_variant_id)}
            className="text-xs text-white/40 hover:text-[#F5AF19] transition-colors underline underline-offset-2 min-h-[44px]"
          >
            Remove
          </button>
        </div>
      </div>
      <p className="font-semibold text-sm whitespace-nowrap">{formatPrice(item.price_cents * item.qty)}</p>
    </li>
  );
}

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, subtotalCents } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stateCode, setStateCode] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SHIPPING_STORAGE_KEY);
      if (!raw) return;
      const saved: { state_code?: unknown; zip?: unknown } = JSON.parse(raw);
      if (typeof saved.state_code === 'string') setStateCode(saved.state_code);
      if (typeof saved.zip === 'string') setZip(saved.zip);
    } catch {
      // Corrupt or inaccessible storage — fall back to empty fields.
    }
  }, []);

  function persistShipping(nextStateCode: string, nextZip: string) {
    try {
      window.localStorage.setItem(
        SHIPPING_STORAGE_KEY,
        JSON.stringify({ state_code: nextStateCode, zip: nextZip })
      );
    } catch {
      // Storage unavailable (private mode) — fields still work for this session.
    }
  }

  function handleStateChange(next: string) {
    setStateCode(next);
    persistShipping(next, zip);
  }

  function handleZipChange(next: string) {
    setZip(next);
    persistShipping(stateCode, next);
  }

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const isShippingValid = stateCode !== '' && ZIP_PATTERN.test(zip);

  async function handleCheckout() {
    setError(null);
    setCheckingOut(true);
    try {
      await startCheckout(
        items.map((i) => ({ sync_variant_id: i.sync_variant_id, quantity: i.qty })),
        { state_code: stateCode, zip }
      );
      // Redirecting — keep the spinner up until the browser navigates.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
      setCheckingOut(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button type="button" aria-label="Close cart" onClick={onClose} className="absolute inset-0 bg-[#07070d]/80 backdrop-blur-sm" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="absolute right-0 inset-y-0 w-full max-w-md bg-[#0c0c14] border-l border-white/[0.08] flex flex-col"
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/[0.08]">
          <h2 className="font-display font-extrabold text-xl tracking-[-0.02em]">Your cart</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="w-11 h-11 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-[#F5AF19] transition-colors"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-white/40">Your cart is empty.</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 hover:border-[#F5AF19] hover:text-[#F5AF19] px-6 py-3 text-sm font-medium transition-colors"
            >
              Keep browsing
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6">
              {items.map((item) => (
                <CartLine key={item.sync_variant_id} item={item} />
              ))}
            </ul>
            <div className="px-6 py-6 border-t border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-sm">Subtotal</span>
                <span className="font-display font-extrabold text-xl">{formatPrice(subtotalCents)}</span>
              </div>
              <fieldset>
                <legend className="text-xs tracking-[0.2em] text-white/40 mb-2.5">SHIPPING</legend>
                <div className="flex gap-3">
                  <select
                    value={stateCode}
                    onChange={(e) => handleStateChange(e.target.value)}
                    aria-label="US state"
                    className="flex-1 min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white focus:border-[#F5AF19] focus:outline-none [&>option]:bg-[#0c0c14]"
                  >
                    <option value="">State</option>
                    {US_STATES.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => handleZipChange(e.target.value.trim())}
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="ZIP"
                    aria-label="ZIP code"
                    className="w-28 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-[#F5AF19] focus:outline-none"
                  />
                </div>
              </fieldset>
              <p className="text-xs text-white/40">
                Shipping calculated at Printful&apos;s live rate — enter state + ZIP.
              </p>
              {error && (
                <p role="alert" className="text-sm text-[#F5AF19] border border-[#F12711]/40 bg-[#F12711]/10 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkingOut || items.length === 0 || !isShippingValid}
                className="tl-btn-energy w-full py-4 rounded-xl text-white font-bold shadow-[0_0_30px_-8px_rgba(241,39,17,0.7)] disabled:opacity-60 flex items-center justify-center gap-2.5"
              >
                {checkingOut && <span className="tl-spinner" aria-hidden />}
                {checkingOut ? 'Redirecting…' : 'Checkout'}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

// ── Page shell ─────────────────────────────────────────────────────────

function StoreUI({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Deep-link a product via /store#slug (single static route, no dynamic params).
  useEffect(() => {
    const slug = window.location.hash.slice(1);
    if (slug) setSelected(products.find((p) => p.slug === slug) ?? null);
  }, [products]);

  function handleSelect(product: Product) {
    setSelected(product);
    window.history.replaceState(null, '', `#${product.slug}`);
  }

  function handleCloseDetail() {
    setSelected(null);
    window.history.replaceState(null, '', window.location.pathname);
  }

  return (
    <main className="min-h-screen bg-[#07070d] text-white overflow-x-hidden antialiased font-body">
      <BrandStyles />
      <StoreNav onOpenCart={() => setCartOpen(true)} />

      {products.length === 0 ? (
        <ComingSoonHero />
      ) : (
        <ProductGrid products={products} onSelect={handleSelect} />
      )}

      <StoreFooter />

      {selected && (
        <ProductDetail
          product={selected}
          onClose={handleCloseDetail}
          onAdded={() => {
            handleCloseDetail();
            setCartOpen(true);
          }}
        />
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  );
}

export default function StoreClient({ products }: { products: Product[] }) {
  return (
    <CartProvider>
      <StoreUI products={products} />
    </CartProvider>
  );
}
