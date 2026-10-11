import { WorkspaceError } from '../../shared/types/errors';
import {
  DEFAULT_COLOR_PROCESSING_MODE,
  DEFAULT_DITHERING_ALGORITHM,
  DEFAULT_DITHERING_ENABLED,
  DEFAULT_SOFT_STRENGTH,
  SOFT_STRENGTH_LIMITS,
} from '../../shared/utils/palette-constants';

export type ColorProcessingMode = 'strict' | 'soft';
export type DitheringAlgorithm = typeof DEFAULT_DITHERING_ALGORITHM;

export interface ColorProcessingSettings {
  mode: ColorProcessingMode;
  softStrength: number;
  ditheringEnabled: boolean;
  ditheringAlgorithm: DitheringAlgorithm;
  selectedPaletteId: string | null;
}

function validateSoftStrength(value: number) {
  if (!Number.isFinite(value) || value < SOFT_STRENGTH_LIMITS.min || value > SOFT_STRENGTH_LIMITS.max) {
    throw new WorkspaceError('unknown', 'Soft grading strength is out of bounds.', {
      value,
      min: SOFT_STRENGTH_LIMITS.min,
      max: SOFT_STRENGTH_LIMITS.max,
    });
  }
}

export function createColorProcessingSettings(overrides: Partial<ColorProcessingSettings> = {}): ColorProcessingSettings {
  const resolved: ColorProcessingSettings = {
    mode: overrides.mode ?? DEFAULT_COLOR_PROCESSING_MODE,
    softStrength: overrides.softStrength ?? DEFAULT_SOFT_STRENGTH,
    ditheringEnabled: overrides.ditheringEnabled ?? DEFAULT_DITHERING_ENABLED,
    ditheringAlgorithm: overrides.ditheringAlgorithm ?? DEFAULT_DITHERING_ALGORITHM,
    selectedPaletteId: overrides.selectedPaletteId ?? null,
  };

  validateSoftStrength(resolved.softStrength);

  if (resolved.ditheringAlgorithm !== DEFAULT_DITHERING_ALGORITHM) {
    throw new WorkspaceError('unknown', 'Unsupported dithering algorithm selected.', {
      algorithm: resolved.ditheringAlgorithm,
    });
  }

  return resolved;
}

export function updateSoftStrength(settings: ColorProcessingSettings, softStrength: number): ColorProcessingSettings {
  validateSoftStrength(softStrength);
  return { ...settings, softStrength };
}
