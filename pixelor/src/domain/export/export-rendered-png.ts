import { createExportedOutput } from './exported-output';
import { WorkspaceError } from '../../shared/types/errors';
import { drawRenderPreviewToCanvas } from '../rendering/render-preview-canvas';
import type { ExportRenderedPreviewService } from '../pipeline/contracts';

export const exportRenderedPng: ExportRenderedPreviewService = async ({ logicalGrid, renderPreview }) => {
  const canvas = document.createElement('canvas');
  drawRenderPreviewToCanvas({ logicalGrid, renderPreview, canvas });

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((candidate) => {
      if (!candidate) {
        reject(new WorkspaceError('export-failed', 'Canvas export did not produce a PNG blob.'));
        return;
      }

      resolve(candidate);
    }, 'image/png');
  });

  return createExportedOutput(blob, logicalGrid.fingerprint);
};
