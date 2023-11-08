import { type Lucid } from "lucid-cardano";
import { hexaToText } from "./string";

export const POLICY_LENGTH = 56;
export const getTokenNames = async (lucid: Lucid) => {
  const utxos = await lucid.wallet.getUtxos();
  const tokens = utxos.reduce(
    (acc, utxo) => {
      const tokensAmounts = Object.values(utxo.assets);
      Object.keys(utxo.assets).forEach((asset, index) => {
        const assetName =
          asset === "lovelace" ? asset : hexaToText(asset.slice(POLICY_LENGTH));
        if (acc[assetName]) {
          acc[assetName] += tokensAmounts[index] ?? BigInt(0);
        } else {
          acc[assetName] = tokensAmounts[index] ?? BigInt(0);
        }
      });
      return acc;
    },
    {} as Record<string, bigint>,
  );
  return tokens;
};
