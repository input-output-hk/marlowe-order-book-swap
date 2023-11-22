import { type ContractId, type Tags } from "@marlowe.io/runtime-core";
import { mkRestClient } from "@marlowe.io/runtime-rest-client";
import { iso } from "newtype-ts";
import Head from "next/head";
import {
  mkSwapContract,
  type SwapRequest,
} from "node_modules/@marlowe.io/language-examples/dist/esm/swaps/swap-token-token";
import { useContext } from "react";
import { Button } from "~/components/Button/Button";
import { RuntimeContext } from "~/contexts/runtime.context";
import { env } from "~/env.mjs";

export default function Test() {
  const { runtimeLifecycle, setRuntime } = useContext(RuntimeContext);

  const handleClick = async () => {
    if (!setRuntime) return;

    await setRuntime({
      runtimeURL: env.NEXT_PUBLIC_RUNTIME_URL,
      walletName: "eternl",
    });
  };

  const createContract = async () => {
    if (!runtimeLifecycle) return;

    const swapRequest: SwapRequest = {
      provider: {
        roleName: "testProvider",
        depositTimeout: BigInt(1000),
        value: {
          amount: BigInt(100),
          token: {
            currency_symbol:
              "77211b30313564b8b11db9c9de94addc5fa305f5d47fd278140eef63",
            token_name: "SODITA",
          },
        },
      },
      swapper: {
        roleName: "testSwap",
        depositTimeout: BigInt(1000),
        value: {
          amount: BigInt(100),
          token: {
            currency_symbol: "",
            token_name: "",
          },
        },
      },
    };

    const swapContract = mkSwapContract(swapRequest);
    console.log(swapContract);

    const tags: Tags = {
      "marlowe.examples.swap.prototype": {
        title: "TestSwap",
      },
    };

    try {
      const response = await runtimeLifecycle.contracts.createContract({
        contract: swapContract,
        tags,
      });

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClient = async () => {
    const client = mkRestClient(env.NEXT_PUBLIC_RUNTIME_URL);
    const hasValidRuntime = await client.healthcheck();

    if (!hasValidRuntime) throw new Error("Invalid Marlowe Runtime instance");

    // const contracts = await client.getContracts({
    //   tags: [`${env.NEXT_PUBLIC_DAPP_ID}`],
    // });

    const isoContractId = iso<ContractId>();
    const contractId = isoContractId.wrap(
      "2aa4b2bedaef6fd748e116f74da7078b650d66bec6d0b0817c04427213782303#1",
    );
    const myContract = await client.getContractById(contractId);

    console.log(myContract);
  };

  return (
    <>
      <Head>
        <title>Order Book Swap Prototype</title>
        <meta name="description" content="Token Swap Prototype" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      <main className="flex h-screen w-full flex-grow flex-col items-center justify-center gap-6 px-52">
        <Button onClick={handleClick}>Runtime</Button>
        <Button onClick={handleClient}>Client</Button>
        <Button onClick={createContract}>Create</Button>
      </main>
    </>
  );
}
