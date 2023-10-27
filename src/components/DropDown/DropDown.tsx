import Image from "next/image";
import DownArrowIcon from "public/open_input.svg";
import { useState } from "react";
import { COLORS, type IToken } from "~/utils";
import { Button, SIZE } from "../Button/Button";

export interface DropdownProps {
  options: Array<IToken>;
  disabled?: boolean;
}

export const DropDown = ({ options, disabled = false }: DropdownProps) => {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  if (!selected) {
    return (
      <Button disabled size={SIZE.XSMALL}>
        No options
      </Button>
    );
  }
  return (
    <div className="relative w-full">
      <Button
        size={SIZE.XSMALL}
        color={COLORS.LIGHT_GRAY}
        filled
        onClick={() => disabled && setOpenDropDown(!openDropDown)}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center justify-around gap-2 text-xl font-medium text-m-dark-gray">
            {selected.icon}
            {selected.token}
          </div>
          {!disabled && (
            <Image
              src={DownArrowIcon as string}
              alt="↓"
              height={20}
              width={20}
            />
          )}
        </div>
      </Button>
      {openDropDown && (
        <div className="absolute z-10 w-full rounded-b-lg bg-m-light-gray px-1 ">
          <ul className="overflow-y-auto text-m-dark-gray">
            {options.map((option, index) => {
              return (
                <>
                  <li
                    key={index}
                    className=" flex cursor-pointer gap-6 p-4"
                    onClick={() => {
                      setSelected(option);
                    }}
                  >
                    {option.icon}
                    {option.token}
                  </li>
                  {index < options.length - 1 && <hr />}
                </>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
