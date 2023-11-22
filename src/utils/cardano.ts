import { type Assets, type Lucid } from "lucid-cardano";
import {
  mkSwapContract,
  type SwapRequest,
} from "node_modules/@marlowe.io/language-examples/dist/esm/swaps/swap-token-token";
import { type IOptions, type ITokenAmount } from "./interfaces";
import { hexaToText } from "./string";
import { tokensData, type TOKENS } from "./tokens";

export const POLICY_LENGTH = 56;
export const ADA = "ADA";
export const LOVELACE = "Lovelace";

export const getBalance = async (lucid: Lucid) => {
  const utxos = await lucid.wallet.getUtxos();

  if (!utxos || utxos.length === 0) {
    return { lovelace: BigInt(0) };
  }

  const balance: Record<string, bigint> = {};
  utxos.forEach((utxo) => {
    Object.entries(utxo.assets).forEach(([asset, amount]) => {
      if (asset !== LOVELACE.toLowerCase()) {
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
    tokenLowercase === ADA.toLowerCase() &&
    Number(balance.lovelace) / 1e6 >= tokenToCompare.amount
  ) {
    return true;
  }

  return (
    myTokens.includes(tokenLowercase) &&
    Number(balance[tokenLowercase]!) >= tokenToCompare.amount
  );
};

interface ISwapRequest {
  valueOffered: string;
  valueDesired: string;
  selectedOffered: IOptions;
  selectedDesired: IOptions;
  address: string;
}

export const getSwapContract = ({
  valueOffered,
  valueDesired,
  selectedOffered,
  selectedDesired,
  address,
}: ISwapRequest) => {
  const swapRequest: SwapRequest = {
    provider: {
      roleName: address,
      // TODO: ask about this parameter
      depositTimeout: BigInt(1000000),
      value: {
        amount: BigInt(valueOffered),
        token: {
          currency_symbol:
            tokensData[selectedOffered.option as TOKENS].currency_symbol,
          token_name: tokensData[selectedOffered.option as TOKENS].token_name,
        },
      },
    },
    swapper: {
      roleName: "swapper",
      depositTimeout: BigInt(1000000),
      value: {
        amount: BigInt(valueDesired),
        token: {
          currency_symbol:
            tokensData[selectedDesired.option as TOKENS].currency_symbol,
          token_name: tokensData[selectedDesired.option as TOKENS].token_name,
        },
      },
    },
  };
  return mkSwapContract(swapRequest);
};
