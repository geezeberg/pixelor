import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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
        width: 2,
        height: 2,
        pixelData: new ImageData(new Uint8ClampedArray(2 * 2 * 4).fill(210), 2, 2),
      }),
    generateLogicalPixelGrid,
    createRenderPreview: createCanvasRenderPreview,
    drawRenderPreview: drawRenderPreviewToCanvas,
    exportRenderedPreview: exportRenderedPng,
  };
}

describe('workspace regressions', () => {
  it('keeps the source image stable while exporting the current rendered preview', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    const { container } = render(
      <WorkspaceProvider services={createServices()}>
        <WorkspaceShell />
      </WorkspaceProvider>,
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File(['x'], 'stable.png', { type: 'image/png' })] } });

    await waitFor(() => expect(screen.getByText(/loaded stable\.png/i)).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/cell size/i), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: /export png/i }));

    await waitFor(() => expect(clickSpy).toHaveBeenCalled());
    expect(screen.getByAltText(/imported source preview/i)).toHaveAttribute('src', expect.stringContaining('data:image/png'));

    clickSpy.mockRestore();
  });
});
