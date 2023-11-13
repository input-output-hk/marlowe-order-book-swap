import Image from "next/image";
import CheckIcon from "public/check.svg";
import CopyIcon from "public/copy.svg";
import DisconnectIcon from "public/disconnect.svg";
import { useState } from "react";
import { useCardano } from "use-cardano";
import { ICON_SIZES } from "~/utils";

interface AddressBalanceProps {
  balance: bigint;
  changeOpen: () => void;
}

export const AddressBalance = ({
  balance,
  changeOpen,
}: AddressBalanceProps) => {
  const [copied, setCopied] = useState(false);
  const { account, availableProviders, walletProvider } = useCardano();

  const getWalletIcon = () => {
    const prov = availableProviders.find((prov) => {
      if (prov.key === walletProvider) {
        return prov;
      }
    });

    return prov ? prov.icon : "";
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(account.address!).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3500);
      });
    } catch (err) {
      console.error("Failed to copy address: ", err);
    }
  };

  const balanceInt = Math.floor(Number(balance) / 1e6);

  const balanceDecimals = ((Number(balance) / 1e6) % 1)
    .toFixed(6)
    .toString()
    .slice(2);

  return (
    <div className="flex h-12 items-center gap-3 align-middle">
      <div className="flex cursor-default items-center gap-2 rounded-md border border-m-light-purple bg-m-light-purple px-2 py-1">
        {getWalletIcon() && (
          <Image
            src={getWalletIcon()}
            alt="wallet"
            width={ICON_SIZES.M}
            height={ICON_SIZES.M}
            priority
          />
        )}
        <div className="hidden sm:block">
          {balanceInt}.<span className="text-xs">{balanceDecimals}</span>
          &nbsp;
          <b>t₳</b>
        </div>
      </div>
      {copied ? (
        <div className="animate-bounce">
          <abbr title="Copied!">
            <Image
              src={CheckIcon as string}
              alt="✓"
              width={ICON_SIZES.M}
              height={ICON_SIZES.M}
            />
          </abbr>
        </div>
      ) : (
        <div onClick={copyToClipboard} className="cursor-pointer">
          <abbr title="Copy Address">
            <Image
              src={CopyIcon as string}
              alt="Copy"
              width={ICON_SIZES.M}
              height={ICON_SIZES.M}
            />
          </abbr>
        </div>
      )}
      <div onClick={changeOpen} className="cursor-pointer">
        <Image src={DisconnectIcon as string} alt="" height={ICON_SIZES.M} />
      </div>
    </div>
  );
};
