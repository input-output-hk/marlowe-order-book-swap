import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import {
  CardanoProvider,
  UseCardanoNodeOptions,
  type UseCardanoOptions,
} from "use-cardano";
import { env } from "~/env.mjs";

import "~/styles/globals.css";
import { api } from "~/utils/api";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--inter-font",
});

const MyApp: AppType = ({ Component, pageProps }) => {
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
      <CardanoProvider options={options}>
        <Component {...pageProps} />
      </CardanoProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
