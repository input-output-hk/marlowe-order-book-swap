export const PAGES = {
  ABOUT: "/about",
  COMPLETE: "/listing/complete",
  HOME: "/",
  LISTING: "/listing",
  CREATE: "/create",
} as const;
export type PagesValue = (typeof PAGES)[keyof typeof PAGES];

export const headerLinks = [
  { displayText: "Listing", href: PAGES.LISTING },
  { displayText: "Create", href: PAGES.CREATE },
  { displayText: "About", href: PAGES.ABOUT },
];

export const HEADER_TITLE = "Order Book Swap Prototype";
