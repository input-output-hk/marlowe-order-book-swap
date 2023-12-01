import Image from "next/image";
import { useRouter } from "next/router";
import ConnectIcon from "public/connect.svg";
import { useEffect, useState } from "react";
import { useCardano, type WalletProvider } from "use-cardano";
import { COLORS, ICON_SIZES, PAGES, type IWalletInStorage } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import { Loading } from "../Loading/Loading";
import { Balance } from "./Balance";
import { CopyButton } from "./CopyButton";
import { DisconnectButton } from "./DisconnectButton";

export const WalletWidget = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    account,
    accountLoaded,
    walletProvider,
    availableProviders,
    setWalletProvider,
    setAccountLoaded,
    setAccount,
  } = useCardano();
  const router = useRouter();

  useEffect(() => {
    const walletInfo = window.localStorage.getItem("walletInfo");

    if (walletInfo) {
      const walletInfoParsed = JSON.parse(walletInfo) as IWalletInStorage;

      setAccount({
        address: walletInfoParsed.address,
        rewardAddress: walletInfoParsed.rewardAddress,
      });
      setWalletProvider(walletInfoParsed.walletProvider);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAccount, setWalletProvider]);

  useEffect(() => {
    setAccountLoaded(account.address !== undefined);
    setLoading(!accountLoaded && walletProvider !== undefined);

    if (account.address) {
      window.localStorage.setItem(
        "walletInfo",
        JSON.stringify({
          address: account.address,
          rewardAddress: account.rewardAddress,
          walletProvider: walletProvider,
        }),
      );
      setOpen(false);
    }
  }, [
    account.address,
    account.rewardAddress,
    walletProvider,
    accountLoaded,
    setAccountLoaded,
  ]);

  const toggleOpenConnect = () => {
    if (!availableProviders.length) {
      void router.push(PAGES.HOME);
    } else {
      setOpen(!open);
    }
  };

  const getWalletIcon = () => {
    const prov = availableProviders.find((prov) => {
      if (prov.key === walletProvider) {
        return prov;
      }
    });

    return prov ? prov.icon : "";
  };

  const connectWallet = (provider: string) => () => {
    setWalletProvider(provider.toLowerCase() as WalletProvider);
  };

  if (loading) {
    return (
      <div className="flex flex-grow items-center justify-center py-1">
        <Loading sizeDesktop={ICON_SIZES.S} sizeMobile={ICON_SIZES.XS} />
      </div>
    );
  }

  if (router.pathname === PAGES.HOME) {
    return null;
  }

  return (
    <div className="relative flex h-8 items-center">
      {account.address ? (
        <div className="flex cursor-pointer items-center gap-1">
          <div
            onClick={toggleOpenConnect}
            className="flex items-center justify-center gap-2 rounded-md border border-m-light-purple bg-m-light-purple px-6 py-1"
          >
            {getWalletIcon() && (
              <Image
                src={getWalletIcon()}
                alt={"wallet"}
                width={ICON_SIZES.M}
                height={ICON_SIZES.M}
                priority
              />
            )}
            <Balance />
          </div>

          <div className="flex w-16 items-center justify-center gap-2">
            <CopyButton text={account.address} />
            <DisconnectButton />
          </div>
        </div>
      ) : (
        <div className="relative w-32 md:w-44">
          <Button
            color={COLORS.BLACK}
            size={SIZE.XSMALL}
            className="flex items-center justify-center gap-1"
            onClick={toggleOpenConnect}
          >
            Connect <span className="hidden md:block">Wallet</span>
            <Image src={ConnectIcon as string} alt="" height={ICON_SIZES.S} />
          </Button>
        </div>
      )}

      {open && (
        <div className="absolute top-9 z-10 w-32 border border-m-purple/10 bg-m-light-purple md:w-44">
          {availableProviders.sort().map((prov) => (
            <div
              key={prov.key}
              className="flex cursor-pointer items-center justify-center gap-1 px-3 py-2 hover:bg-m-purple/10"
              onClick={connectWallet(prov.key)}
            >
              <Image
                src={prov.icon}
                alt={prov.name}
                width={ICON_SIZES.M}
                height={ICON_SIZES.M}
              />
              <p className="text-sm capitalize md:text-base">{prov.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
