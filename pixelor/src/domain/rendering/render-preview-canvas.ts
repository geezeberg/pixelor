import { createRenderPreview } from './render-preview';
import { WorkspaceError } from '../../shared/types/errors';
import type { CreateRenderPreviewService, DrawRenderPreviewService } from '../pipeline/contracts';

function getCanvasContext(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d');

  if (!context) {
    throw new WorkspaceError('render-failed', 'A 2D canvas context was not available.');
  }

  context.imageSmoothingEnabled = false;
  return context;
}

export const createCanvasRenderPreview: CreateRenderPreviewService = ({ logicalGrid, renderScale }) => {
  const resolvedScale = renderScale ?? Math.max(4, Math.floor(768 / Math.max(logicalGrid.gridWidth, logicalGrid.gridHeight)));

  return createRenderPreview({
    renderWidth: logicalGrid.gridWidth * resolvedScale,
    renderHeight: logicalGrid.gridHeight * resolvedScale,
    renderedFromGridId: logicalGrid.gridId,
    renderScale: resolvedScale,
    fingerprint: logicalGrid.fingerprint,
  });
};

export const drawRenderPreviewToCanvas: DrawRenderPreviewService = ({ logicalGrid, renderPreview, canvas }) => {
  const bufferCanvas = document.createElement('canvas');
  bufferCanvas.width = logicalGrid.gridWidth;
  bufferCanvas.height = logicalGrid.gridHeight;

  const bufferContext = getCanvasContext(bufferCanvas);
  const imageData = new ImageData(
    new Uint8ClampedArray(logicalGrid.sampledPixels),
    logicalGrid.gridWidth,
    logicalGrid.gridHeight,
  );

  bufferContext.putImageData(imageData, 0, 0);

  canvas.width = renderPreview.renderWidth;
  canvas.height = renderPreview.renderHeight;

  const targetContext = getCanvasContext(canvas);
  targetContext.clearRect(0, 0, canvas.width, canvas.height);
  targetContext.drawImage(bufferCanvas, 0, 0, canvas.width, canvas.height);
};
