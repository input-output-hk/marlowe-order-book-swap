import Head from "next/head";
import { CompleteSwap } from "~/components/Information/CompleteSwap";

export default function CompletePage() {
  return (
    <>
      <Head>
        <title>Order Book Swap Prototype - Swap Complete</title>
        <meta name="description" content="Swap Complete" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>
      <CompleteSwap />
    </>
  );
}
