---
name: research-design-web-extension
description: Research methods for premium web apps and Chrome extensions using only code (no Figma). Includes palette composition rules, 2026 tech stack, and design system documentation.
---

## Instructions

When tasked with researching how to create a well-designed web application and Chrome extension with a premium interface without using Figma or other design tools:

### Output Format
- Create a comprehensive markdown report (`REPORT_*.md`) in the project root
- Include: philosophy, stack recommendations, step-by-step methodology, code examples, checklists, and case studies
- Reference existing project code as concrete examples where applicable

### Key Topics to Cover
1. **Design System from Code** philosophy — defining tokens in CSS instead of design tools
2. **2026 Tech Stack** — React 19, Next.js 15, Tailwind CSS v4, shadcn/ui, magicui, Framer Motion, Zustand, Lucide icons
3. **Color Palette Composition** — 60-30-10 rule, analogical harmony, dark mode rules, WCAG contrast
4. **Component Architecture** — CVA (class-variance-authority) for variant management, cn() utility for merging classes
5. **Premium Effects** — glassmorphism (`backdrop-blur`), cosmic gradients (`radial-gradient`), glow effects, shimmer animations
6. **Typography** — system fonts, hierarchical scale with CSS variables
7. **Chrome Extension Specifics** — Manifest V3, side panel architecture, performance constraints
8. **Accessibility** — focus rings, ARIA attributes, `prefers-reduced-motion` support
9. **Checklists** — separate checklists for web app and Chrome extension
10. **Resource Links** — shadcn/ui, magicui.design, v0.dev, Linear, Vercel, Raycast as inspiration

### Palette Composition Rules (2026)
- **60-30-10 rule**: 60% neutral (surfaces), 30% secondary (text/borders), 10% accent (violet/CTAs)
- **Analogical harmony**: Violet → blue-violet → red-violet (max 3 shades of same family)
- **Dark mode specific**: No #000000, +15% saturation for accents, glow replaces shadow
- **WCAG 2.2**: 4.5:1 for normal text, 3:1 for non-text components
- **Glow max 2 levels**: Never more than 2 layers of box-shadow
- **Gradient max 2 colors**: Direction always 135deg, never mix radial + linear on same element
- **Violet max 10% screen**: It's a "heavy" color, use sparingly for actions only

### Sources to Check
- https://ui.shadcn.com — component library
- https://magicui.design — animation components
- https://v0.dev — AI-generated components
- https://chrome.dev/ — Chrome extension docs
- Project's own `globals.css`, component files as reference
- WCAG 2.2 contrast guidelines
- Material Design 3 color system

### Quality Criteria
- Report must be actionable with concrete code examples
- Must reference the existing project's code where applicable
- Must cover both web app AND Chrome extension
- Must include a practical checklist
- Must include palette composition rules (60-30-10, harmonies, contrast)
- Written in the language requested by the user (French if requested in French)
