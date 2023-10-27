import Image from "next/image";
import CloseIcon from "public/close.svg";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";

interface ModalProps {
  title: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const Modal = ({
  title,
  children,
  open,
  setOpen,
}: PropsWithChildren<ModalProps>) => {
  const closeModal = () => {
    setOpen(false);
  };
  if (!open) return;
  return (
    <div className="fixed inset-0 flex h-full items-center bg-gray-600 bg-opacity-50  text-m-disabled">
      <div className="shadow-lg relative mx-auto w-4/5 rounded-md border bg-white px-11 py-8 md:w-2/3 lg:w-2/5">
        <div className="text-m-subtitle mb-5 flex justify-between text-center text-3xl font-bold leading-6 ">
          {title}
          <div onClick={closeModal}>
            <Image
              className="cursor-pointer"
              src={CloseIcon as string}
              alt="x"
            ></Image>
          </div>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
};
