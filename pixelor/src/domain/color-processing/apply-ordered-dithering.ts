import type { Palette } from '../palettes/palette';

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function nearestPaletteColor(red: number, green: number, blue: number, palette: Palette) {
  let nearest = palette.colors[0];
  let minDistance = Number.POSITIVE_INFINITY;

  for (const entry of palette.colors) {
    const dr = red - entry.rgba.red;
    const dg = green - entry.rgba.green;
    const db = blue - entry.rgba.blue;
    const distance = dr * dr + dg * dg + db * db;

    if (distance < minDistance) {
      minDistance = distance;
      nearest = entry;
    }
  }

  return nearest;
}

export interface OrderedDitheringOptions {
  quantizeToPalette?: boolean;
  strength?: number;
}

export function applyOrderedDithering(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  palette: Palette,
  options?: OrderedDitheringOptions,
): Uint8ClampedArray {
  const dithered = new Uint8ClampedArray(pixels.length);
  const quantizeToPalette = options?.quantizeToPalette ?? true;
  const strength = Math.max(0, Math.min(1, options?.strength ?? 1));

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 4;
      const alpha = pixels[offset + 3];

      if (alpha === 0) {
        dithered[offset] = pixels[offset];
        dithered[offset + 1] = pixels[offset + 1];
        dithered[offset + 2] = pixels[offset + 2];
        dithered[offset + 3] = 0;
        continue;
      }

      const threshold = (BAYER_4X4[y % 4][x % 4] / 15 - 0.5) * (24 * strength);
      const adjustedRed = Math.max(0, Math.min(255, Math.round(pixels[offset] + threshold)));
      const adjustedGreen = Math.max(0, Math.min(255, Math.round(pixels[offset + 1] + threshold)));
      const adjustedBlue = Math.max(0, Math.min(255, Math.round(pixels[offset + 2] + threshold)));

      if (quantizeToPalette) {
        const nearest = nearestPaletteColor(adjustedRed, adjustedGreen, adjustedBlue, palette);
        dithered[offset] = nearest.rgba.red;
        dithered[offset + 1] = nearest.rgba.green;
        dithered[offset + 2] = nearest.rgba.blue;
      } else {
        dithered[offset] = adjustedRed;
        dithered[offset + 1] = adjustedGreen;
        dithered[offset + 2] = adjustedBlue;
      }
      dithered[offset + 3] = alpha;
    }
  }

  return dithered;
}
