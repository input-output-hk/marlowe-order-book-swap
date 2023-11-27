/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { ListingPage } from "~/components/ListingPage/ListingPage";
import { defaultListing } from "~/components/ListingPage/utils";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { getContracts, type ITableData } from "~/utils";

export default function Listing() {
  const [data, setData] = useState<ITableData[] | null>(null);
  const { client } = useContext(TSSDKContext);

  useEffect(() => {
    if (client) {
      void getContracts(client, setData);
      setData([defaultListing]);
    }
  }, [client]);

  return (
    <>
      <Head>
        <title>Order Book Swap Prototype - Listing</title>
        <meta name="description" content="Order Book Listing" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      <ListingPage listingData={data} />
    </>
  );
}
