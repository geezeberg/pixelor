import type { ExportedOutput } from '../export/exported-output';
import type { LogicalPixelGrid } from '../logical-grid/logical-pixel-grid';
import type { PixelationSetting } from '../logical-grid/pixelation-setting';
import type { RenderPreview } from '../rendering/render-preview';
import type { SourceImage } from '../source-image/source-image';

export interface ImportSourceImageInput {
  file: File;
}

export interface RenderPreviewInput {
  logicalGrid: LogicalPixelGrid;
  renderScale?: number;
}

export interface DrawPreviewInput {
  logicalGrid: LogicalPixelGrid;
  renderPreview: RenderPreview;
  canvas: HTMLCanvasElement;
}

export interface ExportRenderedPreviewInput {
  logicalGrid: LogicalPixelGrid;
  renderPreview: RenderPreview;
}

export type ImportSourceImageService = (input: ImportSourceImageInput) => Promise<SourceImage>;
export type GenerateLogicalPixelGridService = (
  sourceImage: SourceImage,
  pixelationSetting: PixelationSetting,
) => LogicalPixelGrid;
export type CreateRenderPreviewService = (input: RenderPreviewInput) => RenderPreview;
export type DrawRenderPreviewService = (input: DrawPreviewInput) => void;
export type ExportRenderedPreviewService = (input: ExportRenderedPreviewInput) => Promise<ExportedOutput>;

export interface ImageWorkspaceServices {
  importSourceImage: ImportSourceImageService;
  generateLogicalPixelGrid: GenerateLogicalPixelGridService;
  createRenderPreview: CreateRenderPreviewService;
  drawRenderPreview: DrawRenderPreviewService;
  exportRenderedPreview: ExportRenderedPreviewService;
}
