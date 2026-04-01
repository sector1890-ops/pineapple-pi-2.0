# Pineapple Pi 2.0 — Project Context

## Project Overview

**Pineapple Pi 2.0** is a Next.js 16 web application bootstrapped with `create-next-app`. This is a minimal starter project using the latest Next.js features including the App Router architecture.

### Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.2.1 (App Router) |
| **Language** | TypeScript 5.x |
| **UI Library** | React 19.2.4 |
| **Styling** | Tailwind CSS 4.x |
| **State Management** | Zustand 5.x |
| **Fonts** | Geist Sans + Geist Mono (via `next/font`) |
| **Linting** | ESLint 9.x with `eslint-config-next` |

### Project Structure

```
pineapple-pi-2.0/
├── src/
│   └── app/                 # App Router root
│       ├── layout.tsx       # Root layout with fonts
│       ├── page.tsx         # Home page
│       └── globals.css      # Global styles with Tailwind
├── public/                  # Static assets
├── .next/                   # Build output (generated)
├── node_modules/            # Dependencies (generated)
├── package.json             # Project config & scripts
├── tsconfig.json            # TypeScript configuration
├── next.config.ts           # Next.js configuration
├── eslint.config.mjs        # ESLint configuration
├── postcss.config.mjs       # PostCSS configuration
└── README.md                # Getting started guide
```

### Key Features

- **App Router**: Uses the `src/app` directory structure for file-based routing
- **Server Components**: React Server Components enabled by default
- **Tailwind CSS v4**: Latest version with new configuration approach
- **TypeScript**: Strict mode with path aliases (`@/*` → `./src/*`)
- **Dark Mode**: Built-in dark mode support via CSS variables

## Building and Running

### Development

```bash
npm run dev
```

Starts the development server on [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build    # Build for production
npm run start    # Start production server
```

### Linting

```bash
npm run lint
```

## Development Conventions

### Code Style

- **TypeScript**: Strict mode enabled (`strict: true`)
- **ESLint**: Uses `eslint-config-next` with TypeScript support
- **Imports**: Path aliases available (`@/*` maps to `./src/*`)

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Styles: Use Tailwind utility classes inline

### Testing

No testing framework configured yet. Consider adding:
- Jest + React Testing Library for unit tests
- Playwright for E2E tests

### Git

Standard `.gitignore` excludes:
- `.next/`
- `node_modules/`
- Build outputs

## Key Configuration Details

### TypeScript (`tsconfig.json`)

- Target: ES2017
- Module: ESNext with bundler resolution
- JSX: `react-jsx`
- Incremental builds enabled

### Next.js (`next.config.ts`)

Currently minimal configuration. Extend as needed for:
- Environment variables
- Image optimization
- Middleware
- API routes

### Tailwind CSS (`globals.css`)

Uses v4 syntax with `@theme inline` for custom variables:
- CSS variables for light/dark themes
- Custom font families via Geist

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
