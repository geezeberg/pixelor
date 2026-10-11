import { describe, expect, it } from 'vitest';
import { PREDEFINED_PALETTES } from '../../../src/domain/palettes/predefined-palettes';
import { duplicatePaletteAsCustom } from '../../../src/domain/palettes/create-custom-palette';

describe('predefined palette catalog', () => {
  it('keeps predefined palettes immutable by contract', () => {
    expect(PREDEFINED_PALETTES.length).toBeGreaterThan(0);
    expect(PREDEFINED_PALETTES.every((palette) => palette.sourceType === 'predefined')).toBe(true);
    expect(PREDEFINED_PALETTES.every((palette) => !palette.isEditable)).toBe(true);
  });

  it('duplicates predefined palette into editable custom palette', () => {
    const duplicated = duplicatePaletteAsCustom(PREDEFINED_PALETTES[0], 'custom-copy');

    expect(duplicated.sourceType).toBe('custom');
    expect(duplicated.isEditable).toBe(true);
    expect(duplicated.colors.map((entry) => entry.hex)).toEqual(PREDEFINED_PALETTES[0].colors.map((entry) => entry.hex));
  });
});
