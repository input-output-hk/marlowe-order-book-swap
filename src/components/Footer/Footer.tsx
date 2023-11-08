import Image from "next/image";
import { ICON_SIZES } from "~/utils";
import { footerLinks, socialMediaLinks } from "./utils";

export const Footer = () => {
  return (
    <footer className="px-10 py-5 sm:px-12 sm:py-8 md:px-20 lg:px-32">
      <hr className="pb-6" />
      <div className="flex flex-col justify-between gap-8 px-4 md:flex-row md:gap-14">
        <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-8 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:grid-rows-1 lg:gap-14">
          {footerLinks.map((footerLink) => {
            return (
              <div key={footerLink.title}>
                <b>{footerLink.title}</b>
                {footerLink.links.map((link) => (
                  <a
                    href={link.href}
                    target="_blank"
                    className="block"
                    key={link.text}
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            );
          })}
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-4 md:w-1/2 md:items-end md:gap-0 lg:w-1/3">
          <div className="flex gap-6">
            {socialMediaLinks.map((social) => (
              <a
                href={social.href}
                target="_blank"
                key={social.alt}
                className="cursor-pointer hover:brightness-50"
              >
                <Image
                  src={social.logo}
                  alt={social.alt}
                  height={ICON_SIZES.M}
                  width={ICON_SIZES.M}
                  className={social.alt !== "X" ? "h-auto w-auto" : ""}
                />
              </a>
            ))}
          </div>
          <div className="text-center md:text-right">
            &copy; 2023 Input Output Global, Inc. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
