import { WorkspaceError } from '../../shared/types/errors';

export interface LogicalPixelGrid {
  gridId: string;
  gridWidth: number;
  gridHeight: number;
  sampledPixels: Uint8ClampedArray;
  derivedFromSourceImageId: string;
  derivedFromSettingValue: number;
  preservesTransparency: boolean;
  fingerprint: string;
}

export interface CreateLogicalPixelGridInput {
  gridWidth: number;
  gridHeight: number;
  sampledPixels: Uint8ClampedArray;
  derivedFromSourceImageId: string;
  derivedFromSettingValue: number;
  preservesTransparency: boolean;
}

export function computeGridFingerprint(sampledPixels: Uint8ClampedArray): string {
  let hash = 2166136261;

  for (let index = 0; index < sampledPixels.length; index += 1) {
    hash ^= sampledPixels[index];
    hash = Math.imul(hash, 16777619);
  }

  return `grid-${(hash >>> 0).toString(16)}`;
}

export function createLogicalPixelGrid(input: CreateLogicalPixelGridInput): LogicalPixelGrid {
  if (input.gridWidth <= 0 || input.gridHeight <= 0) {
    throw new WorkspaceError('unknown', 'Logical grid dimensions must be greater than zero.');
  }

  if (input.sampledPixels.length !== input.gridWidth * input.gridHeight * 4) {
    throw new WorkspaceError('corrupt-image', 'Logical grid data length does not match the requested dimensions.');
  }

  return {
    gridId: `${input.derivedFromSourceImageId}-${input.derivedFromSettingValue}`,
    gridWidth: input.gridWidth,
    gridHeight: input.gridHeight,
    sampledPixels: new Uint8ClampedArray(input.sampledPixels),
    derivedFromSourceImageId: input.derivedFromSourceImageId,
    derivedFromSettingValue: input.derivedFromSettingValue,
    preservesTransparency: input.preservesTransparency,
    fingerprint: computeGridFingerprint(input.sampledPixels),
  };
}
