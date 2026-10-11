const IMPORT_START = 'pixelor:import:start';
const IMPORT_END = 'pixelor:import:end';
const IMPORT_MEASURE = 'pixelor:import:duration';
const PREVIEW_START = 'pixelor:preview:start';
const PREVIEW_END = 'pixelor:preview:end';
const PREVIEW_MEASURE = 'pixelor:preview:duration';

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

export function readPerformanceSnapshot() {
  return {
    importDurationMs: readLatestDuration(IMPORT_MEASURE),
    previewDurationMs: readLatestDuration(PREVIEW_MEASURE),
  };
}
