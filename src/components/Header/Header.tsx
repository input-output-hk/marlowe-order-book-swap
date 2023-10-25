import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import DisconnectIcon from "~/../public/disconnect.svg";
import MarloweIcon from "~/../public/marlowe-logo.svg";
import LogoIcon from "~/../public/marlowe.svg";
import NamiIcon from "~/../public/nami.svg";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [showAddr, setShowAddr] = useState(true);
  const { pathname } = useRouter();
  const addr = "addr_test1qp8rc...";

  const changeOpen = () => {
    setOpen(!open);
  };

  const disconnectWallet = () => {
    // TODO: Change to go to initial page
    setShowAddr(false);
  };

  const isHome = pathname === "/";

  return (
    <header className="px-10 py-5 sm:px-12 sm:py-8 md:px-20 lg:px-32">
      <div className="relative flex flex-wrap items-center justify-between gap-5">
        <Image
          src={MarloweIcon as string}
          alt="Marlowe"
          width={150}
          className="hidden sm:block"
        />
        <Image
          src={LogoIcon as string}
          alt="Marlowe"
          width={30}
          className="block sm:hidden"
        />
        {showAddr ? (
          <div className="flex cursor-pointer gap-5" onClick={changeOpen}>
            <Image src={NamiIcon as string} alt="N" width={30} />
            <div className="hidden sm:block">{addr}</div>
          </div>
        ) : !isHome ? (
          <div>Select a Wallet</div>
        ) : null}
        {open && (
          <div
            className="fixed inset-0 flex h-full items-center bg-gray-600 bg-opacity-50"
            onClick={changeOpen}
          >
            <div
              className="absolute right-5 top-5 z-10 flex cursor-pointer items-center gap-3 rounded-md border bg-white p-2 sm:right-24 sm:top-10"
              onClick={disconnectWallet}
            >
              Disconnect Wallet
              <Image src={DisconnectIcon as string} alt="Marlowe" width={30} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
