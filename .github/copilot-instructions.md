# Copilot Instructions for IyiFinans

## Project Overview
- **Framework:** Next.js (TypeScript/JavaScript)
- **UI Components:** Custom components in `components/ui/` (e.g., `button.tsx`, `card.tsx`, `table.tsx`)
- **Global Styles:** Defined in `app/globals.css` and `styles/globals.css`
- **App Entry:** Main layout in `app/layout.tsx`, main page in `app/page.jsx`

## Architecture & Patterns
- **Component Structure:**
  - All reusable UI elements are in `components/ui/`.
  - Shared logic (hooks) in `hooks/` (e.g., `use-toast.ts`, `use-mobile.ts`).
  - Utility functions in `lib/utils.ts`.
- **Styling:**
  - Use global CSS for base styles.
  - Component-level styles are handled via CSS modules or inline styles.
- **TypeScript:**
  - Prefer TypeScript for new components and hooks. Some legacy files may use `.jsx`.

## Developer Workflows
- **Install dependencies:** `pnpm install`
- **Run dev server:** `pnpm dev`
- **Build for production:** `pnpm build`
- **Lint:** `pnpm lint` (if configured)
- **Testing:** No test setup detected; add tests in `__tests__/` if needed.

## Conventions & Practices
- **Component Naming:** Use PascalCase for components (e.g., `Button`, `Card`).
- **Props:** Pass props explicitly; avoid using `any` type.
- **Imports:** Use relative imports within the project structure.
- **Assets:** Store images and static files in `public/`.
- **Configuration:**
  - Next.js config in `next.config.mjs`
  - TypeScript config in `tsconfig.json`
  - PostCSS config in `postcss.config.mjs`

## Integration Points
- **External Libraries:**
  - UI components may use libraries like Radix UI or Shadcn UI (check component code for details).
  - No backend/API integration detected in current structure.

## Examples
- To create a new UI component, add it to `components/ui/` and export as default.
- To add a new hook, place it in `hooks/` and use TypeScript.
- To update global styles, edit `app/globals.css` or `styles/globals.css`.

## Key Files & Directories
- `app/` — Main app entry, layout, and global styles
- `components/ui/` — Reusable UI components
- `hooks/` — Custom React hooks
- `lib/utils.ts` — Utility functions
- `public/` — Static assets

---
**For AI agents:**
- Follow the above conventions for new code.
- Reference existing components and hooks for implementation patterns.
- Ask for clarification if project-specific logic or workflows are unclear.
