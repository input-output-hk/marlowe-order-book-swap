import {
  type Action,
  type Contract,
  type Deposit,
  type Party,
  type Role,
  type When,
} from "@marlowe.io/language-core-v1";
import { mkRestClient } from "@marlowe.io/runtime-rest-client";
import Head from "next/head";
import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";
import { useEffect, useState } from "react";
import { ListingPage } from "~/components/ListingPage/ListingPage";
import { env } from "~/env.mjs";
import { ICON_SIZES, type ITableData } from "~/utils";

export default function Listing() {
  const [example, setExample] = useState<ITableData[]>([]);

  const client = mkRestClient(env.NEXT_PUBLIC_RUNTIME_URL);

  const isWhen = (contract: Contract): contract is When => {
    if (typeof contract === "string") return false;
    return "when" in contract;
  };

  const isDeposit = (action: Action): action is Deposit => {
    return "deposit" in action;
  };

  const isParty = (party: Party): party is Role => {
    return "role_token" in party;
  };

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
          const contractList = await Promise.all(contractsListPromise);
          const formattedList: ITableData[] = contractList.map(
            ({ contractId, initialContract }) => {
              if (isWhen(initialContract) && initialContract !== undefined) {
                const contractDetails = initialContract.when[0]?.case;
                const contractDesired =
                  initialContract.when[0]?.then !== undefined &&
                  isWhen(initialContract.when[0]?.then) &&
                  initialContract.when[0]?.then.when[0]?.case;
                return {
                  id: Number(contractId),
                  createdBy:
                    contractDetails !== undefined &&
                    isDeposit(contractDetails) &&
                    isParty(contractDetails?.into_account)
                      ? contractDetails?.into_account?.role_token
                      : "",
                  offered:
                    contractDetails !== undefined && isDeposit(contractDetails)
                      ? {
                          token: contractDetails?.of_token.token_name,
                          amount:
                            contractDetails !== undefined &&
                            isDeposit(contractDetails)
                              ? Number(contractDetails?.deposits)
                              : 0,
                          icon: (
                            <Image
                              src={MarloweIcon as string}
                              alt="M"
                              height={ICON_SIZES.XS}
                            />
                          ),
                        }
                      : { token: "", amount: 0, icon: <></> },
                  desired:
                    contractDesired !== undefined &&
                    contractDesired !== false &&
                    isDeposit(contractDesired)
                      ? {
                          token: contractDesired?.of_token.token_name,
                          amount:
                            initialContract.when[0]?.then !== undefined &&
                            isWhen(initialContract.when[0]?.then)
                              ? Number(contractDesired.deposits)
                              : 0,
                          icon: (
                            <Image
                              src={MarloweIcon as string}
                              alt="M"
                              height={ICON_SIZES.XS}
                            />
                          ),
                        }
                      : { token: "", amount: 0, icon: <></> },
                  expiry: new Date(Number(initialContract.timeout)).toString(),
                };
              } else {
                return {
                  id: 1,
                  createdBy: "test_123",
                  offered: {
                    token: "Marlons",
                    amount: 999.0123778979214,
                    icon: (
                      <Image
                        src={MarloweIcon as string}
                        alt="M"
                        height={ICON_SIZES.XS}
                      />
                    ),
                  },
                  desired: {
                    token: "ADA",
                    amount: 278071203701,
                    icon: (
                      <Image
                        src={MarloweIcon as string}
                        alt="M"
                        height={ICON_SIZES.XS}
                      />
                    ),
                  },
                  expiry: "12/30/2023 11:35",
                };
              }
            },
          );
          setExample(formattedList);
        });
    };

    void healthCheck();
    void getContracts();
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
