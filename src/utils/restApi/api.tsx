import { datetoTimeout } from "@marlowe.io/language-core-v1";
import {
  contractId,
  unAddressBech32,
  unContractId,
  type ContractId,
} from "@marlowe.io/runtime-core";
import type { RuntimeLifecycle } from "@marlowe.io/runtime-lifecycle/api";
import type { RestClient } from "@marlowe.io/runtime-rest-client";
import type { ContractDetails } from "@marlowe.io/runtime-rest-client/contract/details";
import { contractsRange } from "@marlowe.io/runtime-rest-client/contract/endpoints/collection";
import Image from "next/image";
import CardanoIcon from "public/cardano.svg";
import type { Dispatch, SetStateAction } from "react";
import type { IStateData } from "~/components/Table/table.interface";
import type { IMoreContractDetails } from "~/components/Withdraw/WithdrawPage";
import { env } from "~/env.mjs";
import type { IPagination } from "~/pages/listing";
import {
  contractDetailsSchema,
  contractHeaderSchema,
  contractSchema,
  initialContractSchema,
  type DesiredType,
  type OfferedType,
} from ".";
import {
  ADA,
  ICON_SIZES,
  intToDecimal,
  lovelaceToAda,
  parseState,
  textToHexa,
  type ITableData,
} from "..";
import { getState, type Scheme } from "../atomicSwap";
import { lookupTokenMetadata } from "../lookupTokenMetadata";
import { tokensData } from "../tokens";

export const getAddress = async (
  runtime: RuntimeLifecycle,
  setAddress: Dispatch<SetStateAction<string | undefined>>,
) => {
  const walletAddress = await runtime.wallet.getChangeAddress();
  if (walletAddress) setAddress(unAddressBech32(walletAddress));
};

const getOffered = async (data: OfferedType) => {
  const token =
    data.of_token.token_name === "" ? ADA : data.of_token.token_name;

  const tokenFromLocal = Object.values(tokensData).find(
    (tokenData) => tokenData.assetName === data.of_token.token_name,
  );

  if (tokenFromLocal) {
    const amount =
      data.of_token.token_name === ""
        ? (lovelaceToAda(Number(data.deposits)) as number)
        : (intToDecimal(
            Number(data.deposits),
            tokenFromLocal.decimals,
          ) as number);

    return {
      token: tokenFromLocal.tokenName,
      amount,
      icon: tokenFromLocal.icon,
    };
  } else {
    try {
      const tokenInfo = await lookupTokenMetadata(
        data.of_token.currency_symbol,
        textToHexa(data.of_token.token_name),
        "preprod",
      );

      if (tokenInfo) {
        const amount =
          data.of_token.token_name === ""
            ? (lovelaceToAda(Number(data.deposits)) as number)
            : (intToDecimal(
                Number(data.deposits),
                tokenInfo.decimals!,
              ) as number);

        return {
          token: tokenInfo.ticker ?? tokenInfo.name,
          amount,
          icon: (
            <Image
              src={
                tokenInfo.logo
                  ? "data:image/png;base64," + tokenInfo.logo
                  : (CardanoIcon as string)
              }
              alt=""
              height={ICON_SIZES.S}
              width={ICON_SIZES.S}
            />
          ),
        };
      } else {
        throw new Error("Token not found");
      }
    } catch (err) {
      return {
        token,
        amount: 0,
        icon: (
          <Image src={CardanoIcon as string} alt="ADA" height={ICON_SIZES.S} />
        ),
      };
    }
  }
};

const getDesired = async (data: DesiredType) => {
  const token =
    data.when[0].case.of_token.token_name === ""
      ? ADA
      : data.when[0].case.of_token.token_name;

  const tokenFromLocal = Object.values(tokensData).find(
    (tokenData) =>
      tokenData.tokenName === data.when[0].case.of_token.token_name,
  );

  if (tokenFromLocal) {
    const amount =
      data.when[0].case.of_token.token_name === ADA
        ? (lovelaceToAda(Number(data.when[0].case.deposits)) as number)
        : (intToDecimal(
            Number(data.when[0].case.deposits),
            tokenFromLocal.decimals,
          ) as number);

    return {
      token: tokenFromLocal.tokenName,
      amount,
      icon: tokenFromLocal.icon,
    };
  } else {
    try {
      const tokenInfo = await lookupTokenMetadata(
        data.when[0].case.of_token.currency_symbol,
        textToHexa(data.when[0].case.of_token.token_name),
        "preprod",
      );

      if (tokenInfo) {
        const tokenName =
          tokenInfo.ticker === "t₳" ? ADA : tokenInfo.ticker ?? tokenInfo.name;

        const amount =
          data.when[0].case.of_token.token_name === ADA
            ? (lovelaceToAda(Number(data.when[0].case.deposits)) as number)
            : (intToDecimal(
                Number(data.when[0].case.deposits),
                tokenInfo.decimals!,
              ) as number);

        return {
          token: tokenName,
          amount,
          icon: (
            <Image
              src={
                tokenInfo.logo
                  ? "data:image/png;base64," + tokenInfo.logo
                  : (CardanoIcon as string)
              }
              alt=""
              height={ICON_SIZES.S}
              width={ICON_SIZES.S}
            />
          ),
        };
      } else {
        throw new Error("Token not found");
      }
    } catch (err) {
      return {
        token,
        amount: 0,
        icon: (
          <Image src={CardanoIcon as string} alt="ADA" height={ICON_SIZES.S} />
        ),
      };
    }
  }
};

export const PAGINATION_LIMIT = 10;
export const SWAP_TAG = "swap";
export const tokenToTag = (token: string) => {
  return env.NEXT_PUBLIC_DAPP_ID + `-${SWAP_TAG}-` + token.toLocaleLowerCase();
};

export const getContracts = async (
  client: RestClient,
  setData: Dispatch<SetStateAction<ITableData[] | null>>,
  setPagination: Dispatch<SetStateAction<IPagination>>,
  setError: Dispatch<SetStateAction<string | null>>,
  searchQuery: string,
  page: number,
) => {
  try {
    const range = contractsRange(
      `contractId;limit ${PAGINATION_LIMIT + 1};offset ${
        (page - 1) * PAGINATION_LIMIT
      };order desc`,
    );

    const tags =
      searchQuery !== ""
        ? [tokenToTag(searchQuery)]
        : [env.NEXT_PUBLIC_DAPP_ID];

    const allContracts = await client.getContracts({ tags, range });

    const succededContracts: ContractId[] = [];
    allContracts.headers.map((header) => {
      const parsedHeader = contractHeaderSchema.safeParse(header);
      if (parsedHeader.success) succededContracts.push(header.contractId);
    });

    if (succededContracts.length === PAGINATION_LIMIT + 1) {
      succededContracts.pop();
    }

    const filteredContracts = allContracts.headers.filter((contract) => {
      return succededContracts.includes(contract.contractId);
    });

    const parsedContracts = contractSchema.safeParse(filteredContracts);

    if (parsedContracts.success) {
      const validContracts = parsedContracts.data;
      // FIXME: It is disabled for the moment, until pagination is solved
      // .filter((contract) => {
      //   if (
      //     env.NEXT_PUBLIC_DAPP_ID in contract.tags &&
      //     contract.tags[`${env.NEXT_PUBLIC_DAPP_ID}`]
      //   ) {
      //     const tag = contract.tags[`${env.NEXT_PUBLIC_DAPP_ID}`];
      //     const startDate =
      //       typeof tag === "object" && tag !== null ? tag.startDate : undefined;
      //     const expiryDate =
      //       typeof tag === "object" && tag !== null
      //         ? tag.expiryDate
      //         : undefined;
      //     return (
      //       startDate &&
      //       expiryDate &&
      //       new Date(startDate) < new Date() &&
      //       new Date(expiryDate) > new Date() &&
      //       contract.status === "confirmed"
      //     );
      //   }
      // });

      const contractsListPromise = validContracts.map((contract) => {
        return client.getContractById(contract.contractId);
      });

      const contractsList = await Promise.all(contractsListPromise);

      // TODO: Implement a better solution. Check https://github.com/input-output-hk/marlowe-ts-sdk/discussions/129
      const parsedContractsList = contractsList.map(async (contract) => {
        const parsedContract = contractDetailsSchema.safeParse(contract);

        if (parsedContract.success) {
          const { tags, contractId, initialContract } = parsedContract.data;
          let startDate = new Date();
          if (
            env.NEXT_PUBLIC_DAPP_ID in tags &&
            tags[`${env.NEXT_PUBLIC_DAPP_ID}`]
          ) {
            const tag = tags[`${env.NEXT_PUBLIC_DAPP_ID}`];
            startDate =
              typeof tag === "object" && tag?.startDate
                ? new Date(tag.startDate)
                : new Date();
          }

          return {
            id: unContractId(contractId),
            createdBy:
              parsedContract.data.initialContract.when[0].case.into_account
                .address,
            offered: await getOffered(initialContract.when[0].case),
            desired: await getDesired(initialContract.when[0].then),
            expiry: new Date(Number(initialContract.timeout)).toString(),
            start: startDate.toString(),
            state: parsedContract.data.state,
          };
        } else {
          return null;
        }
      });
      const nonFilteredData = await Promise.all(parsedContractsList);
      const filteredData = nonFilteredData.filter(
        (x) => x !== null,
      ) as ITableData[];

      setData(filteredData);
      if (
        allContracts.nextRange._tag === "None" ||
        allContracts.headers.length < PAGINATION_LIMIT
      ) {
        setPagination((prev) => ({ ...prev, fetchMore: false }));
      } else {
        setPagination((prev) => ({ ...prev, fetchMore: true }));
      }
    }
  } catch (err) {
    console.log(err);
    setError("Something went wrong. Please reload and try later.");
  }
};

const getInitialContract = async (contract: ContractDetails) => {
  const parsedPayout = initialContractSchema.safeParse(
    contract.initialContract,
  );
  let swapperAmount = BigInt(0);
  let providerAmount = BigInt(0);
  let error = "";
  let providerToken = "";
  let swapperToken = "";
  if (parsedPayout.success) {
    const tokenOfferedInfo = await lookupTokenMetadata(
      parsedPayout.data.when[0].case.of_token.currency_symbol,
      textToHexa(parsedPayout.data.when[0].case.of_token.token_name),
      "preprod",
    );
    const tokenDesiredInfo = await lookupTokenMetadata(
      parsedPayout.data.when[0].then.when[0].case.of_token.currency_symbol,
      textToHexa(
        parsedPayout.data.when[0].then.when[0].case.of_token.token_name,
      ),
      "preprod",
    );

    providerToken =
      parsedPayout.data.when[0].case.of_token.token_name === ""
        ? ADA
        : parsedPayout.data.when[0].case.of_token.token_name;
    swapperToken =
      parsedPayout.data.when[0].then.when[0].case.of_token.token_name === ""
        ? ADA
        : parsedPayout.data.when[0].then.when[0].case.of_token.token_name;
    providerAmount =
      providerToken === ADA
        ? (lovelaceToAda(parsedPayout.data.when[0].case.deposits) as bigint)
        : (intToDecimal(
            parsedPayout.data.when[0].case.deposits,
            tokenOfferedInfo.decimals!,
          ) as bigint);
    swapperAmount =
      swapperToken === ADA
        ? (lovelaceToAda(
            parsedPayout.data.when[0].then.when[0].case.deposits,
          ) as bigint)
        : (intToDecimal(
            parsedPayout.data.when[0].then.when[0].case.deposits,
            tokenDesiredInfo.decimals!,
          ) as bigint);
  } else {
    error = "Error obtaining amount";
  }
  return {
    ...contract,
    added: false,
    adding: false,
    payoutId: null,
    error: error,
    amount: { swapper: swapperAmount, provider: providerAmount },
    token: { swapper: swapperToken, provider: providerToken },
  };
};

export const getPayouts = async (
  runtimeLifecycle: RuntimeLifecycle | undefined,
  client: RestClient | undefined,
  setPossibleWithdraws: Dispatch<SetStateAction<IMoreContractDetails[]>>,
  setLoadingPayouts: Dispatch<SetStateAction<boolean>>,
  setAddressExists: Dispatch<SetStateAction<boolean | null>>,
) => {
  const availableWithdraws = await runtimeLifecycle?.payouts.available();
  availableWithdraws?.map((payout) => payout.contractId);

  if (availableWithdraws && client) {
    const contractsListPromise = availableWithdraws.map((contract) => {
      return client.getContractById(contract.contractId);
    });
    const contractsList = await Promise.all(contractsListPromise);
    const contractsPromises = contractsList.map((contract) =>
      getInitialContract(contract),
    );
    const contracts = await Promise.all(contractsPromises);
    setPossibleWithdraws(contracts);
  }

  const walletInfo = window.localStorage.getItem("walletInfo");
  setLoadingPayouts(availableWithdraws?.length === undefined);
  setAddressExists(!!walletInfo);
};

export const getTransactionDetails = async (
  client: RestClient,
  row: ITableData,
  address: string | undefined,
  handleOpenRetract: (row: ITableData) => () => void,
  handleOpenAccept: (row: ITableData) => () => void,
  handleGoToDeposit: (row: ITableData) => () => void,
  setState: Dispatch<SetStateAction<IStateData>>,
) => {
  const transactions = await client.getTransactionsForContract(
    contractId(row.id),
  );
  const txIds = transactions.headers.map((tx) => tx.transactionId);
  const txsPromises = txIds.map((txId) =>
    client.getContractTransactionById(contractId(row.id), txId),
  );

  const txDetails = await Promise.all(txsPromises);
  const inputs = txDetails.flatMap((tx) => tx.inputs);

  const deadline = datetoTimeout(new Date(row.expiry));
  // Some data in scheme is not used, we can leave it empty. We just use deadline.
  const scheme: Scheme = {
    offer: {
      deadline,
      seller: { address: "" },
      asset: {
        amount: BigInt(0),
        token: { currency_symbol: "", token_name: "" },
      },
    },
    ask: {
      deadline,
      buyer: { role_token: "" },
      asset: {
        amount: BigInt(0),
        token: { currency_symbol: "", token_name: "" },
      },
    },
    swapConfirmation: {
      deadline,
    },
  };

  const contractStateFromData = Object.keys(row.state).length
    ? row.state
    : undefined;

  try {
    const contractState = getState(scheme, inputs, contractStateFromData);
    parseState(
      {
        row,
        address,
        handleOpenRetract,
        handleOpenAccept,
        handleGoToDeposit,
        setState,
      },
      contractState,
    );
  } catch (err) {
    console.log(err);
  }
};
