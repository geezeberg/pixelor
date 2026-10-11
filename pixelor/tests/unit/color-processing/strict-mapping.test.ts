import { describe, expect, it } from 'vitest';
import { createLogicalPixelGrid } from '../../../src/domain/logical-grid/logical-pixel-grid';
import { applyStrictPalette } from '../../../src/domain/color-processing/apply-strict-palette';
import { createPalette } from '../../../src/domain/palettes/palette';
import { createPaletteColorEntry } from '../../../src/domain/palettes/palette-color-entry';

function createPaletteFixture() {
  return createPalette({
    paletteId: 'palette-1',
    name: 'Strict fixture',
    sourceType: 'custom',
    isEditable: true,
    colors: [
      createPaletteColorEntry({ entryId: 'p-0', hex: '#000000', index: 0 }),
      createPaletteColorEntry({ entryId: 'p-1', hex: '#FFFFFF', index: 1 }),
    ],
  });
}

describe('applyStrictPalette', () => {
  it('maps non-transparent colors to the nearest palette entries', () => {
    const palette = createPaletteFixture();
    const grid = createLogicalPixelGrid({
      gridWidth: 2,
      gridHeight: 1,
      sampledPixels: new Uint8ClampedArray([
        20, 20, 20, 255,
        230, 230, 230, 255,
      ]),
      derivedFromSourceImageId: 's-1',
      derivedFromSettingValue: 4,
      preservesTransparency: true,
    });

    const mapped = applyStrictPalette(grid, palette);

    expect(Array.from(mapped)).toEqual([
      0, 0, 0, 255,
      255, 255, 255, 255,
    ]);
  });

  it('preserves transparency for transparent pixels', () => {
    const palette = createPaletteFixture();
    const grid = createLogicalPixelGrid({
      gridWidth: 1,
      gridHeight: 1,
      sampledPixels: new Uint8ClampedArray([120, 80, 20, 0]),
      derivedFromSourceImageId: 's-2',
      derivedFromSettingValue: 4,
      preservesTransparency: true,
    });

    const mapped = applyStrictPalette(grid, palette);
    expect(mapped[3]).toBe(0);
  });
});
