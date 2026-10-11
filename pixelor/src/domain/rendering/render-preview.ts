import { WorkspaceError } from '../../shared/types/errors';

export type PreviewSurfaceState = 'ready' | 'updating' | 'failed';

export interface RenderPreview {
  renderWidth: number;
  renderHeight: number;
  renderStyle: 'square-blocks';
  renderedFromGridId: string;
  previewSurfaceState: PreviewSurfaceState;
  renderScale: number;
  fingerprint: string;
}

export interface CreateRenderPreviewInput {
  renderWidth: number;
  renderHeight: number;
  renderedFromGridId: string;
  previewSurfaceState?: PreviewSurfaceState;
  renderScale: number;
  fingerprint: string;
}

export function createRenderPreview(input: CreateRenderPreviewInput): RenderPreview {
  if (input.renderWidth <= 0 || input.renderHeight <= 0 || input.renderScale <= 0) {
    throw new WorkspaceError('render-failed', 'Render preview dimensions must be greater than zero.');
  }

  return {
    renderWidth: input.renderWidth,
    renderHeight: input.renderHeight,
    renderStyle: 'square-blocks',
    renderedFromGridId: input.renderedFromGridId,
    previewSurfaceState: input.previewSurfaceState ?? 'ready',
    renderScale: input.renderScale,
    fingerprint: input.fingerprint,
  };
}
