import { contractId } from "@marlowe.io/runtime-core";
import { mkRestClient } from "@marlowe.io/runtime-rest-client";
import Image from "next/image";
import { useRouter } from "next/router";
import SwapCircleIcon from "public/swap_circle.svg";
import SwapIcon from "public/swap_vert.svg";
import { useContext, useState } from "react";
import { Button } from "~/components/Button/Button";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { env } from "~/env.mjs";
import { ADA, ICON_SIZES, PAGES, adaToLovelace } from "~/utils";
import { tokensData, type TOKENS } from "~/utils/tokens";
import { Loading } from "../Loading/Loading";

export const Deposit = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const router = useRouter();
  const client = mkRestClient(env.NEXT_PUBLIC_RUNTIME_URL);
  const { runtimeLifecycle } = useContext(TSSDKContext);

  const {
    id,
    offeredToken,
    offeredAmount,
    desiredToken,
    desiredAmount,
    expiryDate,
  } = router.query as {
    offeredToken: string;
    offeredAmount: string;
    desiredToken: string;
    desiredAmount: string;
    id: string;
    expiryDate: string;
  };

  async function handleApplyInput() {
    try {
      setLoading(true);
      if (id && runtimeLifecycle) {
        const contract = await client.getContractById(contractId(id));
        const txId = await runtimeLifecycle.contracts.applyInputs(
          contract.contractId,
          {
            inputs: [
              {
                input_from_party: { role_token: "provider" },
                that_deposits:
                  offeredToken === ADA
                    ? (adaToLovelace(BigInt(offeredAmount)) as bigint)
                    : BigInt(offeredAmount),
                of_token: {
                  currency_symbol:
                    tokensData[offeredToken as TOKENS].currency_symbol,
                  token_name: offeredToken === ADA ? "" : offeredToken,
                },
                into_account: { role_token: "provider" },
              },
            ],
          },
        );

        await runtimeLifecycle?.wallet.waitConfirmation(txId).then(() => {
          void router.push(PAGES.LISTING);
        });
      }
    } catch (e) {
      setLoading(false);
      setShowError(true);
      console.log(e);
    }
  }

  return (
    <div className="m-auto flex w-1/3 flex-col gap-4 shadow-container">
      <div className="flex gap-3 rounded-lg rounded-b-none border border-b-0 bg-m-light-purple p-5 text-center text-2xl">
        <Image src={SwapCircleIcon as string} alt="" height={ICON_SIZES.L} />
        Swap Details
      </div>
      <div className="flex flex-col  items-center gap-4 p-5">
        <div className="flex justify-center gap-5">
          <div className="flex gap-3 text-xl font-semibold">
            {tokensData[offeredToken as TOKENS]?.icon}
            {offeredAmount}&nbsp;&nbsp;{offeredToken}
          </div>
          <Image
            src={SwapIcon as string}
            alt="↑↓"
            height={ICON_SIZES.L}
            className="rotate-90"
          />

          <div className="flex gap-3 text-xl font-semibold">
            {tokensData[desiredToken as TOKENS]?.icon}
            {desiredAmount}&nbsp;&nbsp;{desiredToken}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-lg font-semibold">Swap expiry date:</div>
          <div className="text-xl">{expiryDate}</div>
        </div>
        <div className="flex gap-4">
          <div className="text-lg font-semibold">You will deposit:</div>
          <div className="text-xl">
            {offeredAmount} &nbsp;
            {offeredToken} + Fee
          </div>
        </div>

        <div className="flex  flex-col gap-3 p-5 pb-0 text-center text-m-blue">
          <Button onClick={handleApplyInput}>Deposit</Button>
          {showError && (
            <div className="font-semibold text-m-red">
              There was an error on the deposit
            </div>
          )}
          {!showError &&
            (loading ? (
              <div className="flex w-full items-center gap-4">
                <Loading
                  sizeDesktop={ICON_SIZES.XS}
                  sizeMobile={ICON_SIZES.XS}
                />
                <b className="text-base text-m-purple">
                  Don&apos;t leave the page. Waiting confirmation...
                </b>
              </div>
            ) : (
              <b>
                Please don&apos;t close this page until the transaction is
                confirmed.
                <br /> You will be redirected to the listing when the
                transaction ends.
              </b>
            ))}
        </div>
      </div>
    </div>
  );
};
