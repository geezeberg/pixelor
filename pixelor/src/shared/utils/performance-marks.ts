const IMPORT_START = 'pixelor:import:start';
const IMPORT_END = 'pixelor:import:end';
const IMPORT_MEASURE = 'pixelor:import:duration';
const PREVIEW_START = 'pixelor:preview:start';
const PREVIEW_END = 'pixelor:preview:end';
const PREVIEW_MEASURE = 'pixelor:preview:duration';
const PALETTE_GENERATION_START = 'pixelor:palette-generation:start';
const PALETTE_GENERATION_END = 'pixelor:palette-generation:end';
const PALETTE_GENERATION_MEASURE = 'pixelor:palette-generation:duration';
const MODE_SWITCH_START = 'pixelor:mode-switch:start';
const MODE_SWITCH_END = 'pixelor:mode-switch:end';
const MODE_SWITCH_MEASURE = 'pixelor:mode-switch:duration';

function clearMeasurement(name: string, start: string, end: string) {
  performance.clearMeasures(name);
  performance.clearMarks(start);
  performance.clearMarks(end);
}

function readLatestDuration(name: string): number | null {
  const entries = performance.getEntriesByName(name, 'measure');
  if (entries.length === 0) {
    return null;
  }

  return Math.round(entries[entries.length - 1].duration * 100) / 100;
}

export function markImportStart() {
  clearMeasurement(IMPORT_MEASURE, IMPORT_START, IMPORT_END);
  performance.mark(IMPORT_START);
}

export function markImportEnd() {
  performance.mark(IMPORT_END);
  performance.measure(IMPORT_MEASURE, IMPORT_START, IMPORT_END);
  return readLatestDuration(IMPORT_MEASURE);
}

export function markPreviewStart() {
  clearMeasurement(PREVIEW_MEASURE, PREVIEW_START, PREVIEW_END);
  performance.mark(PREVIEW_START);
}

export function markPreviewEnd() {
  performance.mark(PREVIEW_END);
  performance.measure(PREVIEW_MEASURE, PREVIEW_START, PREVIEW_END);
  return readLatestDuration(PREVIEW_MEASURE);
}

export function markPaletteGenerationStart() {
  clearMeasurement(PALETTE_GENERATION_MEASURE, PALETTE_GENERATION_START, PALETTE_GENERATION_END);
  performance.mark(PALETTE_GENERATION_START);
}

export function markPaletteGenerationEnd() {
  performance.mark(PALETTE_GENERATION_END);
  performance.measure(PALETTE_GENERATION_MEASURE, PALETTE_GENERATION_START, PALETTE_GENERATION_END);
  return readLatestDuration(PALETTE_GENERATION_MEASURE);
}

export function markModeSwitchStart() {
  clearMeasurement(MODE_SWITCH_MEASURE, MODE_SWITCH_START, MODE_SWITCH_END);
  performance.mark(MODE_SWITCH_START);
}

export function markModeSwitchEnd() {
  performance.mark(MODE_SWITCH_END);
  performance.measure(MODE_SWITCH_MEASURE, MODE_SWITCH_START, MODE_SWITCH_END);
  return readLatestDuration(MODE_SWITCH_MEASURE);
}

export function readPerformanceSnapshot() {
  return {
    importDurationMs: readLatestDuration(IMPORT_MEASURE),
    previewDurationMs: readLatestDuration(PREVIEW_MEASURE),
    paletteGenerationDurationMs: readLatestDuration(PALETTE_GENERATION_MEASURE),
    modeSwitchDurationMs: readLatestDuration(MODE_SWITCH_MEASURE),
  };
}
