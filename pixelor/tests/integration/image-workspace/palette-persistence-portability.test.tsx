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

describe('palette persistence and portability flow', () => {
  it('saves custom palette and exports active palette artifact', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    const { container } = render(
      <WorkspaceProvider services={createServices()}>
        <WorkspaceShell />
      </WorkspaceProvider>,
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File(['x'], 'persist.png', { type: 'image/png' })] } });

    await waitFor(() => expect(screen.getByText(/loaded persist\.png/i)).toBeInTheDocument());

    fireEvent.click(screen.getAllByRole('button', { name: /duplicate/i })[0]);
    fireEvent.click(screen.getByRole('button', { name: /save active custom palette/i }));
    fireEvent.click(screen.getByRole('button', { name: /export active palette/i }));

    await waitFor(() => {
      expect(clickSpy).toHaveBeenCalled();
    });

    clickSpy.mockRestore();
  });
});
