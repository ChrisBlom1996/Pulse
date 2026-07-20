# Pulse — Design System

> Source of truth for visual language, interaction, and accessibility.
> Implementation tokens live in [`src/styles/global.css`](src/styles/global.css).

A minimalist daily habit tracker. The visual language is built around a literal **biometric pulse / heartbeat monitor** — not generic “dark mode glassmorphism.”

---

## Table of contents

1. [Principles](#1-principles)
2. [Color tokens](#2-color-tokens)
3. [Typography](#3-typography)
4. [Spacing & layout](#4-spacing--layout)
5. [Motion](#5-motion)
6. [Signature element: Pulse Ring](#6-signature-element-pulse-ring)
7. [Components](#7-components)
8. [Accessibility](#8-accessibility)
9. [Anti-patterns](#9-anti-patterns)

---

## 1. Principles

| Principle | Meaning |
| --- | --- |
| Instrument, not dashboard | Numerals read like a monitor readout (JetBrains Mono). One loud signal (the ring); everything else stays quiet. |
| Thumb-first | Comfortable one-handed use: ≥56px tap targets, generous list spacing. |
| Two accents, no more | Teal (`--accent-pulse`) is primary; coral (`--accent-warm`) is secondary and scarce. |
| Motion with meaning | Springs for touch feedback; ECG-style heartbeat on the ring — never decorative bounce. |
| Tokens only | Never hardcode hex in components. Always reference CSS variables / Tailwind theme tokens. |

---

## 2. Color tokens

Defined as CSS variables in `src/styles/global.css`. Components must reference variables (or Tailwind mappings such as `bg-bg`, `text-accent-pulse`), never raw hex.

```css
:root {
  /* Surfaces */
  --bg: #0b0f14;
  --surface: rgba(255, 255, 255, 0.04);
  --surface-hover: rgba(255, 255, 255, 0.07);
  --border: rgba(255, 255, 255, 0.09);

  /* Accents */
  --accent-pulse: #5eead4; /* primary — completion, active states, the ring */
  --accent-warm: #f97462; /* secondary — streaks, mood warmth, sparingly */

  /* Text */
  --text-primary: #f5f7fa;
  --text-muted: #8b95a1;
  --text-disabled: #4a5560;

  /* Semantic */
  --success: var(--accent-pulse);
  --danger: #f87171; /* delete / destructive actions only */
}
```

### Usage rules

- **`--accent-warm`** is a secondary accent, not a second primary. Cap it at streak counters and small highlight moments. If more than ~10% of a screen is coral, pull it back.
- **`--danger`** only appears on destructive confirmation (e.g. delete habit), never as a general warning color.
- **Glass surfaces** (`--surface` + `--border` + `backdrop-blur`) are for cards floating over `--bg`. Do not stack glass-on-glass.
- **Contrast:** `--text-muted` on `--bg` must remain ≥ **4.5:1** (WCAG AA). Do not reduce legibility with parent `opacity` on text.

| Token | Role |
| --- | --- |
| `--bg` | App canvas / phone interior |
| `--surface` | Card / bar fill |
| `--surface-hover` | Pressed or hovered surface |
| `--border` | Hairline edges |
| `--accent-pulse` | Primary brand / completion / nav active / ring stroke |
| `--accent-warm` | Secondary spark (particles, rare highlights) |
| `--text-primary` | Titles, habit names (incomplete) |
| `--text-muted` | Supporting copy, streaks, inactive nav |
| `--text-disabled` | Unavailable controls |
| `--success` | Alias of pulse teal |
| `--danger` | Destructive only |

---

## 3. Typography

| Role | Font | Weight | Use |
| --- | --- | --- | --- |
| Display / headings | Space Grotesk | 500–700 | Screen titles, ring center number |
| Body | Inter | 400–500 | Habit names, body copy, buttons |
| Data / numeric | JetBrains Mono | 400–500 | Streak counts, dates, timestamps |

### Type scale

| Token | Size / line-height | Notes |
| --- | --- | --- |
| `--text-xs` | 12px / 16px | Labels, nav captions |
| `--text-sm` | 14px / 20px | Supporting copy |
| `--text-base` | 16px / 24px | Body, habit names |
| `--text-lg` | 20px / 28px | Section emphasis |
| `--text-xl` | 28px / 34px | Screen titles |
| `--text-2xl` | 40px / 44px | Ring center number only |

CSS source values are stored as `--font-size-*` / `--font-size-*-leading` in `:root` and mapped into Tailwind as `--text-*` via `@theme` (see `global.css`).

### Numeric rule

Numbers in the app (streaks, ring counts, dates, timestamps) are **always** JetBrains Mono — even inline in a sentence. This is the product’s “instrument readout” signature and must not lapse into Inter for numerals.

---

## 4. Spacing & layout

**8px base grid.**

| Token | Value |
| --- | --- |
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |

### Layout constants

| Rule | Value |
| --- | --- |
| Screen horizontal padding | `--space-4` (16px) |
| Card internal padding | `--space-4` |
| Gap between stacked cards | `--space-3` |
| Minimum tap target height | **56px** (thumb-zone) |
| Bottom nav height | **64px** + `env(safe-area-inset-bottom)` |

### PhoneFrame

- **Desktop (≥500px):** fixed ~390×844 device mockup — thin bezel, soft shadow, subtle notch.
- **Mobile (&lt;500px):** frame chrome disappears; app fills the real viewport (`100dvh`), edge-to-edge, with safe-area insets.

---

## 5. Motion

| Interaction | Spec |
| --- | --- |
| Touch feedback | Framer Motion **spring** (not linear CSS) for anything the user presses |
| Card press | Scale `1 → 0.97`, ~120ms feel (spring) |
| Completion burst | 6–10 particles; `--accent-pulse` / `--accent-warm` alternating; fade out **&lt;500ms**; fire only on the toggle action, never on re-render |
| Pulse Ring heartbeat | Scale `1 → 1.06 → 1` + soft glow on every completion change — ECG blip, not a bounce |

### Reduced motion

Always respect `prefers-reduced-motion`:

- Disable scale and particle effects.
- Keep only opacity / color transitions.
- Progress ring may snap without `stroke-dashoffset` animation.

---

## 6. Signature element: Pulse Ring

SVG circular progress ring. `stroke-dashoffset` animates when today’s completion percent changes. Center shows `{completed}/{total}` in Space Grotesk (display), with optional mono “today” caption.

This is the **one** place in the app allowed to be loud. Everything else stays quiet around it. Do not add a second showpiece animation elsewhere — it dilutes the ring.

---

## 7. Components

| Component | Responsibility |
| --- | --- |
| `HabitCard` | Glass surface; icon + name + streak (mono). Tap toggles `completedToday`. Completed state is quieter so incomplete habits draw attention. |
| `PulseRing` | Signature progress ring; top of Today. |
| `PhoneFrame` | Desktop-only device mockup; gone on real mobile. |
| `BottomNav` | Today / Trends / Settings. Active tab = `--accent-pulse`. Glass bar; safe-area aware. |
| `EmptyState` | Text-led, action-oriented. No stock illustrations. |
| `AddHabitSheet` | Bottom sheet: name input + icon picker (planned / upcoming). |

### Composition notes

- Presentational components receive data and callbacks; they do not touch `localStorage`.
- State flows through Zustand (`useHabitStore`) and hooks such as `useTodayProgress`.

---

## 8. Accessibility

| Requirement | Standard |
| --- | --- |
| Focus | Visible focus ring using `--accent-pulse` (via `--focus-ring`), never browser default blue |
| Contrast | `--text-muted` on `--bg` ≥ 4.5:1 (AA); verify after any token tweak |
| Motion | `prefers-reduced-motion` respected wherever motion appears |
| Targets | ≥ 44×44px minimum; **56px** preferred for primary list actions |
| Semantics | Habit cards expose `aria-pressed`; nav is a landmark with clear labels |

---

## 9. Anti-patterns

Guardrails so future work does not drift into a generic template:

- **No** stock circular progress bars — always the Pulse Ring pattern.
- **No** single-accent neon-on-black look — the two-accent system (teal + coral) is deliberate; do not add a third brand accent.
- **No** decorative numbered markers (`01` / `02` / `03`) — nothing in this app is a marketing sequence.
- **No** illustration-heavy empty states — text does the work.
- **No** glass-on-glass stacking.
- **No** hardcoded hex in JSX / TSX — tokens only.

---

## Changelog

| Date | Change |
| --- | --- |
| 2026-07-20 | Initial design system documented from product direction. |
