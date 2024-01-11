import {
  datetoTimeout,
  tokenValue,
  type Address,
  type Token as TokenSwap,
} from "@marlowe.io/language-core-v1";
import { type ContractId, type Token } from "@marlowe.io/runtime-core";
import { type RestClient } from "@marlowe.io/runtime-rest-client";
import { type Dispatch, type SetStateAction } from "react";
import type {
  DataRowProps,
  IStateData,
} from "~/components/Table/table.interface";
import { COLORS, adaToLovelace, decimalToInt } from ".";
import { mkContract, type Scheme, type State } from "./atomicSwap";
import { tokensData, type Asset, type TOKENS } from "./tokens";

export const POLICY_LENGTH = 56;
export const ADA = "ADA";
export const LOVELACE = "Lovelace";

export const checkIfIsToken = (token: string): token is TOKENS => {
  if (token === ADA) return true;
  return Object.values(tokensData).some((t) => t.assetName === token);
};

export const isEnoughBalance = (balance: Token[], assetToCompare: Asset) => {
  const asset = balance.find(
    (a) => String(a.assetId.policyId) === assetToCompare.policyId,
  );

  if (!asset) return false;

  if (asset.assetId.assetName === "") {
    return asset.quantity >= adaToLovelace(assetToCompare.amount ?? 0);
  } else {
    return asset.quantity >= (assetToCompare.amount ?? 0);
  }
};

interface ISwapRequest {
  valueOffered: string;
  valueDesired: string;
  selectedOffered: Asset;
  selectedDesired: Asset;
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
  const parsedValueOffered = decimalToInt(
    BigInt(valueOffered),
    selectedOffered.decimals,
  ) as bigint;
  const parsedValueDesired = decimalToInt(
    BigInt(valueDesired),
    selectedDesired.decimals,
  ) as bigint;

  const tokenOffered: TokenSwap = {
    currency_symbol: selectedOffered.policyId,
    token_name:
      selectedOffered.assetName === ADA ? "" : selectedOffered.assetName,
  };

  const tokenDesired: TokenSwap = {
    currency_symbol: selectedDesired.policyId,
    token_name:
      selectedDesired.assetName === ADA ? "" : selectedDesired.assetName,
  };

  const swapSchema: Scheme = {
    offer: {
      seller: providerAddress,
      asset: tokenValue(parsedValueOffered)(tokenOffered),
      deadline: datetoTimeout(new Date(expiryDate)),
    },
    ask: {
      buyer: { role_token: "buyer" },
      asset: tokenValue(parsedValueDesired)(tokenDesired),
      deadline: datetoTimeout(new Date(expiryDate)),
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
