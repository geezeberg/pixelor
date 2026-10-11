import type { LogicalPixelGrid } from '../logical-grid/logical-pixel-grid';
import type { Palette } from '../palettes/palette';
import type { PaletteFileArtifact } from '../palettes/palette-file-artifact';
import type { PaletteLibrary } from '../palettes/palette-library';
import type { ColorProcessingSettings } from '../color-processing/color-processing-settings';
import type { ProcessedLogicalGrid } from '../color-processing/processed-logical-grid';

export type GeneratePaletteFromGridService = (
  logicalGrid: LogicalPixelGrid,
  targetSize: number,
) => Palette;

export type ApplyPaletteToGridService = (
  logicalGrid: LogicalPixelGrid,
  palette: Palette,
  settings: ColorProcessingSettings,
) => ProcessedLogicalGrid;

export type PersistPaletteLibraryService = (library: PaletteLibrary) => Promise<void>;
export type LoadPaletteLibraryService = () => Promise<PaletteLibrary>;

export type ImportPaletteFileService = (content: string) => PaletteFileArtifact;
export type ExportPaletteFileService = (palette: Palette) => PaletteFileArtifact;

export interface PaletteWorkspaceServices {
  generatePaletteFromGrid: GeneratePaletteFromGridService;
  applyPaletteToGrid: ApplyPaletteToGridService;
  persistPaletteLibrary: PersistPaletteLibraryService;
  loadPaletteLibrary: LoadPaletteLibraryService;
  importPaletteFile: ImportPaletteFileService;
  exportPaletteFile: ExportPaletteFileService;
}
