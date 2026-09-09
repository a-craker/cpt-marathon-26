export const scaleLinear = ([d0, d1], [r0, r1]) => (v) =>
  r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

export const line = (pts) => pts.map(([x, y]) => `${x},${y}`).join(" ");

export const BAND_PALETTE = [
  "#123F5A", "#3E7AA8", "#7E9E9E", "#C0994F", "#C86A34", "#A82F14",
];

export const BAND_ORDER = [
  "sub 3:00", "3:00-3:30", "3:30-4:00", "4:00-4:30", "4:30-5:00", "5:00+",
];

export const BAND_COLS = Object.fromEntries(
  BAND_ORDER.map((b, i) => [b, BAND_PALETTE[i]])
);