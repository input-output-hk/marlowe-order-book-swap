/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Tags } from "@marlowe.io/runtime-core";
import { mkRestClient } from "@marlowe.io/runtime-rest-client";
import { type ContractDetails } from "@marlowe.io/runtime-rest-client/contract/details";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ListingPage } from "~/components/ListingPage/ListingPage";
import {
  defaultListing,
  getCreatedDate,
  getDesired,
  getOffered,
} from "~/components/ListingPage/utils";
import { env } from "~/env.mjs";
import { isWhen, type ITableData } from "~/utils";

export default function Listing() {
  const [example, setExample] = useState<ITableData[]>([]);

  const client = mkRestClient(env.NEXT_PUBLIC_RUNTIME_URL);

  useEffect(() => {
    const healthCheck = async () => {
      const hasValidRuntime = await client.healthcheck();
      if (!hasValidRuntime) throw new Error("Invalid Marlowe Runtime instance");
    };

    const getContracts = async () => {
      await client
        .getContracts({
          tags: [`${env.NEXT_PUBLIC_DAPP_ID}`],
        })
        .then(async (res) => {
          const contractsListPromise = res.headers.map((contract) => {
            return client.getContractById(contract.contractId);
          });
          const contractList = (await Promise.all(
            contractsListPromise,
          )) as (ContractDetails & { tags: Tags })[];
          const filteredContractList = contractList.filter((contract) => {
            const startDate: string =
              contract.tags[`${env.NEXT_PUBLIC_DAPP_ID}`].startDate;
            const endDate: string =
              contract.tags[`${env.NEXT_PUBLIC_DAPP_ID}`].expiryDate;
            return (
              new Date(startDate) > new Date() &&
              new Date(endDate) > new Date() &&
              contract.status === "confirmed"
            );
          });

          const formattedList: ITableData[] = filteredContractList.map(
            ({ contractId, initialContract }) => {
              if (isWhen(initialContract) && initialContract) {
                const contractDetails = initialContract.when[0]?.case;
                const contractDesired =
                  initialContract.when[0]?.then &&
                  isWhen(initialContract.when[0]?.then)
                    ? initialContract.when[0]?.then.when[0]?.case
                    : undefined;
                return {
                  id: Number(contractId),
                  createdBy: getCreatedDate(contractDetails),
                  offered: getOffered(contractDetails),
                  desired: getDesired(contractDesired, initialContract),

                  expiry: new Date(Number(initialContract.timeout)).toString(),
                };
              } else {
                return defaultListing;
              }
            },
          );
          setExample(formattedList);
        });
    };

    void healthCheck();
    void getContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Order Book Swap Prototype - Listing</title>
        <meta name="description" content="Order Book Listing" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      <ListingPage listingData={example} />
    </>
  );
}
