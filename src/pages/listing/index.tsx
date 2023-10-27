import Head from "next/head";
import { Header } from "~/components/Header/Header";

export default function Listing() {
  return (
    <>
      <Head>
        <title>Token Swap</title>
        <meta name="description" content="Token Swap Prototype" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>
      <Header />
    </>
  );
}
