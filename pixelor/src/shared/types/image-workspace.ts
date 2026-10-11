import type { ExportedOutput } from '../../domain/export/exported-output';
import type { LogicalPixelGrid } from '../../domain/logical-grid/logical-pixel-grid';
import type { PixelationSetting } from '../../domain/logical-grid/pixelation-setting';
import type { RenderPreview } from '../../domain/rendering/render-preview';
import type { SourceImage } from '../../domain/source-image/source-image';
import type { WorkspaceError } from './errors';

export type WorkspacePhase = 'idle' | 'loading' | 'ready' | 'updating' | 'error' | 'exporting';

export interface WorkspaceState {
  activeSourceImage: SourceImage | null;
  activePixelationSetting: PixelationSetting;
  activeLogicalGrid: LogicalPixelGrid | null;
  activeRenderPreview: RenderPreview | null;
  lastExportedOutput: ExportedOutput | null;
  lastError: WorkspaceError | null;
  phase: WorkspacePhase;
}

export interface WorkspaceImportResult {
  sourceImage: SourceImage;
  logicalGrid: LogicalPixelGrid;
  renderPreview: RenderPreview;
}

export interface WorkspaceRegenerationResult {
  logicalGrid: LogicalPixelGrid;
  renderPreview: RenderPreview;
}
