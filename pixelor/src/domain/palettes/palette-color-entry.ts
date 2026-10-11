import { WorkspaceError } from '../../shared/types/errors';

export interface RgbaColor {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export interface PaletteColorEntry {
  entryId: string;
  hex: string;
  rgba: RgbaColor;
  index: number;
}

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function rgbaFromHex(hex: string): RgbaColor {
  return {
    red: parseInt(hex.slice(1, 3), 16),
    green: parseInt(hex.slice(3, 5), 16),
    blue: parseInt(hex.slice(5, 7), 16),
    alpha: 255,
  };
}

export function normalizeHexValue(hex: string): string {
  const trimmed = hex.trim();
  const normalized = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;

  if (!/^#[0-9A-Fa-f]{6}$/.test(normalized)) {
    throw new WorkspaceError('invalid-palette-file', 'Palette color must use #RRGGBB format.', {
      hex,
    });
  }

  return normalized.toUpperCase();
}

export function createPaletteColorEntry(input: {
  entryId: string;
  hex: string;
  index: number;
}): PaletteColorEntry {
  if (!Number.isInteger(input.index) || input.index < 0) {
    throw new WorkspaceError('invalid-palette-file', 'Palette color index must be a non-negative integer.', {
      index: input.index,
    });
  }

  const normalizedHex = normalizeHexValue(input.hex);
  const rgba = rgbaFromHex(normalizedHex);

  return {
    entryId: input.entryId,
    hex: normalizedHex,
    rgba: {
      red: clampChannel(rgba.red),
      green: clampChannel(rgba.green),
      blue: clampChannel(rgba.blue),
      alpha: clampChannel(rgba.alpha),
    },
    index: input.index,
  };
}
