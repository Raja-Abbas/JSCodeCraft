# JSCodeCraft

> **Status:** MVP 1 — Feature-complete prototype. All core features implemented and working. Login removed for public testing — all pages freely accessible.

AI-powered JavaScript code review and performance analysis platform for developers.

> **Note:** Authentication has been removed for this MVP to allow free access to all features. No login or signup required.

## Features

- **AI Code Review** — Paste code, get intelligent analysis of bugs, security issues, anti-patterns, and improvement suggestions
- **Static JavaScript Analyzer** — 20+ regex-based rules detecting unused variables, console logs, debugger statements, callback hell, eval usage, type coercion issues, and more
- **Performance Analysis** — Time/space complexity estimation, nested loop detection, unnecessary array operations, optimization recommendations
- **JavaScript Visualizer** — Interactive event loop, call stack, execution context, closures, and promise chain visualizations with animations
- **AST Explorer** — Collapsible abstract syntax tree visualization with node types, positions, and expandable subtrees
- **AI Refactoring** — 5 modes: Clean, Performance, Functional, OOP, Modern ES2025 with explanations for every change
- **Diff Viewer** — Side-by-side code comparison with added/removed line highlighting
- **AI Interview Mode** — Generate interview questions from code at Junior/Mid/Senior/Staff Engineer levels with "why it matters" explanations
- **Quiz Generator** — Auto-generate multiple-choice quizzes from uploaded code with scoring
- **Bug Hunter** — Find hidden bugs in code snippets with timer, hints, and difficulty levels

## Tech Stack

- **Framework:** Next.js 16 (App Router, RSC)
- **Language:** TypeScript (strict)
- **Database:** SQLite via Prisma 7 + LibSQL adapter
- **Auth:** NextAuth v5 (Credentials, JWT)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Code Editor:** CodeMirror via @uiw/react-codemirror
- **Animations:** Framer Motion
- **State:** Zustand + React Hook Form + Zod
- **Deployment:** Netlify-ready

## Getting Started

```bash
npm install
npx prisma db push
npx prisma generate
npx tsx prisma/seed.ts
npm run dev
```

## Pages

- **/** — Landing page with features grid, how it works, tech stack
- **/login** — Sign in with demo credentials hint
- **/register** — Create account
- **/dashboard** — Overview with stats, recent activity, quick actions
- **/dashboard/static-analysis** — 20+ rule static JavaScript analyzer
- **/dashboard/performance** — Complexity estimation and optimization suggestions
- **/dashboard/visualizer** — Interactive event loop, closures, promises visualizer
- **/dashboard/ast** — Abstract syntax tree explorer with collapsible nodes
- **/dashboard/refactoring** — 5-mode AI refactoring engine
- **/dashboard/diff** — Side-by-side diff viewer
- **/dashboard/interview** — AI interview question generator by difficulty
- **/dashboard/quiz** — Auto-generated JavaScript quizzes
- **/dashboard/bug-hunter** — Find hidden bugs game
- **/settings** — Profile, security, preferences, account

## License

MIT
