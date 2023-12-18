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
  contract: boolean;
  confirmation: boolean;
  contractConfirmed: string;
}

interface ICheckFields {
  valueOffered: string;
  valueDesired: string;
  selectedOffered: IOptions;
  selectedDesired: IOptions;
  expiryDate: string;
  startDate: string;
}

interface ICheckErrors extends ICheckFields {
  setErrors: Dispatch<SetStateAction<ICreateErrors>>;
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
  const today = new Date();

  setErrors((prev) => {
    return {
      ...prev,
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
        startDateObj < today
          ? "Start date must be after today's date"
          : undefined,
      beforeTodayExpiryError:
        expiryDateObj < today
          ? "Expiry date must be after today's date"
          : undefined,
    };
  });
};

export const isEveryFieldValid = ({
  valueOffered,
  valueDesired,
  selectedOffered,
  selectedDesired,
  startDate,
  expiryDate,
}: ICheckFields) => {
  const startDateObj = startDate === "" ? new Date() : new Date(startDate);
  const expiryDateObj = new Date(expiryDate);

  return (
    Number(valueOffered) > 0 &&
    Number(valueDesired) > 0 &&
    selectedOffered.option !== "Token Select" &&
    selectedDesired.option !== "Token Select" &&
    expiryDate !== "" &&
    expiryDate !== "" &&
    startDateObj < expiryDateObj
  );
};
