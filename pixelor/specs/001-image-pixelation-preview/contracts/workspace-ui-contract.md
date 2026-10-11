# UI Contract: Image Workspace Workflow

## Purpose

Define the user-visible contract for Feature 001 so implementation can be
validated without introducing API-specific or framework-specific assumptions.

## Workspace States

| State | Required Visible Elements | Allowed User Actions | Expected Outcome |
|-------|----------------------------|----------------------|------------------|
| Empty workspace | Import action, drag-and-drop target, neutral guidance text | Select file, drag file into workspace | Supported image begins import workflow |
| Image loaded | Original image view, rendered preview, pixelation control, replace image action, export action | Adjust pixelation, replace image, export PNG | Preview remains in sync with active source and setting |
| Import error | Clear error message, unchanged prior workspace if available, import action still available | Retry import, choose different file | User can recover without restarting |
| Preview updating | Pixelation control, visible busy or updating feedback if needed, source image remains visible | Continue waiting or adjust again if supported | Preview settles to newest selected setting |

## Import Contract

- The workspace MUST accept image import from file picker and drag-and-drop.
- The workspace MUST accept PNG and JPEG only.
- The workspace MUST reject unsupported, corrupt, or oversized images with a
  clear error message.
- The workspace MUST keep processing local to the browser.

## Comparison Contract

- After a successful import, the workspace MUST present both the original image
  and the rendered preview together.
- The original image MUST remain visually distinguishable from the rendered
  pixelated result.
- Replacing the image MUST swap the active source and regenerate the derived
  preview without restarting the application.

## Pixelation Control Contract

- The user MUST have an obvious control for adjusting logical pixelation level.
- Changing the control MUST update the rendered preview interactively without a
  separate apply action.
- The control affects logical sampling detail, not merely CSS scaling of an
  unchanged image.

## Rendering Contract

- The preview MUST communicate visible pixel blocks with crisp edges and no
  unintended smoothing.
- Rendering resolution MUST remain conceptually separate from logical pixel grid
  resolution.
- The initial visual style MAY use square blocks, but the contract MUST leave
  room for future alternate render styles.

## Export Contract

- Export MUST produce a PNG artifact from the rendered result.
- The exported PNG MUST match the rendered preview for the active settings.
- Transparency MUST be preserved when present in the source and rendered result.

## Error Contract

- Unsupported file type, decode failure, or size-limit failure MUST each result
  in a clear user-facing error.
- Error handling MUST NOT silently clear a valid previous workspace state.
- The user MUST be able to retry import after an error.