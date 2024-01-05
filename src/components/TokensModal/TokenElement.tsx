import { useState, type Dispatch, type SetStateAction } from "react";
import { truncateString } from "~/utils";
import { TOKENS, type Asset } from "~/utils/tokens";
import { Button, SIZE } from "../Button/Button";

interface TokenElementProps {
  token: Asset;
  setSelectedOffered: Dispatch<SetStateAction<Asset>>;
  closeModal: () => void;
}

export const TokenElement = ({
  token,
  setSelectedOffered,
  closeModal,
}: TokenElementProps) => {
  const [hiddenPolicy, setHiddenPolicy] = useState(true);
  const changeVisibility = () => setHiddenPolicy(!hiddenPolicy);

  const handleSelect = () => {
    setSelectedOffered({
      ...token,
      assetName: token.assetName === "" ? TOKENS.ADA : token.assetName,
    });
    closeModal();
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {token.icon}
          <span className="text-sm font-bold text-black">
            {token.assetName === ""
              ? TOKENS.ADA
              : truncateString(token.assetName, 7)}
          </span>
          {token.assetName !== TOKENS.ADA && (
            <span
              className="cursor-pointer text-xs font-medium"
              onClick={changeVisibility}
            >
              {hiddenPolicy
                ? truncateString(token.policyId, 10)
                : token.policyId}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="w-fit">
            <Button size={SIZE.XSMALL} onClick={handleSelect}>
              Select
            </Button>
          </div>
        </div>
      </div>
      {!token.amount && (
        <div className="pl-10">
          <p className="text-xs font-medium">Amount: 10</p>
        </div>
      )}
    </div>
  );
};
