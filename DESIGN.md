# DESIGN.md — Product Management Platform Visual System (v2: Glossy Premium SaaS)

Revision from v1 (flat editorial red). Direction: premium SaaS gloss — think Linear/Stripe-grade polish — deep graphite base, glass/gloss surfaces, red as a sharp, high-value signature accent rather than the dominant fill. Tokens only, no code/config.

---

## 1. Design Principles

- **Dark-first, glass-surfaced.** Deep graphite/near-black base with translucent, glossy panels (subtle blur + gradient sheen) — not flat matte cards.
- **Red as signal, not wallpaper.** Red is reserved for primary actions, active states, key metrics, brand mark — it hits harder because it's rare.
- **Gloss = light, not decoration.** Gloss comes from soft gradient highlights and glow, not shiny borders on everything. One glossy hero moment (e.g. primary button, key metric card), rest stays quiet.
- **Precision typography.** Tight, confident, geometric sans — no serif warmth this round; feel is engineered, not editorial.

---

## 2. Color Tokens

### 2.1 Base Palette

| Token | Hex | Role |
|---|---|---|
| `color.graphite.950` | `#0A0B0D` | App background, deepest base |
| `color.graphite.900` | `#101215` | Surface base |
| `color.graphite.800` | `#181B1F` | Raised card surface |
| `color.graphite.700` | `#22262C` | Elevated surface (modals, popovers) |
| `color.graphite.600` | `#2E333B` | Hairline borders, dividers |
| `color.graphite.400` | `#565D68` | Muted text, disabled |
| `color.fog.200` | `#9BA1AB` | Secondary text |
| `color.fog.050` | `#E9EBEF` | Primary text (off-white, not pure white) |
| `color.white` | `#FFFFFF` | Highlights, gloss specular points only |

### 2.2 Signature Red (Accent System)

| Token | Hex | Role |
|---|---|---|
| `color.crimson.400` | `#FF3B57` | Bright glow red — used in gradients/glow only, never large fills |
| `color.crimson.500` | `#E31C3D` | Primary action red (buttons, active states) |
| `color.crimson.600` | `#C41230` | Hover (deepen, not lighten) |
| `color.crimson.700` | `#9C0E26` | Pressed |
| `color.crimson.900` | `#3D0A14` | Deep red for gradient base / dark glass tint |
| `color.crimson.glow` | `rgba(227, 28, 61, 0.35)` | Box-shadow glow behind primary CTA / active nav |

### 2.3 Gradient Tokens (the "glossy" layer)

| Token | Value | Usage |
|---|---|---|
| `gradient.primaryButton` | `linear-gradient(180deg, #FF3B57 0%, #C41230 100%)` | Primary button fill — light-to-dark for sheen |
| `gradient.primaryButtonHover` | `linear-gradient(180deg, #FF5670 0%, #D6183A 100%)` | Hover state, slightly brighter top |
| `gradient.glassSurface` | `linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)` | Overlaid on cards for glass sheen, sits above `graphite.800` |
| `gradient.heroGlow` | `radial-gradient(circle at 50% 0%, rgba(227,28,61,0.25), transparent 60%)` | Background wash behind hero/key metric sections |
| `gradient.metricAccent` | `linear-gradient(135deg, #FF3B57 0%, #7A0F22 100%)` | Featured KPI card accent edge or number treatment |
| `gradient.borderSheen` | `linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0) 40%)` | 1px gradient border on premium/glass cards |

### 2.4 Semantic Tokens

| Token | Value | Usage |
|---|---|---|
| `color.surface.base` | `color.graphite.950` | Page background |
| `color.surface.raised` | `color.graphite.800` + `gradient.glassSurface` overlay | Cards, panels |
| `color.surface.overlay` | `color.graphite.700` | Modals, dropdowns, command palette |
| `color.brand.primary` | `gradient.primaryButton` | Primary CTA fill |
| `color.brand.onPrimary` | `#FFFFFF` | Text on red surfaces |
| `color.text.primary` | `color.fog.050` | Headlines, body |
| `color.text.secondary` | `color.fog.200` | Supporting text |
| `color.text.muted` | `color.graphite.400` | Metadata, timestamps |
| `color.border.default` | `color.graphite.600` | Standard hairline |
| `color.border.glass` | `gradient.borderSheen` | Premium card edge |
| `color.focus.ring` | `color.crimson.400` | Keyboard focus |

### 2.5 Status Colors (distinct from brand red)

| Token | Hex | Usage |
|---|---|---|
| `color.status.success` | `#2FBF71` | Done, on-track — glossy green, not muted |
| `color.status.warning` | `#F5A623` | At-risk, due soon |
| `color.status.danger` | `#E31C3D` (reuse crimson.500) | Blocked, overdue — real severity shares brand red intentionally |
| `color.status.info` | `#4C8DFF` | Informational, neutral tags |
| `color.status.neutral` | `#565D68` | Backlog, unassigned |

### 2.6 Priority Scale

| Token | Hex | Label |
|---|---|---|
| `color.priority.urgent` | `#FF3B57` | Urgent (bright glow red) |
| `color.priority.high` | `#F5A623` | High |
| `color.priority.medium` | `#4C8DFF` | Medium |
| `color.priority.low` | `#565D68` | Low |

### 2.7 Data Visualization Palette

1. `#E31C3D` — signature crimson (primary series)
2. `#4C8DFF` — cool blue
3. `#2FBF71` — green
4. `#F5A623` — amber
5. `#9B6BFF` — violet
6. `#565D68` — neutral grey (baseline/comparison series)

### 2.8 Light Mode (secondary, optional surface)

| Token | Hex | Role |
|---|---|---|
| `color.light.surface.base` | `#F5F6F8` | App background |
| `color.light.surface.raised` | `#FFFFFF` | Cards (with subtle `0 1px 0 rgba(0,0,0,0.04)` gloss line at top edge) |
| `color.light.text.primary` | `#0F1115` | Primary text |
| `color.light.text.secondary` | `#5B616B` | Secondary text |
| `color.light.border.default` | `#E4E6EA` | Hairline |
| `color.light.brand.primary` | `#E31C3D` | Same signature red, kept consistent across modes |

---

## 3. Typography Tokens

### 3.1 Typeface Roles

| Role | Typeface | Character |
|---|---|---|
| Display / Headline | **Geist** (Google Fonts / Vercel's open font) | Precise, geometric, engineered feel — signature of premium modern SaaS |
| UI / Body | **Inter** (Google Fonts) | Neutral, dense-legible workhorse for tables, forms, nav |
| Numeric / Metrics | **Geist Mono** or Inter tabular (`type.numeric.tabular`) | KPI numbers, IDs, dates — tabular alignment |

Two families only (Geist + Inter); Geist Mono reserved for metrics/identifiers, never body prose.

### 3.2 Type Scale

| Token | Size / Line-height | Family | Weight | Usage |
|---|---|---|---|---|
| `type.display.lg` | 44px / 48px | Geist | 600 | Hero headline, landing |
| `type.display.md` | 32px / 38px | Geist | 600 | Page titles |
| `type.heading.lg` | 22px / 28px | Geist | 500 | Section headers, modal titles |
| `type.heading.md` | 17px / 24px | Geist | 500 | Card titles |
| `type.body.lg` | 15px / 22px | Inter | 400 | Primary body |
| `type.body.md` | 13.5px / 20px | Inter | 400 | Table cells, list rows |
| `type.body.sm` | 12px / 16px | Inter | 500 | Metadata, timestamps |
| `type.label` | 12.5px / 16px | Inter | 500 | Field/form labels, sentence case |
| `type.metric.lg` | 40px / 44px | Geist Mono | 600 | Featured KPI number |
| `type.numeric` | 13.5px / 20px | Inter (tabular) | 500 | Inline dates, counts, IDs |
| `type.code` | 12.5px / 18px | Geist Mono | 500 | Ticket keys, technical identifiers |

### 3.3 Weight Tokens

| Token | Value | Usage |
|---|---|---|
| `weight.regular` | 400 | Body copy |
| `weight.medium` | 500 | Headings, labels |
| `weight.semibold` | 600 | Display, KPI numbers, primary buttons |
| `weight.bold` | 700 | Reserved — rare hero moment only |

### 3.4 Letter Spacing

| Token | Value | Usage |
|---|---|---|
| `tracking.tight` | -0.02em | Display 32px+ |
| `tracking.snug` | -0.01em | Headings 17–22px |
| `tracking.normal` | 0em | Body |
| `tracking.wide` | 0.01em | 12px labels (sentence case, no all-caps) |

---

## 4. Spacing & Layout Tokens

### 4.1 Spacing Scale (4px base)

| Token | Value |
|---|---|
| `space.1` | 4px |
| `space.2` | 8px |
| `space.3` | 12px |
| `space.4` | 16px |
| `space.5` | 20px |
| `space.6` | 24px |
| `space.8` | 32px |
| `space.10` | 40px |
| `space.12` | 48px |
| `space.16` | 64px |

### 4.2 Radius Tokens

| Token | Value | Usage |
|---|---|---|
| `radius.sm` | 6px | Inputs, chips, small buttons |
| `radius.md` | 10px | Cards, dropdowns |
| `radius.lg` | 16px | Modals, hero containers |
| `radius.pill` | 999px | Badges, avatars |

### 4.3 Elevation / Glow Tokens

| Token | Value | Usage |
|---|---|---|
| `elevation.0` | none | Flat/sunken surfaces |
| `elevation.1` | `0 1px 2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)` | Cards at rest (inset line = top gloss edge) |
| `elevation.2` | `0 8px 24px rgba(0,0,0,0.5)` | Dropdowns, popovers |
| `elevation.3` | `0 24px 64px rgba(0,0,0,0.6)` | Modals, command palette |
| `glow.primaryCta` | `0 0 0 1px rgba(227,28,61,0.4), 0 4px 20px rgba(227,28,61,0.35)` | Primary button rest state |
| `glow.primaryCtaHover` | `0 0 0 1px rgba(255,59,87,0.6), 0 6px 28px rgba(255,59,87,0.45)` | Primary button hover |
| `glow.activeNav` | `inset 2px 0 0 #E31C3D, 0 0 16px rgba(227,28,61,0.2)` | Active sidebar item |

### 4.4 Border Tokens

| Token | Value | Usage |
|---|---|---|
| `border.hairline` | 1px solid `color.graphite.600` | Table rows, standard card outline |
| `border.glass` | 1px solid transparent, background `gradient.borderSheen` (border-image technique) | Premium/glass cards |
| `border.focus` | 2px solid `color.crimson.400`, offset 2px | Keyboard focus ring |

---

## 5. Iconography Tokens

- **Icon set:** Lucide Icons, outline style, consistent 1.75px stroke.
- `icon.size.sm` — 16px (inline, labels)
- `icon.size.md` — 20px (buttons, nav, row actions)
- `icon.size.lg` — 24px (empty states, headers)
- `icon.color.default` — `color.text.secondary`
- `icon.color.active` — `color.crimson.500`, optionally with soft glow at 20% opacity behind it
- `icon.color.muted` — `color.text.muted`
- `icon.color.onPrimary` — `#FFFFFF` (icons inside red gradient buttons)

---

## 6. Motion Tokens

| Token | Value | Usage |
|---|---|---|
| `motion.duration.fast` | 100ms | Hover, icon toggle |
| `motion.duration.base` | 180ms | Dropdown, panel reveal |
| `motion.duration.slow` | 280ms | Modal entrance |
| `motion.easing.standard` | cubic-bezier(0.4, 0, 0.2, 1) | Default |
| `motion.easing.emphasis` | cubic-bezier(0.16, 1, 0.3, 1) | One orchestrated moment — CTA glow pulse on primary success action, card drop |

Gloss detail: on primary button hover, gradient shifts brighter (`gradient.primaryButtonHover`) + glow expands (`glow.primaryCtaHover`) — this is the one "shiny" moment; everything else stays restrained.

---

## 7. Component-Level Mapping

| Component | Background | Text | Border | Notes |
|---|---|---|---|---|
| Primary button | `gradient.primaryButton` | `#FFFFFF` | none | `glow.primaryCta` rest, `glow.primaryCtaHover` on hover |
| Secondary button | `color.graphite.800` | `color.text.primary` | `border.hairline` | hover border → `color.crimson.500` |
| Sidebar (active item) | `color.graphite.800` | `color.text.primary` | left `glow.activeNav` | icon tinted `color.crimson.500` |
| Task card | `color.surface.raised` + `gradient.glassSurface` | `color.text.primary` | `border.hairline` | priority dot per §2.6 |
| Featured KPI card | `color.graphite.800` + `gradient.metricAccent` edge | number in `type.metric.lg` | `border.glass` | one glossy hero card per dashboard, not repeated everywhere |
| Status badge | tint (10% opacity of status color over `graphite.700`) | full-strength status color | none | pill radius |
| Table header row | `color.graphite.900` | `color.text.secondary` | bottom `border.hairline` | — |
| Modal | `color.surface.overlay` | `color.text.primary` | `border.glass` | `elevation.3` |

---

## 8. What Changed From v1 (rationale)

- Base flipped from warm bone/light to dark graphite — matches modern premium SaaS (Linear/Stripe/Vercel-adjacent) rather than editorial print feel.
- Red role changed from **dominant surface color** to **signature accent + gloss/glow source** — used in gradients, glows, and single hero moments, not large fills. Reads more expensive by being rarer.
- Added explicit gradient and glow tokens (§2.3, §4.3) — this is what produces "glossy," which flat hex tokens alone can't express.
- Serif (Fraunces) dropped in favor of Geist — SaaS-precision tone over editorial warmth.
- Status "danger" intentionally reuses signature red — in this system, real severity is allowed to borrow the brand's highest-value color; everything else (success/warning/info) gets distinct hues so priority vs. status is never confused.

---

## 9. Naming Convention

`category.subcategory.variant` (e.g. `gradient.primaryButtonHover`, `glow.activeNav`, `type.metric.lg`). This file is the source of truth for values — implementation should reference these token names.
