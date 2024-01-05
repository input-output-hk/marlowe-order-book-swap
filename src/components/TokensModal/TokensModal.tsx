import Image from "next/image";
import FullscreenIcon from "public/fullscreen.svg";
import { useState } from "react";
import { COLORS, ICON_SIZES } from "~/utils";
import { tokensData, type Asset } from "~/utils/tokens";
import { Button, SIZE } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import { TokenElement } from "./TokenElement";

interface TokensModalProps {
  assets?: [string, Asset];
}

export const TokensModal = ({ assets }: TokensModalProps) => {
  const [open, setOpen] = useState(false);

  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);

  return (
    <>
      <div className="relative w-full">
        <Button
          size={SIZE.XSMALL}
          color={COLORS.LIGHT_GRAY}
          onClick={openModal}
          filled
        >
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs font-medium text-m-dark-gray">
              Token Select
            </span>
            <Image
              src={FullscreenIcon as string}
              alt=""
              height={ICON_SIZES.S}
            />
          </div>
        </Button>
      </div>

      <Modal closeModal={closeModal} open={open} title="Token Select">
        <div className="flex flex-col gap-4 pt-2">
          {assets
            ? //TODO add own tokens instead of null
              null
            : Object.entries(tokensData).map((token) => {
                return <TokenElement key={token[0]} token={token} />;
              })}
        </div>
      </Modal>
    </>
  );
};
