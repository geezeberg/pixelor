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
        displayUrl: `data:image/png;base64,${file.name}`,
        mimeType: 'image/png',
        width: 2,
        height: 2,
        pixelData: new ImageData(new Uint8ClampedArray(2 * 2 * 4).fill(file.name === 'first.png' ? 80 : 160), 2, 2),
      }),
    generateLogicalPixelGrid,
    createRenderPreview: createCanvasRenderPreview,
    drawRenderPreview: drawRenderPreviewToCanvas,
    exportRenderedPreview: exportRenderedPng,
  };
}

describe('replace image workflow', () => {
  it('replaces the active source image and keeps custom palettes available', async () => {
    const { container } = render(
      <WorkspaceProvider services={createServices()}>
        <WorkspaceShell />
      </WorkspaceProvider>,
    );

    const fileInputs = container.querySelectorAll('input[type="file"]');
    fireEvent.change(fileInputs[0], { target: { files: [new File(['x'], 'first.png', { type: 'image/png' })] } });

    await waitFor(() => expect(screen.getByText(/loaded first\.png/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /generate palette/i }));
    fireEvent.change(screen.getByLabelText(/palette name/i), { target: { value: 'Carry Me' } });
    fireEvent.click(screen.getByRole('button', { name: /save as new custom palette/i }));
    expect(screen.getByRole('button', { name: /carry me copy/i })).toBeInTheDocument();

    fireEvent.change(fileInputs[1], { target: { files: [new File(['x'], 'second.png', { type: 'image/png' })] } });

    await waitFor(() => {
      expect(screen.getByText(/loaded second\.png/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /carry me copy/i })).toBeInTheDocument();
    });
  });
});
