import Image from "next/image";
import FullscreenIcon from "public/fullscreen.svg";
import { useState } from "react";
import { COLORS, ICON_SIZES, truncateString } from "~/utils";
import { TOKENS, tokensData, type Asset } from "~/utils/tokens";
import { Button, SIZE } from "../Button/Button";
import { Modal } from "../Modal/Modal";

interface TokenElementProps {
  token: [string, Asset];
}

const TokenElement = ({ token }: TokenElementProps) => {
  const [hiddenPolicy, setHiddenPolicy] = useState(true);
  const changeVisibility = () => setHiddenPolicy(!hiddenPolicy);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {token[1].icon}
        <span className="text-sm font-medium">
          {truncateString(token[0], 7)}
        </span>
        {token[0] !== TOKENS.ADA && (
          <span
            className="cursor-pointer text-xs font-medium"
            onClick={changeVisibility}
          >
            {hiddenPolicy
              ? truncateString(token[1].policyId, 10)
              : token[1].policyId}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">
          Decimals: {token[1].decimals}
        </span>
        <div className="w-fit">
          <Button size={SIZE.XSMALL}>Select</Button>
        </div>
      </div>
    </div>
  );
};

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
