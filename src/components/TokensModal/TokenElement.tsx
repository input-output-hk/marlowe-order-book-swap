import Image from "next/image";
import InfoIcon from "public/info.svg";
import { useState, type Dispatch, type SetStateAction } from "react";
import { ICON_SIZES, intToDecimal, isADA, truncateString } from "~/utils";
import { type Asset } from "~/utils/tokens";
import { Button, SIZE } from "../Button/Button";

interface TokenElementProps {
  token: Asset;
  setSelected: Dispatch<SetStateAction<Asset>>;
  closeModal: () => void;
}

export const TokenElement = ({
  token,
  setSelected,
  closeModal,
}: TokenElementProps) => {
  const [hiddenPolicy, setHiddenPolicy] = useState(true);
  const changeVisibility = () => setHiddenPolicy(!hiddenPolicy);

  const handleSelect = () => {
    setSelected({
      ...token,
      tokenName: token.tokenName,
    });
    closeModal();
  };

  const IntAmount =
    token.decimals > 0 && token.amount
      ? (intToDecimal(token.amount, token.decimals) as bigint)
      : token.amount;

  const DecimalAmount =
    token.decimals > 0 ? "." + String(token.amount).slice(-token.decimals) : "";

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex w-4/5 items-center gap-3">
          {token.icon}
          <div className="flex flex-col">
            <div className="flex flex-col items-baseline xl:flex-row xl:gap-3">
              <span className="text-sm font-bold text-black">
                {truncateString(token.tokenName, 15)}
              </span>
              {!isADA(token.assetName) && (
                <div className="flex">
                  <span
                    className="cursor-pointer break-all text-xs font-medium"
                    onClick={changeVisibility}
                  >
                    <span className="text-xs font-medium xl:hidden">
                      Policy ID:&nbsp;
                    </span>
                    {hiddenPolicy
                      ? truncateString(token.policyId, 20)
                      : token.policyId}
                  </span>
                </div>
              )}
            </div>
            {token.amount !== undefined && (
              <p className="text-xs font-medium">
                Amount:&nbsp;
                {String(IntAmount) + DecimalAmount}
              </p>
            )}
          </div>
        </div>
        <div className="flex w-28 items-center justify-end gap-2">
          {token.decimals < 0 && (
            <abbr title="This token is not supported">
              <Image
                src={InfoIcon as string}
                alt="i"
                height={ICON_SIZES.L}
                className="cursor-help"
              />
            </abbr>
          )}
          <div>
            <Button
              size={SIZE.XSMALL}
              onClick={handleSelect}
              disabled={token.decimals < 0}
            >
              Select
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
