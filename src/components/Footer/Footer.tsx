import Image from "next/image";
import MarloweIcon from "public/marlowe-logo.svg";
import { ICON_SIZES, type ILink } from "~/utils";

interface FooterProps {
  socialMediaLinks: {
    href: string;
    logo: string;
    alt: string;
  }[];
  footerLinks: {
    title: string;
    links: ILink[];
  }[];
}

export const Footer = ({ footerLinks, socialMediaLinks }: FooterProps) => {
  return (
    <footer className="flex flex-col gap-4 px-8 py-5 pb-24 sm:px-12 sm:py-8 md:px-24 lg:px-28">
      <hr />
      <div className=" flex flex-col justify-between gap-8 md:flex-row md:gap-4 lg:gap-8">
        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-8  lg:grid-cols-4 lg:grid-rows-1 ">
          {footerLinks.map((footerLink) => {
            return (
              <div key={footerLink.title}>
                <b className="text-m-purple">{footerLink.title}</b>
                {footerLink.links.map((link) => (
                  <a
                    href={link.href}
                    target="_blank"
                    className="block"
                    key={link.displayText}
                  >
                    {link.displayText}
                  </a>
                ))}
              </div>
            );
          })}
        </div>

        <div className="flex w-full flex-col items-center justify-start gap-6 md:w-1/2 md:items-end lg:w-1/4">
          <Image
            src={MarloweIcon as string}
            alt="Marlowe"
            height={ICON_SIZES.XL}
          />
          <div
            className="flex items-center justify-items-center gap-6 md:grid md:grid-cols-5 lg:gap-3"
            dir="rtl"
          >
            {socialMediaLinks.map((social) => (
              <a
                href={social.href}
                target="_blank"
                key={social.alt}
                className="block cursor-pointer hover:brightness-50"
              >
                <Image
                  src={social.logo}
                  alt={social.alt}
                  height={ICON_SIZES.M}
                  width={ICON_SIZES.M}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center">
        &copy; 2024 Input Output Global, Inc. All Rights Reserved.
      </div>
    </footer>
  );
};
