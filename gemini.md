# Gemini Project Rules

## Purpose
This workspace uses a mission-dispatch workflow. Global dotfiles may provide shared standards and environment details, but this file is the project-local source of truth for execution in this repository.

## Operating Mode
- Default to Phase 0 or Phase 1 behavior unless the current mission explicitly sets a higher phase.
- Prefer the smallest working result over speculative architecture.
- Keep all project logic portable and local to this repository.

## Human Gate
Before implementation or deployment, confirm these three irrational human variables in the mission:
- visual_mood
- pacing
- audience_feeling

If any variable is missing or blank, stop execution and log the blocker.

## Environment Rules
- Prefer binary paths supplied by the environment manifest when available.
- Do not hardcode paths from the global dotfiles directory into app logic.
- If a referenced manifest file is unavailable, continue with local context and log the gap.

## Deployment Rules
- Deploy only when success criteria are explicit.
- A deployment is complete only when the finish-line metric is concrete and externally verifiable.
- Do not auto-deploy on partial success.

## Logging
- Record mission outcomes, blockers, and next actions in `mission_log.md`.
