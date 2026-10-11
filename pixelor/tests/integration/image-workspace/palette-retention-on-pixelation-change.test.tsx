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
        pixelData: new ImageData(new Uint8ClampedArray(4 * 4 * 4).fill(170), 4, 4),
      }),
    generateLogicalPixelGrid,
    createRenderPreview: createCanvasRenderPreview,
    drawRenderPreview: drawRenderPreviewToCanvas,
    exportRenderedPreview: exportRenderedPng,
  };
}

describe('palette retention across pixelation changes', () => {
  it('keeps selected palette processing active after logical pixelation updates', async () => {
    const { container } = render(
      <WorkspaceProvider services={createServices()}>
        <WorkspaceShell />
      </WorkspaceProvider>,
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File(['x'], 'retain.png', { type: 'image/png' })] } });

    await waitFor(() => expect(screen.getByText(/loaded retain\.png/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /generate palette/i }));
    fireEvent.click(screen.getByRole('button', { name: /apply strict mode/i }));
    fireEvent.change(screen.getByLabelText(/cell size/i), { target: { value: '24' } });

    await waitFor(() => {
      expect(screen.getByText(/rendered preview \(palette-processed\)/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('24')).toBeInTheDocument();
    });
  });
});
