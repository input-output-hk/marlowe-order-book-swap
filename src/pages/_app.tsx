import { type RuntimeLifecycle } from "@marlowe.io/runtime-lifecycle/api";
import {
  mkRuntimeLifecycle,
  type BrowserRuntimeLifecycleOptions,
} from "@marlowe.io/runtime-lifecycle/browser";
import { type SupportedWalletName } from "@marlowe.io/wallet/browser";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import {
  CardanoProvider,
  type UseCardanoNodeOptions,
  type UseCardanoOptions,
} from "use-cardano";
import { Footer } from "~/components/Footer/Footer";
import { Header } from "~/components/Header/Header";
import { WalletWidget } from "~/components/WalletWidget/WalletWidget";
import { RuntimeContext } from "~/contexts/runtime.context";
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

  const setRuntime = async (options: BrowserRuntimeLifecycleOptions) => {
    const runtime = await mkRuntimeLifecycle(options);
    setRuntimeLifecycle(runtime);
  };

  useEffect(() => {
    const walletInfo = window.localStorage.getItem("walletInfo");
    if (walletInfo) {
      const { walletProvider } = JSON.parse(walletInfo) as IWalletInStorage;

      void setRuntime({
        runtimeURL: env.NEXT_PUBLIC_RUNTIME_URL,
        walletName: walletProvider as SupportedWalletName,
      });
    }
  }, []);

  const useCardanoNodeOptions: UseCardanoNodeOptions = {
    provider: "blockfrost",
    projectId: env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID,
  };

  const options: UseCardanoOptions = {
    allowedNetworks: ["Mainnet", "Testnet"],
    testnetNetwork: "Preprod",
    node: useCardanoNodeOptions,
    autoReconnect: false,
  };

  return (
    <>
      <style jsx global>
        {`
          :root {
            --inter-font: ${inter.style.fontFamily};
          }
        `}
      </style>
      <RuntimeContext.Provider
        value={{
          runtimeLifecycle,
          setRuntime,
        }}
      >
        <CardanoProvider options={options}>
          <Header
            links={headerLinks}
            title={HEADER_TITLE}
            homeLink={PAGES.LISTING}
          >
            <WalletWidget />
          </Header>
          <Component {...pageProps} />
          <Footer
            footerLinks={footerLinks}
            socialMediaLinks={socialMediaLinks}
          />
        </CardanoProvider>
      </RuntimeContext.Provider>
    </>
  );
};

export default api.withTRPC(MyApp);
