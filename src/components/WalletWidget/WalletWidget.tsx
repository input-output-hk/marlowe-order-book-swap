import Image from "next/image";
import { useRouter } from "next/router";
import ConnectIcon from "public/connect.svg";
import DisconnectIcon from "public/disconnect.svg";
import { useEffect, useState } from "react";
import { useCardano } from "use-cardano";
import { COLORS, ICON_SIZES, getBalance, type IWalletInStorage } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import { Loading } from "../Loading/Loading";
import { WalletSelect } from "../WalletSelect/WalletSelect";
import { AddressBalance } from "./AddressBalance";

export const WalletWidget = () => {
  const [open, setOpen] = useState(false);
  const [openWalletSelect, setOpenWalletSelect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<undefined | bigint>(undefined);

  const router = useRouter();
  const { account, setWalletProvider, setAccount, lucid } = useCardano();

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
    if (!walletInfo || (account.address && balance)) {
      setLoading(false);
    }

    const walletBalance = async () => {
      if (lucid) {
        const balance = await getBalance(lucid);
        setBalance(balance.lovelace);
      }
    };

    void walletBalance();
  }, [setAccount, setWalletProvider, account.address, balance, lucid]);

  const changeOpen = () => {
    setOpen(!open);
  };

  const changeOpenWalletSelect = () => {
    setOpenWalletSelect(!openWalletSelect);
  };

  const disconnectWallet = () => {
    window.localStorage.setItem("walletInfo", "");
    setWalletProvider(undefined);
    setAccount({ address: undefined, rewardAddress: undefined });
    router.reload();
  };

  const isHomePage = router.pathname === "/";

  return (
    <div className="relative flex h-8">
      {account.address && balance ? (
        <AddressBalance balance={balance} changeOpen={changeOpen} />
      ) : (
        !isHomePage &&
        (loading ? (
          <div className="flex items-end">
            <Loading sizeDesktop={ICON_SIZES.XS} sizeMobile={ICON_SIZES.XS} />
          </div>
        ) : (
          <div className="flex h-12 items-center">
            <Button
              color={COLORS.DARK_GRAY}
              size={SIZE.XSMALL}
              onClick={changeOpenWalletSelect}
              className="flex items-center gap-1"
            >
              Connect <span className="hidden md:block">Wallet</span>
              <Image src={ConnectIcon as string} alt="" height={ICON_SIZES.S} />
            </Button>
          </div>
        ))
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
      {openWalletSelect && (
        <WalletSelect isModal closeModal={changeOpenWalletSelect} />
      )}
    </div>
  );
};
