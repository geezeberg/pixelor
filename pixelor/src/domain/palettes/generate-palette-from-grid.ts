import type { LogicalPixelGrid } from '../logical-grid/logical-pixel-grid';
import { WorkspaceError } from '../../shared/types/errors';
import { PALETTE_LIMITS } from '../../shared/utils/palette-constants';
import { createPalette } from './palette';
import { createPaletteColorEntry } from './palette-color-entry';

interface RankedColor {
  hex: string;
  count: number;
}

function toHex(red: number, green: number, blue: number) {
  return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`.toUpperCase();
}

function rankColors(grid: LogicalPixelGrid): RankedColor[] {
  const counts = new Map<string, number>();

  for (let index = 0; index < grid.sampledPixels.length; index += 4) {
    const alpha = grid.sampledPixels[index + 3];
    if (alpha === 0) {
      continue;
    }

    const hex = toHex(grid.sampledPixels[index], grid.sampledPixels[index + 1], grid.sampledPixels[index + 2]);
    counts.set(hex, (counts.get(hex) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([hex, count]) => ({ hex, count }))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.hex.localeCompare(right.hex);
    });
}

export function generatePaletteFromGrid(logicalGrid: LogicalPixelGrid, targetSize: number, name = 'Auto Palette') {
  if (!Number.isInteger(targetSize) || targetSize < PALETTE_LIMITS.minColors || targetSize > PALETTE_LIMITS.maxColors) {
    throw new WorkspaceError('palette-generation-failed', 'Requested palette size must be between 2 and 256 colors.', {
      targetSize,
    });
  }

  const rankedColors = rankColors(logicalGrid);

  if (rankedColors.length === 0) {
    throw new WorkspaceError('palette-generation-failed', 'A palette cannot be generated from an empty or fully transparent logical grid.');
  }

  const selected = rankedColors.slice(0, Math.min(targetSize, rankedColors.length));

  if (selected.length < PALETTE_LIMITS.minColors) {
    const fallback = selected[0];
    selected.push({ ...fallback, count: fallback.count });
  }

  const paletteId = `auto-${logicalGrid.gridId}-${targetSize}`;
  const colors = selected.map((entry, index) =>
    createPaletteColorEntry({
      entryId: `${paletteId}-${index}`,
      hex: entry.hex,
      index,
    }),
  );

  return createPalette({
    paletteId,
    name,
    sourceType: 'automatic',
    colors,
    isEditable: true,
  });
}
