import { useContext, useEffect, useState } from "react";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { adaToLovelace, lovelaceToAda } from "~/utils";

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

  const balanceInt = Math.floor(Number(lovelaceToAda(balance)));

  const balanceDecimals = Number(
    balance - (adaToLovelace(BigInt(balanceInt)) as bigint),
  );

  return (
    <div className="hidden md:block">
      {balanceInt}.<span className="text-xs">{balanceDecimals}</span>
      &nbsp;
      <b>t₳</b>
    </div>
  );
};
