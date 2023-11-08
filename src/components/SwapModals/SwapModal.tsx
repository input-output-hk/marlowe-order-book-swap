import Image from "next/image";
import Link from "next/link";
import CrossIcon from "public/cancel.svg";
import CheckIcon from "public/check.svg";
import DownArrowIcon from "public/down_arrow.svg";
import { useEffect, useState } from "react";
import { useCardano } from "use-cardano";
import { COLORS, ICON_SIZES, PAGES } from "~/utils";
import { getTokenNames } from "~/utils/cardano";
import { Button, SIZE } from "../Button/Button";
import { DropDown } from "../DropDown/DropDown";
import { Input } from "../Input/Input";
import { Modal } from "../Modal/Modal";
import { type ModalProps } from "./interface";

export const SwapModal = ({ open, setOpen, offered, desired }: ModalProps) => {
  const [isEnough, setIsEnough] = useState<boolean | null>(null);
  const address = process.env.NEXT_PUBLIC_OWN_ADDRESS;
  const { walletApi, lucid } = useCardano();

  useEffect(() => {
    const tokenNames = async () => {
      if (walletApi && lucid) {
        const walletFromLucid = lucid?.selectWallet(walletApi);
        const tokensFromWallet = await getTokenNames(walletFromLucid);
        setIsEnough(
          Object.keys(tokensFromWallet).includes(desired.token) &&
            tokensFromWallet[desired.token]! >= desired.amount,
        );
      }
    };
    void tokenNames();
  }, [desired, lucid, walletApi]);

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} setOpen={setOpen} title="Swap Offer">
      <main className="flex w-full flex-col items-center text-m-disabled">
        <div className="flex w-full flex-col items-center justify-center gap-5 align-middle">
          <div className="flex w-full flex-col content-start items-start gap-2">
            <Input
              label="You will swap"
              type="number"
              disabled
              placeholder={desired.amount.toString()}
              endContent={
                <DropDown
                  options={[{ option: desired.token, icon: desired.icon }]}
                  disabled
                />
              }
              className="py-4"
            />
            {isEnough !== null &&
              (isEnough ? (
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
                  <p>
                    Insufficient funds,&nbsp;
                    <span className="p-0 font-medium underline">
                      add tokens to wallet
                    </span>
                  </p>
                </div>
              ))}
            <hr className="h-1 w-full " />
            <Input
              label="You will receive"
              type="number"
              disabled
              placeholder={offered.amount.toString()}
              endContent={
                <DropDown
                  options={[{ option: offered.token, icon: offered.icon }]}
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
              <Button size={SIZE.SMALL} disabled={!isEnough} filled>
                Confirm Swap
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </Modal>
  );
};
