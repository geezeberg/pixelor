import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WorkspaceProvider } from '../../../src/app/providers/workspace-provider';
import { generateLogicalPixelGrid } from '../../../src/domain/logical-grid/generate-logical-grid';
import { createCanvasRenderPreview, drawRenderPreviewToCanvas } from '../../../src/domain/rendering/render-preview-canvas';
import { createSourceImage } from '../../../src/domain/source-image/source-image';
import { exportRenderedPng } from '../../../src/domain/export/export-rendered-png';
import { readPerformanceSnapshot } from '../../../src/shared/utils/performance-marks';
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
        pixelData: new ImageData(new Uint8ClampedArray(4 * 4 * 4).fill(190), 4, 4),
      }),
    generateLogicalPixelGrid,
    createRenderPreview: createCanvasRenderPreview,
    drawRenderPreview: drawRenderPreviewToCanvas,
    exportRenderedPreview: exportRenderedPng,
  };
}

describe('palette performance budgets', () => {
  it('tracks palette generation and mode-switch timings within budget', async () => {
    const { container } = render(
      <WorkspaceProvider services={createServices()}>
        <WorkspaceShell />
      </WorkspaceProvider>,
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File(['x'], 'perf.png', { type: 'image/png' })] } });

    await waitFor(() => expect(screen.getByText(/loaded perf\.png/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /generate palette/i }));
    fireEvent.click(screen.getByRole('button', { name: /apply strict mode/i }));
    fireEvent.change(screen.getByLabelText(/mode/i), { target: { value: 'soft' } });

    const snapshot = readPerformanceSnapshot();
    expect(snapshot.paletteGenerationDurationMs ?? 0).toBeLessThan(2000);
    expect(snapshot.modeSwitchDurationMs ?? 0).toBeLessThan(500);
  });
});
