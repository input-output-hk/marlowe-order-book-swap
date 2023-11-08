import { type Assets } from "lucid-cardano";
import Image from "next/image";
import Link from "next/link";
import CrossIcon from "public/cancel.svg";
import CheckIcon from "public/check.svg";
import DownArrowIcon from "public/down_arrow.svg";
import { useEffect, useState } from "react";
import { useCardano } from "use-cardano";
import {
  COLORS,
  ICON_SIZES,
  PAGES,
  getBalance,
  isEnoughBalance,
} from "~/utils";
import { Button, SIZE } from "../Button/Button";
import { DropDown } from "../DropDown/DropDown";
import { Input } from "../Input/Input";
import { Loading } from "../Loading/Loading";
import { Modal } from "../Modal/Modal";
import { type ModalProps } from "./interface";

export const SwapModal = ({ open, setOpen, offer, receive }: ModalProps) => {
  const [balance, setBalance] = useState<Assets>({});
  const { walletApi, lucid, account } = useCardano();
  const { address } = account;

  useEffect(() => {
    const getBalanceFromWallet = async () => {
      if (walletApi && lucid) {
        const walletFromLucid = lucid.selectWallet(walletApi);
        const balanceFromWallet = await getBalance(walletFromLucid);
        setBalance(balanceFromWallet);
      }
    };

    getBalanceFromWallet().catch((err) => console.log(err));
  }, [lucid, walletApi]);

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} setOpen={setOpen} title="Swap Offer">
      {Object.keys(balance).length === 0 ? (
        <div className="flex flex-grow items-center justify-center py-8">
          <Loading sizeDesktop={ICON_SIZES.XL} sizeMobile={ICON_SIZES.L} />
        </div>
      ) : (
        <div className="flex w-full flex-col items-center text-m-disabled">
          <div className="flex w-full flex-col items-center justify-center gap-5 align-middle">
            <div className="flex w-full flex-col content-start items-start gap-2">
              <Input
                label="You will swap"
                type="number"
                disabled
                placeholder={offer.amount.toString()}
                endContent={
                  <DropDown
                    options={[{ option: offer.token, icon: offer.icon }]}
                    disabled
                  />
                }
                className="py-4"
              />
              {isEnoughBalance(balance, receive) ? (
                <div className="flex gap-2 pb-11 text-sm text-m-green">
                  <Image
                    src={CheckIcon as string}
                    height={ICON_SIZES.S}
                    alt="✓"
                  />
                  You have sufficient funds in your wallet
                </div>
              ) : (
                <div className="flex gap-2 pb-11 text-sm text-m-red">
                  <Image
                    src={CrossIcon as string}
                    height={ICON_SIZES.S}
                    alt="✗"
                  />
                  Insufficient funds,
                  <div className="font-medium underline">
                    add tokens to wallet
                  </div>
                </div>
              )}
              <hr className="h-1 w-full " />
              <Input
                label="You will receive"
                type="number"
                disabled
                placeholder={receive.amount.toString()}
                endContent={
                  <DropDown
                    options={[{ option: receive.token, icon: receive.icon }]}
                    disabled
                  />
                }
                className="py-4"
              />
            </div>
            <div className="flex w-full flex-col content-start items-start gap-4">
              <div className="flex items-center gap-2 align-middle text-lg font-medium">
                <Image
                  src={DownArrowIcon as string}
                  height={ICON_SIZES.M}
                  alt="↓"
                />
                Transferred to
              </div>
              <div className="flex w-full flex-col gap-2 text-sm font-normal ">
                Your wallet address
                <div className="break-words rounded-lg border border-m-light-blue bg-m-light-blue px-5 py-3 font-semibold text-black">
                  {address}
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col justify-end gap-5 pt-5 text-sm sm:flex-row">
              <div>
                <Button
                  size={SIZE.SMALL}
                  color={COLORS.BLACK}
                  onClick={closeModal}
                >
                  Cancel
                </Button>
              </div>
              <Link href={PAGES.COMPLETE}>
                <Button
                  size={SIZE.SMALL}
                  disabled={!isEnoughBalance(balance, receive)}
                  filled
                >
                  Confirm Swap
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
