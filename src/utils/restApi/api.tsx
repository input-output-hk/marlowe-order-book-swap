import { unContractId } from "@marlowe.io/runtime-core";
import type { RestClient } from "@marlowe.io/runtime-rest-client";
import { contractsRange } from "@marlowe.io/runtime-rest-client/contract/endpoints/collection";
import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";
import type { Dispatch, SetStateAction } from "react";
import { env } from "~/env.mjs";
import {
  contractDetailsSchema,
  contractSchema,
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

export const getContracts = async (
  client: RestClient,
  setData: Dispatch<SetStateAction<ITableData[] | null>>,
  setError: Dispatch<SetStateAction<string | null>>,
) => {
  try {
    const range = contractsRange(`contractId;limit 10;offset 0;order desc`);

    const allContracts = await client.getContracts({
      tags: [`${env.NEXT_PUBLIC_DAPP_ID}`],
      range,
    });

    const parsedContracts = contractSchema.safeParse(allContracts);

    if (!parsedContracts.success) {
      throw new Error(parsedContracts.error.message);
    }

    const validContracts = parsedContracts.data.headers.filter((contract) => {
      if (
        env.NEXT_PUBLIC_DAPP_ID in contract.tags &&
        contract.tags[`${env.NEXT_PUBLIC_DAPP_ID}`]
      ) {
        const tag = contract.tags[`${env.NEXT_PUBLIC_DAPP_ID}`];
        const startDate =
          typeof tag === "object" && tag !== null ? tag.startDate : undefined;
        const expiryDate =
          typeof tag === "object" && tag !== null ? tag.expiryDate : undefined;

        return (
          startDate &&
          expiryDate &&
          new Date(startDate) < new Date() &&
          new Date(expiryDate) > new Date() &&
          contract.status === "confirmed"
        );
      }
    });

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
          console.log(parsedContract.error.message);
          return null;
        }
      })
      .filter((x) => x !== null) as ITableData[];

    setData(parsedContractsList);
  } catch (err) {
    console.log(err);
    setError("Something went wrong. Please reload and try later.");
  }
};
