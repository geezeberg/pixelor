import type { LogicalPixelGrid } from '../logical-grid/logical-pixel-grid';
import type { Palette } from '../palettes/palette';

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

function blendChannel(source: number, target: number, strength: number) {
  return Math.round(source + (target - source) * strength);
}

export function applySoftGrading(logicalGrid: LogicalPixelGrid, palette: Palette, strength: number): Uint8ClampedArray {
  const processed = new Uint8ClampedArray(logicalGrid.sampledPixels.length);

  for (let index = 0; index < logicalGrid.sampledPixels.length; index += 4) {
    const alpha = logicalGrid.sampledPixels[index + 3];

    if (alpha === 0) {
      processed[index] = logicalGrid.sampledPixels[index];
      processed[index + 1] = logicalGrid.sampledPixels[index + 1];
      processed[index + 2] = logicalGrid.sampledPixels[index + 2];
      processed[index + 3] = 0;
      continue;
    }

    const nearest = nearestPaletteColor(
      logicalGrid.sampledPixels[index],
      logicalGrid.sampledPixels[index + 1],
      logicalGrid.sampledPixels[index + 2],
      palette,
    );

    processed[index] = blendChannel(logicalGrid.sampledPixels[index], nearest.rgba.red, strength);
    processed[index + 1] = blendChannel(logicalGrid.sampledPixels[index + 1], nearest.rgba.green, strength);
    processed[index + 2] = blendChannel(logicalGrid.sampledPixels[index + 2], nearest.rgba.blue, strength);
    processed[index + 3] = alpha;
  }

  return processed;
}
