import type { ImageWorkspaceServices } from '../../../domain/pipeline/contracts';
import type { WorkspaceImportResult, WorkspaceState } from '../../../shared/types/image-workspace';
import { importImageAction } from './import-image';

export interface ReplaceImageActionInput {
  file: File;
  previousState: WorkspaceState;
  services: ImageWorkspaceServices;
}

export async function replaceImageAction(input: ReplaceImageActionInput): Promise<WorkspaceImportResult> {
  return importImageAction(input);
}
