import { useEffect, useRef } from 'react';
import { useWorkspaceContext } from '../../app/providers/workspace-provider';

export function SourcePreviewComparison() {
  const { state, services } = useWorkspaceContext();
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeDisplayGrid = state.activeProcessedLogicalGrid ?? state.activeLogicalGrid;

  useEffect(() => {
    if (!previewCanvasRef.current || !activeDisplayGrid || !state.activeRenderPreview) {
      return;
    }

    services.drawRenderPreview({
      logicalGrid: activeDisplayGrid,
      renderPreview: state.activeRenderPreview,
      canvas: previewCanvasRef.current,
    });
  }, [activeDisplayGrid, services, state.activeRenderPreview]);

  return (
    <section className="panel preview-comparison-panel" style={{ padding: 20, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ marginTop: 0 }}>Source and rendered preview</h2>
        <p style={{ marginBottom: 0, color: 'var(--color-muted)' }}>
          The left view stays faithful to the imported source. The right view renders the logical grid.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <figure style={{ margin: 0, display: 'grid', gap: 12 }}>
          <figcaption style={{ fontWeight: 600 }}>Original image</figcaption>
          {state.activeSourceImage ? (
            <img
              alt="Imported source preview"
              src={state.activeSourceImage.displayUrl}
              style={{ width: '100%', borderRadius: 16, border: '1px solid rgba(29, 36, 48, 0.12)' }}
            />
          ) : (
            <div style={{ minHeight: 280, display: 'grid', placeItems: 'center', background: 'rgba(29, 36, 48, 0.05)', borderRadius: 16 }}>
              No source image loaded.
            </div>
          )}
        </figure>

        <figure style={{ margin: 0, display: 'grid', gap: 12 }}>
          <figcaption style={{ fontWeight: 600 }}>
            Rendered preview{state.paletteWorkspace.activePaletteId ? ' (palette-processed)' : ''}
          </figcaption>
          {state.activeRenderPreview ? (
            <div style={{ overflow: 'auto', borderRadius: 16, border: '1px solid rgba(29, 36, 48, 0.12)', background: 'white', padding: 12 }}>
              <canvas ref={previewCanvasRef} aria-label="Rendered logical pixel preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          ) : (
            <div style={{ minHeight: 280, display: 'grid', placeItems: 'center', background: 'rgba(29, 36, 48, 0.05)', borderRadius: 16 }}>
              No rendered preview yet.
            </div>
          )}
        </figure>
      </div>
    </section>
  );
}
