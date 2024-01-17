import { getInstalledWalletExtensions } from "@marlowe.io/wallet";
import {
  type BroswerWalletExtension,
  type SupportedWalletName,
} from "@marlowe.io/wallet/browser";
import Image from "next/image";
import { useRouter } from "next/router";
import CardanoIcon from "public/cardano.svg";
import InfoIcon from "public/info.svg";
import { useContext, useEffect, useState } from "react";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { env } from "~/env.mjs";
import { COLORS, ICON_SIZES, PAGES } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import { Loading } from "../Loading/Loading";
import { WalletsSupported } from "./WalletSupported";

export const WalletSelect = () => {
  const [openInfo, setOpenInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [walletName, setWalletName] = useState<SupportedWalletName | undefined>(
    undefined,
  );
  const [availableProviders, setAvailableProviders] = useState<
    BroswerWalletExtension[]
  >([]);
  const { setRuntime, runtimeLifecycle } = useContext(TSSDKContext);
  const router = useRouter();

  useEffect(() => {
    const walletsInstalled = getInstalledWalletExtensions();
    setAvailableProviders(walletsInstalled);
    setLoading(false);
  }, []);

  useEffect(() => {
    void getWalletAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimeLifecycle]);

  const getWalletAddress = async () => {
    const walletAddress = await runtimeLifecycle?.wallet.getChangeAddress();
    if (walletAddress !== undefined) {
      window.localStorage.setItem(
        "walletInfo",
        JSON.stringify({
          address: walletAddress,
          walletProvider: walletName,
        }),
      );

      void router.push({ pathname: PAGES.HOME, query: { page: 1 } });
    }
  };

  const handleSelectWallet = (walletName: SupportedWalletName) => async () => {
    if (setRuntime) {
      setWalletName(walletName);
      await setRuntime({
        runtimeURL: env.NEXT_PUBLIC_RUNTIME_URL,
        walletName,
      });

      setLoading(true);
    }
  };

  const toggleInfo = () => setOpenInfo((prev) => !prev);

  if (loading) {
    return (
      <div className="flex flex-grow items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (availableProviders.length === 0) {
    return (
      <div className="my-16 flex w-full flex-col justify-center rounded-lg p-8 shadow-container md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
        <p className="pb-2 text-2xl font-bold lg:text-3xl">No wallet found</p>
        <div className="flex flex-col gap-4">
          <p className="text-base text-m-disabled lg:text-lg">
            Please install a wallet to deploy a contract
          </p>
          <WalletsSupported />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col justify-center rounded-lg p-8 shadow-container md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
      <div className="flex items-center gap-3">
        <p className="pb-2 text-2xl font-bold lg:text-3xl">Choose a wallet</p>
        <div className="relative">
          <Image
            src={InfoIcon as string}
            alt="i"
            height={ICON_SIZES.L}
            onClick={toggleInfo}
            className="cursor-pointer pb-1"
          />
          {openInfo && (
            <div className="absolute right-0 top-8 w-48 rounded-lg bg-white px-4 py-2 shadow-container sm:left-0 lg:w-56">
              <WalletsSupported />
            </div>
          )}
        </div>
      </div>
      <p className="text-base text-m-disabled lg:text-lg">
        Please select a wallet to deploy a contract
      </p>

      <div className="flex flex-col gap-2 py-8">
        {availableProviders.sort().map((wallet) => {
          return (
            <div
              key={wallet.name}
              className="flex items-center justify-between gap-2 rounded-lg border p-4"
            >
              <div className="flex w-1/4 items-center gap-2">
                <Image
                  src={wallet.icon}
                  alt={wallet.name}
                  height={ICON_SIZES.L}
                  width={ICON_SIZES.L}
                />
                <p className="text-base font-bold capitalize">{wallet.name}</p>
              </div>
              <div className="w-1/2 sm:w-2/5 md:w-2/5 xl:w-1/3 2xl:min-w-min 2xl:max-w-min">
                <Button
                  size={SIZE.SMALL}
                  color={COLORS.BLUE}
                  onClick={handleSelectWallet(
                    wallet.name as SupportedWalletName,
                  )}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Image
                      src={CardanoIcon as string}
                      alt={"C"}
                      height={ICON_SIZES.XS}
                    />
                    <p className="font-normal text-black">Cardano</p>
                  </div>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
