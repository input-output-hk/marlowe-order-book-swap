import { contractId, unContractId } from "@marlowe.io/runtime-core";
import { type RestAPI } from "@marlowe.io/runtime-rest-client";
import { type ContractsRange } from "@marlowe.io/runtime-rest-client/contract/index";
import { iso } from "newtype-ts";
import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";
import type { Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { env } from "~/env.mjs";
import { ADA, ICON_SIZES, lovelaceToAda, type ITableData } from ".";

const contractHeaderSchema = z.object({
  contractId: z
    .string()
    .min(64)
    .transform((x: string) => contractId(x)),
  tags: z.record(z.literal(env.NEXT_PUBLIC_DAPP_ID), z.any()),
  status: z.union([
    z.literal("unsigned"),
    z.literal("submitted"),
    z.literal("confirmed"),
  ]),
});

const contractSchema = z.object({
  headers: z.array(contractHeaderSchema),
  previousRange: z.object({
    _tag: z.union([z.literal("Some"), z.literal("None")]),
  }),
  nextRange: z.object({
    _tag: z.union([z.literal("Some"), z.literal("None")]),
  }),
});

const caseSchema = z.object({
  deposits: z.bigint(),
  into_account: z.object({
    role_token: z.string(),
  }),
  of_token: z.object({
    currency_symbol: z.string(),
    token_name: z.string(),
  }),
  party: z.object({
    role_token: z.string(),
  }),
});

const thenSchema = z.object({
  when: z
    .array(
      z.object({
        case: caseSchema,
        then: z.object({
          from_account: z.object({
            role_token: z.string(),
          }),
          pay: z.bigint(),
          token: z.object({
            currency_symbol: z.string(),
            token_name: z.string(),
          }),
        }),
      }),
    )
    .nonempty(),
});

const whenSchema = z.object({
  case: caseSchema,
  then: thenSchema,
});

const contractDetailsSchema = z.object({
  contractId: z
    .string()
    .min(64)
    .transform((x: string) => contractId(x)),
  initialContract: z.object({
    when: z.array(whenSchema).nonempty(),
    timeout: z.bigint(),
  }),
});

type OfferedType = z.infer<typeof caseSchema>;
type DesiredType = z.infer<typeof thenSchema>;

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
