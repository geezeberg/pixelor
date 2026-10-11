import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WorkspaceProvider } from '../../../src/app/providers/workspace-provider';
import { WorkspaceError } from '../../../src/shared/types/errors';
import { WorkspaceShell } from '../../../src/ui/workspace/workspace-shell';

describe('import error handling', () => {
  it('shows a clear error and keeps the workspace recoverable', async () => {
    const services = {
      importSourceImage: async () => {
        throw new WorkspaceError('unsupported-type', 'Only PNG and JPEG images are supported.');
      },
    };

    const { container } = render(
      <WorkspaceProvider services={services}>
        <WorkspaceShell />
      </WorkspaceProvider>,
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [new File(['x'], 'bad.txt', { type: 'text/plain' })] } });

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/only png and jpeg images are supported/i));
    expect(screen.getByText(/choose image/i)).toBeInTheDocument();
  });
});
