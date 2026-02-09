/**
 * Custom neon wireframe SVGs for the global parallax background.
 * Stroke-only style with glow effect via SVG filters.
 * Injected with [innerHTML] into parallax layer elements.
 */

const GLOW_FILTER = `
  <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="3" result="blur"/>
    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
  </filter>`;

const GLOW_FILTER_STRONG = `
  <filter id="neonGlowStrong" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="5" result="blur"/>
    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
  </filter>`;

/** Laptop wireframe — outline only */
export const SVG_LAPTOP = `<svg viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>${GLOW_FILTER}</defs>
  <g filter="url(#neonGlow)" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="12" y="4" width="56" height="36" rx="3"/>
    <rect x="16" y="8" width="48" height="28" rx="1"/>
    <path d="M8 44h64l-4 8H12l-4-8z"/>
    <line x1="30" y1="48" x2="50" y2="48"/>
  </g>
</svg>`;

/** Smartphone wireframe */
export const SVG_PHONE = `<svg viewBox="0 0 36 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>${GLOW_FILTER}</defs>
  <g filter="url(#neonGlow)" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="2" width="32" height="60" rx="6"/>
    <rect x="5" y="10" width="26" height="42" rx="2"/>
    <line x1="14" y1="6" x2="22" y2="6"/>
    <circle cx="18" cy="57" r="2"/>
  </g>
</svg>`;

/** Code brackets </> */
export const SVG_CODE_BRACKETS = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>${GLOW_FILTER_STRONG}</defs>
  <g filter="url(#neonGlowStrong)" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="16,12 6,24 16,36"/>
    <polyline points="32,12 42,24 32,36"/>
    <line x1="28" y1="8" x2="20" y2="40"/>
  </g>
</svg>`;

/** Curly braces { } */
export const SVG_CURLY_BRACES = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>${GLOW_FILTER}</defs>
  <g filter="url(#neonGlow)" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 8c-4 0-6 2-6 6v6c0 4-2 4-4 4 2 0 4 0 4 4v6c0 4 2 6 6 6"/>
    <path d="M32 8c4 0 6 2 6 6v6c0 4 2 4 4 4-2 0-4 0-4 4v6c0 4-2 6-6 6"/>
  </g>
</svg>`;

/** Terminal prompt >_ */
export const SVG_TERMINAL = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>${GLOW_FILTER}</defs>
  <g filter="url(#neonGlow)" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="6" width="40" height="36" rx="4"/>
    <line x1="8" y1="12" x2="40" y2="12"/>
    <circle cx="10" cy="9" r="1"/>
    <circle cx="14" cy="9" r="1"/>
    <circle cx="18" cy="9" r="1"/>
    <polyline points="12,22 18,26 12,30"/>
    <line x1="22" y1="30" x2="32" y2="30"/>
  </g>
</svg>`;

/** Database cylinder */
export const SVG_DATABASE = `<svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>${GLOW_FILTER}</defs>
  <g filter="url(#neonGlow)" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="20" cy="10" rx="16" ry="6"/>
    <path d="M4 10v28c0 3.3 7.2 6 16 6s16-2.7 16-6V10"/>
    <path d="M4 20c0 3.3 7.2 6 16 6s16-2.7 16-6"/>
    <path d="M4 30c0 3.3 7.2 6 16 6s16-2.7 16-6"/>
  </g>
</svg>`;

/** Cloud icon */
export const SVG_CLOUD = `<svg viewBox="0 0 56 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>${GLOW_FILTER}</defs>
  <g filter="url(#neonGlow)" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 32H10a8 8 0 01-1-15.9A12 12 0 0132 10c0 .7-.1 1.4-.2 2A10 10 0 0142 22a10 10 0 01-10 10H14z"/>
  </g>
</svg>`;

/** Arrow function => */
export const SVG_ARROW_FN = `<svg viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>${GLOW_FILTER_STRONG}</defs>
  <g filter="url(#neonGlowStrong)" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <line x1="6" y1="14" x2="30" y2="14"/>
    <polyline points="24,6 34,14 24,22"/>
  </g>
</svg>`;

/** Hash # symbol */
export const SVG_HASH = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>${GLOW_FILTER}</defs>
  <g filter="url(#neonGlow)" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <line x1="14" y1="4" x2="10" y2="36"/>
    <line x1="30" y1="4" x2="26" y2="36"/>
    <line x1="6" y1="14" x2="36" y2="14"/>
    <line x1="4" y1="26" x2="34" y2="26"/>
  </g>
</svg>`;

/** Square brackets [] */
export const SVG_BRACKETS = `<svg viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>${GLOW_FILTER}</defs>
  <g filter="url(#neonGlow)" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="14,8 8,8 8,40 14,40"/>
    <polyline points="26,8 32,8 32,40 26,40"/>
  </g>
</svg>`;

/** Git branch icon */
export const SVG_GIT_BRANCH = `<svg viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>${GLOW_FILTER}</defs>
  <g filter="url(#neonGlow)" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="10" r="4"/>
    <circle cx="12" cy="38" r="4"/>
    <circle cx="28" cy="18" r="4"/>
    <line x1="12" y1="14" x2="12" y2="34"/>
    <path d="M28 22c0 8-16 8-16 12"/>
  </g>
</svg>`;

/** Semicolon ; */
export const SVG_SEMICOLON = `<svg viewBox="0 0 20 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>${GLOW_FILTER_STRONG}</defs>
  <g filter="url(#neonGlowStrong)" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <circle cx="10" cy="14" r="3" fill="currentColor"/>
    <circle cx="10" cy="30" r="3" fill="currentColor"/>
    <line x1="10" y1="33" x2="6" y2="42"/>
  </g>
</svg>`;

/**
 * All parallax elements with metadata for the background component.
 * depth: 0-1 (0 = farthest/slowest, 1 = closest/fastest)
 */
export interface ParallaxElement {
  svg: string;
  depth: number;
  /** Starting position (%) */
  x: number;
  y: number;
  /** Size in pixels */
  size: number;
  /** Initial rotation (degrees) */
  rotation: number;
  /** Color class: 'primary' | 'accent' | 'violet' | 'emerald' | 'pink' */
  colorClass: 'primary' | 'accent' | 'violet' | 'emerald' | 'pink';
}

export const PARALLAX_ELEMENTS: ParallaxElement[] = [
  // Deep layer (slow, large, faint)
  { svg: SVG_LAPTOP,        depth: 0.15, x: 8,  y: 12, size: 100, rotation: -8,  colorClass: 'primary' },
  { svg: SVG_PHONE,         depth: 0.12, x: 85, y: 25, size: 72,  rotation: 12,  colorClass: 'accent' },
  { svg: SVG_DATABASE,      depth: 0.18, x: 75, y: 65, size: 64,  rotation: -5,  colorClass: 'violet' },
  { svg: SVG_CLOUD,         depth: 0.10, x: 50, y: 8,  size: 90,  rotation: 0,   colorClass: 'primary' },

  // Mid layer (medium speed, medium size)
  { svg: SVG_CODE_BRACKETS, depth: 0.35, x: 15, y: 55, size: 56,  rotation: 15,  colorClass: 'accent' },
  { svg: SVG_TERMINAL,      depth: 0.40, x: 70, y: 15, size: 60,  rotation: -10, colorClass: 'emerald' },
  { svg: SVG_CURLY_BRACES,  depth: 0.30, x: 90, y: 50, size: 52,  rotation: 8,   colorClass: 'primary' },
  { svg: SVG_GIT_BRANCH,    depth: 0.38, x: 25, y: 80, size: 48,  rotation: -12, colorClass: 'violet' },
  { svg: SVG_ARROW_FN,      depth: 0.42, x: 55, y: 40, size: 50,  rotation: 5,   colorClass: 'accent' },

  // Close layer (fast, small, sharper)
  { svg: SVG_HASH,          depth: 0.65, x: 5,  y: 35, size: 36,  rotation: 20,  colorClass: 'pink' },
  { svg: SVG_BRACKETS,      depth: 0.70, x: 40, y: 75, size: 32,  rotation: -18, colorClass: 'emerald' },
  { svg: SVG_SEMICOLON,     depth: 0.60, x: 80, y: 85, size: 28,  rotation: 10,  colorClass: 'primary' },
  { svg: SVG_CODE_BRACKETS, depth: 0.72, x: 60, y: 20, size: 30,  rotation: -25, colorClass: 'pink' },
  { svg: SVG_CURLY_BRACES,  depth: 0.55, x: 35, y: 5,  size: 34,  rotation: 15,  colorClass: 'violet' },
];
