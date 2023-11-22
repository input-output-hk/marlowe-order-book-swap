import type { Dispatch, SetStateAction } from "react";
import { type IOptions } from "~/utils";

export interface ICreateErrors {
  valueOffered: string | undefined;
  valueDesired: string | undefined;
  dropOffered: string | undefined;
  dropDesired: string | undefined;
  expiryDate: string | undefined;
  startDate: string | undefined;
  beforeTodayStartError: string | undefined;
  beforeTodayExpiryError: string | undefined;
  transactionError: string | undefined;
}

export interface ICreateLoading {
  loading: boolean;
  contract: boolean;
  confirmation: boolean;
}

interface ICheckErrors {
  setErrors: Dispatch<SetStateAction<ICreateErrors>>;
  valueOffered: string;
  valueDesired: string;
  selectedOffered: IOptions;
  selectedDesired: IOptions;
  expiryDate: string;
  startDate: string;
}

export const checkValidity = ({
  setErrors,
  valueOffered,
  valueDesired,
  selectedOffered,
  selectedDesired,
  expiryDate,
  startDate,
}: ICheckErrors) => {
  const startDateObj = startDate === "" ? new Date() : new Date(startDate);
  const expiryDateObj = new Date(expiryDate);

  setErrors({
    transactionError: undefined,
    valueOffered:
      Number(valueOffered) <= 0 || valueOffered === ""
        ? "Value must be greater than 0"
        : undefined,
    valueDesired:
      Number(valueDesired) <= 0 || valueDesired === ""
        ? "Value must be greater than 0"
        : undefined,
    dropOffered:
      selectedOffered.option === "Token Select"
        ? "You must select an offered token"
        : undefined,
    dropDesired:
      selectedDesired.option === "Token Select"
        ? "You must select a desired token"
        : undefined,
    expiryDate:
      expiryDate === "" ? "You must select an expiry date" : undefined,
    startDate:
      startDate !== "" && startDateObj > expiryDateObj
        ? "Start date must be before expiry date"
        : undefined,
    beforeTodayStartError:
      startDateObj < new Date()
        ? "Start date must be after today's date"
        : undefined,
    beforeTodayExpiryError:
      expiryDateObj < new Date()
        ? "Expiry date must be after today's date"
        : undefined,
  });
};

export const isEveryFieldValid = (errors: ICreateErrors) => {
  return Object.values(errors).every((error) => error === undefined);
};
