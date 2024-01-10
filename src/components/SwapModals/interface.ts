import { type Dispatch, type SetStateAction } from "react";
import { type Asset } from "~/utils";

export interface ModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  offered: Asset;
  desired: Asset;
  id: string;
}
