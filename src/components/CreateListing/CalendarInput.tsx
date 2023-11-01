import Image from "next/image";
import CalendarIcon from "public/calendar.svg";
import OpenIcon from "public/open_input.svg";
import type { Dispatch, SetStateAction } from "react";
import { ICON_SIZES } from "~/utils";
import { Input } from "../Input/Input";

interface CalendarInputProps {
  label: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

export const CalendarInput = ({
  label,
  value,
  setValue,
}: CalendarInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(new Date(e.target.value).toLocaleDateString());
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      label={label}
      type="date"
      endContent={
        <div className="flex">
          <Image src={CalendarIcon as string} alt="" height={ICON_SIZES.M} />
          <Image src={OpenIcon as string} alt="↓" height={ICON_SIZES.M} />
        </div>
      }
    />
  );
};
