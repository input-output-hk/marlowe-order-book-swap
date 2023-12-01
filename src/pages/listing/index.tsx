import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { ErrorMessage } from "~/components/ErrorMessage/ErrorMessage";
import { ListingPage } from "~/components/ListingPage/ListingPage";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { getContracts, type IPagination, type ITableData } from "~/utils";

export default function Listing() {
  const [data, setData] = useState<ITableData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<IPagination>({
    offset: 0,
    fetchMore: false,
  });
  const { client } = useContext(TSSDKContext);

  useEffect(() => {
    if (client) {
      void getContracts(client, pagination, setPagination, setData, setError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, pagination.offset]);

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
        />
      )}
    </>
  );
}
