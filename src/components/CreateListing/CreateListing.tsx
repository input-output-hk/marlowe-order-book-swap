import { type Address } from "@marlowe.io/language-core-v1";
import {
  addressBech32,
  unContractId,
  type ContractId,
} from "@marlowe.io/runtime-core";
import { type RolesConfig } from "@marlowe.io/runtime-rest-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import DownIcon from "public/down_arrow.svg";
import { useContext, useEffect, useState, type FormEvent } from "react";
import { Button, SIZE } from "~/components/Button/Button";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { env } from "~/env.mjs";
import {
  COLORS,
  ICON_SIZES,
  PAGES,
  getAddress,
  getSwapContract,
  tokenToTag,
} from "~/utils";
import { type Asset } from "~/utils/tokens";
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
    contract: false,
    confirmation: false,
    contractConfirmed: "",
  });
  const [errors, setErrors] = useState<ICreateErrors>({
    valueOffered: undefined,
    valueDesired: undefined,
    tokenOffered: undefined,
    tokenDesired: undefined,
    expiryDate: undefined,
    startDate: undefined,
    beforeTodayStartError: undefined,
    beforeTodayExpiryError: undefined,
    transactionError: undefined,
  });

  const [valueOffered, setValueOffered] = useState<string>("");
  const [selectedOffered, setSelectedOffered] = useState<Asset>({
    tokenName: "",
    assetName: "",
    policyId: "",
    decimals: 0,
    icon: <></>,
  });
  const [startDate, setStartDate] = useState<string>("");
  const [valueDesired, setValueDesired] = useState<string>("");
  const [selectedDesired, setSelectedDesired] = useState<Asset>({
    tokenName: "",
    assetName: "",
    policyId: "",
    decimals: 0,
    icon: <></>,
  });
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [myAddress, setMyAddress] = useState<string | undefined>(undefined);

  const router = useRouter();
  const { runtimeLifecycle, setRuntime, client } = useContext(TSSDKContext);

  useEffect(() => {
    if (runtimeLifecycle) {
      void getAddress(runtimeLifecycle, setMyAddress);
    }
    if (createLoading.contractConfirmed !== "") {
      void router.push({
        pathname: PAGES.DEPOSIT,
        query: {
          id: createLoading.contractConfirmed,
          offeredToken: selectedOffered.assetName,
          offeredAmount: valueOffered,
          offeredPolicyId: selectedOffered.policyId,
          offeredDecimals: selectedOffered.decimals,
          desiredToken: selectedDesired.assetName,
          desiredAmount: valueDesired,
          expiryDate: expiryDate,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createLoading.contractConfirmed, runtimeLifecycle]);

  const waitConfirmation = (contractId: ContractId) => {
    if (!client) return;
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const pollingInterval = setInterval(async () => {
      const pollingContract = await client.getContractById(contractId);
      if (pollingContract.status === "confirmed") {
        clearInterval(pollingInterval);
        setCreateLoading((prev) => ({
          ...prev,
          confirmation: false,
          contractConfirmed: unContractId(contractId),
        }));
        return;
      }
    }, 3000);
  };

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

    if (
      isEveryFieldValid({
        valueOffered,
        valueDesired,
        selectedOffered,
        selectedDesired,
        expiryDate,
        startDate,
      }) &&
      myAddress
    ) {
      try {
        if (!setRuntime || !runtimeLifecycle) throw new Error("No runtime");
        setCreateLoading((prev) => ({
          ...prev,
          contract: true,
        }));

        const providerAddress: Address = {
          address: myAddress,
        };

        const swapContract = getSwapContract({
          valueOffered,
          valueDesired,
          selectedOffered,
          selectedDesired,
          expiryDate,
          providerAddress,
        });

        const roles: RolesConfig = {
          buyer: addressBech32(myAddress),
        };

        const tags = {
          [env.NEXT_PUBLIC_DAPP_ID]: {
            startDate: startDate !== "" ? startDate : new Date().toISOString(),
            expiryDate,
          },
          [tokenToTag(selectedOffered.assetName)]: "",
          [tokenToTag(selectedDesired.assetName)]: "",
        };

        const contract = await runtimeLifecycle.contracts.createContract({
          contract: swapContract,
          roles,
          tags,
        });

        setCreateLoading((prev) => ({
          ...prev,
          contract: false,
          confirmation: true,
        }));

        waitConfirmation(contract[0]);
      } catch (err) {
        console.log(err);
        setErrors((prev) => {
          return {
            ...prev,
            transactionError: "There was an error creating the transaction",
          };
        });
        setCreateLoading((prev) => ({
          ...prev,
          contract: false,
        }));
      }
    }
  };

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
            errors={[errors.tokenOffered, errors.valueOffered]}
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
            errors={[errors.tokenDesired, errors.valueDesired]}
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
                  !runtimeLifecycle ||
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
