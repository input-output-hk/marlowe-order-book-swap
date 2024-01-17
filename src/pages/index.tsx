import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ErrorMessage } from "~/components/ErrorMessage/ErrorMessage";
import { ListingPage } from "~/components/ListingPage/ListingPage";
import { TSSDKContext } from "~/contexts/tssdk.context";
import useDebounce from "~/hooks/useDebounce";
import useUpdate from "~/hooks/useUpdate";
import {
  UPDATING_INTERVAL,
  getContracts,
  type IFilters,
  type ITableData,
} from "~/utils";

export interface IPagination {
  page?: number;
  totalPages: number;
}

interface IQueryParams {
  page?: string;
}

export default function Home() {
  const [data, setData] = useState<ITableData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState<IFilters>({
    filterOwnListings: false,
    searchQuery: "",
    owner: "",
  });
  const [pagination, setPagination] = useState<IPagination>({
    page: undefined,
    totalPages: 0,
  });

  const { client, runtimeLifecycle } = useContext(TSSDKContext);
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

  const getAddress = async () => {
    const walletAddress = await runtimeLifecycle?.wallet.getChangeAddress();
    if (walletAddress)
      setFilters((prev) => ({
        ...prev,
        owner: String(walletAddress),
      }));
  };

  useEffect(() => {
    void getAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimeLifecycle]);

  useEffect(() => {
    setPagination((prev) => {
      return {
        ...prev,
        page: query.page ? Number(query.page) : 1,
      };
    });
    void asyncGetContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page]);

  useDebounce({
    effect: () => {
      void asyncGetContracts();
    },
    dependencies: [client, filters.searchQuery],
    delay: 1000,
  });

  useUpdate({
    callback: () => {
      if (pagination.page === 1 && !modalOpen) {
        void asyncGetContracts();
      }
    },
    delay: UPDATING_INTERVAL,
  });

  return (
    <>
      <Head>
        <title>Order Book Swap Prototype</title>
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
          pagination={pagination}
          setPagination={setPagination}
          setModalOpen={setModalOpen}
        />
      )}
    </>
  );
}
