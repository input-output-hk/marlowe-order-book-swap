import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DisconnectIcon from "~/../public/disconnect.svg";
import MarloweIcon from "~/../public/marlowe-logo.svg";
import LogoIcon from "~/../public/marlowe.svg";
import { ICON_SIZES, PAGES } from "~/utils";
import { WALLETS, walletLogos } from "~/utils/wallets";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [wallet, setWallet] = useState<WALLETS | undefined>(undefined);
  const { push } = useRouter();
  const addr = "addr_test1qp8rc...";

  useEffect(() => {
    const getWallet = async () => {
      const wallet = window.localStorage.getItem("wallet");
      if (wallet && Object.values(WALLETS).includes(wallet as WALLETS)) {
        setWallet(wallet as WALLETS);
      } else {
        await push(PAGES.HOME);
      }
    };

    getWallet().catch((e) => console.error(e));
  }, [push]);

  const changeOpen = () => {
    setOpen(!open);
  };

  const disconnectWallet = async () => {
    setWallet(undefined);
    window.localStorage.removeItem("wallet");
    await push(PAGES.HOME);
  };

  return (
    <header className="px-10 py-5 sm:px-12 sm:py-8 md:px-20 lg:px-32">
      <div className="relative flex flex-wrap items-center justify-between gap-5">
        <Link href={PAGES.LISTING} className="hidden sm:block">
          <Image
            src={MarloweIcon as string}
            alt="Marlowe"
            height={ICON_SIZES.L}
          />
        </Link>
        <Link href={PAGES.LISTING} className="block sm:hidden">
          <Image src={LogoIcon as string} alt="M" height={ICON_SIZES.L} />
        </Link>
        {wallet && (
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={changeOpen}
          >
            {walletLogos[wallet]}
            <div className="hidden sm:block">{addr}</div>
          </div>
        )}
        {open && (
          <div
            className="fixed inset-0 z-50 flex h-full items-center bg-gray-600 bg-opacity-50"
            onClick={changeOpen}
          >
            <div
              className="absolute right-5 top-5  flex cursor-pointer items-center gap-10 rounded-md border bg-white p-2 sm:right-10 sm:top-8 md:right-20 lg:right-24"
              onClick={disconnectWallet}
            >
              Disconnect Wallet
              <Image
                src={DisconnectIcon as string}
                alt=""
                height={ICON_SIZES.L}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
