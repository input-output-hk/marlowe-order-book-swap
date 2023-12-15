import DiscordLogo from "public/discord.svg";
import GithubLogo from "public/github.svg";
import XLogo from "public/x-logo.svg";
import YoutubeLogo from "public/youtube.svg";

export const PAGES = {
  ABOUT: "/about",
  COMPLETE: "/listing/complete",
  CREATE: "/create",
  DEPOSIT: "/create/deposit",
  HOME: "/",
  LISTING: "/listing",
  WITHDRAW: "/withdraw",
} as const;
export type PagesValue = (typeof PAGES)[keyof typeof PAGES];

export const headerLinks = [
  { displayText: "Listing", href: PAGES.LISTING },
  { displayText: "Create", href: PAGES.CREATE },
  { displayText: "About", href: PAGES.ABOUT },
  { displayText: "Withdraw", href: PAGES.WITHDRAW },
];

export const HEADER_TITLE = "Order Book Swap Prototype";

export const socialMediaLinks = [
  {
    href: "https://github.com/input-output-hk/marlowe-cardano",
    logo: GithubLogo as string,
    alt: "Github",
  },
  {
    href: "https://discord.gg/inputoutput",
    logo: DiscordLogo as string,
    alt: "Discord",
  },
  {
    href: "https://x.com/marlowe_io",
    logo: XLogo as string,
    alt: "X",
  },
  {
    href: "https://www.youtube.com/@IohkIo",
    logo: YoutubeLogo as string,
    alt: "Youtube",
  },
];

export const footerLinks = [
  {
    title: "Resources",
    links: [
      { displayText: "Official Website", href: "https://marlowe.iohk.io/" },
      { displayText: "Documentation", href: "https://docs.marlowe.iohk.io/" },
      { displayText: "Playground", href: "https://play.marlowe.iohk.io/" },
      { displayText: "Blog", href: "https://marlowe.iohk.io/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      {
        displayText: "Cookie Policy",
        href: "https://docs.google.com/document/d/13zJ5jdaKjXgAytvDn0kln8UFDhyFr3AS/view",
      },
      {
        displayText: "Privacy Policy",
        href: "https://static.iohk.io/terms/iog-privacy-policy.pdf",
      },
      {
        displayText: "Terms of Use",
        href: "https://plutus-static.s3.eu-central-1.amazonaws.com/IOHK+Website+Terms+%26+Conditions+(Final).pdf",
      },
    ],
  },
  {
    title: "Support",
    links: [
      {
        displayText: "IOG tech support",
        href: "https://iohk.zendesk.com/hc/en-us/requests/new",
      },
    ],
  },
];
