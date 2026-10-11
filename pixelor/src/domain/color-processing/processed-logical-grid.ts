import { WorkspaceError } from '../../shared/types/errors';
import type { Palette } from '../palettes/palette';
import type { ColorProcessingMode } from './color-processing-settings';

export interface ProcessedLogicalGrid {
  gridFingerprint: string;
  paletteFingerprint: string;
  width: number;
  height: number;
  processedPixels: Uint8ClampedArray;
  modeUsed: ColorProcessingMode;
  ditheringApplied: boolean;
  preservesTransparency: boolean;
}

function pixelHash(pixels: Uint8ClampedArray): string {
  let hash = 2166136261;
  for (let index = 0; index < pixels.length; index += 1) {
    hash ^= pixels[index];
    hash = Math.imul(hash, 16777619);
  }
  return `proc-${(hash >>> 0).toString(16)}`;
}

function belongsToPalette(red: number, green: number, blue: number, palette: Palette): boolean {
  return palette.colors.some((entry) => entry.rgba.red === red && entry.rgba.green === green && entry.rgba.blue === blue);
}

interface CreateProcessedGridInput {
  width: number;
  height: number;
  sourceGridFingerprint: string;
  processedPixels: Uint8ClampedArray;
  modeUsed: ColorProcessingMode;
  ditheringApplied: boolean;
  preservesTransparency: boolean;
  palette: Palette;
}

export function createProcessedLogicalGrid(input: CreateProcessedGridInput): ProcessedLogicalGrid {
  if (input.width <= 0 || input.height <= 0) {
    throw new WorkspaceError('unknown', 'Processed logical grid dimensions must be greater than zero.');
  }

  if (input.processedPixels.length !== input.width * input.height * 4) {
    throw new WorkspaceError('unknown', 'Processed logical grid size does not match dimensions.');
  }

  if (input.modeUsed === 'strict') {
    for (let index = 0; index < input.processedPixels.length; index += 4) {
      const alpha = input.processedPixels[index + 3];
      if (alpha === 0) {
        continue;
      }

      if (!belongsToPalette(input.processedPixels[index], input.processedPixels[index + 1], input.processedPixels[index + 2], input.palette)) {
        throw new WorkspaceError('unknown', 'Strict mode produced a color outside of the selected palette.', {
          pixelOffset: index,
        });
      }
    }
  }

  return {
    gridFingerprint: input.sourceGridFingerprint,
    paletteFingerprint: `${input.palette.paletteId}-${input.palette.updatedAt}-${pixelHash(input.processedPixels)}`,
    width: input.width,
    height: input.height,
    processedPixels: new Uint8ClampedArray(input.processedPixels),
    modeUsed: input.modeUsed,
    ditheringApplied: input.ditheringApplied,
    preservesTransparency: input.preservesTransparency,
  };
}
