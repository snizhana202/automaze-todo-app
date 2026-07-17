@AGENTS.md
# Project Guidelines

## Core Principles
- **Style**: Use Tailwind CSS with `@apply` inside `@layer components` in `globals.css`. Focus on a clean, modern, dark-themed "glassmorphism" aesthetic.
- **Code Structure**: 
    - Business logic belongs in `hooks/`.
    - UI components belong in `components/`.
    - Keep `page.tsx` clean by delegating UI to components.
- **TypeScript**: Always prioritize strong typing. Define interfaces for all data structures (e.g., `Task`).
- **Validation**:
    - Titles are mandatory and must be in English.
    - Descriptions are optional but must be validated for content if provided.

## Workflow
- When adding new features, always consider the impact on the existing layout.
- Prioritize reusable components.
- Keep the UI responsive for mobile and desktop.