import { unContractId, type ContractId } from "@marlowe.io/runtime-core";
import type { RestClient } from "@marlowe.io/runtime-rest-client";
import { contractsRange } from "@marlowe.io/runtime-rest-client/contract/endpoints/collection";
import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";
import type { Dispatch, SetStateAction } from "react";
import { env } from "~/env.mjs";
import { type IPagination } from "~/pages/listing";
import {
  contractDetailsSchema,
  contractHeaderSchema,
  contractSchema,
  swapTag,
  type DesiredType,
  type OfferedType,
} from ".";
import { ADA, ICON_SIZES, lovelaceToAda, type ITableData } from "..";

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
      `contractId;limit ${PAGINATION_LIMIT};offset ${
        (page - 1) * PAGINATION_LIMIT
      };order desc`,
    );

    const tags =
      searchQuery !== ""
        ? [env.NEXT_PUBLIC_DAPP_ID + swapTag + searchQuery]
        : [env.NEXT_PUBLIC_DAPP_ID];

    const allContracts = await client.getContracts({ tags, range });

    const succededContracts: ContractId[] = [];
    allContracts.headers.map((header) => {
      const parsedHeader = contractHeaderSchema.safeParse(header);
      if (parsedHeader.success) succededContracts.push(header.contractId);
    });

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
            const { contractId, initialContract, state } = parsedContract.data;
            return {
              id: unContractId(contractId),
              createdBy: state.value.accounts[0][0][0].address,
              offered: getOffered(initialContract.when[0].case),
              desired: getDesired(initialContract.when[0].then),
              expiry: new Date(Number(initialContract.timeout)).toString(),
            };
          } else {
            return null;
          }
        })
        .filter((x) => x !== null) as ITableData[];

      setData(parsedContractsList);
      if (allContracts.nextRange._tag === "Some") {
        setPagination((prev) => ({ ...prev, fetchMore: true }));
      } else {
        setPagination((prev) => ({ ...prev, fetchMore: false }));
      }
    }
  } catch (err) {
    console.log(err);
    setError("Something went wrong. Please reload and try later.");
  }
};
