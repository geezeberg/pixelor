import { WorkspaceError } from '../../shared/types/errors';

export interface PixelationSetting {
  settingValue: number;
  minValue: number;
  maxValue: number;
  defaultValue: number;
}

export const DEFAULT_PIXELATION_SETTING = {
  minValue: 2,
  maxValue: 64,
  defaultValue: 12,
};

export function createPixelationSetting(value = DEFAULT_PIXELATION_SETTING.defaultValue): PixelationSetting {
  validatePixelationValue(value, DEFAULT_PIXELATION_SETTING.minValue, DEFAULT_PIXELATION_SETTING.maxValue);

  return {
    settingValue: value,
    ...DEFAULT_PIXELATION_SETTING,
  };
}

export function validatePixelationValue(value: number, minValue: number, maxValue: number) {
  if (!Number.isFinite(value)) {
    throw new WorkspaceError('unknown', 'Pixelation level must be a finite number.');
  }

  if (value < minValue || value > maxValue) {
    throw new WorkspaceError('unknown', 'Pixelation level is out of bounds.', {
      value,
      minValue,
      maxValue,
    });
  }
}

export function updatePixelationSetting(setting: PixelationSetting, value: number): PixelationSetting {
  validatePixelationValue(value, setting.minValue, setting.maxValue);

  return {
    ...setting,
    settingValue: value,
  };
}
