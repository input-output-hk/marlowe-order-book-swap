import {
  datetoTimeout,
  tokenValue,
  type Address,
  type Token as TokenSwap,
} from "@marlowe.io/language-core-v1";
import {
  unPolicyId,
  type ContractId,
  type Token,
} from "@marlowe.io/runtime-core";
import { type RestClient } from "@marlowe.io/runtime-rest-client";
import { type Dispatch, type SetStateAction } from "react";
import type {
  DataRowProps,
  IStateData,
} from "~/components/Table/table.interface";
import { COLORS, adaToLovelace } from ".";
import { mkContract, type Scheme, type State } from "./atomicSwap";
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
  providerAddress: Address;
}

export const getSwapContract = ({
  valueOffered,
  valueDesired,
  selectedOffered,
  selectedDesired,
  expiryDate,
  providerAddress,
}: ISwapRequest) => {
  const parsedValueOffered =
    selectedOffered.option === ADA
      ? (adaToLovelace(BigInt(valueOffered)) as bigint)
      : BigInt(valueOffered);
  const parsedValueDesired =
    selectedDesired.option === ADA
      ? (adaToLovelace(BigInt(valueDesired)) as bigint)
      : BigInt(valueDesired);

  const tokenOffered: TokenSwap = {
    currency_symbol: tokensData[selectedOffered.option as TOKENS].policyId,
    token_name: tokensData[selectedOffered.option as TOKENS].assetName,
  };

  const tokenDesired: TokenSwap = {
    currency_symbol: tokensData[selectedDesired.option as TOKENS].policyId,
    token_name: tokensData[selectedDesired.option as TOKENS].assetName,
  };

  const swapSchema: Scheme = {
    participants: {
      seller: providerAddress,
      buyer: { role_token: "buyer" },
    },
    offer: {
      deadline: datetoTimeout(new Date(expiryDate)),
      asset: tokenValue(parsedValueOffered)(tokenOffered),
    },
    ask: {
      deadline: datetoTimeout(new Date(expiryDate)),
      asset: tokenValue(parsedValueDesired)(tokenDesired),
    },
    swapConfirmation: {
      deadline: datetoTimeout(new Date(expiryDate)),
    },
  };

  return mkContract(swapSchema);
};

export const waitTxConfirmation = (
  contractId: ContractId,
  txId: string,
  client: RestClient | undefined,
  setFinished?: Dispatch<SetStateAction<boolean>>,
) => {
  if (!client) return;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const pollingInterval = setInterval(async () => {
    const pollingTx = await client.getContractTransactionById(contractId, txId);
    if (pollingTx.status === "confirmed") {
      clearInterval(pollingInterval);
      setFinished && setFinished(true);
      return;
    }
  }, 3000);
};

export const loadingState = {
  disabled: true,
  text: "Loading...",
  action: () => null,
};
export const parseState = (
  componentInfo: DataRowProps & {
    setState: Dispatch<SetStateAction<IStateData>>;
  },
  state: State | undefined,
) => {
  const {
    row,
    address,
    handleOpenAccept,
    handleOpenRetract,
    handleGoToDeposit,
    setState,
  } = componentInfo;
  const nullFn = () => null;

  if (!state) return setState(loadingState);

  switch (state.typeName) {
    case "WaitingForAnswer": {
      return setState({
        disabled: false,
        text: row.createdBy === address ? "Retract Offer" : "Accept Offer",
        action:
          row.createdBy === address
            ? handleOpenRetract(row)
            : handleOpenAccept(row),
        color: row.createdBy === address ? COLORS.RED : COLORS.PURPLE,
      });
    }
    case "NoSellerOfferInTime": {
      return setState({
        disabled: true,
        text: "Offer Ended",
        action: nullFn,
      });
    }
    case "WaitingSellerOffer": {
      return setState({
        disabled: row.createdBy !== address,
        text: row.createdBy === address ? "Deposit" : "Not Started",
        action: handleGoToDeposit(row),
        color: row.createdBy === address ? COLORS.GREEN : COLORS.DISABLED,
      });
    }
    case "WaitingForSwapConfirmation": {
      return setState({
        disabled: true,
        text: "Finishing...",
        action: nullFn,
      });
    }
    case "Closed": {
      return setState({
        disabled: true,
        text: "Offer Ended",
        action: nullFn,
      });
    }
    default: {
      return setState(loadingState);
    }
  }
};
