import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import DownIcon from "public/down_arrow.svg";
import { useState, type FormEvent } from "react";
import { Button, SIZE } from "~/components/Button/Button";
import type { IOptions } from "~/utils";
import { COLORS, ICON_SIZES, PAGES } from "~/utils";
import { CalendarInput } from "./CalendarInput";
import { TokenInputs } from "./TokenInputs";

interface ICreateErrors {
  valueOffered: string | undefined;
  valueDesired: string | undefined;
  dropOffered: string | undefined;
  dropDesired: string | undefined;
  expiry: string | undefined;
  startDate: string | undefined;
}

export const CreateListing = () => {
  const [valueOffered, setValueOffered] = useState<number>(0);
  const [selectedOffered, setSelectedOffered] = useState<IOptions>({
    option: "Token Select",
    icon: <></>,
  });
  const [startDate, setStartDate] = useState<string>("");
  const [valueDesired, setValueDesired] = useState<number>(0);
  const [selectedDesired, setSelectedDesired] = useState<IOptions>({
    option: "Token Select",
    icon: <></>,
  });
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [errors, setErrors] = useState<ICreateErrors>({
    valueOffered: undefined,
    valueDesired: undefined,
    dropOffered: undefined,
    dropDesired: undefined,
    expiry: undefined,
    startDate: undefined,
  });

  const router = useRouter();

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const startDateObj = startDate === "" ? new Date() : new Date(startDate);
    const expiryDateObj = new Date(expiryDate);

    setErrors({
      valueOffered:
        valueOffered <= 0 ? "Value must be greater than 0" : undefined,
      valueDesired:
        valueDesired <= 0 ? "Value must be greater than 0" : undefined,
      dropOffered:
        selectedOffered.option === "Token Select"
          ? "You must select an offered token"
          : undefined,
      dropDesired:
        selectedDesired.option === "Token Select"
          ? "You must select a desired token"
          : undefined,
      expiry: expiryDate === "" ? "You must select an expiry date" : undefined,
      startDate:
        startDateObj > expiryDateObj
          ? "Start date must be before expiry date"
          : undefined,
    });

    if (
      valueOffered > 0 &&
      valueDesired > 0 &&
      selectedOffered.option !== "Token Select" &&
      selectedDesired.option !== "Token Select" &&
      expiryDate !== "" &&
      startDateObj < expiryDateObj
    ) {
      void router.push(PAGES.LISTING);
    }
  };

  return (
    <form
      className="flex flex-col items-center text-m-disabled"
      onSubmit={submitForm}
    >
      <div className="flex w-4/5 flex-col items-center justify-center gap-5 rounded-lg border px-7 py-8 align-middle shadow-container md:w-2/3 lg:w-2/5">
        <h1 className="flex items-start self-stretch text-2xl font-bold">
          Token Swap Listing
        </h1>
        <div className="flex w-full flex-col content-start items-start gap-2">
          <div className="font-bold">Details</div>
          <TokenInputs
            label="You will swap"
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
            label="You will receive"
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
                errors={[errors.startDate]}
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <CalendarInput
                label="Listing expiry date"
                value={expiryDate}
                setValue={setExpiryDate}
                errors={[errors.expiry]}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end pt-5 text-sm">
          <div className="flex w-2/3 items-center justify-end gap-6">
            <Link href={PAGES.LISTING}>
              <Button size={SIZE.SMALL} color={COLORS.BLACK}>
                Cancel
              </Button>
            </Link>
            <div>
              <Button size={SIZE.SMALL} filled type="submit">
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
