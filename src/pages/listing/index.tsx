import Head from "next/head";
import { useContext, useState } from "react";
import { ErrorMessage } from "~/components/ErrorMessage/ErrorMessage";
import { ListingPage } from "~/components/ListingPage/ListingPage";
import { TSSDKContext } from "~/contexts/tssdk.context";
import useDebounce from "~/hooks/useDebounce";
import { getContracts, type IFilters, type ITableData } from "~/utils";

export default function Listing() {
  const [data, setData] = useState<ITableData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<IFilters>({
    filterOwnListings: false,
    searchQuery: "",
    owner: "",
  });
  const { client } = useContext(TSSDKContext);

  const asyncGetContracts = async () => {
    if (client) {
      setLoading(true);
      await getContracts(client, setData, setError, filters.searchQuery);
      setLoading(false);
    }
  };

  useDebounce({
    effect: () => {
      void asyncGetContracts();
    },
    dependencies: [client, filters.searchQuery],
    delay: 1000,
  });

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
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </>
  );
}
