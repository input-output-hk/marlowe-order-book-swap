import Head from "next/head";
import { WithdrawPage } from "~/components/Withdraw/WithdrawPage";
export default function Withdraw() {
  return (
    <>
      <Head>
        <title>Order Book Swap Prototype - Withdraw</title>
        <meta name="description" content="Order Book Listing" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      <WithdrawPage />
    </>
  );
}
