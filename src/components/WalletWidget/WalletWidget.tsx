import { getInstalledWalletExtensions } from "@marlowe.io/wallet";
import {
  SupportedWalletName,
  type BroswerWalletExtension,
} from "@marlowe.io/wallet/browser";
import Image from "next/image";
import { useRouter } from "next/router";
import ConnectIcon from "public/connect.svg";
import { useContext, useEffect, useState } from "react";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { env } from "~/env.mjs";
import { COLORS, ICON_SIZES, PAGES, type IWalletInStorage } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import { Loading } from "../Loading/Loading";
import { Balance } from "./Balance";
import { CopyButton } from "./CopyButton";
import { DisconnectButton } from "./DisconnectButton";

export const WalletWidget = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [walletSelected, setWalletSelected] = useState<
    BroswerWalletExtension | undefined
  >(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);

  const router = useRouter();
  const { setRuntime, runtimeLifecycle } = useContext(TSSDKContext);

  useEffect(() => {
    const walletInfo = window.localStorage.getItem("walletInfo");

    if (walletInfo) {
      setLoading(true);
      const { walletProvider, address } = JSON.parse(
        walletInfo,
      ) as IWalletInStorage;

      setAddress(address);
      const currentWallet = getInstalledWalletExtensions().filter(
        (wallet) => wallet.name === walletProvider,
      );

      if (currentWallet.length) {
        setWalletSelected(currentWallet[0]);
      }
    }
    setLoading(false);
  }, []);

  const toggleOpenConnect = () => {
    if (!getInstalledWalletExtensions().length) {
      void router.push(PAGES.HOME);
    } else {
      setOpen(!open);
    }
  };

  const connectWallet = (walletName: SupportedWalletName) => async () => {
    if (setRuntime) {
      await setRuntime({
        runtimeURL: env.NEXT_PUBLIC_RUNTIME_URL,
        walletName: walletName,
      });

      const walletAddress = await runtimeLifecycle?.wallet.getChangeAddress();
      if (walletAddress !== undefined) {
        window.localStorage.setItem(
          "walletInfo",
          JSON.stringify({
            address: walletAddress,
            walletProvider: walletName,
          }),
        );

        void router.reload();
      }
    }
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
      {address ? (
        <div className="flex cursor-pointer items-center gap-1">
          <div
            onClick={toggleOpenConnect}
            className="flex items-center justify-center gap-2 rounded-md border border-m-light-purple bg-m-light-purple px-6 py-1"
          >
            {walletSelected?.icon && (
              <Image
                src={walletSelected.icon}
                alt={"wallet"}
                width={ICON_SIZES.M}
                height={ICON_SIZES.M}
                priority
              />
            )}
            <Balance />
          </div>

          <div className="flex w-16 items-center justify-center gap-2">
            <CopyButton text={address} />
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
          {getInstalledWalletExtensions()
            .sort()
            .map((wallet) => (
              <div
                key={wallet.name}
                className="flex cursor-pointer items-center justify-center gap-1 px-3 py-2 hover:bg-m-purple/10"
                onClick={connectWallet(wallet.name as SupportedWalletName)}
              >
                <Image
                  src={wallet.icon}
                  alt={wallet.name}
                  width={ICON_SIZES.M}
                  height={ICON_SIZES.M}
                />
                <p className="text-sm capitalize md:text-base">{wallet.name}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
