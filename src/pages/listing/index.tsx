import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { ErrorMessage } from "~/components/ErrorMessage/ErrorMessage";
import { ListingPage } from "~/components/ListingPage/ListingPage";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { getContracts, type IFilters, type ITableData } from "~/utils";

export default function Listing() {
  const [data, setData] = useState<ITableData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IFilters>({
    filterOwnListings: false,
    searchQuery: "",
    owner: "",
  });
  const { client } = useContext(TSSDKContext);

  useEffect(() => {
    if (client) {
      void getContracts(client, setData, setError, filters.searchQuery);
    }
  }, [client, filters.searchQuery]);

  return (
    <>
      <Head>
        <title>Order Book Swap Prototype - Listing</title>
        <meta name="description" content="Order Book Listing" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <ListingPage
          listingData={data}
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </>
  );
}
