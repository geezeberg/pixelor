import type { LogicalPixelGrid } from '../logical-grid/logical-pixel-grid';
import type { Palette } from '../palettes/palette';

function squaredDistance(
  redA: number,
  greenA: number,
  blueA: number,
  redB: number,
  greenB: number,
  blueB: number,
) {
  const dr = redA - redB;
  const dg = greenA - greenB;
  const db = blueA - blueB;
  return dr * dr + dg * dg + db * db;
}

function findNearestPaletteColor(red: number, green: number, blue: number, palette: Palette) {
  let nearest = palette.colors[0];
  let minDistance = Number.POSITIVE_INFINITY;

  for (const entry of palette.colors) {
    const distance = squaredDistance(red, green, blue, entry.rgba.red, entry.rgba.green, entry.rgba.blue);

    if (distance < minDistance) {
      minDistance = distance;
      nearest = entry;
    }
  }

  return nearest;
}

export function applyStrictPalette(logicalGrid: LogicalPixelGrid, palette: Palette): Uint8ClampedArray {
  const mapped = new Uint8ClampedArray(logicalGrid.sampledPixels.length);

  for (let index = 0; index < logicalGrid.sampledPixels.length; index += 4) {
    const alpha = logicalGrid.sampledPixels[index + 3];

    if (alpha === 0) {
      mapped[index] = logicalGrid.sampledPixels[index];
      mapped[index + 1] = logicalGrid.sampledPixels[index + 1];
      mapped[index + 2] = logicalGrid.sampledPixels[index + 2];
      mapped[index + 3] = 0;
      continue;
    }

    const nearest = findNearestPaletteColor(
      logicalGrid.sampledPixels[index],
      logicalGrid.sampledPixels[index + 1],
      logicalGrid.sampledPixels[index + 2],
      palette,
    );

    mapped[index] = nearest.rgba.red;
    mapped[index + 1] = nearest.rgba.green;
    mapped[index + 2] = nearest.rgba.blue;
    mapped[index + 3] = alpha;
  }

  return mapped;
}
