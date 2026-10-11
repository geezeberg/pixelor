import { useWorkspaceContext } from '../../app/providers/workspace-provider';

export function ColorProcessingControls() {
  const { state, updateColorProcessing } = useWorkspaceContext();
  const { processing } = state.paletteWorkspace;
  const hasPalette = Boolean(state.paletteWorkspace.activePaletteId);

  return (
    <section className="panel" style={{ padding: 20, display: 'grid', gap: 12 }}>
      <div>
        <h2 style={{ marginTop: 0 }}>Color processing</h2>
        <p style={{ marginBottom: 0, color: '#4e5765' }}>Switch strict/soft mapping and toggle deterministic ordered dithering.</p>
      </div>

      <label htmlFor="processing-mode">Mode</label>
      <select
        id="processing-mode"
        disabled={!hasPalette}
        value={processing.mode}
        onChange={(event) => updateColorProcessing({ mode: event.currentTarget.value as 'strict' | 'soft' })}
      >
        <option value="strict">Strict Palette Matching</option>
        <option value="soft">Soft Palette Grading</option>
      </select>

      {processing.mode === 'soft' ? (
        <>
          <label htmlFor="soft-strength">Soft strength</label>
          <input
            id="soft-strength"
            type="range"
            min={0}
            max={1}
            step={0.05}
            disabled={!hasPalette}
            value={processing.softStrength}
            onChange={(event) => updateColorProcessing({ softStrength: Number(event.currentTarget.value) })}
          />
        </>
      ) : null}

      <label htmlFor="dithering-enabled" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          id="dithering-enabled"
          type="checkbox"
          disabled={!hasPalette}
          checked={processing.ditheringEnabled}
          onChange={(event) => updateColorProcessing({ ditheringEnabled: event.currentTarget.checked })}
        />
        Enable ordered dithering
      </label>
    </section>
  );
}
