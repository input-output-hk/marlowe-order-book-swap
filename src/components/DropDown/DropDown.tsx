import Image from "next/image";
import DownArrowIcon from "public/open_input.svg";
import { useState } from "react";
import { COLORS, IToken } from "~/utils";
import { Button, SIZE } from "../Button/Button";

export interface DropdownProps {
  options: Array<IToken>;
}

export const DropDown = ({ options }: DropdownProps) => {
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
    <div className="w-32">
      <Button
        size={SIZE.XSMALL}
        color={COLORS.LIGHT_GRAY}
        filled
        onClick={() => setOpenDropDown(!openDropDown)}
      >
        <div className="w-inherit flex items-center justify-between">
          <div className="flex items-center justify-around gap-2 text-xl font-medium text-m-dark-gray">
            {selected.icon}
            {selected.token}
          </div>
          <Image
            src={DownArrowIcon as string}
            alt="tag"
            height={20}
            width={20}
          />
        </div>
      </Button>
      {openDropDown && (
        <div className="bg-m-light-gray w-inherit absolute z-10 rounded-b-lg px-[.85%]">
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
