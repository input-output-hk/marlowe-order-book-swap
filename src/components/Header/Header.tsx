import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCardano } from "use-cardano";
import DisconnectIcon from "~/../public/disconnect.svg";
import MarloweIcon from "~/../public/marlowe-logo.svg";
import LogoIcon from "~/../public/marlowe.svg";
import { ICON_SIZES, PAGES, truncateString } from "~/utils";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {
    account,
    walletProvider,
    availableProviders,
    accountLoaded,
    setWalletProvider,
    setAccount,
    setAccountLoaded,
  } = useCardano();

  useEffect(() => {
    // setAccountLoaded(account.address !== undefined);
    // if (accountLoaded) {
    //   void router.push(PAGES.LISTING);
    // }
    // if (!account.address) {
    //   void router.push(PAGES.HOME);
    // }
  }, [account, account.address, accountLoaded]);

  const getWalletIcon = () => {
    const prov = availableProviders.find((prov) => {
      if (prov.key === walletProvider) {
        return prov;
      }
    });

    if (prov) {
      return prov.icon;
    } else {
      return "";
    }
  };

  const changeOpen = () => {
    setOpen(!open);
  };

  const disconnectWallet = () => {
    setWalletProvider(undefined);
    setAccount({ address: undefined, rewardAddress: undefined });
    void router.push(PAGES.HOME);
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
        {account.address && walletProvider && (
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={changeOpen}
          >
            <Image
              src={getWalletIcon()}
              alt={"wallet"}
              width={ICON_SIZES.L}
              height={ICON_SIZES.L}
            />
            <div className="hidden sm:block">
              {truncateString(account.address, 14)}
            </div>
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
