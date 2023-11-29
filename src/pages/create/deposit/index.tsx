import { contractId } from "@marlowe.io/runtime-core";
import { mkRestClient } from "@marlowe.io/runtime-rest-client";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Button } from "~/components/Button/Button";
import { RuntimeContext } from "~/contexts/runtime.context";
import { env } from "~/env.mjs";
import { ADA, PAGES, lovelaceToAda } from "~/utils";
import { tokensData, type TOKENS } from "~/utils/tokens";

export default function Deposit() {
  const router = useRouter();
  const client = mkRestClient(env.NEXT_PUBLIC_RUNTIME_URL);
  const { runtimeLifecycle } = useContext(RuntimeContext);

  async function handleApplyInput() {
    try {
      const { tokenName, amount, id } = router.query as {
        tokenName: string;
        amount: string;
        id: string;
      };
      if (id && runtimeLifecycle) {
        const contract = await client.getContractById(contractId(id));
        const txId = await runtimeLifecycle.contracts.applyInputs(
          contract.contractId,
          {
            inputs: [
              {
                input_from_party: { role_token: "provider" },
                that_deposits:
                  tokenName === ADA
                    ? (lovelaceToAda(BigInt(amount)) as bigint)
                    : BigInt(amount),
                of_token: {
                  currency_symbol:
                    tokensData[tokenName as TOKENS].currency_symbol,
                  token_name: tokenName === ADA ? "" : tokenName,
                },
                into_account: { role_token: "provider" },
              },
            ],
          },
        );

        if (await runtimeLifecycle?.wallet.waitConfirmation(txId)) {
          void router.push(PAGES.LISTING);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <Head>
        <title>Order Book Swap Prototype - Create</title>
        <meta name="description" content="Create Listing" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      <div>Deposit</div>
      <Button onClick={handleApplyInput}>Deposit</Button>
    </>
  );
}
