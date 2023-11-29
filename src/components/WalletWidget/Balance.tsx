import { useEffect, useState } from "react";
import { useCardano } from "use-cardano";
import { adaToLovelace, getBalance, lovelaceToAda } from "~/utils";

export const Balance = () => {
  const [balance, setBalance] = useState(BigInt(0));
  const { lucid } = useCardano();

  useEffect(() => {
    const walletBalance = async () => {
      if (lucid) {
        const balance = await getBalance(lucid);
        setBalance(balance.lovelace!);
      }
    };

    void walletBalance();
  }, [lucid]);

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
