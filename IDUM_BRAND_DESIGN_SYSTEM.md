# IDUM Brand Design System

**Version:** 2.0
**Updated:** May 2026
**Purpose:** Visual identity guidelines for the IDUM website — **documenting the system as actually implemented** in `styles.css`.

> **Source of truth:** This document reflects the live site (`index.html` + `styles.css` + `script.js`). If anything here ever disagrees with `styles.css`, the CSS wins — update this doc to match. (Earlier v1.0 described an aspirational navy/teal/gold + Playfair/Barlow system that was never built; this v2.0 corrects it to the shipped design.)

---

## Brand Essence

IDUM positions itself as the authoritative global voice on underwater munitions — comparable to IPCC (climate), IAEA (nuclear), and OPCW (chemical weapons). The visual identity communicates:

- **Scientific Authority** — credibility that commands respect from government ministers and UN leaders
- **Diplomatic Gravitas** — international sophistication befitting multilateral cooperation
- **Environmental Stewardship** — ocean protection *without* activist aesthetics
- **Measured Urgency** — serious concern without alarmism
- **Institutional Permanence** — an organization built for decades, not campaigns

**Core Principle:** Make the invisible visible with clarity, not drama.

---

## Color System

The site uses a deliberate **two-color brand: Deep Ocean (blue) + Sea Green** — on light backgrounds with dark hero/CTA/footer anchors. **There is no gold and no red/danger color.** Saturated/neon colors are avoided entirely.

### Palette (from `:root` in `styles.css`)

| Token | Hex | Usage |
|-------|-----|-------|
| `--deep-ocean` | `#0B2A3C` | Primary dark — hero, mission strip, CTA, footer, headings |
| `--ocean-blue` | `#1F5E7A` | Secondary blue accent |
| `--sea-green` | `#2C8C6B` | **Primary accent** — CTAs, links, eyebrows, `<em>` title words |
| `--sea-green-soft` | `#34A07A` | Hover states, accent on dark backgrounds |
| `--light-ocean` | `#E8F3F8` | Tint / hover wash |
| `--charcoal` | `#1E1E1E` | Body text |
| `--slate` | `#5F6B73` | Secondary text, metadata |
| `--light-gray` | `#F3F4F6` | Borders, dividers, the 1px-gap trick |
| `--white` | `#FFFFFF` | Light backgrounds, on-dark text |
| `--off-white` | `#FAFBFC` | Alternating section background (`.content-section.alt`) |

Additional anchors: footer background `#030B12`; CTA gradient `--deep-ocean → #081E2B`.

### Color ratios (approximate, as built)
- Light backgrounds (white / off-white) dominate the content body.
- `--deep-ocean` anchors the hero, mission strip, CTA, and footer.
- `--sea-green` / `--sea-green-soft` carry all interactive emphasis and accent words.

### Gradients in use
```css
/* Primary button glow (shadow, not fill) */
box-shadow: 0 4px 16px rgba(44, 140, 107, 0.3);

/* CTA section background */
background: linear-gradient(180deg, #0B2A3C 0%, #081E2B 100%);

/* Hero stats card — glassmorphism */
background: linear-gradient(135deg,
  rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.12) 100%);
```

---

## Typography

**One typeface: Public Sans** (Google Fonts), weights 400 / 500 / 600 / 700. There is no serif and no secondary family — clarity over decoration.

```css
font-family: 'Public Sans', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type hierarchy (as implemented)

| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| Hero title | `clamp(36px, 5vw, 56px)` | 700 | line-height 1.08, letter-spacing −0.5px, white |
| Section title | `clamp(28px, 4vw, 40px)` | 700 | `--deep-ocean`, letter-spacing −0.3px |
| Stat number | 40px (32px mobile) | 700 | letter-spacing −1px |
| Body large | 17–18px | 400 | line-height 1.6–1.75 |
| Body | 16px | 400 | `--slate` for prose, line-height ~1.85 |
| Micro-header | 14px | 600 | **sentence case**, letter-spacing 0, `--deep-ocean`. Labels a group/section or form field that is *read* |
| Overline tag | 12px | 700 | uppercase, letter-spacing 1.4px, `--sea-green-ink`. Dates, pills, eyebrows that are *scanned* |
| Nav | 13px | 500–600 | uppercase for logo/nav |

### Label system (two roles, don't blur them)
Small text serves one of two jobs — choose by intent, not by size:

- **Micro-header** (`--label-micro-*` tokens) — sentence case, readable. Used when the label *explains* a group/section or names a form field: `.accred-col-header`, `.project-achievements-title`, `.contact-affil-title`, `.action-box-title`, `.form-label`.
- **Overline tag** (`--label-overline-*` tokens) — refined small-caps, orienting. Used for metadata that is glanced at: `.project-meta` (dates/region), `.honor-label` (pills), `.founder-tag`, `.service-eyebrow`.

Buttons, tabs, and dark-surface labels keep intentional all-caps and are outside this system. `--sea-green-ink` (`#1F6E54`) is the AA-safe green for small text on light surfaces — plain `--sea-green` fails contrast below ~16px.

### The `<em>` accent convention
Inside `.hero-title` and `.section-title`, `<em>` is **not italic** — it renders as `font-style: normal` in `--sea-green` (or `--sea-green-soft` on dark). This is the standard mechanism for the accent word in every section heading.

```html
<h2 class="section-title">The <em>Silent Threat</em> Beneath Our Oceans</h2>
```

### Typography principles
1. One family, weight-driven hierarchy — no decorative fonts.
2. Tight letter-spacing on large headings; generous line-height on body.
3. All-caps is reserved for *orienting* text (overline tags, nav, buttons) — never for labels meant to be read. Reading labels use sentence-case micro-headers (see Label system above).

---

## Layout & Spacing

- **Container:** `max-width: 1200px`, centered.
- **Section padding:** `96px 48px` desktop → `72px 24px` at ≤900px.
- **Section rhythm:** alternate `.content-section` (white) and `.content-section.alt` (off-white) for visual cadence.
- Spacing is applied directly (no numeric token scale in `:root`); keep to the existing 8px-ish rhythm and match neighboring values.

---

## Border Radius

| Element | Radius |
|---------|--------|
| Buttons, nav button, badges | 6px |
| Standard cards (expert, service, action, docs) | 10–12px |
| Feature / action boxes | 16px |
| Hero stats card | 24px |
| Chips / tags | 999px (pill) |

**Buttons are never pill-shaped** (6px). Pills are reserved for small chips/tags.

---

## Elevation & Motion

- Shadows are soft, low-opacity, navy-tinted — depth without drama:
  - Card hover: `0 12px 32px rgba(11,42,60,0.08)`
  - Nav (scrolled): `0 2px 16px rgba(0,0,0,0.06)`
  - Primary button: `0 4px 16px rgba(44,140,107,0.3)` → `0 6px 24px rgba(44,140,107,0.4)` on hover
- Transitions: 0.2s–0.3s ease.
- Interactive lift: buttons `translateY(-1px)`, cards `translateY(-3px to -4px)` on hover, with the border shifting to `--sea-green`.
- A subtle `pulse` keyframe animates the hero eyebrow dot.

---

## Signature Patterns

- **Glassmorphism** (stats card, hero eyebrow, hero quote): `backdrop-filter: blur(...)` + semi-transparent white over the dark hero.
- **RTL column flip:** `.project-row.reverse` swaps image/text order via `direction: rtl` (children reset to `ltr`) — no DOM change.
- **Logo white-out:** `filter: brightness(0) invert(1)` renders colored logos white on dark; already-light SVGs use `filter: none`.
- **1px-gap hairlines:** light-gray parent + white children + `gap: 1px` simulate borders (threat stats row).
- **Nav scroll state:** `.scrolled` (toggled in `script.js` at 100px) switches the nav from dark-transparent to white-solid.

---

## Iconography

- **Lucide** icons via CDN, rendered from `data-lucide` attributes and initialized with `lucide.createIcons()`.
- Re-run `lucide.createIcons()` after any JS that injects new icon markup.
- Sizes inline with text (16px) up to feature/section icons (24–32px).

---

## Imagery

- **Tone:** documentary, not commercial — images should read as evidence, not marketing.
- **Treatment:** cool, slightly desaturated, navy bias. The hero applies `saturate(0.7) brightness(0.8) contrast(1.05)` plus gradient overlays for text legibility.
- **Subjects:** ocean depths, scientific/field operations, international diplomacy, archival munitions, marine ecosystems.
- **Partner logos:** consistent height, white-out filter on dark backgrounds, original proportions, generous spacing.

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| **≤900px** (tablet) | Nav links hidden (no hamburger menu yet), hero stacks to one column, most grids collapse to 1–2 columns, section/hero padding shrinks, founder photo goes static |
| **≤600px** (mobile) | Remaining multi-column grids (docs, experts, services, honors, founder photos) go single-column |

> Note: the previous spec referenced a 768px breakpoint. The site actually uses **900px and 600px**.

---

## Accessibility

- Maintain WCAG AA contrast across the two-color palette on white/off-white and on `--deep-ocean`.
- Preserve visible focus states on all interactive elements.
- Respect `@media (prefers-reduced-motion: reduce)`.
- Provide `alt` text on imagery and labels on form fields.

---

## Voice & Tone in Visual Design

- Headlines: declarative, authoritative, globally scoped — urgent but not alarmist.
  - **Good:** "The Silent Threat Beneath Our Oceans"
  - **Avoid:** "OMG! The Ocean is in DANGER!!!"
- Lead with the problem, then the solution. Use data as evidence. Balance urgency with hope. Generous whitespace signals confidence.

---

## Brand Don'ts

1. Don't add a second font family — Public Sans only.
2. Don't introduce gold, red, neon, or saturated colors — the brand is Deep Ocean + Sea Green.
3. Don't use pill-shaped buttons (6px radius); pills are for chips/tags only.
4. Don't use playful illustration or stock-photo clichés — documentary imagery and data only.
5. Don't overcrowd — whitespace is part of the brand.
6. Don't animate gratuitously — motion should inform.
7. Avoid left-edge colored border accents on cards/highlights (use a low-opacity background wash instead). *Legacy exception to revisit: `.hero-quote` currently uses a `border-left` accent.*

---

## Quick Reference: CSS Variables

```css
:root {
  --deep-ocean:     #0B2A3C;
  --ocean-blue:     #1F5E7A;
  --sea-green:      #2C8C6B;
  --sea-green-soft: #34A07A;
  --light-ocean:    #E8F3F8;
  --charcoal:       #1E1E1E;
  --slate:          #5F6B73;
  --light-gray:     #F3F4F6;
  --white:          #FFFFFF;
  --off-white:      #FAFBFC;
}
```

---

*This design system documents the site as built. Update it whenever `styles.css` changes so the two never drift.*
