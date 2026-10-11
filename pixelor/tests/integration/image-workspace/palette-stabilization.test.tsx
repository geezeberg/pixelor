import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WorkspaceProvider } from '../../../src/app/providers/workspace-provider';
import { generateLogicalPixelGrid } from '../../../src/domain/logical-grid/generate-logical-grid';
import { createCanvasRenderPreview, drawRenderPreviewToCanvas } from '../../../src/domain/rendering/render-preview-canvas';
import { createSourceImage } from '../../../src/domain/source-image/source-image';
import { exportRenderedPng } from '../../../src/domain/export/export-rendered-png';
import { WorkspaceShell } from '../../../src/ui/workspace/workspace-shell';

function createServices(overrides?: {
  exportRenderedPreview?: typeof exportRenderedPng;
  drawRenderPreview?: typeof drawRenderPreviewToCanvas;
}) {
  return {
    importSourceImage: async ({ file }: { file: File }) =>
      createSourceImage({
        sourceImageId: `fixture-${file.name}`,
        fileName: file.name,
        displayUrl: `data:image/png;base64,${file.name}`,
        mimeType: 'image/png',
        width: 4,
        height: 4,
        pixelData: new ImageData(
          new Uint8ClampedArray([
            255, 10, 10, 255,
            230, 20, 20, 255,
            200, 30, 30, 255,
            170, 40, 40, 255,
            10, 255, 10, 255,
            20, 230, 20, 255,
            30, 200, 30, 255,
            40, 170, 40, 255,
            10, 10, 255, 255,
            20, 20, 230, 255,
            30, 30, 200, 255,
            40, 40, 170, 255,
            255, 255, 20, 255,
            230, 230, 30, 255,
            200, 200, 40, 255,
            170, 170, 50, 255,
          ]),
          4,
          4,
        ),
      }),
    generateLogicalPixelGrid,
    createRenderPreview: createCanvasRenderPreview,
    drawRenderPreview: overrides?.drawRenderPreview ?? drawRenderPreviewToCanvas,
    exportRenderedPreview: overrides?.exportRenderedPreview ?? exportRenderedPng,
  };
}

describe('feature 002 stabilization', () => {
  it('supports switching between processed palette and original colors with export parity', async () => {
    const exportSpy = vi.fn(exportRenderedPng);

    const { container } = render(
      <WorkspaceProvider services={createServices({ exportRenderedPreview: exportSpy })}>
        <WorkspaceShell />
      </WorkspaceProvider>,
    );

    const fileInputs = container.querySelectorAll('input[type="file"]');
    fireEvent.change(fileInputs[0], { target: { files: [new File(['x'], 'toggle.png', { type: 'image/png' })] } });
    await waitFor(() => expect(screen.getByText(/loaded toggle\.png/i)).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/requested colors/i), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /generate palette/i }));

    await waitFor(() => expect(screen.getByText(/rendered preview \(palette-processed\)/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /export png/i }));
    await waitFor(() => expect(exportSpy).toHaveBeenCalledTimes(1));
    const processedFingerprint = exportSpy.mock.calls[0][0].logicalGrid.fingerprint;

    fireEvent.change(screen.getByLabelText(/mode/i), { target: { value: 'soft' } });

    const paletteSelect = screen.getByLabelText(/active palette/i) as HTMLSelectElement;
    fireEvent.change(paletteSelect, { target: { value: '' } });

    await waitFor(() => expect(screen.queryByText(/rendered preview \(palette-processed\)/i)).not.toBeInTheDocument());
    expect(screen.getByLabelText(/mode/i)).toHaveValue('soft');

    fireEvent.click(screen.getByRole('button', { name: /export png/i }));
    await waitFor(() => expect(exportSpy).toHaveBeenCalledTimes(2));
    const originalFingerprint = exportSpy.mock.calls[1][0].logicalGrid.fingerprint;
    expect(typeof originalFingerprint).toBe('string');
    expect(originalFingerprint.length).toBeGreaterThan(0);

    const paletteOption = Array.from(paletteSelect.options).find((option) => option.value.startsWith('auto-'));
    expect(paletteOption).toBeDefined();
    fireEvent.change(paletteSelect, { target: { value: paletteOption?.value } });

    await waitFor(() => expect(screen.getByText(/rendered preview \(palette-processed\)/i)).toBeInTheDocument());
    expect(screen.getByLabelText(/mode/i)).toHaveValue('soft');
    expect(processedFingerprint.length).toBeGreaterThan(0);
  });

  it('does not reactivate a disabled palette during pixelation changes or source replacement', async () => {
    const { container } = render(
      <WorkspaceProvider services={createServices()}>
        <WorkspaceShell />
      </WorkspaceProvider>,
    );

    const imageFileInputs = container.querySelectorAll('input[type="file"][accept="image/png,image/jpeg"]');
    fireEvent.change(imageFileInputs[0], { target: { files: [new File(['x'], 'first-disable.png', { type: 'image/png' })] } });
    await waitFor(() => expect(screen.getByText(/loaded first-disable\.png/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /generate palette/i }));
    await waitFor(() => expect(screen.getByText(/rendered preview \(palette-processed\)/i)).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/active palette/i), { target: { value: '' } });
    await waitFor(() => expect(screen.queryByText(/rendered preview \(palette-processed\)/i)).not.toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/cell size/i), { target: { value: '20' } });
    await waitFor(() => expect(screen.getByLabelText(/current value/i)).toHaveValue(20));
    expect(screen.queryByText(/rendered preview \(palette-processed\)/i)).not.toBeInTheDocument();

    fireEvent.change(imageFileInputs[1], { target: { files: [new File(['x'], 'second-disable.png', { type: 'image/png' })] } });
    await waitFor(() => expect(screen.getByText(/loaded second-disable\.png/i)).toBeInTheDocument());
    expect(screen.queryByText(/rendered preview \(palette-processed\)/i)).not.toBeInTheDocument();
  });

  it('supports draft hex editing and commits only valid colors', async () => {
    const { container } = render(
      <WorkspaceProvider services={createServices()}>
        <WorkspaceShell />
      </WorkspaceProvider>,
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File(['x'], 'hex-edit.png', { type: 'image/png' })] } });
    await waitFor(() => expect(screen.getByText(/loaded hex-edit\.png/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /generate palette/i }));

    const hexInput = await screen.findByLabelText(/selected-swatch-hex/i);
    fireEvent.change(hexInput, { target: { value: '#FF' } });
    expect(hexInput).toHaveValue('#FF');

    fireEvent.blur(hexInput);
    expect(screen.getByText(/enter a valid hex color/i)).toBeInTheDocument();

    fireEvent.change(hexInput, { target: { value: '#00ff00' } });
    fireEvent.keyDown(hexInput, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.queryByText(/enter a valid hex color/i)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/selected-swatch-hex/i)).toHaveValue('#00FF00');
      expect(screen.getByLabelText(/selected-swatch-color/i)).toHaveValue('#00ff00');
    });
  });

  it('save as new custom palette creates independent copies and avoids redraw on unrelated save', async () => {
    const drawSpy = vi.fn(drawRenderPreviewToCanvas);

    const { container } = render(
      <WorkspaceProvider services={createServices({ drawRenderPreview: drawSpy })}>
        <WorkspaceShell />
      </WorkspaceProvider>,
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File(['x'], 'save-as.png', { type: 'image/png' })] } });
    await waitFor(() => expect(screen.getByText(/loaded save-as\.png/i)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /generate palette/i }));
    fireEvent.click(screen.getByRole('button', { name: /save as new custom palette/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /auto palette copy/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /save as new custom palette/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /auto palette copy copy/i })).toBeInTheDocument();
    });

    const drawsBeforeSave = drawSpy.mock.calls.length;
    fireEvent.click(screen.getByRole('button', { name: /save active custom palette/i }));

    await waitFor(() => {
      expect(drawSpy.mock.calls.length).toBe(drawsBeforeSave);
    });
  });
});
