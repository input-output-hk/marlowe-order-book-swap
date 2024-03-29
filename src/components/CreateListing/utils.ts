import type { Dispatch, SetStateAction } from "react";
import { isEmpty } from "~/utils";
import { type Asset } from "~/utils/tokens";

export interface ICreateErrors {
  valueOffered: string | undefined;
  valueDesired: string | undefined;
  tokenOffered: string | undefined;
  tokenDesired: string | undefined;
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
  selectedOffered: Asset;
  selectedDesired: Asset;
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
  const startDateObj = isEmpty(startDate) ? new Date() : new Date(startDate);
  const expiryDateObj = new Date(expiryDate);
  const today = new Date();

  setErrors((prev) => {
    return {
      ...prev,
      transactionError: undefined,
      valueOffered:
        Number(valueOffered) <= 0 || isEmpty(valueOffered)
          ? "Value must be greater than 0"
          : selectedOffered.amount &&
            Number(valueOffered) > selectedOffered.amount
          ? "Value must be lower or equal than owned amount"
          : undefined,
      valueDesired:
        Number(valueDesired) <= 0 || isEmpty(valueDesired)
          ? "Value must be greater than 0"
          : undefined,
      tokenOffered: isEmpty(selectedOffered.tokenName)
        ? "You must select an offered token"
        : undefined,
      tokenDesired: isEmpty(selectedDesired.tokenName)
        ? "You must select a desired token"
        : undefined,
      expiryDate: isEmpty(expiryDate)
        ? "You must select an expiry date"
        : undefined,
      startDate:
        !isEmpty(startDate) && startDateObj > expiryDateObj
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
  const startDateObj = isEmpty(startDate) ? new Date() : new Date(startDate);
  const expiryDateObj = new Date(expiryDate);

  return (
    Number(valueOffered) > 0 &&
    Number(valueDesired) > 0 &&
    !isEmpty(selectedOffered.tokenName) &&
    !isEmpty(selectedDesired.tokenName) &&
    !isEmpty(expiryDate) &&
    !isEmpty(expiryDate) &&
    startDateObj < expiryDateObj
  );
};
