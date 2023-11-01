export const PAGES = {
  COMPLETE: "/listing/complete",
  HOME: "/",
  LISTING: "/listing",
  CREATE: "/create",
} as const;
export type PagesValue = (typeof PAGES)[keyof typeof PAGES];
