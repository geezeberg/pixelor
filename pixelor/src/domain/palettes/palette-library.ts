import { WorkspaceError } from '../../shared/types/errors';
import type { Palette } from './palette';

export interface PaletteLibrary {
  libraryVersion: string;
  palettes: readonly Palette[];
  lastSyncedAt: string;
}

export function createPaletteLibrary(palettes: readonly Palette[] = [], libraryVersion = '1'): PaletteLibrary {
  const customOnly = palettes.filter((palette) => palette.sourceType === 'custom');

  if (customOnly.length !== palettes.length) {
    throw new WorkspaceError('palette-persistence-failed', 'Only custom palettes can be stored in the local palette library.');
  }

  return {
    libraryVersion,
    palettes: [...customOnly],
    lastSyncedAt: new Date().toISOString(),
  };
}

export function upsertCustomPalette(library: PaletteLibrary, palette: Palette): PaletteLibrary {
  if (palette.sourceType !== 'custom') {
    throw new WorkspaceError('palette-persistence-failed', 'Only custom palettes can be saved to local storage.');
  }

  const existingIndex = library.palettes.findIndex((candidate) => candidate.paletteId === palette.paletteId);
  const nextPalettes = [...library.palettes];

  if (existingIndex >= 0) {
    nextPalettes[existingIndex] = palette;
  } else {
    nextPalettes.push(palette);
  }

  return {
    ...library,
    palettes: nextPalettes,
    lastSyncedAt: new Date().toISOString(),
  };
}

export function deleteCustomPalette(library: PaletteLibrary, paletteId: string): PaletteLibrary {
  return {
    ...library,
    palettes: library.palettes.filter((palette) => palette.paletteId !== paletteId),
    lastSyncedAt: new Date().toISOString(),
  };
}
