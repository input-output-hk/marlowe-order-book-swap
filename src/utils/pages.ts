export const PAGES = {
  HOME: "/",
  LISTING: "/listing",
  CREATE: "/create",
} as const;
export type PagesValue = (typeof PAGES)[keyof typeof PAGES];
