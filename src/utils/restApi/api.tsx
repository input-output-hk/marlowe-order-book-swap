import {
  unAddressBech32,
  unContractId,
  type ContractId,
} from "@marlowe.io/runtime-core";
import { type RuntimeLifecycle } from "@marlowe.io/runtime-lifecycle/api";
import type { RestClient } from "@marlowe.io/runtime-rest-client";
import { type ContractDetails } from "@marlowe.io/runtime-rest-client/contract/details";
import { contractsRange } from "@marlowe.io/runtime-rest-client/contract/endpoints/collection";
import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";
import type { Dispatch, SetStateAction } from "react";
import { type IMoreContractDetails } from "~/components/Withdraw/WithdrawPage";
import { env } from "~/env.mjs";
import { type IPagination } from "~/pages/listing";
import {
  contractDetailsSchema,
  contractHeaderSchema,
  contractSchema,
  initialContractSchema,
  type DesiredType,
  type OfferedType,
} from ".";
import { ADA, ICON_SIZES, lovelaceToAda, type ITableData } from "..";

export const getAddress = async (
  runtime: RuntimeLifecycle,
  setAddress: Dispatch<SetStateAction<string | undefined>>,
) => {
  const walletAddress = await runtime.wallet.getChangeAddress();
  if (walletAddress) setAddress(unAddressBech32(walletAddress));
};

const getOffered = (data: OfferedType) => {
  const token =
    data.of_token.token_name === "" ? ADA : data.of_token.token_name;
  const amount =
    data.of_token.token_name === ""
      ? (lovelaceToAda(Number(data.deposits)) as number)
      : Number(data.deposits);

  return {
    token,
    amount,
    icon: <Image src={MarloweIcon as string} alt="M" height={ICON_SIZES.XS} />,
  };
};

const getDesired = (data: DesiredType) => {
  const token =
    data.when[0].case.of_token.token_name === ""
      ? ADA
      : data.when[0].case.of_token.token_name;
  const amount =
    data.when[0].case.of_token.token_name === ""
      ? (lovelaceToAda(Number(data.when[0].case.deposits)) as number)
      : Number(data.when[0].case.deposits);

  return {
    token,
    amount,
    icon: <Image src={MarloweIcon as string} alt="M" height={ICON_SIZES.XS} />,
  };
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
      // It is disabled for the moment, until pagination is solved
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

      const parsedContractsList = contractsList
        .map((contract) => {
          const parsedContract = contractDetailsSchema.safeParse(contract);

          if (parsedContract.success) {
            const { tags, contractId, initialContract, state } =
              parsedContract.data;
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
              createdBy: state.value?.accounts[0][0][0].address,
              offered: getOffered(initialContract.when[0].case),
              desired: getDesired(initialContract.when[0].then),
              expiry: new Date(Number(initialContract.timeout)).toString(),
              start: startDate.toString(),
            };
          } else {
            return null;
          }
        })
        .filter((x) => x !== null) as ITableData[];

      setData(parsedContractsList);
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

const getInitialContract = (contract: ContractDetails) => {
  const parsedPayout = initialContractSchema.safeParse(
    contract.initialContract,
  );
  let swapperAmount = BigInt(0);
  let providerAmount = BigInt(0);
  let error = "";
  let providerToken = "";
  let swapperToken = "";
  if (parsedPayout.success) {
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
        : parsedPayout.data.when[0].case.deposits;
    swapperAmount =
      swapperToken === ADA
        ? (lovelaceToAda(
            parsedPayout.data.when[0].then.when[0].case.deposits,
          ) as bigint)
        : parsedPayout.data.when[0].then.when[0].case.deposits;
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
  setAddressExists: Dispatch<SetStateAction<boolean>>,
) => {
  const availableWithdraws = await runtimeLifecycle?.payouts.available();
  availableWithdraws?.map((payout) => payout.contractId);

  if (availableWithdraws && client) {
    const contractsListPromise = availableWithdraws.map((contract) => {
      return client.getContractById(contract.contractId);
    });
    const contractsList = await Promise.all(contractsListPromise);
    setPossibleWithdraws(
      contractsList.map((contract) => getInitialContract(contract)),
    );
  }

  const walletInfo = window.localStorage.getItem("walletInfo");
  setAddressExists(!!runtimeLifecycle || !walletInfo);
};
