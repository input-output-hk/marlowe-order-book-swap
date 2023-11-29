import Image from "next/image";
import ErrorIcon from "public/error.svg";
import { ICON_SIZES } from "~/utils";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <main className="flex h-fit w-full flex-grow flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <Image src={ErrorIcon as string} alt="Error" height={ICON_SIZES.XXL} />
        <p className="text-2xl text-m-disabled">{message}</p>
      </div>
    </main>
  );
};
