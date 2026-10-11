import { useWorkspaceContext } from '../../app/providers/workspace-provider';

export function PixelationControl() {
  const { state, updatePixelation } = useWorkspaceContext();
  const { activeSourceImage, activePixelationSetting } = state;

  return (
    <section className="panel" style={{ padding: 20, display: 'grid', gap: 12 }}>
      <div>
        <h2 style={{ marginTop: 0 }}>Logical pixelation</h2>
        <p style={{ marginBottom: 0, color: '#4e5765' }}>
          Adjust the logical grid density without mutating the imported source image.
        </p>
      </div>

      <label htmlFor="pixelation-range">Cell size</label>
      <input
        id="pixelation-range"
        type="range"
        min={activePixelationSetting.minValue}
        max={activePixelationSetting.maxValue}
        step={1}
        disabled={!activeSourceImage}
        value={activePixelationSetting.settingValue}
        onChange={(event) => updatePixelation(Number(event.currentTarget.value))}
      />

      <label htmlFor="pixelation-number">Current value</label>
      <input
        id="pixelation-number"
        type="number"
        min={activePixelationSetting.minValue}
        max={activePixelationSetting.maxValue}
        step={1}
        disabled={!activeSourceImage}
        value={activePixelationSetting.settingValue}
        onChange={(event) => updatePixelation(Number(event.currentTarget.value))}
      />
    </section>
  );
}
