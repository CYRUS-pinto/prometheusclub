---
name: Prometheus OS
colors:
  surface: '#0a1614'
  surface-dim: '#0a1614'
  surface-bright: '#2f3c39'
  surface-container-lowest: '#05100e'
  surface-container-low: '#121e1c'
  surface-container: '#162220'
  surface-container-high: '#202c2a'
  surface-container-highest: '#2b3735'
  on-surface: '#d8e5e2'
  on-surface-variant: '#bacac6'
  inverse-surface: '#d8e5e2'
  inverse-on-surface: '#273330'
  outline: '#859491'
  outline-variant: '#3c4a47'
  surface-tint: '#3ddccc'
  primary: '#59f1e0'
  on-primary: '#003732'
  primary-container: '#2fd4c4'
  on-primary-container: '#005750'
  inverse-primary: '#006a61'
  secondary: '#ffb59f'
  on-secondary: '#5f1500'
  secondary-container: '#ab2f01'
  on-secondary-container: '#ffc8b9'
  tertiary: '#7fede0'
  on-tertiary: '#003733'
  tertiary-container: '#61d0c4'
  on-tertiary-container: '#005750'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#63f9e8'
  primary-fixed-dim: '#3ddccc'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb59f'
  on-secondary-fixed: '#3b0a00'
  on-secondary-fixed-variant: '#862200'
  tertiary-fixed: '#87f5e8'
  tertiary-fixed-dim: '#6ad8cc'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#00504a'
  background: '#0a1614'
  on-background: '#d8e5e2'
  surface-variant: '#2b3735'
typography:
  system-code:
    fontFamily: Press Start 2P
    fontSize: 8px
    fontWeight: '400'
    lineHeight: 12px
  terminal-md:
    fontFamily: jetbrainsMono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  window-title:
    fontFamily: spaceGrotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  display-lg:
    fontFamily: spaceGrotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
  display-lg-mobile:
    fontFamily: spaceGrotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  body-content:
    fontFamily: spaceGrotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: jetbrainsMono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin: 24px
  window-padding: 12px
---

## Brand & Style

The design system embodies a "Cold & Mechanical" aesthetic, channeling a high-fidelity retro-futurism inspired by early 2000s operating systems. It prioritizes a sense of terminal-based power wrapped in a consumer-grade desktop shell. 

The style is a hybrid of **Retro-Digital** and **Glassmorphism**, featuring semi-translucent window chrome, pixel-perfect iconography, and CRT-inspired visual artifacts. The atmosphere is clinical, immersive, and slightly subversive, utilizing "REBELLION" orange sparingly to signal high-priority system overrides or central calls to action within a sea of mechanical teal.

## Colors

The palette is rooted in deep, atmospheric teals to simulate a glowing phosphor display. 

- **Foundation:** The background is a near-black teal (#0A1614), providing a high-contrast base for glowing elements.
- **Surfaces:** UI panels use a soft teal-black (#101F1C) with a subtle transparency to simulate "Aero" style glass.
- **Accents:** The primary interaction color is Teal (#2FD4C4), transitioning to Bright Teal (#7FEDE0) for hover states and active glows.
- **The Rebellion Factor:** Flame Orange (#FF6A3D) is strictly reserved for the mascot flame and the primary "Join" action. Use it nowhere else to maintain its psychological impact.
- **Typography:** Main content uses a Pale Mint-Cream (#EAF6F3) for maximum legibility against dark backgrounds, while metadata uses Muted Teal (#0F6158).

## Typography

This system utilizes a tripartite typographic hierarchy to define the user's "depth" within the OS:

1.  **System Level (Press Start 2P):** Used for low-level BIOS messages, status indicators, and pixel-art labels. Always rendered in 8px increments to maintain pixel alignment.
2.  **Terminal Level (JetBrains Mono):** Used for data input, code blocks, and technical metadata. It emphasizes the mechanical nature of the system.
3.  **Application Level (Space Grotesk):** Used for window content, headers, and primary reading. It provides a modern, geometric balance to the retro elements.

All text should utilize a subtle `text-shadow` in primary teal at low opacity to simulate CRT bloom.

## Layout & Spacing

The layout philosophy follows a **Windowed Desktop Model**. Elements are not always bound to a strict global grid but are instead contained within draggable, resizable window components.

- **Grid:** Use a 4px baseline grid to ensure pixel-art icons and system fonts align perfectly.
- **Window Chrome:** Headers should be 32px tall. Windows utilize a 1px inner highlight border to create a "beveled glass" effect.
- **Responsive Behavior:** On mobile, windows stack vertically and expand to full-width, adopting a "tiled" interface while retaining the OS-style header bars.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and **Tonal Layering** rather than traditional drop shadows.

- **Backdrop Blur:** All window surfaces and dropdown menus must use a `backdrop-filter: blur(12px)` to separate them from the desktop wallpaper.
- **Outer Glow:** Active windows or focused inputs use a soft Teal (#2FD4C4) outer glow (`box-shadow: 0 0 15px rgba(47, 212, 196, 0.3)`).
- **Scanlines:** A global overlay of 1px semi-transparent horizontal lines should be applied to the entire viewport to mimic a CRT monitor.
- **Borders:** Every container must have a 1px border (#1B3B36). Active elements use a dual-border approach: a dark outer border and a bright teal inner "glow" line.

## Shapes

The design system uses a **Soft (0.25rem)** roundedness for windows and buttons to mimic the refined feel of early 2000s "Liquid" or "Aero" design languages.

- **Buttons:** Subtle rounding (4px) to maintain a mechanical feel.
- **Desktop Icons:** Perfect squares or circles, following a pixel-art grid.
- **Selection Boxes:** Sharp corners (0px) are used for technical selections or terminal highlights to contrast with the softer window frames.

## Components

- **Windows:** Must include a title bar with a gradient (Surface to Border color), "Minimize/Maximize/Close" pixel-art buttons, and a semi-transparent body.
- **Buttons (Standard):** Gradient backgrounds (Bottom-to-Top) from #101F1C to #1B3B36. On hover, the border glows #7FEDE0.
- **Button (The Rebellion):** Solid #FF6A3D background with black text. Reserved for the mascot and the "Join" CTA. It should have a subtle "flicker" animation.
- **Inputs:** Inset shadows to create a "carved" look into the glass. Use JetBrains Mono for text entry.
- **Chips/Tags:** Monospaced text inside a #1B3B36 capsule with no background fill, only a border.
- **Taskbar:** A fixed-bottom blur bar containing the "Start" equivalent (Mascot Flame) and active window tabs.
- **Scrollbars:** Retro-style blocky scrollbars. The thumb should be a solid block of #1B3B36 that turns Teal on interaction.