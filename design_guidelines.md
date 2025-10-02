# Ballon d'Or Predictor - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from professional sports analytics platforms (FiveThirtyEight, Opta, ESPN Stats) combined with modern data visualization apps (Linear, Observable). The design balances sports excitement with analytical credibility, creating a premium prediction platform that feels both authoritative and engaging.

**Core Design Principles**:
- Data clarity over decoration - let predictions and insights shine
- Confident, professional sports analytics aesthetic
- Hierarchical information architecture for complex ML outputs
- Responsive precision - charts and tables must work perfectly on mobile

---

## Color Palette

**Primary Colors (Dark Mode)**:
- Background Base: 222 14% 8% (deep charcoal, almost black)
- Surface: 222 14% 12% (elevated surfaces, cards)
- Surface Elevated: 222 14% 16% (modals, dropdowns)

**Primary Colors (Light Mode)**:
- Background Base: 0 0% 98% (soft white)
- Surface: 0 0% 100% (pure white for cards)
- Surface Elevated: 210 20% 96% (subtle blue-gray)

**Accent & Semantic Colors**:
- Primary Brand: 142 76% 36% (football pitch green - #16a34a equivalent, represents the game)
- Probability High: 142 71% 45% (success green for high predictions)
- Probability Medium: 43 96% 56% (amber for medium)
- Probability Low: 0 84% 60% (muted red for low)
- Interactive Blue: 221 83% 53% (links, secondary actions)

**Text Colors (Dark Mode)**:
- Primary Text: 0 0% 95%
- Secondary Text: 0 0% 65%
- Muted Text: 0 0% 45%

**Text Colors (Light Mode)**:
- Primary Text: 222 14% 12%
- Secondary Text: 222 10% 40%
- Muted Text: 222 8% 55%

---

## Typography

**Font Families**:
- Headings: 'Inter', sans-serif (600-800 weights) - clean, modern, authoritative
- Body: 'Inter', sans-serif (400-500 weights)
- Data/Stats: 'JetBrains Mono', monospace (for precise numerical alignment in tables)

**Type Scale**:
- Hero Heading: text-5xl md:text-6xl font-bold
- Page Title: text-3xl md:text-4xl font-semibold
- Section Heading: text-2xl md:text-3xl font-semibold
- Card Title: text-lg md:text-xl font-semibold
- Body Large: text-base md:text-lg
- Body: text-sm md:text-base
- Caption: text-xs md:text-sm font-medium

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20 (p-2, m-4, gap-6, py-8, px-12, space-y-16, my-20)

**Container Strategy**:
- Max Width: max-w-7xl for main content areas
- Section Padding: px-4 md:px-6 lg:px-8
- Vertical Spacing: py-12 md:py-16 lg:py-20 between major sections

**Grid Layouts**:
- Leaderboard Cards: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Player Stats Grid: grid grid-cols-2 md:grid-cols-4 gap-4
- Feature Importance: Single column on mobile, two-column on desktop for comparison

---

## Component Library

**Navigation**:
- Top navbar with logo, season selector (prominent), navigation links (Leaderboard, Players, Predictions, About)
- Sticky header on scroll with subtle shadow elevation
- Mobile: Hamburger menu with slide-in drawer

**Cards & Surfaces**:
- Player Prediction Card: Rounded corners (rounded-xl), subtle border, hover elevation with scale transform (hover:scale-[1.02])
- Stats Card: Darker background in dark mode, clean white in light mode, 1px border with opacity
- Interactive cards show probability badge (top-right corner, pill-shaped with gradient)

**Data Visualization**:
- Chart Container: p-6 bg-surface rounded-lg with subtle border
- Recharts Color Scheme: Use green gradient for probabilities, multi-color for feature importance
- SHAP Waterfall: Horizontal bars with positive (green) and negative (red) contributions
- Feature Importance: Horizontal bar chart, sorted descending, with percentage labels

**Leaderboard Table**:
- Sticky header row with bg-surface-elevated
- Alternating row backgrounds (subtle zebra striping)
- Rank column: Bold, larger font with medal icons for top 3 (🥇🥈🥉)
- Probability column: Visual bar overlay behind percentage text
- Monospace font for numerical columns

**Forms & Inputs**:
- Season Selector: Large dropdown with custom styling, search-enabled
- Manual Input Form: Two-column grid on desktop, single column mobile
- Input fields: Consistent height (h-12), rounded-lg, focus ring in brand color
- Slider inputs for continuous stats with real-time value display
- Submit button: Full-width on mobile, fixed-width on desktop, prominent brand color

**Buttons**:
- Primary CTA: bg-primary text-white with hover:bg-primary/90
- Secondary: border border-primary text-primary with hover:bg-primary/10
- Ghost buttons for tertiary actions
- Loading states: Spinner + disabled opacity

**Badges & Pills**:
- Probability badges: Rounded-full with gradient backgrounds based on value
- Position badges: Subtle background (Forward: red-tint, Midfielder: blue-tint, Defender: green-tint, Goalkeeper: yellow-tint)
- Status indicators: Small dot + text for model version, last updated

**Player Profile Component**:
- Header with player name, photo placeholder, nationality flag
- Stats grid below: Key metrics in prominent cards
- Radar chart for performance profile
- Timeline chart showing season-over-season trends

**Feature Importance Display**:
- Global importance: Horizontal bar chart, full-width
- Local (per-player) SHAP: Simplified waterfall or bar chart
- Interactive tooltips explaining each feature's contribution
- Legend with color coding for positive/negative influence

**Mobile Optimizations**:
- Collapsible sections for detailed stats
- Swipeable player cards in leaderboard
- Bottom sheet for filters and settings
- Simplified charts with essential information only

---

## Animations

**Minimal, Purposeful Motion**:
- Page transitions: Simple fade-in (duration-200)
- Card hover: Subtle scale and shadow (transform hover:scale-[1.02] transition-transform)
- Chart rendering: Stagger appearance of bars (delay-75, delay-150 etc.)
- Loading states: Skeleton screens with subtle pulse animation
- NO auto-playing carousels or distracting motion

---

## Images

**Hero Section Image**:
- Large, high-quality hero image of Ballon d'Or trophy on a dark background with dramatic lighting
- Overlay: Dark gradient (from bottom) to ensure text readability
- Position: Background cover with center-top positioning
- Alt hero option: Stadium crowd with golden hour lighting, overlaid with prediction interface

**Player Images**:
- Circular player headshots in cards (aspect-square with object-cover)
- Fallback: Initials in circular badge with gradient background
- Trophy icons for winners history section

**Iconography**:
- Heroicons for UI elements (outlined style for navigation, solid for actions)
- Football/soccer related icons for stats (⚽ for goals, 🎯 for assists)
- Chart.js/Recharts built-in icons for data visualization controls

---

## Accessibility

- WCAG AA contrast ratios throughout (check with color contrast analyzer)
- Focus indicators on all interactive elements (ring-2 ring-primary ring-offset-2)
- ARIA labels for charts and complex visualizations
- Keyboard navigation support for season selector and filters
- Screen reader announcements for prediction results
- Alt text for all images and icons

---

## Visual Hierarchy

**Information Architecture**:
1. Season selection (most prominent - users start here)
2. Top predictions leaderboard (primary content)
3. Detailed player analysis (drill-down content)
4. Model explanations (educational/transparency content)

**Typography Hierarchy**:
- Use font weight variation (400→600→800) more than size
- Maintain consistent line-height (leading-relaxed for body, leading-tight for headings)
- Strategic color contrast for emphasis (primary text for key data, muted for labels)

**Spatial Hierarchy**:
- Generous whitespace around key prediction results
- Tighter spacing within related stat groups
- Clear visual separation between prediction and explanation sections

This design system creates a professional, data-driven sports analytics platform that builds trust through clarity while maintaining visual engagement appropriate for passionate football fans.