import Head from "next/head";
import { Header } from "~/components/Header/Header";
import { WalletSelect } from "~/components/WalletSelect/WalletSelect";

export default function Home() {
  return (
    <>
      <Head>
        <title>Token Swap</title>
        <meta name="description" content="Token Swap Prototype" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      <Header />

      <main className="h-screen w-full flex-grow px-4 pb-48 pt-4 sm:px-28 md:flex md:items-center md:justify-center md:px-0 ">
        <WalletSelect />
      </main>
    </>
  );
}
