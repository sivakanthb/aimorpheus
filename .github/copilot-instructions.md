# SkillForge - Forge Your AI Learning Path

This document tracks the setup and development guidelines for SkillForge, a revolutionary personalized AI learning portal that guides users through their self-sourced journey to mastering artificial intelligence.

## Project Specifications
- **App Name**: SkillForge ⚡
- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Routing**: App Router
- **Structure**: src-based directory layout
- **Package Manager**: npm
- **Node Version**: 24.14.0+
- **Linting**: ESLint 9

## Setup Checklist
- [x] Project scaffolding
- [x] Customization (Tailwind CSS, TypeScript paths)
- [x] Extension installation
- [x] Dependency verification
- [x] Dev server configuration
- [x] Interactive AI Learning Portal built
- [x] Recommendation algorithm implemented
- [x] Learning paths and modules created
- [x] UI components developed

## Available Scripts
- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Development Guidelines
- Use TypeScript for type safety and better IDE support
- Follow Next.js best practices for component organization
- Utilize app router for routing configuration
- Keep components modular and reusable
- Use Tailwind CSS utility classes for styling
- Place components in `src/app` directory
- Export default components from React files
- Use TypeScript interfaces for props typing

## Project Structure
```
my-learning-app/
├── .github/                 # GitHub configuration
├── .vscode/                 # VS Code settings
│   └── tasks.json          # Development tasks
├── src/
│   └── app/
│       ├── layout.tsx      # Root layout
│       ├── page.tsx        # Home page
│       └── globals.css     # Global styles
├── public/                 # Static assets
├── .gitignore
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── package.json
├── postcss.config.mjs      # PostCSS/Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── README.md
```

## Getting Started
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Open browser and navigate to http://localhost:3000
4. Start building your AI learning portal!

## Next Steps for Development
- [ ] Create custom components in `src/app/components/`
- [ ] Set up API routes in `src/app/api/`
- [ ] Configure environment variables in `.env.local`
- [ ] Add custom fonts and images
- [ ] Implement authentication (if needed)
- [ ] Set up database connectivity (if needed)
- [ ] Deploy to Vercel or your preferred hosting

## Import Alias
The project uses the `@/*` import alias configured in `tsconfig.json`. This allows clean imports:
```typescript
import { Component } from '@/components/Component';
```

## Useful Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
