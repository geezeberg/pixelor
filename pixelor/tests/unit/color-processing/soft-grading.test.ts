import { describe, expect, it } from 'vitest';
import { createLogicalPixelGrid } from '../../../src/domain/logical-grid/logical-pixel-grid';
import { applySoftGrading } from '../../../src/domain/color-processing/apply-soft-grading';
import { createPalette } from '../../../src/domain/palettes/palette';
import { createPaletteColorEntry } from '../../../src/domain/palettes/palette-color-entry';

describe('applySoftGrading', () => {
  it('blends toward nearest palette color by configurable strength', () => {
    const grid = createLogicalPixelGrid({
      gridWidth: 1,
      gridHeight: 1,
      sampledPixels: new Uint8ClampedArray([100, 50, 0, 255]),
      derivedFromSourceImageId: 's-soft',
      derivedFromSettingValue: 8,
      preservesTransparency: true,
    });

    const palette = createPalette({
      paletteId: 'palette-soft',
      name: 'Soft test',
      sourceType: 'custom',
      isEditable: true,
      colors: [
        createPaletteColorEntry({ entryId: 'c-0', hex: '#000000', index: 0 }),
        createPaletteColorEntry({ entryId: 'c-1', hex: '#FFAA00', index: 1 }),
      ],
    });

    const half = applySoftGrading(grid, palette, 0.5);

    expect(half[0]).toBe(50);
    expect(half[1]).toBe(25);
    expect(half[2]).toBe(0);
  });
});
