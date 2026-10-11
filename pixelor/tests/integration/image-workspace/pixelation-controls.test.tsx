import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WorkspaceProvider } from '../../../src/app/providers/workspace-provider';
import { generateLogicalPixelGrid } from '../../../src/domain/logical-grid/generate-logical-grid';
import { createCanvasRenderPreview, drawRenderPreviewToCanvas } from '../../../src/domain/rendering/render-preview-canvas';
import { createSourceImage } from '../../../src/domain/source-image/source-image';
import { exportRenderedPng } from '../../../src/domain/export/export-rendered-png';
import { WorkspaceShell } from '../../../src/ui/workspace/workspace-shell';

function createServices() {
  return {
    importSourceImage: async ({ file }: { file: File }) =>
      createSourceImage({
        sourceImageId: `fixture-${file.name}`,
        fileName: file.name,
        displayUrl: 'data:image/png;base64,fixture',
        mimeType: 'image/png',
        width: 4,
        height: 4,
        pixelData: new ImageData(new Uint8ClampedArray(4 * 4 * 4).fill(200), 4, 4),
      }),
    generateLogicalPixelGrid,
    createRenderPreview: createCanvasRenderPreview,
    drawRenderPreview: drawRenderPreviewToCanvas,
    exportRenderedPreview: exportRenderedPng,
  };
}

describe('pixelation controls', () => {
  it('updates the numeric control and keeps the source image visible', async () => {
    const { container } = render(
      <WorkspaceProvider services={createServices()}>
        <WorkspaceShell />
      </WorkspaceProvider>,
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File(['x'], 'editable.png', { type: 'image/png' })] } });

    await waitFor(() => expect(screen.getByText(/loaded editable\.png/i)).toBeInTheDocument());

    const range = screen.getByLabelText(/cell size/i);
    fireEvent.change(range, { target: { value: '16' } });

    await waitFor(() => expect(screen.getByLabelText(/current value/i)).toHaveValue(16));
    expect(screen.getByAltText(/imported source preview/i)).toBeInTheDocument();
  });
});
