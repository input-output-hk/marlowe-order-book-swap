import { type Action, type Contract } from "@marlowe.io/language-core-v1";
import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";
import {
  ADA,
  ICON_SIZES,
  isDeposit,
  isParty,
  isWhen,
  lovelaceToAda,
  type ITableData,
} from "~/utils";

export const defaultListing: ITableData = {
  id: "",
  createdBy: "",
  offered: { token: "", amount: 0, icon: <></> },
  desired: { token: "", amount: 0, icon: <></> },
  expiry: "",
};

export const getCreatedDate = (contractDetails: Action | undefined) => {
  return contractDetails !== undefined &&
    isDeposit(contractDetails) &&
    isParty(contractDetails?.into_account)
    ? contractDetails?.into_account?.role_token
    : "";
};

export const getOffered = (contractDetails: Action | undefined) => {
  const tokenName =
    contractDetails && isDeposit(contractDetails)
      ? contractDetails?.of_token.token_name === ""
        ? ADA
        : contractDetails?.of_token.token_name
      : "";
  const tokenAmount =
    contractDetails !== undefined && isDeposit(contractDetails)
      ? tokenName === ADA
        ? (lovelaceToAda(Number(contractDetails?.deposits)) as number)
        : Number(contractDetails?.deposits)
      : 0;
  return {
    token: tokenName,
    amount: tokenAmount,
    // TODO: Add icon
    icon:
      tokenName !== "" ? (
        <Image src={MarloweIcon as string} alt="M" height={ICON_SIZES.XS} />
      ) : (
        <></>
      ),
  };
};

export const getDesired = (
  contractDesired: Action | undefined,
  initialContract: Contract | undefined,
) => {
  const tokenName =
    contractDesired && isDeposit(contractDesired)
      ? contractDesired?.of_token.token_name === ""
        ? ADA
        : contractDesired?.of_token.token_name
      : "";
  const tokenAmount =
    initialContract &&
    isWhen(initialContract) &&
    initialContract.when[0]?.then &&
    isWhen(initialContract.when[0]?.then) &&
    contractDesired &&
    isDeposit(contractDesired)
      ? contractDesired?.of_token.token_name === ""
        ? (lovelaceToAda(Number(contractDesired?.deposits)) as number)
        : Number(contractDesired.deposits)
      : 0;
  return {
    token: tokenName,
    amount: tokenAmount,
    // TODO: Add icon
    icon: <Image src={MarloweIcon as string} alt="M" height={ICON_SIZES.XS} />,
  };
};
