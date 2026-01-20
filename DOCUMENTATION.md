# PowerFit - Fitness Website Documentation

A modern, high-performance fitness/gym website built with React 19, Vite, and Tailwind CSS v4.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Architecture](#architecture)
6. [Pages](#pages)
7. [Components](#components)
8. [Sections](#sections)
9. [Fitness Tools](#fitness-tools)
10. [Hooks](#hooks)
11. [Animations](#animations)
12. [Styling](#styling)
13. [Routing](#routing)
14. [Configuration](#configuration)
15. [Best Practices](#best-practices)
16. [Deployment](#deployment)

---

## Overview

PowerFit is a fully-featured fitness website featuring:

- **7 main pages** (Home, Programs, Trainers, Tools, Pricing, Testimonials, Contact)
- **44+ interactive fitness tools** (calculators, trackers, timers, guides)
- **Smooth scrolling** powered by Lenis
- **Page transitions** with Framer Motion
- **Responsive design** for all devices
- **Accessibility-first** with reduced motion support

---

## Tech Stack

### Core

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.3 | UI library |
| Vite (rolldown-vite) | 7.2.5 | Build tool & dev server |
| Tailwind CSS | 4.1.18 | Utility-first CSS |
| React Router DOM | 7.12.0 | Client-side routing |
| Framer Motion | 12.27.1 | Animations & transitions |

### UI Components

| Package | Purpose |
|---------|---------|
| Radix UI | Accessible component primitives |
| class-variance-authority (cva) | Component variant styling |
| clsx + tailwind-merge | Conditional class merging |
| Lucide React | Icon library |

### Utilities

| Package | Purpose |
|---------|---------|
| Lenis | Smooth scrolling |
| babel-plugin-react-compiler | React Compiler optimization |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd vite-project

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── animations/
│   └── variants.js          # Framer Motion animation variants
├── assets/
│   └── react.svg            # Static assets
├── components/
│   ├── ui/                  # Reusable UI components (shadcn/ui style)
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── input.jsx
│   │   ├── textarea.jsx
│   │   ├── select.jsx
│   │   ├── badge.jsx
│   │   ├── sheet.jsx
│   │   └── separator.jsx
│   ├── parallax/            # Parallax effect components
│   │   ├── ParallaxSection.jsx
│   │   └── ParallaxElement.jsx
│   ├── Navbar.jsx           # Main navigation
│   └── Footer.jsx           # Site footer
├── hooks/
│   ├── useSmoothScroll.js   # Lenis smooth scroll hook
│   ├── useParallax.js       # Parallax scroll hook
│   └── useReducedMotion.js  # Accessibility motion hook
├── layouts/
│   └── PageLayout.jsx       # Page wrapper with transitions
├── lib/
│   └── utils.js             # Utility functions (cn helper)
├── pages/
│   ├── Home.jsx             # Homepage
│   ├── Programs.jsx         # Programs page
│   ├── Trainers.jsx         # Trainers page
│   ├── Tools.jsx            # Fitness tools hub
│   ├── Pricing.jsx          # Pricing plans
│   ├── Testimonials.jsx     # Customer testimonials
│   └── Contact.jsx          # Contact form
├── sections/
│   ├── Hero.jsx             # Hero section
│   ├── ProgramsSection.jsx  # Programs preview
│   ├── FeaturesSection.jsx  # Features grid
│   ├── StatsSection.jsx     # Statistics counters
│   ├── BMICalculator.jsx    # BMI calculator tool
│   ├── ... (44+ section components)
│   └── CTASection.jsx       # Call to action
├── App.jsx                  # Root component with routing
├── main.jsx                 # Entry point
└── index.css                # Global styles & Tailwind config
```

---

## Architecture

### Application Flow

```
main.jsx
    └── BrowserRouter
        └── App.jsx
            ├── Navbar
            ├── AnimatePresence
            │   └── Routes
            │       ├── Home → PageLayout → Sections
            │       ├── Programs → PageLayout → Content
            │       ├── Trainers → PageLayout → Content
            │       ├── Tools → PageLayout → Tool Categories
            │       ├── Pricing → PageLayout → Pricing Cards
            │       ├── Testimonials → PageLayout → Content
            │       └── Contact → PageLayout → Form
            └── Footer
```

### Component Hierarchy

1. **App.jsx** - Root component, handles routing and page transitions
2. **PageLayout** - Wraps all pages with Framer Motion transitions
3. **Pages** - Individual route components
4. **Sections** - Reusable content blocks used within pages
5. **UI Components** - Atomic design components

---

## Pages

### Home (`/`)

The main landing page showcasing all key sections.

**Sections included:**
- Hero
- CountdownTimer
- ProgramsSection
- ClassSchedule
- FeaturesSection
- StatsSection
- BMICalculator
- TrainersPreview
- TestimonialsSection
- TransformationGallery
- MembershipBenefits
- FAQSection
- CTASection

```jsx
// Usage pattern
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export default function Home() {
  useSmoothScroll({ duration: 1.4 });
  // ... sections array with zIndex stacking
}
```

### Programs (`/programs`)

Displays all fitness programs with alternating image/content layouts.

**Features:**
- Full-width alternating cards
- Program metadata (duration, level)
- CTA buttons

### Trainers (`/trainers`)

Team page showcasing gym trainers.

**Features:**
- Trainer cards with photos
- Social media links
- Certifications display

### Tools (`/tools`)

Interactive fitness tools hub with drill-down navigation.

**Flow:**
1. Category cards (6 categories)
2. Tool cards within category
3. Selected tool renders below

**Categories:**
- Calculators (12 tools)
- Trackers (6 tools)
- Planners & Generators (6 tools)
- Timers (2 tools)
- Guides & Tips (10 tools)
- Workout Tools (8 tools)

### Pricing (`/pricing`)

Membership plans with feature comparison.

**Plans:**
- Basic ($29/month)
- Pro ($59/month) - Featured
- Elite ($99/month)

### Testimonials (`/testimonials`)

Customer reviews with auto-sliding carousel and grid display.

### Contact (`/contact`)

Contact form integrated with Web3Forms API.

**Features:**
- Form validation
- Subject selection
- Success/error states
- Contact info cards

---

## Components

### UI Components (shadcn/ui style)

Located in `src/components/ui/`

#### Button

```jsx
import { Button } from '@/components/ui/button';

// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: default, sm, lg, xl, icon

<Button variant="default" size="lg">Click me</Button>
<Button variant="outline" asChild>
  <Link to="/contact">Contact</Link>
</Button>
```

#### Card

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

#### Input & Textarea

```jsx
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

<Input type="email" placeholder="Email" />
<Textarea rows={6} placeholder="Message" />
```

#### Select

```jsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

#### Sheet (Mobile Menu)

```jsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost">Open</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Menu</SheetTitle>
    </SheetHeader>
    {/* Content */}
  </SheetContent>
</Sheet>
```

### Navbar

Fixed navigation with:
- Logo
- Desktop navigation links
- Mobile hamburger menu (Sheet)
- Active link highlighting

### Footer

Site footer with links and branding.

---

## Sections

Reusable content sections located in `src/sections/`

### Core Sections

| Section | Description |
|---------|-------------|
| Hero | Main hero with CTA |
| CountdownTimer | Promotional countdown |
| ProgramsSection | Programs preview cards |
| ClassSchedule | Weekly class schedule |
| FeaturesSection | Feature highlights |
| StatsSection | Animated statistics |
| TrainersPreview | Trainer spotlight |
| TestimonialsSection | Reviews carousel |
| TransformationGallery | Before/after gallery |
| MembershipBenefits | Benefits list |
| FAQSection | Accordion FAQ |
| CTASection | Final call to action |

---

## Fitness Tools

44+ interactive fitness tools organized by category:

### Calculators

| Tool | Description |
|------|-------------|
| BMICalculator | Body Mass Index |
| TDEECalculator | Total Daily Energy Expenditure |
| MacroCalculator | Macronutrient calculator |
| OneRepMaxCalculator | 1RM estimation |
| BodyFatEstimator | Body fat percentage |
| IdealWeightCalculator | Ideal body weight |
| FitnessAgeCalculator | Fitness age estimation |
| RunningPaceCalculator | Running pace/splits |
| RepTempoCalculator | Time under tension |
| WorkoutVolumeCalculator | Training volume |
| RPECalculator | Rate of Perceived Exertion |
| FitnessUnitConverter | Unit conversions |

### Trackers

| Tool | Description |
|------|-------------|
| WaterIntakeTracker | Daily hydration |
| ProgressComparison | Progress tracking |
| BodyMeasurementsTracker | Body measurements |
| PersonalRecordsTracker | PR tracking |
| MuscleRecoveryTracker | Recovery status |
| WorkoutLog | Workout logging |

### Planners & Generators

| Tool | Description |
|------|-------------|
| WorkoutGenerator | Custom workout creator |
| WorkoutSplitPlanner | Split planning |
| FitnessChallengeGenerator | Challenge creator |
| WarmupGenerator | Warmup routines |
| MealPrepPlanner | Meal planning |
| FitnessGoalSetter | Goal setting |

### Timers

| Tool | Description |
|------|-------------|
| RestTimer | Rest period timer |
| TabataTimer | HIIT interval timer |

### Guides & Tips

| Tool | Description |
|------|-------------|
| MuscleExplorer | Muscle anatomy |
| StretchingRoutine | Stretching guides |
| ExerciseSubstitutions | Exercise alternatives |
| BreathingExercises | Breathing techniques |
| SupplementTimingGuide | Supplement timing |
| GripStrengthGuide | Grip training |
| ExerciseFormGuide | Form guidance |
| GymEtiquetteTips | Gym etiquette |
| HomeGymGuide | Home gym setup |
| CooldownRoutine | Cooldown guides |

### Workout Tools

| Tool | Description |
|------|-------------|
| CalorieBurnVisualizer | Calorie visualization |
| FitnessQuiz | Fitness knowledge quiz |
| HeartRateZones | Training zones |
| GymBagChecklist | Equipment checklist |
| PlateCalculator | Barbell plate math |
| SleepCalculator | Sleep optimization |
| WorkoutBPM | Music tempo matching |
| MotivationGenerator | Motivation quotes |

---

## Hooks

### useSmoothScroll

Provides buttery smooth scrolling using Lenis.

```jsx
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

function MyPage() {
  useSmoothScroll({ duration: 1.4 });
  // ...
}
```

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| duration | 1.2 | Scroll duration |
| easing | exponential | Easing function |
| wheelMultiplier | 1 | Mouse wheel sensitivity |
| touchMultiplier | 2 | Touch sensitivity |

**Features:**
- Respects `prefers-reduced-motion`
- Automatic cleanup on unmount
- Returns lenis instance ref

### useReducedMotion

Detects user's motion preference.

```jsx
import { useReducedMotion } from '@/hooks/useReducedMotion';

function MyComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={prefersReducedMotion ? undefined : fadeUp}
      initial={prefersReducedMotion ? undefined : "hidden"}
      animate={prefersReducedMotion ? undefined : "visible"}
    >
      Content
    </motion.div>
  );
}
```

### useParallax

Creates parallax scrolling effects.

```jsx
import { useParallax } from '@/hooks/useParallax';

function MyComponent() {
  const { ref, style } = useParallax({ speed: 0.5 });

  return <div ref={ref} style={style}>Parallax content</div>;
}
```

---

## Animations

All animation variants are defined in `src/animations/variants.js`

### Available Variants

#### Entrance Animations

```jsx
import { fadeUp, fadeIn, fadeLeft, fadeRight, scaleUp } from '@/animations/variants';

// Fade up from below
<motion.div variants={fadeUp} initial="hidden" animate="visible" />

// Fade in place
<motion.div variants={fadeIn} initial="hidden" animate="visible" />

// Slide from left/right
<motion.div variants={fadeLeft} initial="hidden" animate="visible" />
```

#### Stagger Container

```jsx
import { staggerContainer, fadeUp } from '@/animations/variants';

<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  <motion.div variants={fadeUp}>Child 1</motion.div>
  <motion.div variants={fadeUp}>Child 2</motion.div>
  <motion.div variants={fadeUp}>Child 3</motion.div>
</motion.div>
```

#### Hover Animations

```jsx
import { cardHover, buttonHover, imageHover } from '@/animations/variants';

// Card lift on hover
<motion.div variants={cardHover} initial="rest" whileHover="hover" />

// Button scale
<motion.button variants={buttonHover} initial="rest" whileHover="hover" whileTap="tap" />

// Image zoom
<motion.img variants={imageHover} initial="rest" whileHover="hover" />
```

#### Page Transitions

```jsx
import { pageTransition } from '@/animations/variants';

<motion.main
  variants={pageTransition}
  initial="initial"
  animate="animate"
  exit="exit"
>
  Page content
</motion.main>
```

#### Decorative Animations

```jsx
import { floatSlow, floatMedium, floatFast, orbPulse } from '@/animations/variants';

// Floating elements
<motion.div variants={floatSlow} animate="animate" />

// Pulsing orb
<motion.div variants={orbPulse} animate="animate" />
```

### All Variants Reference

| Variant | Type | Description |
|---------|------|-------------|
| fadeUp | Entrance | Fade + slide up |
| fadeIn | Entrance | Simple fade |
| fadeLeft | Entrance | Fade + slide from left |
| fadeRight | Entrance | Fade + slide from right |
| scaleUp | Entrance | Fade + scale up |
| staggerContainer | Container | Staggers children |
| cardHover | Hover | Lift + scale |
| buttonHover | Hover | Scale + tap feedback |
| imageHover | Hover | Zoom effect |
| navLinkUnderline | Hover | Underline expand |
| glowEffect | Hover | Box shadow glow |
| pageTransition | Page | Enter/exit transitions |
| mobileMenuVariants | UI | Menu open/close |
| accordion | UI | Expand/collapse |
| sectionReveal | Scroll | Section entrance |
| floatSlow/Medium/Fast | Loop | Floating animation |
| orbPulse | Loop | Pulsing animation |
| floatingParticle | Loop | Particle movement |
| iconBounce | Loop | Bouncing icon |
| shimmer | Loop | Loading shimmer |

---

## Styling

### Tailwind CSS v4 Configuration

Global styles in `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #f97316;
  --color-primary-dark: #ea580c;
  --color-primary-light: #fb923c;
  --color-dark: #0a0a0a;
  --color-dark-light: #111111;
  --color-dark-lighter: #1a1a1a;
  --color-gray: #374151;
  --color-gray-light: #6b7280;
  --font-heading: 'Oswald', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| primary | #f97316 | Accent, CTAs, highlights |
| primary-dark | #ea580c | Hover states |
| primary-light | #fb923c | Light accents |
| dark | #0a0a0a | Main background |
| dark-light | #111111 | Card backgrounds |
| dark-lighter | #1a1a1a | Elevated surfaces |
| gray | #374151 | Muted text |
| gray-light | #6b7280 | Secondary text |

### Typography

| Token | Font | Usage |
|-------|------|-------|
| font-heading | Oswald | Headlines, titles |
| font-body | Inter | Body text, UI |

### cn() Utility

Combines clsx and tailwind-merge for conditional classes:

```jsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" ? "primary-classes" : "secondary-classes"
)} />
```

### Smooth Scroll CSS

```css
/* Lenis smooth scroll */
html.lenis, html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-stopped {
  overflow: hidden;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .parallax-layer,
  .parallax-bg,
  .gpu-accelerated {
    transform: none !important;
    will-change: auto;
  }
}
```

---

## Routing

### Route Configuration

Defined in `src/App.jsx`:

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/programs" element={<Programs />} />
  <Route path="/trainers" element={<Trainers />} />
  <Route path="/tools" element={<Tools />} />
  <Route path="/pricing" element={<Pricing />} />
  <Route path="/testimonials" element={<Testimonials />} />
  <Route path="/contact" element={<Contact />} />
</Routes>
```

### Navigation Links

Defined in `src/components/Navbar.jsx`:

```jsx
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Programs', path: '/programs' },
  { name: 'Trainers', path: '/trainers' },
  { name: 'Tools', path: '/tools' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Testimonials', path: '/testimonials' },
  { name: 'Contact', path: '/contact' },
];
```

### Page Transitions

AnimatePresence wraps routes for exit animations:

```jsx
<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    {/* routes */}
  </Routes>
</AnimatePresence>
```

---

## Configuration

### Vite Configuration

`vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Path Aliases

Use `@/` to import from `src/`:

```jsx
// Instead of
import { Button } from '../../../components/ui/button';

// Use
import { Button } from '@/components/ui/button';
```

### ESLint Rules

Unused variables starting with uppercase or `_` are allowed:

```jsx
// These won't trigger warnings:
const _unusedVar = 'ok';
const UNUSED_CONSTANT = 'ok';
```

---

## Best Practices

### Component Patterns

1. **Use cn() for dynamic classes:**
```jsx
<div className={cn("base", condition && "conditional")} />
```

2. **Respect reduced motion:**
```jsx
const prefersReducedMotion = useReducedMotion();
<motion.div variants={prefersReducedMotion ? undefined : fadeUp} />
```

3. **Use asChild for polymorphic components:**
```jsx
<Button asChild>
  <Link to="/page">Navigate</Link>
</Button>
```

### Animation Guidelines

1. Use `viewport={{ once: true }}` for one-time animations
2. Use `staggerContainer` for list animations
3. Keep durations between 0.2s - 0.8s
4. Always provide reduced motion alternatives

### Performance

1. Use React Compiler (enabled by default)
2. Lazy load heavy components if needed
3. Use `will-change` sparingly
4. Optimize images with proper sizing

### Accessibility

1. Use semantic HTML elements
2. Include aria-labels on icon buttons
3. Respect prefers-reduced-motion
4. Ensure sufficient color contrast

---

## Deployment

### Build for Production

```bash
npm run build
```

Output in `dist/` directory.

### Preview Build

```bash
npm run preview
```

### Deployment Platforms

**Vercel (Recommended):**
```bash
npm i -g vercel
vercel
```

**Netlify:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

**Static Hosting:**
Upload contents of `dist/` to any static host.

### Environment Variables

For Contact form (Web3Forms):
```env
# Update in Contact.jsx
const WEB3FORMS_ACCESS_KEY = 'your-access-key';
```

---

## Troubleshooting

### Common Issues

**Smooth scroll not working:**
- Ensure Lenis CSS is in index.css
- Check if hook is called in component

**Animations not playing:**
- Check if reduced motion is enabled
- Verify variant names match

**Page transitions flickering:**
- Ensure AnimatePresence has `mode="wait"`
- Check route keys are unique

**Build errors:**
- Clear node_modules and reinstall
- Check for circular imports

---

## Contributing

1. Follow existing code patterns
2. Use cn() for all dynamic classes
3. Add reduced motion support for new animations
4. Test on mobile devices
5. Run lint before committing

---

## License

MIT License

---

*Documentation last updated: January 2026*
