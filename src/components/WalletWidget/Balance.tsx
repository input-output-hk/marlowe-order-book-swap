import { useContext, useEffect, useState } from "react";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { decimalToInt, intToDecimal } from "~/utils";

export const Balance = () => {
  const [balance, setBalance] = useState(BigInt(0));
  const { runtimeLifecycle } = useContext(TSSDKContext);

  useEffect(() => {
    void getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimeLifecycle]);

  const getBalance = async () => {
    if (runtimeLifecycle) {
      const walletBalance = await runtimeLifecycle?.wallet.getLovelaces();
      setBalance(walletBalance);
    }
  };

  const decimals: string = 6;

  const balanceInt = Math.floor(Number(intToDecimal(balance, decimals)));

  const balanceDecimals = Number(
    balance - (decimalToInt(BigInt(balanceInt), decimals) as bigint),
  );

  return (
    <div className="hidden md:block">
      {balanceInt}.<span className="text-xs">{balanceDecimals}</span>
      &nbsp;
      <b>t₳</b>
    </div>
  );
};
