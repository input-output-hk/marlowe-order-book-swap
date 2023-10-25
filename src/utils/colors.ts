export const COLORS = {
  BLACK: "#000000",
  DISABLED: "#979DAF",
  DARK_GRAY: "#8C8C8C",
  GREEN: "#17A98F",
  PURPLE: "#4B1FED",
  RED: "#FF525B",
  WHITE: "#FFFFFF",
  BLUE: "#0038FF",
} as const;

export type COLORS = (typeof COLORS)[keyof typeof COLORS];

export const stringedColors: Record<COLORS, string> = {
  [COLORS.BLACK]: "black",
  [COLORS.DISABLED]: "m-disabled",
  [COLORS.DARK_GRAY]: "m-dark-gray",
  [COLORS.GREEN]: "m-green",
  [COLORS.PURPLE]: "m-purple",
  [COLORS.RED]: "m-red",
  [COLORS.WHITE]: "white",
  [COLORS.BLUE]: "m-blue",
};
