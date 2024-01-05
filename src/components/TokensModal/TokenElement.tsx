import { useState } from "react";
import { ADA, adaToLovelace, lovelaceToAda, truncateString } from "~/utils";
import { TOKENS, type Asset } from "~/utils/tokens";
import { Button, SIZE } from "../Button/Button";
interface TokenElementProps {
  token: Asset;
}
export const TokenElement = ({ token }: TokenElementProps) => {
  const [hiddenPolicy, setHiddenPolicy] = useState(true);
  const changeVisibility = () => setHiddenPolicy(!hiddenPolicy);
  const balanceInt = Math.floor(Number(lovelaceToAda(token.amount ?? 0)));

  const balanceDecimals = Number(
    (token.amount ?? BigInt(0)) - (adaToLovelace(BigInt(balanceInt)) as bigint),
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {token.icon}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-3">
              <span className="text-sm font-bold text-black">
                {token.assetName === ""
                  ? TOKENS.ADA
                  : truncateString(token.assetName, 15)}
              </span>
              {token.assetName !== TOKENS.ADA && (
                <span
                  className="cursor-pointer text-xs font-medium"
                  onClick={changeVisibility}
                >
                  {hiddenPolicy
                    ? truncateString(token.policyId, 20)
                    : token.policyId}
                </span>
              )}
            </div>
            {token.amount !== undefined && (
              <p className="text-xs font-medium">
                Amount:&nbsp;
                {token.assetName === ADA ? (
                  <>
                    {balanceInt}.
                    <span className="text-xs">{balanceDecimals}</span>
                  </>
                ) : (
                  String(token.amount)
                )}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            Decimals: {token.decimals}
          </span>
          <div className="w-fit">
            <Button size={SIZE.XSMALL}>Select</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
