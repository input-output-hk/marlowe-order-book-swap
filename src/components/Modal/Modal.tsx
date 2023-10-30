import Image from "next/image";
import CloseIcon from "public/close.svg";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { ICON_SIZES } from "~/utils";

interface IModal {
  title: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const Modal = ({
  title,
  children,
  open,
  setOpen,
}: PropsWithChildren<IModal>) => {
  const closeModal = () => {
    setOpen(false);
  };
  if (!open) return;
  return (
    <div className="fixed inset-0 flex h-full items-center bg-gray-600 bg-opacity-50">
      <div className="shadow-lg relative mx-auto w-max rounded-md border bg-white p-5">
        <div className="text-m-subtitle mb-5 flex justify-between text-center text-3xl font-bold leading-6">
          {title}
          <div onClick={closeModal}>
            <Image
              className="cursor-pointer"
              src={CloseIcon as string}
              alt="x"
              height={ICON_SIZES.S}
            ></Image>
          </div>
        </div>
        <div className="mt-2 px-7 py-3">{children}</div>
      </div>
    </div>
  );
};
