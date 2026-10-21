const QR_IMAGE_WIDTH_PX = 1024;
const QR_QUIET_ZONE_MODULES = 4;
const GENERATED_CODES_STORAGE_KEY = 'tatulogue_admin_qr_generated_codes';

/** PNG data URL of a print-ready QR code (black on white, high error correction). */
export async function generateQrDataUrl(link: string): Promise<string> {
  // Loaded on demand so the QR library stays out of the admin shell bundle.
  const { default: QRCode } = await import('qrcode');
  return QRCode.toDataURL(link, {
    width: QR_IMAGE_WIDTH_PX,
    margin: QR_QUIET_ZONE_MODULES,
    errorCorrectionLevel: 'H',
    color: { dark: '#000000', light: '#ffffff' },
  });
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
