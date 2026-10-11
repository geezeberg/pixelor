import { describe, expect, it } from 'vitest';
import { createCustomPalette } from '../../../src/domain/palettes/create-custom-palette';
import {
  addCustomPaletteColor,
  removeCustomPaletteColor,
  renameCustomPalette,
  updateCustomPaletteColor,
} from '../../../src/domain/palettes/edit-custom-palette';

describe('custom palette editing', () => {
  it('renames, updates, adds, and removes colors while preserving normalization', () => {
    const base = createCustomPalette({
      paletteId: 'custom-1',
      name: 'My Palette',
      colors: ['#FF0000', '#00FF00'],
    });

    const renamed = renameCustomPalette(base, ' Updated Name ');
    const updated = updateCustomPaletteColor(renamed, 1, '#0000ff');
    const added = addCustomPaletteColor(updated, '#ABCDEF');
    const removed = removeCustomPaletteColor(added, 0);

    expect(renamed.name).toBe('Updated Name');
    expect(updated.colors[1].hex).toBe('#0000FF');
    expect(added.colors).toHaveLength(3);
    expect(removed.colors).toHaveLength(2);
  });
});
