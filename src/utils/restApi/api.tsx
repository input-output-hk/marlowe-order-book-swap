import { datetoTimeout } from "@marlowe.io/language-core-v1";
import { contractId, type ContractId } from "@marlowe.io/runtime-core";
import type { RuntimeLifecycle } from "@marlowe.io/runtime-lifecycle/api";
import type { RestClient } from "@marlowe.io/runtime-rest-client";
import { type ContractDetails } from "@marlowe.io/runtime-rest-client/contract";
import Image from "next/image";
import { itemRanged } from "node_modules/@marlowe.io/runtime-rest-client/dist/esm/pagination";
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
  ICON_SIZES,
  intToDecimal,
  isEmpty,
  parseState,
  parseTokenName,
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
  if (walletAddress) setAddress(String(walletAddress));
};

const getOffered = async (data: OfferedType) => {
  const tokenFromLocal = Object.values(tokensData).find(
    (tokenData) => tokenData.assetName === data.of_token.token_name,
  );

  if (tokenFromLocal) {
    const amount = intToDecimal(
      Number(data.deposits),
      tokenFromLocal.decimals,
    ) as bigint;

    return {
      tokenName: tokenFromLocal.tokenName,
      amount,
      policyId: tokenFromLocal.policyId,
      assetName: tokenFromLocal.assetName,
      icon: tokenFromLocal.icon,
      decimals: tokenFromLocal.decimals,
    };
  } else {
    try {
      const tokenInfo = await lookupTokenMetadata(
        data.of_token.currency_symbol,
        textToHexa(data.of_token.token_name),
        "preprod",
      );

      if (tokenInfo) {
        const amount = intToDecimal(
          Number(data.deposits),
          tokenInfo.decimals!,
        ) as number;

        return {
          tokenName: tokenInfo.ticker ?? tokenInfo.name,
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
          decimals: tokenInfo.decimals,
          policyId: data.of_token.currency_symbol,
          assetName: data.of_token.token_name,
        };
      } else {
        throw new Error("Token not found");
      }
    } catch (err) {
      return {
        tokenName: parseTokenName(data.of_token.token_name),
        amount: BigInt(0),
        icon: (
          <Image src={CardanoIcon as string} alt="ADA" height={ICON_SIZES.S} />
        ),

        decimals: -1,
        policyId: data.of_token.currency_symbol,
        assetName: data.of_token.token_name,
      };
    }
  }
};

const getDesired = async (data: DesiredType) => {
  const tokenFromLocal = Object.values(tokensData).find(
    (tokenData) =>
      tokenData.tokenName === data.when[0].case.of_token.token_name,
  );

  if (tokenFromLocal) {
    const amount = intToDecimal(
      Number(data.when[0].case.deposits),
      tokenFromLocal.decimals,
    ) as bigint;

    return {
      tokenName: tokenFromLocal.tokenName,
      amount,
      icon: tokenFromLocal.icon,
      decimals: tokenFromLocal.decimals,
      policyId: tokenFromLocal.policyId,
      assetName: tokenFromLocal.assetName,
    };
  } else {
    try {
      const tokenInfo = await lookupTokenMetadata(
        data.when[0].case.of_token.currency_symbol,
        textToHexa(data.when[0].case.of_token.token_name),
        "preprod",
      );

      if (tokenInfo) {
        const tokenName = tokenInfo.ticker
          ? parseTokenName(tokenInfo.ticker)
          : tokenInfo.name;

        const amount = intToDecimal(
          Number(data.when[0].case.deposits),
          tokenInfo.decimals!,
        ) as number;

        return {
          tokenName,
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

          decimals: tokenInfo.decimals!,
          policyId: data.when[0].case.of_token.currency_symbol,
          assetName: data.when[0].case.of_token.token_name,
        };
      } else {
        throw new Error("Token not found");
      }
    } catch (err) {
      return {
        tokenName: parseTokenName(data.when[0].case.of_token.token_name),
        amount: BigInt(0),
        icon: (
          <Image src={CardanoIcon as string} alt="ADA" height={ICON_SIZES.S} />
        ),
        decimals: -1,
        policyId: data.when[0].case.of_token.currency_symbol,
        assetName: data.when[0].case.of_token.token_name,
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
    const range = itemRanged(
      `contractId;limit ${PAGINATION_LIMIT + 1};offset ${
        (page - 1) * PAGINATION_LIMIT
      };order desc`,
    );

    const tags = !isEmpty(searchQuery)
      ? [tokenToTag(searchQuery)]
      : [env.NEXT_PUBLIC_DAPP_ID];

    const allContracts = await client.getContracts({ tags, range });

    const succeededContracts: ContractId[] = [];
    allContracts.contracts.map((contract) => {
      const parsedHeader = contractHeaderSchema.safeParse(contract);
      if (parsedHeader.success) succeededContracts.push(contract.contractId);
    });

    if (succeededContracts.length === PAGINATION_LIMIT + 1) {
      succeededContracts.pop();
    }

    const filteredContracts = allContracts.contracts.filter((contract) => {
      return succeededContracts.includes(contract.contractId);
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
            id: String(contractId),
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
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(allContracts.page.total / PAGINATION_LIMIT),
      }));
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

    providerToken = parseTokenName(
      parsedPayout.data.when[0].case.of_token.token_name,
    );
    swapperToken = parseTokenName(
      parsedPayout.data.when[0].then.when[0].case.of_token.token_name,
    );
    providerAmount = intToDecimal(
      parsedPayout.data.when[0].case.deposits,
      tokenOfferedInfo.decimals!,
    ) as bigint;
    swapperAmount = intToDecimal(
      parsedPayout.data.when[0].then.when[0].case.deposits,
      tokenDesiredInfo.decimals!,
    ) as bigint;
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

    const validContracts = contractsList
      .map((contract) => {
        const parsedContract = contractDetailsSchema.safeParse(contract);

        return parsedContract.success ? parsedContract.data : null;
      })
      .filter((x) => x !== null) as unknown as ContractDetails[];

    const contractsPromises = validContracts.map((contract) =>
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
  const txIds = transactions.transactions.map((tx) => tx.transactionId);
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

  try {
    const contractState = getState(scheme, inputs, row.state);
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
