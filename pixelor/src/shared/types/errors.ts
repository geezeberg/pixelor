export type WorkspaceErrorCode =
  | 'unsupported-type'
  | 'oversized-image'
  | 'corrupt-image'
  | 'empty-image'
  | 'missing-preview'
  | 'render-failed'
  | 'export-failed'
  | 'unknown';

export class WorkspaceError extends Error {
  code: WorkspaceErrorCode;
  details?: Record<string, unknown>;

  constructor(code: WorkspaceErrorCode, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'WorkspaceError';
    this.code = code;
    this.details = details;
  }
}

export function isWorkspaceError(error: unknown): error is WorkspaceError {
  return error instanceof WorkspaceError;
}
