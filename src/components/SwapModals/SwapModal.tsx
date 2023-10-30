import Image from "next/image";
import CrossIcon from "public/cancel.svg";
import CardanoIcon from "public/cardano.svg";
import CheckIcon from "public/check.svg";
import DownArrowIcon from "public/down_arrow.svg";
import MarloweIcon from "public/marlowe.svg";
import type { Dispatch, SetStateAction } from "react";
import { COLORS, ICON_SIZES, type ITokenAmount } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import { DropDown } from "../DropDown/DropDown";
import { Input } from "../Input/Input";
import { Modal } from "../Modal/Modal";

interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const SwapModal = ({ open, setOpen }: ModalProps) => {
  const offer: ITokenAmount = {
    token: "ADA",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.M} alt="C" />,
    amount: 12,
  };
  const receive: ITokenAmount = {
    token: "MRL",
    icon: <Image src={MarloweIcon as string} height={ICON_SIZES.M} alt="M" />,
    amount: 10,
  };
  const isEnough = true;
  const address =
    "addr_test5ar6f7hwk4fg281xasahtk6t9k6w3aql943uxz8rt62d4dvqu3c6jv";

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
              placeholder={offer.amount.toString()}
              endContent={<DropDown options={[offer]} disabled />}
              className="py-4"
            />
            {isEnough ? (
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
              endContent={<DropDown options={[receive]} disabled />}
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
              <div className="border-m-light-blue bg-m-light-blue break-words rounded-lg border px-5 py-3 font-semibold text-black">
                {address}
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col justify-end gap-5 pt-5 text-sm sm:flex-row">
            <Button size={SIZE.SMALL} color={COLORS.BLACK} onClick={closeModal}>
              Cancel
            </Button>
            <Button
              size={SIZE.SMALL}
              disabled={!isEnough}
              filled
              onClick={closeModal}
            >
              Confirm Swap
            </Button>
          </div>
        </div>
      </main>
    </Modal>
  );
};
