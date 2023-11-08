import Image from "next/image";
import CalendarIcon from "public/calendar.svg";
import OpenIcon from "public/open_input.svg";
import { type Dispatch, type SetStateAction } from "react";
import { ICON_SIZES } from "~/utils";
import { Input } from "../Input/Input";

interface CalendarInputProps {
  label: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  errors?: (string | undefined)[];
}

export const CalendarInput = ({
  label,
  value,
  setValue,
  errors = [],
}: CalendarInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      label={label}
      type="datetime-local"
      error={errors}
      endContent={
        <div className="flex">
          <Image src={CalendarIcon as string} alt="" height={ICON_SIZES.M} />
          <Image
            src={OpenIcon as string}
            alt="↓"
            height={ICON_SIZES.M}
            className="h-auto w-auto"
          />
        </div>
      }
    />
  );
};
