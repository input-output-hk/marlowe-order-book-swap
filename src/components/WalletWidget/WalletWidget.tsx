import Image from "next/image";
import { useRouter } from "next/router";
import CheckIcon from "public/check.svg";
import CopyIcon from "public/copy.svg";
import DisconnectIcon from "public/disconnect.svg";
import { useEffect, useState } from "react";
import { useCardano } from "use-cardano";
import { ICON_SIZES, getBalance, type IWalletInStorage } from "~/utils";

export const WalletWidget = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState(BigInt(0));

  const router = useRouter();
  const {
    account,
    walletProvider,
    availableProviders,
    setWalletProvider,
    setAccount,
    lucid,
  } = useCardano();

  useEffect(() => {
    const walletInfo = window.localStorage.getItem("walletInfo");

    if (walletInfo !== "{}" && walletInfo !== null) {
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
    const walletBalance = async () => {
      if (lucid) {
        const balance = await getBalance(lucid);
        setBalance(balance.lovelace!);
      }
    };

    void walletBalance();
  }, [lucid]);

  const getWalletIcon = () => {
    const prov = availableProviders.find((prov) => {
      if (prov.key === walletProvider) {
        return prov;
      }
    });

    return prov ? prov.icon : "";
  };

  const changeOpen = () => {
    setOpen(!open);
  };

  const disconnectWallet = () => {
    window.localStorage.setItem("walletInfo", "{}");
    setWalletProvider(undefined);
    setAccount({ address: undefined, rewardAddress: undefined });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(account.address!).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
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
    <div className="flex h-8 items-end">
      {account.address && (
        <div className="flex cursor-pointer items-center gap-3">
          <div
            onClick={changeOpen}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-m-light-purple bg-m-light-purple px-2 py-1"
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
            <div onClick={copyToClipboard}>
              <abbr title="Copy Address">
                <Image
                  src={CopyIcon as string}
                  alt={"Copy"}
                  width={ICON_SIZES.M}
                  height={ICON_SIZES.M}
                />
              </abbr>
            </div>
          )}
        </div>
      )}
      {open && (
        <div
          className="fixed inset-0 z-50 flex h-full items-center bg-gray-600 bg-opacity-50"
          onClick={changeOpen}
        >
          <div
            className="absolute right-5 top-5 flex cursor-pointer items-center gap-2 rounded-md border bg-white p-2 sm:right-10 sm:top-8 sm:px-4 md:right-11 md:gap-4 md:px-6 lg:right-32 "
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
  );
};
