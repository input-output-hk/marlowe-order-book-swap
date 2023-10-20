export const PAGES = {
  HOME: "/",
  CONTRACTS: "/contracts",
  CREATE: "/create",
} as const;
export type PagesValue = (typeof PAGES)[keyof typeof PAGES];
