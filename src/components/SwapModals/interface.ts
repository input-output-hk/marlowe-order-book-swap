import { type Dispatch, type SetStateAction } from "react";
import { type ITokenAmount } from "~/utils";

export interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  offer: ITokenAmount;
  receive: ITokenAmount;
}