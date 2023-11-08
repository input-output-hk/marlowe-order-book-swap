import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCardano } from "use-cardano";
import CheckIcon from "~/../public/check.svg";
import CopyIcon from "~/../public/copy.svg";
import DisconnectIcon from "~/../public/disconnect.svg";
import MarloweIcon from "~/../public/marlowe-logo.svg";
import LogoIcon from "~/../public/marlowe.svg";
import { ICON_SIZES, PAGES, getBalance, type IWalletInStorage } from "~/utils";
import { Loading } from "../Loading/Loading";

export const Header = () => {
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

    if (walletInfo === "{}" || walletInfo === null) {
      void router.push(PAGES.HOME);
    } else {
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
    window.localStorage.removeItem("walletInfo");
    setWalletProvider(undefined);
    setAccount({ address: undefined, rewardAddress: undefined });
    void router.push(PAGES.HOME);
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
    <header className="px-10 py-5 sm:px-12 sm:py-8 md:px-20 lg:px-32">
      <div className="relative flex flex-wrap items-center justify-between gap-5">
        <Link href={PAGES.LISTING} className="hidden sm:block">
          <Image
            src={MarloweIcon as string}
            alt="Marlowe"
            height={ICON_SIZES.L}
            priority
          />
        </Link>
        <Link href={PAGES.LISTING} className="block sm:hidden">
          <Image
            src={LogoIcon as string}
            alt="M"
            height={ICON_SIZES.L}
            className="h-auto w-auto"
          />
        </Link>
        {account.address ? (
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
        ) : (
          router.pathname !== PAGES.HOME && (
            <Loading sizeDesktop={ICON_SIZES.M} sizeMobile={ICON_SIZES.M} />
          )
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
    </header>
  );
};
