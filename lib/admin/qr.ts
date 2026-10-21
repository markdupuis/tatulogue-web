const MODULE_PX = 24;
const QUIET_ZONE_MODULES = 3;
const LOGO_BOX_MODULES = 9;
const LOGO_HALO_MODULES = 10.4;
const LOGO_BOX_RADIUS_MODULES = 1.35;
const LOGO_HALO_RADIUS_MODULES = 2.2;
const LOGO_SRC = '/images/qr-logo.png';
const GENERATED_CODES_STORAGE_KEY = 'tatulogue_admin_qr_generated_codes';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${src}`));
    image.src = src;
  });
}

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, radius: number): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + size, y, x + size, y + size, radius);
  ctx.arcTo(x + size, y + size, x, y + size, radius);
  ctx.arcTo(x, y + size, x, y, radius);
  ctx.arcTo(x, y, x + size, y, radius);
  ctx.closePath();
}

/**
 * PNG data URL of the branded QR code: square black modules on white, with the
 * app icon in a rounded box at the center (error correction H keeps it scannable).
 */
export async function generateQrDataUrl(link: string): Promise<string> {
  // Loaded on demand so the QR library stays out of the admin shell bundle.
  const { default: QRCode } = await import('qrcode');
  const qr = QRCode.create(link, { errorCorrectionLevel: 'H' });
  const moduleCount = qr.modules.size;
  const sizePx = (moduleCount + QUIET_ZONE_MODULES * 2) * MODULE_PX;

  const canvas = document.createElement('canvas');
  canvas.width = sizePx;
  canvas.height = sizePx;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, sizePx, sizePx);
  ctx.fillStyle = '#000000';
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.modules.data[row * moduleCount + col]) {
        ctx.fillRect((col + QUIET_ZONE_MODULES) * MODULE_PX, (row + QUIET_ZONE_MODULES) * MODULE_PX, MODULE_PX, MODULE_PX);
      }
    }
  }

  const center = sizePx / 2;
  const haloPx = LOGO_HALO_MODULES * MODULE_PX;
  const boxPx = LOGO_BOX_MODULES * MODULE_PX;
  ctx.fillStyle = '#ffffff';
  roundedRectPath(ctx, center - haloPx / 2, center - haloPx / 2, haloPx, LOGO_HALO_RADIUS_MODULES * MODULE_PX);
  ctx.fill();

  const logo = await loadImage(LOGO_SRC);
  ctx.save();
  roundedRectPath(ctx, center - boxPx / 2, center - boxPx / 2, boxPx, LOGO_BOX_RADIUS_MODULES * MODULE_PX);
  ctx.clip();
  ctx.drawImage(logo, center - boxPx / 2, center - boxPx / 2, boxPx, boxPx);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function qrFilename(code: string): string {
  return `tatulogue-qr-${code}.png`;
}

/** Codes whose QR was generated before, remembered per browser so the button stays "Download" after a reload. */
export function readGeneratedCodes(): string[] {
  try {
    const raw = window.localStorage.getItem(GENERATED_CODES_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((c): c is string => typeof c === 'string') : [];
  } catch {
    return [];
  }
}

export function rememberGeneratedCode(code: string): void {
  try {
    const codes = new Set(readGeneratedCodes());
    codes.add(code);
    window.localStorage.setItem(GENERATED_CODES_STORAGE_KEY, JSON.stringify([...codes]));
  } catch {
    // Storage can be blocked (private window); the QR still works for this visit.
  }
}
