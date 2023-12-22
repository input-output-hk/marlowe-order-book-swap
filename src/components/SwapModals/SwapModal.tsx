import { mkEnvironment } from "@marlowe.io/language-core-v1";
import {
  contractId,
  unAddressBech32,
  type Token,
} from "@marlowe.io/runtime-core";
import Image from "next/image";
import { useRouter } from "next/router";
import CrossIcon from "public/cancel.svg";
import CheckIcon from "public/check.svg";
import DownArrowIcon from "public/down_arrow.svg";
import { useContext, useEffect, useState } from "react";
import { TSSDKContext } from "~/contexts/tssdk.context";
import {
  ADA,
  COLORS,
  ICON_SIZES,
  PAGES,
  adaToLovelace,
  checkIfIsToken,
  isEnoughBalance,
  waitTxConfirmation,
  type AssetAndAmount,
} from "~/utils";
import { TOKENS, tokensData } from "~/utils/tokens";
import { Button, SIZE } from "../Button/Button";
import { DropDown } from "../DropDown/DropDown";
import { Input } from "../Input/Input";
import { Loading } from "../Loading/Loading";
import { Modal } from "../Modal/Modal";
import { type ModalProps } from "./interface";

export const SwapModal = ({
  open,
  setOpen,
  offered,
  desired,
  id,
}: ModalProps) => {
  const [balance, setBalance] = useState<Token[] | null>(null);
  const [myAddress, setMyAddress] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [nextStep, setNextStep] = useState(false);
  const router = useRouter();
  const { runtimeLifecycle, client } = useContext(TSSDKContext);

  useEffect(() => {
    void getBalanceAndAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimeLifecycle]);

  const getBalanceAndAddress = async () => {
    if (runtimeLifecycle) {
      const address = await runtimeLifecycle?.wallet.getChangeAddress();
      setMyAddress(unAddressBech32(address));

      const walletBalance = await runtimeLifecycle?.wallet.getTokens();
      setBalance(walletBalance);
    }
  };

  const closeModal = () => setOpen(false);

  useEffect(() => {
    if (nextStep && runtimeLifecycle) void makeNotify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextStep]);

  const makeNotify = async () => {
    if (!runtimeLifecycle) return;
    await runtimeLifecycle.contracts.applyInputs(contractId(id), {
      inputs: ["input_notify"],
    });

    void router.push(PAGES.COMPLETE + `/${id}`);
  };

  const acceptSwap = async () => {
    try {
      setLoading(true);
      if (client && runtimeLifecycle) {
        const txId = await runtimeLifecycle.contracts.applyInputs(
          contractId(id),
          {
            inputs: [
              {
                input_from_party: { role_token: "buyer" },
                that_deposits:
                  desired.token === ADA
                    ? (adaToLovelace(BigInt(desired.amount)) as bigint)
                    : BigInt(desired.amount),
                of_token: {
                  currency_symbol: tokensData[desired.token as TOKENS].policyId,
                  token_name: desired.token === ADA ? "" : desired.token,
                },
                into_account: { role_token: "buyer" },
              },
            ],
          },
        );

        waitTxConfirmation(contractId(id), txId, client);

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setInterval(async () => {
          const nextStep = await runtimeLifecycle.contracts.getApplicableInputs(
            contractId(id),
            mkEnvironment(new Date())(new Date()),
          );

          if (nextStep.applicable_inputs.notify._tag === "Some") {
            setNextStep(true);
            return;
          }
        }, 1000);
      }
    } catch (e) {
      setLoading(false);
      setShowError(true);
      console.log(e);
    }
  };

  const getAssetDesired = (): AssetAndAmount | undefined => {
    if (checkIfIsToken(desired.token))
      return {
        ...tokensData[
          String(desired.token) === "" ? TOKENS.ADA : desired.token
        ],
        amount: desired.amount,
      };
  };
  const assetDesired = getAssetDesired();

  return (
    <Modal open={open} setOpen={setOpen} title="Swap Offer">
      {!balance ? (
        <div className="flex flex-grow items-center justify-center py-8">
          <Loading sizeDesktop={ICON_SIZES.XXL} sizeMobile={ICON_SIZES.L} />
        </div>
      ) : (
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full flex-col items-center justify-center gap-5 align-middle">
            <div className="flex w-full flex-col content-start items-start gap-2 text-m-disabled">
              <Input
                label="You will swap"
                type="number"
                disabled
                placeholder={desired.amount.toString()}
                endContent={
                  <DropDown
                    options={[{ option: desired.token, icon: desired.icon }]}
                    disabled
                  />
                }
                className="py-4"
              />
              {assetDesired && isEnoughBalance(balance, assetDesired) ? (
                <div className="flex gap-2 pb-11 text-sm text-m-green">
                  <Image
                    src={CheckIcon as string}
                    height={ICON_SIZES.S}
                    alt="✓"
                  />
                  You have sufficient funds in your wallet
                </div>
              ) : (
                <div className="flex gap-2 pb-11 text-sm text-m-red">
                  <Image
                    src={CrossIcon as string}
                    height={ICON_SIZES.S}
                    alt="✗"
                  />
                  <p>
                    Insufficient funds,&nbsp;
                    <span className="font-medium underline">
                      add tokens to wallet
                    </span>
                  </p>
                </div>
              )}
              <hr className="h-1 w-full " />
              <Input
                label="You will receive"
                type="number"
                disabled
                placeholder={offered.amount.toString()}
                endContent={
                  <DropDown
                    options={[{ option: offered.token, icon: offered.icon }]}
                    disabled
                  />
                }
                className="py-4"
              />
            </div>
            <div className="flex w-full flex-col content-start items-start gap-4 text-m-disabled">
              <div className="flex items-center gap-2 align-middle text-lg font-medium">
                <Image
                  src={DownArrowIcon as string}
                  height={ICON_SIZES.M}
                  alt="↓"
                />
                Transferred to
              </div>
              <div className="flex w-full flex-col gap-2 text-sm font-normal ">
                Your wallet address
                <div className="break-words rounded-lg border border-m-light-blue bg-m-light-blue px-5 py-3 font-semibold text-black">
                  {myAddress}
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col justify-between gap-5 pt-5 text-sm sm:flex-row">
              <div className="w-full">
                <Button
                  size={SIZE.SMALL}
                  color={COLORS.BLACK}
                  onClick={closeModal}
                >
                  Cancel
                </Button>
              </div>
              <div className="w-full">
                <Button
                  size={SIZE.SMALL}
                  filled
                  onClick={acceptSwap}
                  disabled={
                    assetDesired && !isEnoughBalance(balance, assetDesired)
                  }
                >
                  Confirm Swap
                </Button>
              </div>
            </div>
            {showError && (
              <div className="font-semibold text-m-red">
                There was an error on the transaction
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
                </b>
              ))}
          </div>
        </div>
      )}
    </Modal>
  );
};
