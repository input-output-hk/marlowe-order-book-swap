import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { ErrorMessage } from "~/components/ErrorMessage/ErrorMessage";
import { ListingPage } from "~/components/ListingPage/ListingPage";
import { TSSDKContext } from "~/contexts/tssdk.context";
import useDebounce from "~/hooks/useDebounce";
import { getContracts, type IFilters, type ITableData } from "~/utils";

export interface IPagination {
  page?: number;
  fetchMore: boolean;
}

interface IQueryParams {
  page?: string;
}

export default function Listing() {
  const [data, setData] = useState<ITableData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<IFilters>({
    filterOwnListings: false,
    searchQuery: "",
    owner: "",
  });
  const [pagination, setPagination] = useState<IPagination>({
    page: undefined,
    fetchMore: false,
  });
  const { client } = useContext(TSSDKContext);
  const { query }: { query: IQueryParams } = useRouter();

  const asyncGetContracts = async () => {
    if (client) {
      setLoading(true);

      await getContracts(
        client,
        setData,
        setPagination,
        setError,
        filters.searchQuery,
        query.page ? Number(query.page) : 1,
      );
      setLoading(false);
    }
  };

  useDebounce({
    effect: () => {
      setPagination((prev) => {
        return {
          ...prev,
          page: query.page ? Number(query.page) : 1,
        };
      });
      void asyncGetContracts();
    },
    dependencies: [client, filters.searchQuery, query.page],
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
          pagination={pagination}
          setPagination={setPagination}
          filters={filters}
          setFilters={setFilters}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </>
  );
}
