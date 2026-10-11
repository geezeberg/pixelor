import { describe, expect, it } from 'vitest';
import { createLogicalPixelGrid } from '../../../src/domain/logical-grid/logical-pixel-grid';
import { generatePaletteFromGrid } from '../../../src/domain/palettes/generate-palette-from-grid';

function createGrid() {
  return createLogicalPixelGrid({
    gridWidth: 2,
    gridHeight: 2,
    sampledPixels: new Uint8ClampedArray([
      255, 0, 0, 255,
      255, 0, 0, 255,
      0, 0, 255, 255,
      0, 255, 0, 255,
    ]),
    derivedFromSourceImageId: 'grid-source',
    derivedFromSettingValue: 8,
    preservesTransparency: true,
  });
}

describe('generatePaletteFromGrid', () => {
  it('generates deterministic palettes for equal inputs', () => {
    const grid = createGrid();
    const first = generatePaletteFromGrid(grid, 3);
    const second = generatePaletteFromGrid(grid, 3);

    expect(first.paletteId).toBe(second.paletteId);
    expect(first.colors.map((entry) => entry.hex)).toEqual(second.colors.map((entry) => entry.hex));
  });

  it('respects 2-256 target bounds', () => {
    const grid = createGrid();

    expect(() => generatePaletteFromGrid(grid, 1)).toThrow();
    expect(() => generatePaletteFromGrid(grid, 257)).toThrow();
  });
});
