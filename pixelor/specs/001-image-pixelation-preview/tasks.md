---

description: "Task list for implementing Feature 001: Image Import, Logical Pixelation, and Basic Rendered Preview"
---

# Tasks: Image Import, Logical Pixelation, and Basic Rendered Preview

**Input**: Design documents from `/specs/001-image-pixelation-preview/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include deterministic unit and integration tasks for critical image-processing, preview, and export behavior required by the feature plan and constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single browser application: `src/`, `tests/` at repository root
- Feature docs live in `specs/001-image-pixelation-preview/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline tooling for a React + TypeScript browser app

- [X] T001 Create `package.json` with React, TypeScript, Vite, and Vitest scripts at `/home/tomtom/gm/pixelor/package.json`
- [X] T002 Create TypeScript project configuration with strict mode at `/home/tomtom/gm/pixelor/tsconfig.json`
- [X] T003 [P] Create Vite configuration for a desktop-browser web app at `/home/tomtom/gm/pixelor/vite.config.ts`
- [X] T004 [P] Create HTML entry point and root mount at `/home/tomtom/gm/pixelor/index.html`
- [X] T005 [P] Create application bootstrap files at `/home/tomtom/gm/pixelor/src/main.tsx` and `/home/tomtom/gm/pixelor/src/app/App.tsx`
- [X] T006 [P] Create Vitest setup and browser test environment configuration at `/home/tomtom/gm/pixelor/vitest.config.ts` and `/home/tomtom/gm/pixelor/tests/setup.ts`
- [X] T007 [P] Create base stylesheet with crisp canvas presentation defaults at `/home/tomtom/gm/pixelor/src/styles/global.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core architecture and shared modules that MUST exist before any user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Create shared feature and pipeline type definitions at `/home/tomtom/gm/pixelor/src/shared/types/image-workspace.ts`
- [X] T009 [P] Create `SourceImage` domain model in `/home/tomtom/gm/pixelor/src/domain/source-image/source-image.ts` with validations "Width and height MUST both be greater than zero and MUST NOT exceed 2048", "MIME type MUST be supported before processing continues", and "Source pixel data MUST remain unchanged after import unless the user replaces the image"
- [X] T010 [P] Create `PixelationSetting` domain model in `/home/tomtom/gm/pixelor/src/domain/logical-grid/pixelation-setting.ts` with validations "Current value MUST stay within the supported bounds" and "Setting changes MUST trigger logical grid regeneration"
- [X] T011 [P] Create `LogicalPixelGrid` domain model in `/home/tomtom/gm/pixelor/src/domain/logical-grid/logical-pixel-grid.ts` with validations "Grid dimensions MUST preserve source aspect ratio within the selected sampling scheme", "Grid generation MUST be deterministic for identical source data and identical settings", and "Grid generation MUST NOT mutate source image data"
- [X] T012 [P] Create `RenderPreview` and `ExportedOutput` domain models in `/home/tomtom/gm/pixelor/src/domain/rendering/render-preview.ts` and `/home/tomtom/gm/pixelor/src/domain/export/exported-output.ts` with validations "Rendered preview MUST preserve crisp pixel boundaries without unintended smoothing", "Render dimensions MUST remain conceptually independent from logical grid dimensions", "Preview MUST accurately represent what export will produce for the same settings", "Export MUST only proceed when a valid rendered preview exists", "Exported output MUST match the active preview for the current settings", and "Export MUST preserve transparency when present in the rendered result"
- [X] T013 Create `WorkspaceSession` state model in `/home/tomtom/gm/pixelor/src/features/image-workspace/state/workspace-session.ts` with validations "Only one source image is active at a time in Feature 001", "Import failure MUST leave the previous valid session intact when possible", and "Replacing the source image MUST invalidate derived grid and preview state before regeneration"
- [X] T014 Create framework-independent image pipeline interfaces for import, sampling, rendering, and export at `/home/tomtom/gm/pixelor/src/domain/pipeline/contracts.ts`
- [X] T015 [P] Create reusable browser file and image utility helpers at `/home/tomtom/gm/pixelor/src/shared/utils/file-image.ts`
- [X] T016 [P] Create shared error types and user-facing error mapping for unsupported, corrupt, and oversized images at `/home/tomtom/gm/pixelor/src/shared/types/errors.ts` and `/home/tomtom/gm/pixelor/src/shared/utils/error-messages.ts`
- [X] T017 Create root workspace layout and provider scaffolding at `/home/tomtom/gm/pixelor/src/app/providers/workspace-provider.tsx`, `/home/tomtom/gm/pixelor/src/ui/workspace/workspace-shell.tsx`, and `/home/tomtom/gm/pixelor/src/ui/feedback/workspace-status.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Import and View Pixelated Preview (Priority: P1) 🎯 MVP

**Goal**: Let a user import a supported image offline and see the unchanged source image beside a rendered pixelated preview derived from a logical pixel grid.

**Independent Test**: Import a supported PNG or JPEG while offline and confirm the workspace shows the original image together with a separate pixelated preview generated from a logical pixel grid.

### Tests for User Story 1

- [X] T018 [P] [US1] Add unit tests for source image validation and immutability in `/home/tomtom/gm/pixelor/tests/unit/source-image/source-image.test.ts`
- [X] T019 [P] [US1] Add unit tests for initial logical grid generation preserving aspect ratio and deterministic output in `/home/tomtom/gm/pixelor/tests/unit/logical-grid/generate-grid.test.ts`
- [X] T020 [P] [US1] Add integration test for offline image import and dual-pane source/preview display in `/home/tomtom/gm/pixelor/tests/integration/image-workspace/import-preview.test.tsx`

### Implementation for User Story 1

- [X] T021 [P] [US1] Implement browser image import service for file picker and drag-and-drop in `/home/tomtom/gm/pixelor/src/domain/source-image/import-source-image.ts`
- [X] T022 [P] [US1] Implement deterministic logical pixel grid generation from source image data in `/home/tomtom/gm/pixelor/src/domain/logical-grid/generate-logical-grid.ts`
- [X] T023 [P] [US1] Implement Canvas 2D square-block preview renderer with smoothing disabled in `/home/tomtom/gm/pixelor/src/domain/rendering/render-preview-canvas.ts`
- [X] T024 [US1] Implement image import actions and workspace session transitions in `/home/tomtom/gm/pixelor/src/features/image-workspace/actions/import-image.ts`
- [X] T025 [US1] Implement workspace import surface with file picker and drag-and-drop in `/home/tomtom/gm/pixelor/src/ui/workspace/import-panel.tsx`
- [X] T026 [US1] Implement original image view and rendered preview panel in `/home/tomtom/gm/pixelor/src/ui/workspace/source-preview-comparison.tsx`
- [X] T027 [US1] Wire the import workflow into the main app shell in `/home/tomtom/gm/pixelor/src/app/App.tsx` and `/home/tomtom/gm/pixelor/src/ui/workspace/workspace-shell.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Adjust Logical Pixelation Interactively (Priority: P2)

**Goal**: Let a user adjust logical pixelation interactively and see the preview update without losing source image recoverability or transparency behavior.

**Independent Test**: Load one supported image, change the pixelation control several times, and confirm the preview updates interactively while the original image remains unchanged and visible.

### Tests for User Story 2

- [X] T028 [P] [US2] Add unit tests for `PixelationSetting` bounds and regeneration triggers in `/home/tomtom/gm/pixelor/tests/unit/logical-grid/pixelation-setting.test.ts`
- [X] T029 [P] [US2] Add unit tests for transparency preservation and preview determinism during grid regeneration in `/home/tomtom/gm/pixelor/tests/unit/rendering/preview-regeneration.test.ts`
- [X] T030 [P] [US2] Add integration test for interactive pixelation updates without explicit apply in `/home/tomtom/gm/pixelor/tests/integration/image-workspace/pixelation-controls.test.tsx`

### Implementation for User Story 2

- [X] T031 [P] [US2] Implement pixelation setting reducer and state selectors in `/home/tomtom/gm/pixelor/src/features/image-workspace/state/pixelation-state.ts`
- [X] T032 [P] [US2] Implement regenerate-preview action that rebuilds the logical grid and preview from the active source image in `/home/tomtom/gm/pixelor/src/features/image-workspace/actions/update-pixelation.ts`
- [X] T033 [P] [US2] Implement pixelation slider and numeric control UI in `/home/tomtom/gm/pixelor/src/ui/controls/pixelation-control.tsx`
- [X] T034 [US2] Update preview rendering orchestration to show responsive updating state and preserve transparency in `/home/tomtom/gm/pixelor/src/ui/workspace/source-preview-comparison.tsx` and `/home/tomtom/gm/pixelor/src/ui/feedback/workspace-status.tsx`
- [X] T035 [US2] Wire interactive pixelation controls into the workspace shell in `/home/tomtom/gm/pixelor/src/ui/workspace/workspace-shell.tsx`

**Checkpoint**: At this point, User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Export and Replace Source Image (Priority: P3)

**Goal**: Let a user export the rendered result as PNG, replace the source image without restarting, and receive clear errors for unsupported, corrupt, or oversized imports.

**Independent Test**: Export the rendered preview as PNG, then replace the active image with a new supported file and confirm the workspace refreshes correctly while invalid imports surface clear errors.

### Tests for User Story 3

- [X] T036 [P] [US3] Add unit tests for PNG export parity and transparency preservation in `/home/tomtom/gm/pixelor/tests/unit/export/export-rendered-output.test.ts`
- [X] T037 [P] [US3] Add integration test for replacing the active source image without stale preview state in `/home/tomtom/gm/pixelor/tests/integration/image-workspace/replace-image.test.tsx`
- [X] T038 [P] [US3] Add integration test for invalid import errors and recovery in `/home/tomtom/gm/pixelor/tests/integration/image-workspace/import-errors.test.tsx`

### Implementation for User Story 3

- [X] T039 [P] [US3] Implement PNG export service from the active rendered preview in `/home/tomtom/gm/pixelor/src/domain/export/export-rendered-png.ts`
- [X] T040 [P] [US3] Implement replace-image action that swaps the active source image and invalidates derived state before regeneration in `/home/tomtom/gm/pixelor/src/features/image-workspace/actions/replace-image.ts`
- [X] T041 [P] [US3] Implement export action and download flow in `/home/tomtom/gm/pixelor/src/features/image-workspace/actions/export-preview.ts`
- [X] T042 [US3] Add replace-image and export controls to the workspace UI in `/home/tomtom/gm/pixelor/src/ui/controls/workspace-actions.tsx`
- [X] T043 [US3] Implement clear user-facing error presentation and retry handling in `/home/tomtom/gm/pixelor/src/ui/feedback/import-error-banner.tsx` and `/home/tomtom/gm/pixelor/src/features/image-workspace/actions/import-image.ts`
- [X] T044 [US3] Wire export and replace-image flows into the workspace shell in `/home/tomtom/gm/pixelor/src/ui/workspace/workspace-shell.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T045 [P] Document project setup, offline workflow, and available scripts in `/home/tomtom/gm/pixelor/README.md`
- [X] T046 Optimize preview redraw and import memory behavior across `/home/tomtom/gm/pixelor/src/domain/logical-grid/generate-logical-grid.ts`, `/home/tomtom/gm/pixelor/src/domain/rendering/render-preview-canvas.ts`, and `/home/tomtom/gm/pixelor/src/domain/export/export-rendered-png.ts`
- [X] T047 [P] Add repeatable import and preview timing instrumentation in `/home/tomtom/gm/pixelor/src/shared/utils/performance-marks.ts`
- [ ] T048 Record SC-001 and SC-002 validation results for supported browsers in `/home/tomtom/gm/pixelor/specs/001-image-pixelation-preview/quickstart.md`
- [X] T049 [P] Add cross-story regression tests for source/grid/render separation and preview/export parity in `/home/tomtom/gm/pixelor/tests/integration/image-workspace/workspace-regressions.test.tsx`
- [ ] T050 Run the full quickstart validation scenarios and record any follow-up fixes in `/home/tomtom/gm/pixelor/specs/001-image-pixelation-preview/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories should be completed in priority order for MVP delivery
  - After Foundational, separate team members can work on later stories in parallel if they respect stable interfaces from prior stories
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - establishes the MVP workflow
- **User Story 2 (P2)**: Depends on User Story 1 preview pipeline and can begin once import and initial preview exist
- **User Story 3 (P3)**: Depends on User Story 1 preview pipeline and should reuse User Story 2 state handling where available

### Within Each User Story

- Tests should be written before or alongside the related implementation work for deterministic validation
- Domain logic before UI wiring
- UI wiring before full workflow validation
- Story complete before moving MVP scope to the next priority

### Parallel Opportunities

- Setup tasks marked `[P]` can run in parallel after `T001` and `T002`
- Foundational domain model tasks `T009` through `T012` can run in parallel
- In User Story 1, `T021`, `T022`, and `T023` can run in parallel after the foundational phase
- In User Story 2, `T031`, `T032`, and `T033` can run in parallel after User Story 1 is stable
- In User Story 3, `T039`, `T040`, and `T041` can run in parallel after the shared preview state is stable

---

## Parallel Example: User Story 1

```bash
Task: "T018 [US1] Add unit tests for source image validation and immutability in tests/unit/source-image/source-image.test.ts"
Task: "T019 [US1] Add unit tests for initial logical grid generation preserving aspect ratio and deterministic output in tests/unit/logical-grid/generate-grid.test.ts"

Task: "T021 [US1] Implement browser image import service for file picker and drag-and-drop in src/domain/source-image/import-source-image.ts"
Task: "T022 [US1] Implement deterministic logical pixel grid generation from source image data in src/domain/logical-grid/generate-logical-grid.ts"
Task: "T023 [US1] Implement Canvas 2D square-block preview renderer with smoothing disabled in src/domain/rendering/render-preview-canvas.ts"
```

---

## Parallel Example: User Story 2

```bash
Task: "T028 [US2] Add unit tests for PixelationSetting bounds and regeneration triggers in tests/unit/logical-grid/pixelation-setting.test.ts"
Task: "T029 [US2] Add unit tests for transparency preservation and preview determinism during grid regeneration in tests/unit/rendering/preview-regeneration.test.ts"

Task: "T031 [US2] Implement pixelation setting reducer and state selectors in src/features/image-workspace/state/pixelation-state.ts"
Task: "T033 [US2] Implement pixelation slider and numeric control UI in src/ui/controls/pixelation-control.tsx"
```

---

## Parallel Example: User Story 3

```bash
Task: "T036 [US3] Add unit tests for PNG export parity and transparency preservation in tests/unit/export/export-rendered-output.test.ts"
Task: "T037 [US3] Add integration test for replacing the active source image without stale preview state in tests/integration/image-workspace/replace-image.test.tsx"
Task: "T038 [US3] Add integration test for invalid import errors and recovery in tests/integration/image-workspace/import-errors.test.tsx"

Task: "T039 [US3] Implement PNG export service from the active rendered preview in src/domain/export/export-rendered-png.ts"
Task: "T040 [US3] Implement replace-image action that swaps the active source image and invalidates derived state before regeneration in src/features/image-workspace/actions/replace-image.ts"
Task: "T041 [US3] Implement export action and download flow in src/features/image-workspace/actions/export-preview.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate offline import plus original/preview comparison before expanding scope

### Incremental Delivery

1. Setup + Foundational create the reusable pipeline and workspace shell
2. User Story 1 delivers the first end-to-end image transformation MVP
3. User Story 2 adds interactive control over logical pixelation
4. User Story 3 adds export, replacement flow, and failure recovery
5. Polish then tightens performance, documentation, and regression coverage

### Parallel Team Strategy

1. One developer can establish tooling and domain contracts while another prepares tests and workspace UI scaffolding.
2. After User Story 1 stabilizes interfaces, one developer can focus on interactive controls while another prepares export and replacement flows.

---

## Notes

- All tasks use the required checklist format with task ID, optional parallel marker, optional story label, and exact file paths.
- The suggested MVP scope is Phase 3 only after Setup and Foundational work are complete.
- The task list preserves the constitution's separation between source image, logical grid, rendering, and export logic.