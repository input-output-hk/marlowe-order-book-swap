import { unAddressBech32 } from "@marlowe.io/runtime-core";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
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
  const { client, runtimeLifecycle } = useContext(TSSDKContext);

  const asyncGetContracts = async () => {
    if (client) {
      setLoading(true);
      await getContracts(client, setData, setError, filters.searchQuery);
      setLoading(false);
    }
  };

  useEffect(() => {
    void getAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimeLifecycle]);

  useDebounce({
    effect: () => {
      void asyncGetContracts();
    },
    dependencies: [client, filters.searchQuery],
    delay: 1000,
  });

  const getAddress = async () => {
    const walletAddress = await runtimeLifecycle?.wallet.getChangeAddress();
    if (walletAddress)
      setFilters((prev) => ({
        ...prev,
        owner: unAddressBech32(walletAddress),
      }));
  };

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
        />
      )}
    </>
  );
}
