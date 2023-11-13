import Image from "next/image";
import { useRouter } from "next/router";
import CardanoIcon from "public/cardano.svg";
import CloseIcon from "public/close.svg";
import InfoIcon from "public/info.svg";
import { useEffect, useState } from "react";
import { useCardano, type WalletProvider } from "use-cardano";
import { COLORS, ICON_SIZES, PAGES } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import { Loading } from "../Loading/Loading";
import { WalletsSupported } from "./WalletSupported";

interface WalletSelectProps {
  isModal?: boolean;
  closeModal?: () => void;
}

export const WalletSelect = ({ isModal, closeModal }: WalletSelectProps) => {
  const [openInfo, setOpenInfo] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const {
    account,
    availableProviders,
    accountLoaded,
    walletProvider,
    setWalletProvider,
    setAccountLoaded,
  } = useCardano();

  useEffect(() => {
    const walletInfo = window.localStorage.getItem("walletInfo");
    if (!walletInfo || walletInfo === "{}") {
      setLoading(false);
    }

    setAccountLoaded(account.address !== undefined || !!walletInfo);
    if (accountLoaded && account.address && walletProvider) {
      window.localStorage.setItem(
        "walletInfo",
        JSON.stringify({
          address: account.address,
          rewardAddress: account.rewardAddress,
          walletProvider: walletProvider,
        }),
      );
      void router.push(PAGES.LISTING).then(() => closeModal && closeModal());
    }
  }, [
    account.address,
    account.rewardAddress,
    accountLoaded,
    router,
    setAccountLoaded,
    walletProvider,
    closeModal,
  ]);

  const handleSelectWallet = (provider: string) => () => {
    setWalletProvider(provider.toLowerCase() as WalletProvider);
  };

  const toggleInfo = () => setOpenInfo((prev) => !prev);

  if (loading) {
    return (
      <div className="flex flex-grow items-center justify-center">
        <Loading />
      </div>
    );
  }

  const wrapperClass = isModal ? "fixed inset-0 z-50 bg-gray-600/50 " : "";

  if (availableProviders.length === 0) {
    return (
      <div
        className={
          wrapperClass + "flex w-full flex-col items-center justify-center"
        }
      >
        <div className="my-16 rounded-lg bg-white p-8 shadow-container md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
          <div className="flex justify-between">
            <p className="pb-2 text-2xl font-bold lg:text-3xl">
              No wallet found
            </p>
            {isModal && (
              <Image
                src={CloseIcon as string}
                alt="i"
                height={ICON_SIZES.L}
                onClick={closeModal}
                className="cursor-pointer pb-1"
              />
            )}
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-base text-m-disabled lg:text-lg">
              Please install a wallet to deploy a contract
            </p>
            <WalletsSupported />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        wrapperClass + "flex w-full flex-col items-center justify-center"
      }
    >
      <div className="rounded-lg bg-white p-8 shadow-container md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <p className="pb-2 text-2xl font-bold lg:text-3xl">
              Choose a wallet
            </p>

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
          {isModal && (
            <Image
              src={CloseIcon as string}
              alt="i"
              height={ICON_SIZES.L}
              onClick={closeModal}
              className="cursor-pointer pb-1"
            />
          )}
        </div>
        <p className="text-base text-m-disabled lg:text-lg">
          Please select a wallet to deploy a contract
        </p>

        <div className="flex flex-col gap-2 py-8">
          {availableProviders.map((prov) => {
            return (
              <div
                key={prov.key}
                className="flex items-center justify-between gap-2 rounded-lg border p-4"
              >
                <div className="flex w-1/4 items-center gap-2">
                  <Image
                    src={prov.icon}
                    alt={prov.name}
                    height={ICON_SIZES.L}
                    width={ICON_SIZES.L}
                  />
                  <p className="text-base font-bold">{prov.name}</p>
                </div>
                <div className="w-1/2 sm:w-2/5 md:w-2/5 xl:w-1/3 2xl:min-w-min 2xl:max-w-min">
                  <Button
                    size={SIZE.SMALL}
                    color={COLORS.BLUE}
                    onClick={handleSelectWallet(prov.key)}
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
    </div>
  );
};
