<!--
Sync Impact Report
Version change: 2.0.0 -> 2.1.0
Modified principles:
- I. Technology and Architecture Boundaries -> I. Technology and Architecture Boundaries
- V. Image-Processing Correctness -> V. Image-Processing Correctness
- Added principle -> VI. Logical Pixels and Resolution Independence
Added sections:
- None
Removed sections:
- None
Follow-up TODOs:
- None
-->

# Pixel Editor Constitution

## Core Principles

### I. Technology and Architecture Boundaries
Pixel Editor MUST use React and TypeScript with strict type checking enabled.
React MUST manage application UI and interaction state only. Drawing operations,
image-processing logic, and document-management behavior MUST remain in
framework-independent modules that can run without React component lifecycle
coupling. The application MUST target modern desktop web browsers.

Canvas 2D SHOULD be the initial rendering technology because it minimizes
complexity and fits the current product scope. WebGL, OffscreenCanvas, or other
rendering technologies MAY be introduced only when measurement shows clear,
meaningful performance gains for realistic editing workflows.

Architecture MUST preserve explicit boundaries between UI, source-image data,
pixel-conversion logic, visual rendering effects, exported output generation,
and persistence. Source images MUST remain distinct from derived pixel-art data
and from any final stylized presentation state.

The processing workflow MUST be non-destructive. Original imported artwork MUST
remain recoverable after conversion, preview, editing, and export operations
unless the user explicitly deletes it. Rendering architecture MUST allow GPU
acceleration to be introduced when measured CPU-based rendering cannot satisfy
responsiveness requirements.

Modules MUST stay small and focused. The project MUST avoid unnecessary
frameworks, dependencies, and architectural patterns whose primary effect is
indirection rather than capability.

Rationale: clear boundaries keep performance-sensitive code independent from UI
framework churn and reduce long-term maintenance cost.

### II. Performance First
Performance is the highest engineering priority after correctness and data
integrity. Drawing interactions, zooming, panning, and common interface actions
MUST remain responsive under normal editing workloads.

The application MUST support editing and processing imported or created images
up to 2048x2048 pixels. Implementations MUST avoid unnecessary image copies,
avoidable allocations, and full-canvas redraws. React MUST NOT render
individual pixels or own the pixel pipeline.

Image manipulation MUST prefer efficient pixel-buffer operations and suitable
typed arrays. Expensive processing MUST NOT block the UI thread when a worker,
incremental algorithm, or comparable approach can preserve responsiveness.
Live previews MUST favor responsiveness over perfect fidelity when conversion is
expensive, but any lower-resolution or progressive-preview behavior MUST be
explicit and predictable.

Performance claims MUST be supported by measurement when practical.
Performance regressions affecting realistic editing workflows MUST be
investigated before changes are accepted. Performance optimizations MUST
preserve correctness and reasonable maintainability.

Rationale: the product succeeds or fails on editing responsiveness.

### III. Local-First Privacy
The application MUST be fully functional without an internet connection. Core
product behavior MUST NOT depend on backend services, user accounts,
authentication, or cloud infrastructure.

Projects and artwork MUST remain on the user's device. Local file import,
export, and project persistence MUST be supported. IndexedDB or similar browser
storage MAY be used for local persistence, but external network services MUST
NOT be required for core functionality.

User artwork MUST NOT be transmitted to external services. The project MUST
avoid telemetry, tracking, and unnecessary collection of user information.
Offline operation MUST remain available after installation or appropriate local
caching.

Rationale: local ownership, privacy, and offline reliability are core product
requirements, not optional enhancements.

### IV. Drawing and Editing Discipline
Pixel Editor's primary purpose is importing existing artwork and transforming it
into highly customizable pixel-art visuals. Manual pixel drawing and editing
are secondary capabilities that MUST support refinement of converted artwork and
basic from-scratch creation without redefining the product's core direction.

The initial drawing workflow MUST prioritize pencil, eraser, fill, color
palette, and undo/redo. Mouse and keyboard MUST be treated as the primary input
methods. Editing behavior MUST favor predictable, precise pixel manipulation,
and pixel-art rendering MUST avoid unintended smoothing or interpolation.

Editing operations SHOULD be reversible through undo/redo whenever the behavior
is user-visible and practical to record. Layers, advanced selections,
animation timelines, customizable brushes, and comparable advanced systems MUST
NOT be introduced without explicit feature requirements.

Rationale: the editor must remain useful for direct manipulation while keeping
its central value in customizable artwork transformation.

### V. Image-Processing Correctness
Advanced image conversion is the core product capability. The architecture MUST
support adjustable processing parameters, adjustable rendering parameters,
responsive live previews, and manual refinement after conversion without
destroying recoverability of the imported source image.

Image-processing algorithms MUST be isolated from UI concerns and designed for
independent execution and testing. For identical input data and configuration,
deterministic algorithms MUST produce identical output. Processing behavior MUST
handle supported image dimensions, transparency, and color values predictably.

The system MUST be able to reproduce the same result from the same source image
and saved parameters. Source-image state, conversion state, rendering-effect
state, and export state MUST remain distinguishable in architecture and saved
project data.

Conversion previews MUST accurately represent final output for the selected
settings, except for explicitly documented preview-resolution differences.
Export capabilities MUST distinguish between underlying pixel-art data and final
stylized appearance so that workflows can preserve either or both intentionally.

Rationale: conversion quality is a primary product value and must be reliable
enough for repeatable creative workflows.

### VI. Logical Pixels and Resolution Independence
The application MUST distinguish between three independent concepts:

1. Source resolution: the dimensions and original image data of imported
	artwork.
2. Logical pixel grid: a configurable grid of image samples representing the
	artwork at a chosen level of detail.
3. Rendering resolution: the dimensions at which the logical pixel grid is
	visually rendered and exported.

A logical pixel MUST be treated as a configurable visual element, not as a
physical screen pixel and not necessarily as an opaque square. The rendering
architecture MUST allow future customization of each element's appearance,
including shape, size, spacing, opacity, edge softness, and glow.

Changing visual rendering properties MUST NOT require regenerating the logical
pixel grid unless those properties explicitly affect sampling. Export
resolution MUST be independent of logical grid resolution.

The application is an artistic image-rendering tool, not merely an image
downscaler.

Rationale: separating sampled image structure from final presentation preserves
artistic flexibility, predictable exports, and future rendering extensibility.

### VII. Minimal but Meaningful Testing
Automated testing MUST focus on correctness of critical image-processing and
pixel-manipulation logic. Unit tests MUST cover important conversion behavior,
including boundaries, transparency handling, palette behavior, deterministic
output, and representative edge cases.

The project SHOULD use a lightweight TypeScript-compatible testing framework.
Tests MUST be deterministic and fast enough for routine development. Manual
verification is acceptable for ordinary interface behavior and visual
presentation when automated coverage would cost more than the value it returns.

Extensive end-to-end suites, arbitrary code-coverage thresholds, and mandatory
test-driven development are NOT required. Test infrastructure MUST NOT be added
when its maintenance cost outweighs practical benefit.

Rationale: the highest testing value is concentrated in image correctness, not
in exhaustive UI automation.

### VIII. Code Quality and Maintainability
TypeScript types MUST be explicit where they materially improve correctness or
understanding. The codebase MUST avoid `any` unless there is a documented
technical justification. Functions and modules MUST remain focused, with clearly
separated responsibilities.

The project MUST prefer understandable code over clever abstraction and MUST
avoid duplicate image-processing logic. Shared behavior SHOULD live in reusable,
framework-independent modules when that reduces duplication without introducing
indirection. Complex algorithms and non-obvious performance decisions MUST be
documented in code or adjacent design artifacts.

Dependencies MUST provide clear value and SHOULD be kept to a minimum. Plugin
systems, microservices, distributed infrastructure, and similar architectural
layers MUST NOT be introduced prematurely.

Maintainability matters, but it MUST NOT be used to justify substantial,
avoidable performance degradation.

Rationale: maintainable systems are built through clarity and boundaries, not by
adding generalized infrastructure early.

### IX. User Experience Priority
The interface MUST prioritize the artwork and drawing canvas. Common operations
SHOULD be accessible with minimal interaction, and keyboard shortcuts SHOULD be
available for frequently used tools and actions.

Zooming MUST preserve sharp pixel boundaries. Long-running operations MUST show
clear progress or busy-state feedback when appropriate. Destructive or
irreversible actions MUST be communicated clearly before user commitment.

The interface MUST remain understandable without extensive documentation.
Decorative complexity, excessive animation, and unnecessary UI dependencies MUST
be avoided.

Rationale: the intended experience is a fast, precise, desktop-oriented creative
tool rather than a presentation-heavy web application.

### X. Scope and Incremental Delivery
Pixel Editor is a personal creative tool, not an enterprise platform.
Development MUST proceed through small, independently verifiable feature
increments. Each change MUST implement only what the active specification
requires and MUST keep the application usable throughout incremental delivery.

The simplest architecture that satisfies correctness and performance MUST be
preferred. New functionality MUST respect existing architectural boundaries.
Speculative abstractions for unconfirmed future requirements MUST be avoided.
Any substantial architectural change MUST document its performance, complexity,
and maintenance implications before acceptance.

The editor SHOULD export standard PNG assets suitable for game-engine workflows,
including use with engines such as Godot, without coupling product decisions to
any specific engine.

Rationale: disciplined scope control preserves momentum and prevents architecture
from outrunning actual product needs.

### XI. Decision-Making Hierarchy
When requirements conflict, decisions MUST be made in this order:

1. Correctness and data integrity. User artwork MUST NOT be corrupted or lost,
	including through silent failure.
2. Performance and responsiveness. Editing flow is the primary optimization
	target.
3. Privacy and offline availability. Core capabilities MUST remain local-first.
4. Simplicity. Unnecessary complexity and dependencies MUST be rejected.
5. Maintainability. The codebase MUST remain understandable and extensible.
6. Development convenience. Developer ergonomics are secondary to the rules
	above.

Engineering decisions SHOULD be evidence-based. Meaningful trade-offs SHOULD be
documented, and optimization claims MUST NOT be accepted without supporting
measurement when measurement is practical.

Rationale: a clear priority order prevents convenience-driven compromises from
overriding product fundamentals.

## Implementation Standards

All future specifications, implementation plans, tasks, and code reviews MUST
map proposed work back to the core principles in this constitution. Any feature
that crosses UI, rendering, persistence, or image-processing boundaries MUST
state those boundaries explicitly before implementation begins.

Performance-sensitive work MUST identify expected workload characteristics,
likely hot paths, and the strategy for avoiding unnecessary redraws, copies, or
UI-thread blocking. Conversion and document logic MUST be designed so that it
can be executed independently of React rendering and validated in isolation.

Specifications and designs for import, conversion, rendering, persistence, and
export MUST identify which artifacts are source-preserving, which are derived
pixel data, and which are presentation-only effects. If a workflow cannot
preserve original imported artwork or cannot reproduce output from saved source
data and parameters, it MUST be rejected or explicitly justified as a narrow
exception.

Specifications affecting rendering or export MUST state how source resolution,
logical grid resolution, and rendering resolution interact. Designs MUST avoid
coupling visual styling changes to logical grid regeneration unless sampling
behavior actually changes.

New dependencies MUST include a short justification describing the capability
provided, why simpler in-house code is insufficient, and what maintenance cost
the dependency introduces. If that justification is weak, the dependency MUST be
rejected.

## Workflow and Review Requirements

Work MUST be delivered in small increments that remain buildable and reviewable.
Code review and design review MUST verify, at minimum, that:

1. React is not taking ownership of pixel rendering or image-processing logic.
2. Performance-sensitive changes include a concrete explanation of expected
	runtime impact.
3. Local-first privacy guarantees remain intact and no network dependency was
	introduced for core behavior.
4. Non-destructive handling of imported artwork is preserved and recoverable.
5. Source images, conversion data, rendering effects, and export outputs remain
	architecturally distinct.
6. Logical grid resolution and rendering resolution remain distinct where the
	feature affects sampling, rendering, or export.
7. New scope is required by the active specification and does not smuggle in
	unrelated advanced features.
8. Critical algorithm changes include appropriate deterministic tests or a clear
	rationale for why manual verification is sufficient.

Exceptions to this constitution MUST be explicit, narrowly scoped, and recorded
in the relevant specification, plan, or review discussion with justification.
Unexplained exceptions MUST be treated as non-compliant.

## Governance

This constitution is the governing standard for product requirements,
architecture decisions, implementation plans, and code reviews in Pixel Editor.
All such artifacts MUST comply with it.

Amendments MUST be intentional, documented, and accompanied by a short rationale
explaining the change. Constitution versioning MUST follow semantic versioning:
MAJOR for backward-incompatible governance changes or principle removals,
MINOR for new principles or materially expanded guidance, and PATCH for
clarifications that do not change meaning.

Compliance review MUST occur during specification review, implementation-plan
review, and code review. Reviewers MUST reject work that conflicts with this
constitution unless an explicit exception is documented and justified.

This document MUST remain concise and operational. It MUST NOT become a feature
backlog, implementation checklist, or substitute for project specifications.

**Version**: 2.1.0 | **Ratified**: 2026-10-10 | **Last Amended**: 2026-10-11
