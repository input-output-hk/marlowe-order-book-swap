import Image from "next/image";
import CloseIcon from "public/close.svg";
import type { PropsWithChildren } from "react";
import { ICON_SIZES } from "~/utils";

interface ModalProps {
  title: string;
  open: boolean;
  closeModal: () => void;
}

export const Modal = ({
  title,
  children,
  open,
  closeModal,
}: PropsWithChildren<ModalProps>) => {
  if (!open) return;
  return (
    <div className="fixed inset-0 z-40 flex h-full items-center bg-gray-600 bg-opacity-50  text-m-disabled">
      <div className="shadow-lg relative mx-auto w-4/5 rounded-md border bg-white px-11 py-8 md:w-2/3 lg:w-3/5">
        <div className="text-m-subtitle mb-5 flex justify-between text-center text-3xl font-bold leading-6 ">
          {title}
          <div onClick={closeModal}>
            <Image
              className="cursor-pointer"
              src={CloseIcon as string}
              alt="x"
              height={ICON_SIZES.XS}
            ></Image>
          </div>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
};
