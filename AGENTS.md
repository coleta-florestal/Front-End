# PROJECT INSTRUCTIONS

## PROJECT OVERVIEW

GLUPTA - an working forests management platform, allowing the user to generate dashboards with forest metrics according the hierarchy which is:

- Plantation -> Plot -> Parcel -> Tree

This entity hierarchy allow that the main entity have many as minor entity.

## ARCHITECTURE

**Stack**

- **Language:** TypeScript
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS

**Routing** (`app/` — Next.js 15 App Router)

| Route | File |
|-------|------|
| `/` | `app/page.tsx` — login |
| `/cadastro` | `app/cadastro/page.tsx` — register |
| `/recuperar-acesso` | `app/recuperar-acesso/page.tsx` — forgot password |
| `/redefinir-senha` | `app/redefinir-senha/page.tsx` —  |
| `/fazenda` | `app/fazenda/page.tsx` — plantation |
| `/fazenda/talhão` | `/app/fazenda/talhão/page.tsx` - plot |
| `/fazenda/talhão/parcela` | `app/fazenda/talhão/parcela/page.tsx` - parcel |
| `/fazenda/talhão/parcela/cadastrar-arvore` | `app/fazenda/talhão/parcela/cadastrar-arvore/page.tsx` - register tree |
| `/painel-admin` | `app/painel-admin/page.tsx` - administration |

`"use client"` is declared only in files that use React state/hooks (`app/platform/login/page.tsx`). The site and platform home pages are server components.

**Shared components** (`components/`)

A library of reusable primitives (`Button`, `Card`, `Icons`, etc.) used by all pages. Prefer adding to this folder over duplicating patterns inline.

**Styling**

Two approaches are used together intentionally:
- **Inline `style={}`** — for pixel-exact values from the Figma source: specific gradients, exact pixel dimensions, named color constants (`COLOR_DARK = "#2C2F33"`, `COLOR_MID = "#595C60"`, `GRADIENT = "linear-gradient(...)"`).
- **Tailwind classes** — for layout, spacing, responsiveness, and hover/focus states.

Tailwind is configured with dark mode via `class`, a standard shadcn/ui token setup (`--primary`, `--border`, etc.), and `tailwindcss-animate` for accordion animations.

Always prioritize native Tailwind CSS conventions to maintain a clean, responsive, and consistent codebase.

### 1. Spacing Scale
- **Rule:** Always use Tailwind's numeric spacing scale (`-1`, `-2`, `-4`, `-8`, etc.) for `padding (p-)`, `margin (m-)`, `width (w-)`, `height (h-)`, and `gap`.
- **Arbitrary Values:** Strictly avoid using arbitrary values in square brackets (e.g., `p-[15px]` or `w-[320px]`). Only use bracket notation if absolutely necessary for pixel-perfect designs that cannot be mapped to the standard scale.
- **Core Logic:** Keep in mind that 1 unit = 0.25rem (4px).

### 2. Responsiveness (Breakpoints)
- **Mobile-First Approach:** Always write classes targeting mobile devices first (screens below 640px) and use responsiveness prefixes for larger screens.
- **Standard Breakpoints:** Use the native responsive modifiers to adapt layouts fluently:
  - No prefix: Mobile (screens < 640px)
  - `sm:` Small screens / Tablets (640px+)
  - `md:` Medium screens / Tablets (768px+)
  - `lg:` Large screens / Laptops (1024px+)
  - `xl:` Extra large screens / Desktops (1280px+)
- **Anti-pattern:** Never write custom CSS media queries if the layout can be handled using native Tailwind prefixes.

### Code Examples

```tsx
// ❌ AVOID (Fixed styling, arbitrary values, non-standard scaling)
<div className="w-[400px] p-[15px] flex gap-[10px] md:flex-row">...</div>

//  DO THIS (Uses spacing scale, mobile-first, native responsiveness)
<div className="w-full max-w-md p-4 flex flex-col gap-3 md:flex-row">...</div>