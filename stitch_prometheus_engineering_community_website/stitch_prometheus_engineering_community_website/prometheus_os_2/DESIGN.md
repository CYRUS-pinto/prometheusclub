---
name: Prometheus OS
colors:
  surface: '#151311'
  surface-dim: '#151311'
  surface-bright: '#3c3936'
  surface-container-lowest: '#100e0c'
  surface-container-low: '#1d1b19'
  surface-container: '#211f1d'
  surface-container-high: '#2c2927'
  surface-container-highest: '#373432'
  on-surface: '#e8e1dd'
  on-surface-variant: '#d6c4b0'
  inverse-surface: '#e8e1dd'
  inverse-on-surface: '#33302e'
  outline: '#9e8e7c'
  outline-variant: '#514536'
  surface-tint: '#ffb956'
  primary: '#ffc16c'
  on-primary: '#462b00'
  primary-container: '#e8a33d'
  on-primary-container: '#5f3c00'
  inverse-primary: '#835400'
  secondary: '#b7c9da'
  on-secondary: '#21323f'
  secondary-container: '#384957'
  on-secondary-container: '#a6b7c8'
  tertiary: '#d0cbc1'
  on-tertiary: '#323029'
  tertiary-container: '#b4b0a6'
  on-tertiary-container: '#45433c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddb5'
  primary-fixed-dim: '#ffb956'
  on-primary-fixed: '#2a1800'
  on-primary-fixed-variant: '#643f00'
  secondary-fixed: '#d3e5f6'
  secondary-fixed-dim: '#b7c9da'
  on-secondary-fixed: '#0b1d2a'
  on-secondary-fixed-variant: '#384957'
  tertiary-fixed: '#e7e2d7'
  tertiary-fixed-dim: '#cac6bc'
  on-tertiary-fixed: '#1d1c15'
  on-tertiary-fixed-variant: '#49473f'
  background: '#151311'
  on-background: '#e8e1dd'
  surface-variant: '#373432'
typography:
  system-pixel:
    fontFamily: Press Start 2P
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 1px
  headline-lg:
    fontFamily: spaceGrotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: spaceGrotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: spaceGrotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: spaceGrotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  code-sm:
    fontFamily: jetbrainsMono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
spacing:
  unit: 4px
  gutter: 16px
  margin: 24px
  window-padding: 8px
  border-width: 2px
---

## Brand & Style

The design system is a high-fidelity retro-workstation aesthetic that merges the tactical utility of an early-2000s terminal with the warmth of an amber CRT display. It is designed for technical users, developers, and hardware enthusiasts who value a "tangible" digital environment that feels industrial, authoritative, and nostalgic.

The visual style is **Retro-Technical**, characterized by:
- **Mechanical Skeuomorphism:** UI elements resemble physical hardware with "pressed" states and raised bezels.
- **CRT Atmosphere:** A persistent sense of an electron beam behind glass, utilizing amber glows and scanline textures.
- **Information Density:** High-density layouts that prioritize data visibility over whitespace, reminiscent of legacy monitoring systems.
- **Square Rigidity:** A complete absence of rounded corners, emphasizing a structured, hardware-bound architecture.

## Colors

This design system utilizes a high-contrast, "warm-industrial" palette. 

- **The Void:** Charcoal (#151311) serves as the primary canvas, representing the unlit CRT screen. Soft Charcoal (#211D19) is used for active window backgrounds and elevated surfaces.
- **The Glow:** Amber (#E8A33D) is the primary interaction color, mimicking phosphor light. Bright Amber (#F5B84F) is reserved for high-alert states, hover effects, and active cursors.
- **The Chrome:** Steel-blue-grey (#5A6B7A) is used exclusively for "hardware" elements—window title bars, scrollbar tracks, and divider lines—to separate the software interface from the OS container.
- **The Readout:** Cream and Paper provide a soft, legible contrast for long-form text, preventing the eye strain associated with pure white-on-black text.

## Typography

The typography strategy balances low-resolution nostalgia with modern legibility.

- **System & Headers:** "Press Start 2P" is used sparingly for OS-level labels, window titles, and small "pixelated" status indicators. It should never be used for body text.
- **Information Layer:** "Space Grotesk" provides a clean, modern-geometric contrast for main headings and body copy, ensuring the system remains usable for complex reading tasks.
- **Technical Readouts:** "JetBrains Mono" is used for all data values, terminal inputs, and metadata. It reinforces the "under-the-hood" feeling of the workstation.

*Note: All amber text should have a subtle text-shadow of `0 0 4px #E8A33D` to simulate phosphor bleed.*

## Layout & Spacing

This design system uses a **Fixed Grid** philosophy rooted in 4px increments. Layouts are contained within "Windows" that mimic an early-2000s desktop environment.

- **The Window Model:** Every functional area is wrapped in a "Chrome" container with a 2px Steel-blue-grey border.
- **Information Density:** Spacing is tight (8px to 16px) to maximize data visibility. Padding within components should be consistent to maintain the "blocky" aesthetic.
- **Breakpoints:**
  - **Desktop (1280px+):** Multi-window tiling layout.
  - **Tablet (768px - 1279px):** Single active window with side-docked utilities.
  - **Mobile (below 768px):** Full-screen terminal view; "Windows" become stacked panels with persistent title bars.

## Elevation & Depth

Depth is achieved through **Structural Bevels** and **Tonal Layering** rather than realistic shadows.

- **The Bevel:** Use a 2px solid stroke for all borders. For "raised" elements (buttons, active windows), use a two-tone border: top/left are Amber-bright, bottom/right are Amber-dim. For "inset" elements (inputs, wells), reverse this logic.
- **Tonal Tiers:**
  - **Level 0 (Background):** Charcoal (#151311) with a fixed SVG scanline overlay (0.05 opacity).
  - **Level 1 (Window):** Soft Charcoal (#211D19) with a 2px Steel-blue-grey border.
  - **Level 2 (Component):** Soft Charcoal with an Amber border.
- **Phosphor Glow:** Active elements utilize a `box-shadow: 0 0 8px #E8A33D` to indicate "power on" or focus states.

## Shapes

The shape language is strictly **Rectilinear**. 

- **Corners:** All corners are 0px (Sharp). This applies to buttons, windows, inputs, and selection highlights.
- **Borders:** Every border must be a minimum of 2px. Dotted or dashed borders may be used for "secondary" grouping containers to simulate low-bandwidth UI rendering.
- **Cursors:** Use a block-style cursor (8x16px) for text inputs rather than a vertical line.

## Components

### Buttons
Buttons are styled as physical "keys."
- **Default:** 2px Amber border, Soft Charcoal background, Amber text (Space Grotesk Bold).
- **Active/Pressed:** Amber background, Charcoal text, no glow.
- **Visual Feedback:** On click, the button should shift 1px down and 1px right to simulate physical travel.

### Input Fields
Inputs are "wells" sunk into the UI.
- **Style:** 2px inset border (darker on top/left), Charcoal background.
- **Text:** JetBrains Mono in Paper color.
- **Focus:** The entire border glows Amber.

### Window Chrome
The container for all modules.
- **Title Bar:** Solid Steel-blue-grey background (#5A6B7A).
- **Title Text:** Press Start 2P, 10px, Cream color.
- **Controls:** Square 16x16px buttons on the far right for "Minimize" (_) and "Close" (X).

### Chips & Tags
- Small rectangular blocks with 1px borders.
- Monospaced text only.
- Use Steel-blue-grey for system tags and Amber for user-defined tags.

### Progress Bars
- Styled as a series of 4px wide blocks (ASCII style) rather than a smooth fill.
- Unfilled segments use a dim Charcoal; filled segments use Amber.

### CRT Overlay (Global)
- Apply a subtle "Screen Flicker" animation (0.01% opacity shift) and horizontal scanlines to the body to complete the workstation atmosphere.