import { WorkspaceError } from '../../shared/types/errors';

export interface ExportedOutput {
  exportFormat: 'image/png';
  exportedAt: number;
  matchesPreview: boolean;
  sourceGridFingerprint: string;
  blob: Blob;
}

export function createExportedOutput(blob: Blob, sourceGridFingerprint: string): ExportedOutput {
  if (blob.type !== 'image/png') {
    throw new WorkspaceError('export-failed', 'Exported output must be a PNG blob.');
  }

  return {
    exportFormat: 'image/png',
    exportedAt: Date.now(),
    matchesPreview: true,
    sourceGridFingerprint,
    blob,
  };
}
