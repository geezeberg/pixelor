import { useState } from 'react';
import { useWorkspaceContext } from '../../app/providers/workspace-provider';
import { PALETTE_LIMITS } from '../../shared/utils/palette-constants';

export function PaletteGenerationControl() {
  const { state, generatePalette, selectPalette } = useWorkspaceContext();
  const [targetSize, setTargetSize] = useState(16);

  const hasImage = Boolean(state.activeSourceImage);
  const activePaletteId = state.paletteWorkspace.activePaletteId;

  return (
    <section className="panel" style={{ padding: 20, display: 'grid', gap: 12 }}>
      <div>
        <h2 style={{ marginTop: 0 }}>Palette generation</h2>
        <p style={{ marginBottom: 0, color: '#4e5765' }}>
          Generate a reduced palette from the current logical grid and apply strict color mapping.
        </p>
      </div>

      <label htmlFor="palette-size-range">Palette size</label>
      <input
        id="palette-size-range"
        type="range"
        min={PALETTE_LIMITS.minColors}
        max={PALETTE_LIMITS.maxColors}
        step={1}
        disabled={!hasImage}
        value={targetSize}
        onChange={(event) => setTargetSize(Number(event.currentTarget.value))}
      />

      <label htmlFor="palette-size-number">Requested colors</label>
      <input
        id="palette-size-number"
        type="number"
        min={PALETTE_LIMITS.minColors}
        max={PALETTE_LIMITS.maxColors}
        step={1}
        disabled={!hasImage}
        value={targetSize}
        onChange={(event) => setTargetSize(Number(event.currentTarget.value))}
      />

      <button type="button" disabled={!hasImage} onClick={() => generatePalette(targetSize)}>
        Generate palette
      </button>

      {activePaletteId ? (
        <button type="button" disabled={!hasImage} onClick={() => selectPalette(activePaletteId)}>
          Apply strict mode
        </button>
      ) : null}
    </section>
  );
}
