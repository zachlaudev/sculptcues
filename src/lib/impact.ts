/** Body parts, in the same order as the app's Intensity Chart. */
export const PARTS = [
  ['core', 'Core'],
  ['glutes', 'Glutes'],
  ['legs', 'Legs'],
  ['arms', 'Arms'],
  ['shoulders', 'Shoulders'],
  ['back', 'Back'],
  ['chest', 'Chest'],
] as const;

export type PartKey = (typeof PARTS)[number][0];
export type Scores = Record<PartKey, number>;

export type Bar = {
  key: PartKey;
  label: string;
  value: number;
  /** Share of the Flow total, 0–1. */
  share: number;
  /** Bar length relative to the fullest part in this Flow. */
  width: number;
  /** App rule: at least 40% of the total and at least 8 points. */
  overwork: boolean;
};

export function impact(scores: Scores): { bars: Bar[]; caution: string | null } {
  const values = PARTS.map(([key]) => scores[key]);
  const total = values.reduce((sum, n) => sum + n, 0);
  const max = Math.max(...values, 1);
  const bars = PARTS.map(([key, label]) => {
    const value = scores[key];
    const share = total === 0 ? 0 : value / total;
    return {
      key,
      label,
      value,
      share,
      width: (value / max) * 100,
      overwork: share >= 0.4 && value >= 8,
    };
  });
  const hot = bars.find((bar) => bar.overwork);
  return { bars, caution: hot ? `Caution · possible ${hot.label.toLowerCase()} overwork` : null };
}
