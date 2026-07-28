# Luísa Michelin Riqueti — Portfolio

## Project purpose

This is Luísa's personal portfolio for university applications.

The portfolio is not a résumé website or a generic developer portfolio.
It should tell a personal story while also demonstrating Luísa's interest
in technology, education, people, research, and building solutions.

The existing project is the source of truth. Preserve its personality and
evolve it incrementally.

## Core rules

- Preserve the existing visual identity.
- Pink is an intentional part of Luísa's personal identity.
- Do not redesign existing sections unless explicitly requested.
- Do not replace or redraw the custom SVG avatar.
- Preserve the avatar's expressions and interactive behavior unless a task
  explicitly requires changing them.
- Do not rewrite portfolio copy unless explicitly requested.
- Do not invent biographical information, achievements, dates, metrics,
  projects, or experiences.
- Prefer small, reviewable changes over large rewrites.
- Do not delete working behavior just because another implementation would
  be cleaner.
- Explain significant architectural changes before implementing them.

## Technology

Prefer:
- semantic HTML
- CSS
- vanilla JavaScript

Bootstrap is already present and may be used where it genuinely simplifies
layout or responsive behavior.

Do not introduce a new framework, library, animation library, or dependency
without explaining why it is necessary first.

## Design principles

- The site should feel personal, curious, warm, and technically thoughtful.
- It must not look like a generic résumé or developer template.
- Each major section should have one primary interaction.
- If everything moves, nothing feels special.
- Animation must support the story, not distract from it.
- Real photographs should be prioritized when they tell the story better
  than decorative graphics.
- Do not turn every piece of content into a card.
- Preserve visual breathing room.

## Interaction principles

- Important information must never depend exclusively on hover.
- Interactive content must remain understandable on touch devices.
- Respect `prefers-reduced-motion`.
- Avoid simultaneous competing animations.
- Keep scroll-based animations lightweight.
- Microinteractions may add personality but should not interfere with reading.
- Easter eggs must never contain essential application information.

## Accessibility

- Preserve or improve semantic HTML.
- Images must have meaningful alt text when appropriate.
- Interactive elements must be keyboard accessible.
- Maintain visible focus states.
- Maintain readable contrast.
- Do not communicate important information through color alone.
- Test important interactions without a mouse.

## Responsive behavior

The portfolio must work on:
- desktop
- tablet
- mobile

Do not implement desktop interactions that become unusable on touch screens.

Mobile may simplify animations while preserving the same story and content.

## Performance

- Avoid unnecessary scroll listeners or repeated DOM queries when a simpler
  implementation is possible.
- Prefer lightweight CSS/JS animation.
- Avoid unnecessarily large dependencies.
- Optimize image loading when the project begins using many photographs.
- Do not sacrifice readability or maintainability for premature optimization.

## Current narrative structure

The planned portfolio currently follows this broad sequence:

1. Hello, World!
2. My Floating Lanterns — childhood / "Luli"
3. Robotics / FLL
4. Tocando em Frente
5. School community / voice / debate
6. Technical course and projects
7. Off-screen? More like on-stage — theater
8. Currently curious about...
9. Final question

Some titles and details are still intentionally undecided.

Do not create future sections unless the current task explicitly asks for them.

## My Floating Lanterns

This section is about Luísa's childhood and family, not her entire life.

Its primary interaction is:
- lanterns floating upward in response to scrolling.

Possible supporting elements may include:
- a simple map showing childhood moves;
- photographs;
- small static visual details.

Do not add multiple competing animations.

The section should eventually transition into sunrise and then the robotics
story, but that transition has not yet been implemented.

## Working process

For each task:

1. Read the relevant existing files first.
2. Explain what currently happens.
3. Make the smallest change that satisfies the task.
4. Preserve unrelated behavior.
5. Check desktop and mobile implications.
6. Run any available checks.
7. Summarize exactly what changed.
8. Mention anything that still needs manual visual testing.

When asked only to audit, analyze, or plan:
DO NOT modify files.