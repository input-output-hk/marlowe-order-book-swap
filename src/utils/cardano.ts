import {
  unPolicyId,
  type ContractId,
  type Token,
} from "@marlowe.io/runtime-core";
import { type RestClient } from "@marlowe.io/runtime-rest-client";
import {
  mkSwapContract,
  type SwapRequest,
} from "node_modules/@marlowe.io/language-examples/dist/esm/swaps/swap-token-token";
import { type Dispatch, type SetStateAction } from "react";
import { adaToLovelace } from ".";
import { type IOptions } from "./interfaces";
import { tokensData, type Asset, type TOKENS } from "./tokens";

export const POLICY_LENGTH = 56;
export const ADA = "ADA";
export const LOVELACE = "Lovelace";

export const checkIfIsToken = (token: string): token is TOKENS => {
  if (token === ADA) return true;
  return Object.values(tokensData).some((t) => t.assetName === token);
};

export type AssetAndAmount = Asset & { amount: number };
export const isEnoughBalance = (
  balance: Token[],
  assetToCompare: AssetAndAmount,
) => {
  const asset = balance.find(
    (a) => unPolicyId(a.assetId.policyId) === assetToCompare.policyId,
  );

  if (!asset) return false;

  if (asset.assetId.assetName === "") {
    return asset.quantity >= adaToLovelace(assetToCompare.amount);
  } else {
    return asset.quantity >= assetToCompare.amount;
  }
};

interface ISwapRequest {
  valueOffered: string;
  valueDesired: string;
  selectedOffered: IOptions;
  selectedDesired: IOptions;
  expiryDate: string;
}

export const getSwapContract = ({
  valueOffered,
  valueDesired,
  selectedOffered,
  selectedDesired,
  expiryDate,
}: ISwapRequest) => {
  const parsedValueOffered =
    selectedOffered.option === ADA
      ? (adaToLovelace(BigInt(valueOffered)) as bigint)
      : BigInt(valueOffered);
  const parsedValueDesired =
    selectedDesired.option === ADA
      ? (adaToLovelace(BigInt(valueDesired)) as bigint)
      : BigInt(valueDesired);
  const parsedExpiryDate = BigInt(new Date(expiryDate).getTime());

  const swapRequest: SwapRequest = {
    provider: {
      roleName: "provider",
      depositTimeout: parsedExpiryDate,
      value: {
        amount: parsedValueOffered,
        token: {
          currency_symbol:
            tokensData[selectedOffered.option as TOKENS].policyId,
          token_name: tokensData[selectedOffered.option as TOKENS].assetName,
        },
      },
    },
    swapper: {
      roleName: "swapper",
      depositTimeout: parsedExpiryDate,
      value: {
        amount: parsedValueDesired,
        token: {
          currency_symbol:
            tokensData[selectedDesired.option as TOKENS].policyId,
          token_name: tokensData[selectedDesired.option as TOKENS].assetName,
        },
      },
    },
  };
  return mkSwapContract(swapRequest);
};

export const waitTxConfirmation = (
  contractId: ContractId,
  txId: string,
  client: RestClient | undefined,
  setFinished: Dispatch<SetStateAction<boolean>>,
) => {
  if (!client) return;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const pollingInterval = setInterval(async () => {
    const pollingTx = await client.getContractTransactionById(contractId, txId);
    if (pollingTx.status === "confirmed") {
      clearInterval(pollingInterval);
      setFinished(true);
      return;
    }
  }, 3000);
};
