import Head from "next/head";
import { Deposit } from "~/components/Deposit/Deposit";

export default function DepositPage() {
  return (
    <>
      <Head>
        <title>Order Book Swap Prototype - Create</title>
        <meta name="description" content="Create Listing" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      <Deposit />
    </>
  );
}
