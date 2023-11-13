import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import MarloweIcon from "public/marlowe.svg";
import MenuIcon from "public/menu.svg";
import { useState } from "react";
import { ICON_SIZES, PAGES, type ILink } from "~/utils";

interface HeaderProps {
  title: string;
  links: ILink[];
  homeLink?: string;
  className?: string;
  children?: React.ReactNode;
}

export const Header = ({
  title,
  links,
  homeLink = PAGES.HOME,
  children,
  className: customClassName,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useRouter();

  const styleForSelectedPage = (href: string) =>
    pathname === href ? "text-m-purple font-bold" : "";

  const openMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <header
      className={`px-4 py-5 md:px-12 lg:px-24 xl:px-32 ${customClassName}`}
    >
      <div className="relative flex flex-wrap items-center justify-between gap-5">
        <Link href={homeLink} className="flex items-center gap-2">
          <Image
            src={MarloweIcon as string}
            alt="Marlowe"
            height={ICON_SIZES.L}
            className="hidden md:block"
          />
          <Image
            src={MarloweIcon as string}
            alt="Marlowe"
            height={ICON_SIZES.M}
            className="block md:hidden"
          />
          <h1 className="text-lg md:text-2xl xl:text-3xl">{title}</h1>
        </Link>

        <div className="hidden gap-8 lg:flex lg:h-12">
          <ul className="flex h-full items-center gap-6 text-lg font-normal">
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className={`${styleForSelectedPage(
                  link.href,
                )} hover:text-m-purple`}
              >
                <li>{link.displayText}</li>
              </Link>
            ))}
          </ul>
          {children}
        </div>

        <div className="relative z-40 flex h-12 cursor-pointer items-start gap-4 lg:hidden">
          {children}
          <Image
            src={MenuIcon as string}
            height={ICON_SIZES.L}
            alt={"≣"}
            onClick={openMenu}
            className="h-full items-center "
          />
          {isMenuOpen && (
            <ul className="border-m-gray absolute right-0 top-8 flex h-min w-min flex-col gap-3 rounded-lg border bg-m-light-purple px-1 pb-1 pt-1">
              {links.map((link) => (
                <Link
                  href={link.href}
                  key={link.href}
                  className={`rounded-md px-14 py-2 hover:bg-m-purple hover:text-white ${styleForSelectedPage(
                    link.href,
                  )}`}
                >
                  <li>{link.displayText}</li>
                </Link>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};
