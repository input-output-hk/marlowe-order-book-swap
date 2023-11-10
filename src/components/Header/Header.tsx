import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";
import { ICON_SIZES, PAGES } from "~/utils";
import { WalletWidget } from "../WalletWidget/WalletWidget";

interface HeaderProps {
  title: string;
  links: { displayText: string; href: string }[];
  homeLink?: string;
}

export const Header = ({
  title,
  links,
  homeLink = PAGES.HOME,
}: HeaderProps) => {
  return (
    <header className="px-10 py-5 sm:px-12 sm:py-8 md:px-20 lg:px-32">
      <div className="relative flex flex-wrap items-center justify-between gap-5">
        <a href={homeLink} className="flex items-center gap-2">
          <Image
            src={MarloweIcon as string}
            alt="Marlowe"
            height={ICON_SIZES.L}
          />
          <h1 className="text-3xl">{title}</h1>
        </a>

        <div className="flex gap-8">
          <ul className="flex gap-6 text-lg font-normal">
            {links.map((link) => (
              <a
                href={link.href}
                key={link.href}
                className="hover:text-m-purple"
              >
                <li>{link.displayText}</li>
              </a>
            ))}
          </ul>
          <WalletWidget />
        </div>
      </div>
    </header>
  );
};
