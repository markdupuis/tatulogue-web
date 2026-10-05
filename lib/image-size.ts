import fs from 'fs';
import path from 'path';

export interface ImageSize {
  width: number;
  height: number;
}

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const JPEG_SOF_MARKERS = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);

function readJpegSize(buffer: Buffer): ImageSize | null {
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) return null;
    const marker = buffer[offset + 1];
    if (JPEG_SOF_MARKERS.has(marker)) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + buffer.readUInt16BE(offset + 2);
  }
  return null;
}

function readSvgSize(text: string): ImageSize | null {
  const viewBox = text.match(/viewBox="[\d.]+ [\d.]+ ([\d.]+) ([\d.]+)"/);
  return viewBox ? { width: Number(viewBox[1]), height: Number(viewBox[2]) } : null;
}

/** Intrinsic size of a local /public image, used to reserve layout space for lazy-loaded images. */
export function getPublicImageSize(src: string): ImageSize | null {
  const file = path.join(PUBLIC_DIR, src);
  if (!src.startsWith('/') || !fs.existsSync(file)) return null;
  if (src.endsWith('.svg')) return readSvgSize(fs.readFileSync(file, 'utf-8'));
  if (/\.jpe?g$/.test(src)) return readJpegSize(fs.readFileSync(file));
  return null;
}
