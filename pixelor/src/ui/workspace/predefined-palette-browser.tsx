import { useWorkspaceContext } from '../../app/providers/workspace-provider';

export function PredefinedPaletteBrowser() {
  const { state, selectPalette, duplicatePalette } = useWorkspaceContext();
  const palettes = state.paletteWorkspace.orderedPaletteIds
    .map((paletteId) => state.paletteWorkspace.palettesById[paletteId])
    .filter((palette) => palette?.sourceType === 'predefined');

  return (
    <section className="panel" style={{ padding: 20, display: 'grid', gap: 12 }}>
      <div>
        <h2 style={{ marginTop: 0 }}>Predefined palettes</h2>
        <p style={{ marginBottom: 0, color: 'var(--color-muted)' }}>Browse curated palettes and duplicate any into an editable custom palette.</p>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {palettes.map((palette) => (
          <div key={palette.paletteId} style={{ display: 'grid', gap: 8, border: '1px solid rgba(29, 36, 48, 0.12)', borderRadius: 12, padding: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
              <strong>{palette.name}</strong>
              <span>{palette.colors.length} colors</span>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {palette.colors.map((entry) => (
                <span
                  key={entry.entryId}
                  title={entry.hex}
                  style={{ width: 18, height: 18, borderRadius: 4, border: '1px solid rgba(29, 36, 48, 0.15)', background: entry.hex }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => selectPalette(palette.paletteId)}>Select</button>
              <button type="button" onClick={() => duplicatePalette(palette.paletteId)}>Duplicate</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
