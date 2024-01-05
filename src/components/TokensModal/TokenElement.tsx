import { useState } from "react";
import { truncateString } from "~/utils";
import { TOKENS, type Asset } from "~/utils/tokens";
import { Button, SIZE } from "../Button/Button";

interface TokenElementProps {
  token: [string, Asset];
}

export const TokenElement = ({ token }: TokenElementProps) => {
  const [hiddenPolicy, setHiddenPolicy] = useState(true);
  const changeVisibility = () => setHiddenPolicy(!hiddenPolicy);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {token[1].icon}
          <span className="text-sm font-bold text-black">
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
      {!token[1].amount && (
        <div className="pl-10">
          <p className="text-xs font-medium">Amount: 10</p>
        </div>
      )}
    </div>
  );
};
