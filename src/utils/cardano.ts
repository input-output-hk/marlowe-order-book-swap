import { type Assets, type Lucid } from "lucid-cardano";
import { type ITokenAmount } from "./interfaces";
import { hexaToText } from "./string";

export const POLICY_LENGTH = 56;

export const getBalance = async (lucid: Lucid) => {
  const utxos = await lucid.wallet.getUtxos();

  if (!utxos || utxos.length === 0) {
    return { lovelace: BigInt(0) };
  }

  const balance: Record<string, bigint> = {};
  utxos.forEach((utxo) => {
    Object.entries(utxo.assets).forEach(([asset, amount]) => {
      if (asset !== "lovelace") {
        asset = hexaToText(asset.slice(POLICY_LENGTH)).toLowerCase();
      }
      if (asset in balance) {
        balance[asset] += amount;
      } else {
        balance[asset] = amount;
      }
    });
  });

  return balance;
};

export const isEnoughBalance = (
  balance: Assets,
  tokenToCompare: ITokenAmount,
) => {
  const myTokens = Object.keys(balance);
  const tokenLowercase = tokenToCompare.token.toLowerCase();

  if (
    tokenLowercase === "ada" &&
    Number(balance.lovelace) / 1e6 >= tokenToCompare.amount
  ) {
    return true;
  }

  if (
    myTokens.includes(tokenLowercase) &&
    Number(balance[tokenLowercase]!) >= tokenToCompare.amount
  ) {
    return true;
  } else {
    return false;
  }
};
