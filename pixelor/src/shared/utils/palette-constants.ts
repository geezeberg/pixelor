export const PALETTE_LIMITS = {
  minColors: 2,
  maxColors: 256,
} as const;

export const DEFAULT_GENERATED_PALETTE_SIZE = 16;

export const DEFAULT_SOFT_STRENGTH = 0.5;

export const SOFT_STRENGTH_LIMITS = {
  min: 0,
  max: 1,
} as const;

export const DEFAULT_DITHERING_ENABLED = false;

export const DEFAULT_DITHERING_ALGORITHM = 'ordered-bayer' as const;

export const DEFAULT_COLOR_PROCESSING_MODE = 'strict' as const;
