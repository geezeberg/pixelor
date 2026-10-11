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

  it('uses deterministic quantization instead of only taking the most frequent exact colors', () => {
    const quantizedGrid = createLogicalPixelGrid({
      gridWidth: 4,
      gridHeight: 2,
      sampledPixels: new Uint8ClampedArray([
        255, 0, 0, 255,
        224, 32, 32, 255,
        192, 64, 64, 255,
        160, 96, 96, 255,
        0, 0, 255, 255,
        32, 32, 224, 255,
        64, 64, 192, 255,
        96, 96, 160, 255,
      ]),
      derivedFromSourceImageId: 'quantized-grid-source',
      derivedFromSettingValue: 8,
      preservesTransparency: true,
    });

    const palette = generatePaletteFromGrid(quantizedGrid, 2);
    const entries = palette.colors.map((entry) => entry.rgba);

    expect(entries).toHaveLength(2);
    expect(entries.some((entry) => entry.red > 160 && entry.blue < 120)).toBe(true);
    expect(entries.some((entry) => entry.blue > 160 && entry.red < 120)).toBe(true);
  });
});
