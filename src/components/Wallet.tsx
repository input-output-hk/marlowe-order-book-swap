import Image from "next/image";
import { useRouter } from "next/router";
import CardanoIcon from "public/cardano.svg";
import { useEffect } from "react";
import { useCardano, type WalletProvider } from "use-cardano";
import { COLORS, ICON_SIZES, PAGES } from "~/utils";
import { Button, SIZE } from "./Button/Button";

export const Wallet = () => {
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
    setAccountLoaded(account.address !== undefined);

    if (accountLoaded) {
      window.localStorage.setItem(
        "walletInfo",
        JSON.stringify({
          address: account.address,
          rewardAddress: account.rewardAddress,
          walletProvider: walletProvider,
        }),
      );

      void router.push(PAGES.LISTING);
    }
  }, [
    account.address,
    account.rewardAddress,
    accountLoaded,
    router,
    setAccountLoaded,
    walletProvider,
  ]);

  const handleSelectWallet = (provider: string) => () => {
    setWalletProvider(provider.toLowerCase() as WalletProvider);
  };

  return (
    <div className="flex w-full flex-col justify-center rounded-lg p-8 shadow-container md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
      <p className="pb-2 text-2xl font-bold lg:text-3xl">Choose a wallet</p>
      <p className="text-base text-m-disabled lg:text-lg">
        Please select a wallet to deploy a contract
      </p>

      <div className="flex flex-col gap-2 py-8">
        {availableProviders.length > 0 &&
          availableProviders.map((prov) => {
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
                    <div className="flex items-center justify-center gap-4">
                      <Image
                        src={CardanoIcon as string}
                        alt={"C"}
                        height={ICON_SIZES.M}
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
