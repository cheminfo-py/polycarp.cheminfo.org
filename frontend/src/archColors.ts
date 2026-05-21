/** Hex colors for the three polymer architecture classes (random, block, alternating). */
export const ARCH_COLORS: readonly [string, string, string] = [
  '#1c3d6e',
  '#7b2929',
  '#b5621e',
];

/** Name-keyed map used for substring-based colour lookup. */
const ARCH_COLOR_MAP: Record<string, string> = {
  random: ARCH_COLORS[0],
  block: ARCH_COLORS[1],
  'block like': ARCH_COLORS[1],
  alternating: ARCH_COLORS[2],
};

/**
 * Returns the architecture colour for a predicted class name.
 * Matches by substring (case-insensitive). Falls back to `'#555'`.
 * @param name - Predicted class name, e.g. `"random"`, `"block"`, `"alternating"`.
 * @returns Hex colour string.
 */
export function archColor(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, color] of Object.entries(ARCH_COLOR_MAP)) {
    if (lower.includes(key)) return color;
  }
  return '#555';
}

/**
 * Returns the architecture colour by numeric class index, or falls back to
 * a substring match on the class name when no index is given.
 * @param name - Predicted class name used as fallback when index is absent.
 * @param index - Zero-based class index (0 = random, 1 = block, 2 = alternating).
 * @returns Hex colour string.
 */
export function classColor(name: string, index?: number): string {
  if (index !== undefined) return ARCH_COLORS[index] ?? ARCH_COLORS[2];
  return archColor(name);
}

/**
 * Returns an RGB background colour for a heatmap cell.
 * Interpolates from `#f0f4f8` (low confidence) toward the class colour (high).
 * @param classIndex - Zero-based class index (0 = random, 1 = block, 2 = alternating).
 * @param confidence - Classifier confidence in [0, 1].
 * @returns CSS `rgb(...)` string.
 */
export function cellBackground(classIndex: number, confidence: number): string {
  const hex = ARCH_COLORS[classIndex] ?? '#555555';
  const r1 = 240;
  const g1 = 244;
  const b1 = 248;
  const r2 = Number.parseInt(hex.slice(1, 3), 16);
  const g2 = Number.parseInt(hex.slice(3, 5), 16);
  const b2 = Number.parseInt(hex.slice(5, 7), 16);
  const t = 0.4 + confidence * 0.6;
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}
