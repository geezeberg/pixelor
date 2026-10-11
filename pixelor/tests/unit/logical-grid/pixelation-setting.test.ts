import { describe, expect, it } from 'vitest';
import { createPixelationSetting, updatePixelationSetting } from '../../../src/domain/logical-grid/pixelation-setting';

describe('pixelation setting', () => {
  it('updates within bounds', () => {
    const setting = createPixelationSetting();
    const updated = updatePixelationSetting(setting, 18);

    expect(updated.settingValue).toBe(18);
    expect(updated.minValue).toBe(setting.minValue);
  });

  it('rejects values outside the supported range', () => {
    const setting = createPixelationSetting();

    expect(() => updatePixelationSetting(setting, setting.maxValue + 1)).toThrowError(/out of bounds/i);
  });
});
