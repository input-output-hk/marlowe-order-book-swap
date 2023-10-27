import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Header } from "~/components/Header/Header";
import { WalletSelect } from "~/components/WalletSelect/WalletSelect";
import { PAGES } from "~/utils";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkWallet = async () => {
      const wallet = window.localStorage.getItem("wallet");
      if (wallet) {
        await router.push(PAGES.LISTING);
      }
    };

    checkWallet().catch((e) => console.log(e));
  }, [router]);

  return (
    <>
      <Head>
        <title>Token Swap</title>
        <meta name="description" content="Token Swap Prototype" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      <Header />

      <main className="flex-grow-1 h-screen w-full px-4 pb-48 pt-4 sm:px-28 md:flex md:items-center md:justify-center md:px-0 ">
        <WalletSelect />
      </main>
    </>
  );
}
