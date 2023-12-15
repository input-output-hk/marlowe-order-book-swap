import { type RuntimeLifecycle } from "@marlowe.io/runtime-lifecycle/api";
import {
  mkRuntimeLifecycle,
  type BrowserRuntimeLifecycleOptions,
} from "@marlowe.io/runtime-lifecycle/browser";
import { mkRestClient, type RestClient } from "@marlowe.io/runtime-rest-client";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { Footer } from "~/components/Footer/Footer";
import { Header } from "~/components/Header/Header";
import { WalletWidget } from "~/components/WalletWidget/WalletWidget";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { env } from "~/env.mjs";
import "~/styles/globals.css";
import {
  HEADER_TITLE,
  PAGES,
  footerLinks,
  headerLinks,
  socialMediaLinks,
  type IWalletInStorage,
} from "~/utils";
import { api } from "~/utils/api";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--inter-font",
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const [runtimeLifecycle, setRuntimeLifecycle] = useState<
    RuntimeLifecycle | undefined
  >(undefined);
  const [client, setClient] = useState<RestClient | undefined>(undefined);

  const setRuntime = async (options: BrowserRuntimeLifecycleOptions) => {
    try {
      const runtime = await mkRuntimeLifecycle(options);
      setRuntimeLifecycle(runtime);
    } catch (error) {
      console.error(error);
    }
  };

  const setRestClient = () => {
    const newClient = mkRestClient(env.NEXT_PUBLIC_RUNTIME_URL);
    setClient(newClient);
  };

  useEffect(() => {
    const walletInfo = window.localStorage.getItem("walletInfo");
    if (walletInfo) {
      const { walletProvider: walletProvider } = JSON.parse(
        walletInfo,
      ) as IWalletInStorage;

      void setRuntime({
        runtimeURL: env.NEXT_PUBLIC_RUNTIME_URL,
        walletName: walletProvider,
      });
    }

    setRestClient();
  }, []);

  return (
    <>
      <style jsx global>
        {`
          :root {
            --inter-font: ${inter.style.fontFamily};
          }
        `}
      </style>
      <TSSDKContext.Provider
        value={{
          runtimeLifecycle,
          setRuntime,
          client,
        }}
      >
        <Header
          links={headerLinks}
          title={HEADER_TITLE}
          homeLink={PAGES.LISTING}
        >
          <WalletWidget />
        </Header>
        <Component {...pageProps} />
        <Footer footerLinks={footerLinks} socialMediaLinks={socialMediaLinks} />
      </TSSDKContext.Provider>
    </>
  );
};

export default api.withTRPC(MyApp);
