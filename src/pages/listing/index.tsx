import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ErrorMessage } from "~/components/ErrorMessage/ErrorMessage";
import { ListingPage } from "~/components/ListingPage/ListingPage";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { getContracts, type IPagination, type ITableData } from "~/utils";

interface IListingQueryParams {
  page?: string;
}

export default function Listing() {
  const [data, setData] = useState<ITableData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<IPagination>({
    fetchMore: false,
  });
  const [loading, setLoading] = useState(true);
  const { query }: { query: IListingQueryParams } = useRouter();
  const { client } = useContext(TSSDKContext);

  useEffect(() => {
    setLoading((prev) => !prev);
    if (client && !query.page) {
      void getContracts(client, 1, setPagination, setData, setError);
    }
    if (client && query.page) {
      void getContracts(
        client,
        Number(query.page),
        setPagination,
        setData,
        setError,
      );
    }
    setLoading((prev) => !prev);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, query.page, setLoading]);

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
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </>
  );
}
