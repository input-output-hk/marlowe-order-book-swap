import Image from "next/image";
import { useRouter } from "next/router";
import CardanoIcon from "public/cardano.svg";
import { COLORS, PAGES } from "~/utils";
import { WALLETS, walletLogos } from "~/utils/wallets";
import { Button, SIZE } from "../Button/Button";

export const WalletSelect = () => {
  const router = useRouter();

  const handleWalletSelect = (wallet: string) => async () => {
    window.localStorage.setItem("wallet", wallet);
    await router.push(PAGES.LISTING);
  };

  return (
    <div className="flex w-full flex-col justify-center rounded-lg p-8 shadow-container md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
      <p className="pb-2 text-2xl font-bold lg:text-3xl">Choose a wallet</p>
      <p className="text-base text-m-disabled lg:text-lg">
        Please select a wallet to deploy a contract
      </p>

      <div className="flex flex-col gap-2 py-8">
        {Object.entries(WALLETS).map(([_key, value]) => (
          <div
            key={value}
            className="flex items-center justify-between gap-2 rounded-lg border p-4"
          >
            <div className="flex w-1/4 items-center gap-2">
              {walletLogos[value]}
              <div className="text-base font-bold">{value}</div>
            </div>
            <div className="w-1/2 sm:w-2/5 md:w-2/5 xl:w-1/3 2xl:min-w-min 2xl:max-w-min">
              <Button
                size={SIZE.SMALL}
                color={COLORS.BLUE}
                onClick={handleWalletSelect(value)}
              >
                <div className="flex items-center justify-center gap-4">
                  <Image src={CardanoIcon as string} alt={"C"} height={20} />
                  <p className="font-normal text-black">Cardano</p>
                </div>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
