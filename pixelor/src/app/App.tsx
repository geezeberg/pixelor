import { WorkspaceProvider } from './providers/workspace-provider';
import { WorkspaceShell } from '../ui/workspace/workspace-shell';

export default function App() {
  return (
    <WorkspaceProvider>
      <WorkspaceShell />
    </WorkspaceProvider>
  );
}
