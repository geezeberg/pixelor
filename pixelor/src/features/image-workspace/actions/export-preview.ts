import type { ImageWorkspaceServices } from '../../../domain/pipeline/contracts';
import type { WorkspaceState } from '../../../shared/types/image-workspace';
import { WorkspaceError } from '../../../shared/types/errors';

export interface ExportPreviewActionInput {
  state: WorkspaceState;
  services: ImageWorkspaceServices;
}

export async function exportPreviewAction({ state, services }: ExportPreviewActionInput) {
  if (!state.activeLogicalGrid || !state.activeRenderPreview) {
    throw new WorkspaceError('missing-preview', 'Load and render an image before exporting.');
  }

  const exportedOutput = await services.exportRenderedPreview({
    logicalGrid: state.activeLogicalGrid,
    renderPreview: state.activeRenderPreview,
  });

  const objectUrl = URL.createObjectURL(exportedOutput.blob);
  const download = document.createElement('a');
  const fileBaseName = state.activeSourceImage?.fileName.replace(/\.[^.]+$/, '') || 'pixelor-export';

  download.href = objectUrl;
  download.download = `${fileBaseName}-pixelated.png`;
  download.click();

  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);

  return exportedOutput;
}
