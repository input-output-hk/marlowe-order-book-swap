import { unContractId } from "@marlowe.io/runtime-core";
import { type RestAPI } from "@marlowe.io/runtime-rest-client";
import { type ContractsRange } from "@marlowe.io/runtime-rest-client/contract/index";
import { iso } from "newtype-ts";
import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";
import type { Dispatch, SetStateAction } from "react";
import {
  contractDetailsSchema,
  contractSchema,
  type DesiredType,
  type OfferedType,
} from ".";
import { ADA, ICON_SIZES, lovelaceToAda, type ITableData } from "..";
import { env } from "process";

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
  client: RestAPI,
  setData: Dispatch<SetStateAction<ITableData[] | null>>,
) => {
  try {
    const isoContract = iso<ContractsRange>();
    const range = isoContract.wrap(`contractId;limit 5;offset 0;order desc`);

    const allContracts = await client.getContracts({
      tags: [`${env.NEXT_PUBLIC_DAPP_ID}`],
      range,
    });

    const parsedContracts = contractSchema.safeParse(allContracts);

    if (!parsedContracts.success) {
      throw new Error(parsedContracts.error.message);
    }

    const contractsListPromise = parsedContracts.data.headers.map(
      (contract) => {
        return client.getContractById(contract.contractId);
      },
    );
    const contractsList = await Promise.all(contractsListPromise);

    const parsedContractsList = contractsList
      .map((contract) => {
        const parsedContract = contractDetailsSchema.safeParse(contract);

        if (parsedContract.success) {
          const { contractId, initialContract } = parsedContract.data;

          return {
            id: unContractId(contractId),
            createdBy: initialContract.when[0].case.into_account.role_token,
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
    console.error(err);
  }
};
