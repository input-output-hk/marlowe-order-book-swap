import { contractId } from "@marlowe.io/runtime-core";
import Image from "next/image";
import { useRouter } from "next/router";
import CardanoIcon from "public/cardano.svg";
import SwapCircleIcon from "public/swap_circle.svg";
import SwapIcon from "public/swap_vert.svg";
import { useContext, useEffect, useState } from "react";
import { Button, SIZE } from "~/components/Button/Button";

import { TSSDKContext } from "~/contexts/tssdk.context";
import {
  ICON_SIZES,
  PAGES,
  dateTimeOptions,
  decimalToInt,
  getAddress,
  parseTokenName,
  textToHexa,
  waitTxConfirmation,
} from "~/utils";
import { lookupTokenMetadata } from "~/utils/lookupTokenMetadata";
import { tokensData, type TOKENS } from "~/utils/tokens";
import { Loading } from "../Loading/Loading";

export const Deposit = () => {
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showError, setShowError] = useState(false);
  const [myAddress, setMyAddress] = useState<string | undefined>(undefined);
  const [offeredIcon, setOfferedIcon] = useState<JSX.Element>(
    <Image
      src={CardanoIcon as string}
      alt="C"
      height={ICON_SIZES.S}
      width={ICON_SIZES.S}
    />,
  );
  const router = useRouter();
  const { runtimeLifecycle, client } = useContext(TSSDKContext);

  const {
    id,
    offeredToken,
    offeredAmount,
    offeredPolicyId,
    offeredDecimals,
    desiredToken,
    desiredAmount,
    desiredPolicyId,
    expiryDate,
  } = router.query as {
    offeredToken: string;
    offeredAmount: string;
    offeredPolicyId: string;
    offeredDecimals: string;
    desiredToken: string;
    desiredAmount: string;
    desiredPolicyId: string;
    id: string;
    expiryDate: string;
  };
  const [desiredIcon, setDesiredIcon] = useState<JSX.Element>(
    tokensData[desiredToken as TOKENS]?.icon,
  );

  useEffect(() => {
    if (runtimeLifecycle) void getAddress(runtimeLifecycle, setMyAddress);
    if (finished) void router.push(PAGES.LISTING);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getIcons = async () => {
      const offeredMetadata = await lookupTokenMetadata(
        offeredPolicyId,
        textToHexa(parseTokenName(offeredToken)),
        "preprod",
      );
      offeredMetadata.logo &&
        setOfferedIcon(
          <Image
            src={"data:image/png;base64," + offeredMetadata.logo}
            alt={offeredMetadata.logo ? offeredMetadata.name : "C"}
            height={ICON_SIZES.S}
            width={ICON_SIZES.S}
          />,
        );

      if (tokensData[desiredToken as TOKENS]?.icon === <></>) {
        const desiredMetadata = await lookupTokenMetadata(
          desiredPolicyId,
          textToHexa(parseTokenName(desiredToken)),
          "preprod",
        );
        desiredMetadata.logo &&
          setDesiredIcon(
            <Image
              src={
                desiredMetadata.logo
                  ? "data:image/png;base64," + desiredMetadata.logo
                  : (CardanoIcon as string)
              }
              alt={desiredMetadata.logo ? desiredMetadata.name : "C"}
              height={ICON_SIZES.S}
              width={ICON_SIZES.S}
            />,
          );
      }
    };
    getIcons().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    runtimeLifecycle,
    finished,
    offeredPolicyId,
    offeredToken,
    desiredToken,
    desiredPolicyId,
  ]);

  async function handleApplyInput() {
    setShowError(false);
    try {
      setLoading(true);
      if (client && runtimeLifecycle && myAddress) {
        const txId = await runtimeLifecycle.contracts.applyInputs(
          contractId(id),
          {
            inputs: [
              {
                input_from_party: { address: myAddress },
                that_deposits: decimalToInt(
                  Number(offeredAmount),
                  Number(offeredDecimals),
                ) as bigint,
                of_token: {
                  currency_symbol: offeredPolicyId,
                  token_name: parseTokenName(offeredToken),
                },
                into_account: { address: myAddress },
              },
            ],
          },
        );

        waitTxConfirmation(contractId(id), txId, client, setFinished);
      }
    } catch (e) {
      setLoading(false);
      setShowError(true);
      console.log(e);
    }
  }

  return (
    <div className="m-auto flex w-1/2 flex-col gap-4 shadow-container">
      <div className="flex gap-3 rounded-lg rounded-b-none border border-b-0 bg-m-light-purple p-5 text-center text-2xl">
        <Image src={SwapCircleIcon as string} alt="" height={ICON_SIZES.L} />
        Swap Details
      </div>
      <div className="flex flex-col items-center gap-4 p-5">
        <div className="flex flex-col items-center justify-center gap-5 md:flex-row md:items-start">
          <div className="flex gap-3 text-xl font-semibold">
            {offeredIcon}
            {offeredAmount}&nbsp;&nbsp;{offeredToken}
          </div>
          <Image
            src={SwapIcon as string}
            alt="↑↓"
            height={ICON_SIZES.L}
            className="md:rotate-90"
          />
          <div className="flex gap-3 text-xl font-semibold">
            {desiredIcon}
            {desiredAmount}&nbsp;&nbsp;{desiredToken}
          </div>
        </div>
        <hr className="w-full" />
        <div className="flex flex-col gap-1 text-center md:flex-row md:gap-4">
          <div className="text-lg md:font-semibold">Swap expiry date:</div>
          <div className="text-xl font-semibold md:font-normal">
            {new Date(expiryDate).toLocaleDateString(
              undefined,
              dateTimeOptions,
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 text-center md:flex-row md:gap-4">
          <div className="text-lg md:font-semibold ">You will deposit:</div>
          <div className="text-xl font-semibold md:font-normal">
            {offeredAmount} &nbsp;
            {offeredToken} + Fee
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 pt-5 text-center text-sm text-m-blue">
          <div className="w-36 text-base">
            <Button size={SIZE.SMALL} onClick={handleApplyInput}>
              Deposit
            </Button>
          </div>
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
                <b>Don&apos;t leave the page. Waiting confirmation...</b>
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
