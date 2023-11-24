import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import DownIcon from "public/down_arrow.svg";
import { useContext, useEffect, useState, type FormEvent } from "react";
import { useCardano } from "use-cardano";
import { Button, SIZE } from "~/components/Button/Button";
import { RuntimeContext } from "~/contexts/runtime.context";
import { env } from "~/env.mjs";
import type { IOptions } from "~/utils";
import { COLORS, ICON_SIZES, PAGES, getSwapContract } from "~/utils";
import { Loading } from "../Loading/Loading";
import { CalendarInput } from "./CalendarInput";
import { TokenInputs } from "./TokenInputs";
import {
  checkValidity,
  isEveryFieldValid,
  type ICreateErrors,
  type ICreateLoading,
} from "./utils";

export const CreateListing = () => {
  const [createLoading, setCreateLoading] = useState<ICreateLoading>({
    loading: true,
    contract: false,
    confirmation: false,
  });
  const [errors, setErrors] = useState<ICreateErrors>({
    valueOffered: undefined,
    valueDesired: undefined,
    dropOffered: undefined,
    dropDesired: undefined,
    expiryDate: undefined,
    startDate: undefined,
    beforeTodayStartError: undefined,
    beforeTodayExpiryError: undefined,
    transactionError: undefined,
  });

  const [valueOffered, setValueOffered] = useState<string>("");
  const [selectedOffered, setSelectedOffered] = useState<IOptions>({
    option: "Token Select",
    icon: <></>,
  });
  const [startDate, setStartDate] = useState<string>("");
  const [valueDesired, setValueDesired] = useState<string>("");
  const [selectedDesired, setSelectedDesired] = useState<IOptions>({
    option: "Token Select",
    icon: <></>,
  });
  const [expiryDate, setExpiryDate] = useState<string>("");

  const router = useRouter();
  const { account, walletProvider } = useCardano();
  const { runtimeLifecycle, setRuntime } = useContext(RuntimeContext);

  useEffect(() => {
    const walletInfo = window.localStorage.getItem("walletInfo");
    if (!account.address || walletInfo) {
      setCreateLoading((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, [account.address]);

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    checkValidity({
      setErrors,
      valueOffered,
      valueDesired,
      selectedOffered,
      selectedDesired,
      expiryDate,
      startDate,
    });

    if (!setRuntime || !runtimeLifecycle) return;
    if (isEveryFieldValid(errors)) {
      setCreateLoading((prev) => ({
        ...prev,
        contract: true,
      }));

      try {
        const swapContract = getSwapContract({
          valueOffered,
          valueDesired,
          selectedOffered,
          selectedDesired,
          address: account.address!,
        });

        const contract = await runtimeLifecycle.contracts.createContract({
          contract: swapContract,
          tags: {
            [`${env.NEXT_PUBLIC_DAPP_ID}`]: {
              title: "TestSwap",
            },
          },
        });

        setCreateLoading((prev) => ({
          ...prev,
          contract: false,
          confirmation: true,
        }));
        await runtimeLifecycle.wallet.waitConfirmation(contract[1]);
        setCreateLoading((prev) => ({
          ...prev,
          confirmation: false,
        }));

        void router.push(PAGES.LISTING);
      } catch (err) {
        console.log(err);
        setErrors({
          ...errors,
          transactionError: "There was an error creating the transaction",
        });
        setCreateLoading((prev) => ({
          ...prev,
          contract: false,
        }));
      }
    }
  };

  if (createLoading.loading) {
    return (
      <div className="flex flex-grow items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <form
      className="flex h-fit flex-grow flex-col items-center justify-center text-m-disabled"
      onSubmit={submitForm}
    >
      <div className="flex w-4/5 flex-col items-center justify-center gap-5 rounded-lg border px-7 py-8 align-middle shadow-container md:w-4/5 lg:w-3/5">
        <h1 className="flex items-start self-stretch text-2xl font-bold">
          Token Swap Listing
        </h1>
        <div className="flex w-full flex-col content-start items-start gap-2">
          <div className="font-bold">Details</div>
          <TokenInputs
            label="You will swap *"
            valueOffered={valueOffered}
            setValueOffered={setValueOffered}
            selectedOffered={selectedOffered}
            setSelectedOffered={setSelectedOffered}
            errors={[errors.dropOffered, errors.valueOffered]}
          />
          <Image
            src={DownIcon as string}
            alt="↓"
            height={ICON_SIZES.L}
            className="flex justify-center self-center"
          />
          <TokenInputs
            label="You will receive *"
            valueOffered={valueDesired}
            setValueOffered={setValueDesired}
            selectedOffered={selectedDesired}
            setSelectedOffered={setSelectedDesired}
            errors={[errors.dropDesired, errors.valueDesired]}
          />
        </div>
        <div className="flex w-full flex-col content-start items-start gap-4">
          <div className="font-bold">Expiry</div>
          <div className="flex w-full flex-col gap-8 text-sm font-normal md:flex-row ">
            <div className="flex w-full flex-col gap-2">
              <CalendarInput
                label="Listing start date"
                value={startDate}
                setValue={setStartDate}
                errors={[errors.startDate, errors.beforeTodayStartError]}
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <CalendarInput
                label="Listing expiry date *"
                value={expiryDate}
                setValue={setExpiryDate}
                errors={[errors.expiryDate, errors.beforeTodayExpiryError]}
              />
            </div>
          </div>
          <span>
            By default, clicking &ldquo;Accept&rdquo; will automatically start
            the offer.
          </span>
        </div>
        <div className="flex w-full flex-col gap-10 pt-5 text-sm md:gap-6 lg:flex-row lg:justify-end">
          {createLoading.contract && (
            <b className="w-full text-base text-m-green">
              Please wait. Creating transaction...
            </b>
          )}
          {createLoading.confirmation && (
            <div className="flex w-full items-center gap-4">
              <Loading sizeDesktop={ICON_SIZES.XS} sizeMobile={ICON_SIZES.XS} />
              <b className="text-base text-m-purple">
                Don&apos;t leave the page. Waiting confirmation...
              </b>
            </div>
          )}
          {errors.transactionError && (
            <b className="w-full text-base text-m-red">
              {errors.transactionError}
            </b>
          )}
          <div className="flex justify-end gap-6">
            <Link href={PAGES.LISTING}>
              <Button
                size={SIZE.SMALL}
                color={COLORS.BLACK}
                disabled={createLoading.contract || createLoading.confirmation}
              >
                Cancel
              </Button>
            </Link>
            <div>
              <Button
                size={SIZE.SMALL}
                filled
                type="submit"
                disabled={
                  !account.address ||
                  !walletProvider ||
                  createLoading.contract ||
                  createLoading.confirmation
                }
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
