export const COLORS = {
  BLACK: "#1C1C1C",
  DISABLED: "#979DAF",
  DARK_GRAY: "#8C8C8C",
  GREEN: "#15A98F",
  PURPLE: "#511CF7",
  RED: "#FF525B",
  WHITE: "#FFFFFF",
} as const;

export type COLORS = (typeof COLORS)[keyof typeof COLORS];
