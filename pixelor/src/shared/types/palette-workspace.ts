import type { Palette } from '../../domain/palettes/palette';
import type {
  ColorProcessingMode,
  ColorProcessingSettings,
} from '../../domain/color-processing/color-processing-settings';
import type { ProcessedLogicalGrid } from '../../domain/color-processing/processed-logical-grid';

export type PaletteSourceType = 'automatic' | 'predefined' | 'custom';

export interface PaletteWorkspaceState {
  activePaletteId: string | null;
  activePaletteSource: PaletteSourceType;
  palettesById: Record<string, Palette>;
  orderedPaletteIds: string[];
  processing: ColorProcessingSettings;
  processedGrid: ProcessedLogicalGrid | null;
}

export interface PaletteSelectionResult {
  activePalette: Palette;
  processingMode: ColorProcessingMode;
}

export interface PaletteWorkspaceSnapshot {
  activePaletteId: string | null;
  activePaletteSource: PaletteSourceType;
  activeMode: ColorProcessingMode;
  ditheringEnabled: boolean;
  softStrength: number;
}
