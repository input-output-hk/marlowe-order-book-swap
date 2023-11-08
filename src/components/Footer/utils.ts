import DiscordLogo from "public/discord.svg";
import GithubLogo from "public/github.svg";
import XLogo from "public/x-logo.svg";
import YoutubeLogo from "public/youtube.svg";

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
      { text: "Official Website", href: "https://marlowe.iohk.io/" },
      { text: "Documentation", href: "https://docs.marlowe.iohk.io/" },
      { text: "Playground", href: "https://play.marlowe.iohk.io/" },
      { text: "Blog", href: "https://marlowe.iohk.io/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      {
        text: "Cookie Policy",
        href: "https://docs.google.com/document/d/13zJ5jdaKjXgAytvDn0kln8UFDhyFr3AS/view",
      },
      {
        text: "Privacy Policy",
        href: "https://static.iohk.io/terms/iog-privacy-policy.pdf",
      },
      {
        text: "Terms of Use",
        href: "https://plutus-static.s3.eu-central-1.amazonaws.com/IOHK+Website+Terms+%26+Conditions+(Final).pdf",
      },
    ],
  },
  {
    title: "Support",
    links: [
      {
        text: "IOG tech support",
        href: "https://iohk.zendesk.com/hc/en-us/requests/new",
      },
    ],
  },
];
