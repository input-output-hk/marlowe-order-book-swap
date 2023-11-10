import Head from "next/head";
import { WalletSelect } from "~/components/WalletSelect/WalletSelect";

export default function Home() {
  return (
    <>
      <Head>
        <title>Order Book Swap Prototype</title>
        <meta name="description" content="Token Swap Prototype" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      <main className="h-screen w-full flex-grow px-4 pb-48 pt-4 sm:px-28 md:flex md:items-center md:justify-center md:px-0 ">
        <WalletSelect />
      </main>
    </>
  );
}
