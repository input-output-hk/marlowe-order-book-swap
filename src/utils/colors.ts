export const COLORS = {
  BLACK: "#000000",
  DISABLED: "#979DAF",
  DARK_GRAY: "#8C8C8C",
  LIGHT_GRAY: "#F2F6FC",
  GREEN: "#17A98F",
  PURPLE: "#4B1FED",
  LIGHT_PURPLE: "#F8F6FF",
  RED: "#FF525B",
  WHITE: "#FFFFFF",
  BLUE: "#0038FF",
  LIGHT_BLUE: "#EFF2FE",
} as const;

export type COLORS = (typeof COLORS)[keyof typeof COLORS];

export const stringedColors: Record<COLORS, string> = {
  [COLORS.BLACK]: "black",
  [COLORS.DISABLED]: "m-disabled",
  [COLORS.DARK_GRAY]: "m-dark-gray",
  [COLORS.LIGHT_GRAY]: "m-light-gray",
  [COLORS.GREEN]: "m-green",
  [COLORS.PURPLE]: "m-purple",
  [COLORS.LIGHT_PURPLE]: "m-light-purple",
  [COLORS.RED]: "m-red",
  [COLORS.WHITE]: "white",
  [COLORS.BLUE]: "m-blue",
  [COLORS.LIGHT_BLUE]: "m-light-blue",
};
