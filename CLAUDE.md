# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Tech Notes

- **Plain JavaScript** - No TypeScript; uses .jsx files
- **rolldown-vite** - Uses experimental rolldown-vite instead of standard Vite
- **ESLint rule** - Unused variables starting with uppercase or `_` are allowed (e.g., `_unusedVar`, `CONSTANT`)
- **Icons** - Use lucide-react for icons (`import { IconName } from 'lucide-react'`)

## Architecture

This is a React 19 fitness/gym website built with Vite (using rolldown-vite). Key technologies:

- **React Compiler** enabled via babel-plugin-react-compiler
- **Tailwind CSS v4** with @tailwindcss/vite plugin
- **Framer Motion** for page transitions and animations
- **React Router DOM** for client-side routing
- **Radix UI** primitives for accessible components
- **class-variance-authority (cva)** for component variants

### Project Structure

```
src/
├── components/ui/   # shadcn/ui-style reusable components (Button, Card, Input, etc.)
├── components/      # App-specific components (Navbar, Footer)
├── pages/           # Route pages (Home, Programs, Trainers, Pricing, etc.)
├── sections/        # Page sections used in Home (Hero, ProgramsSection, etc.)
├── layouts/         # PageLayout with Framer Motion page transitions
├── animations/      # Framer Motion variant definitions
└── lib/utils.js     # cn() utility for merging Tailwind classes
```

### Key Patterns

- **Path alias**: Use `@/` to import from `src/` (configured in vite.config.js)
- **Class merging**: Use `cn()` from `@/lib/utils` for conditional Tailwind classes
- **Page transitions**: Pages use `PageLayout` wrapper with AnimatePresence in App.jsx
- **Animation variants**: Import from `@/animations/variants` (fadeUp, staggerContainer, cardHover, etc.)
- **UI components**: Follow shadcn/ui conventions with `cva` for variant styling
