export const COLORS = {
  WHITE: "#FFFFFF", // text-m-white
  BLACK: "#1C1C1C",
  PURPLE: "#511CF7",
  DISABLED: "#979DAF",
  RED: "#FF525B",
} as const;

export type COLORS = (typeof COLORS)[keyof typeof COLORS];
