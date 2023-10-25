import Image from "next/image";
import DownArrowIcon from "public/open_input.svg";
import { useState } from "react";
import { COLORS } from "~/utils";
import { Button } from "../Button/Button";

export interface DropdownProps {
  title: { currency: string; icon: JSX.Element };
  options: Array<{ currency: string; icon: JSX.Element }>;
}

export const DropDown = ({ title, options }: DropdownProps) => {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [selected, setSelected] = useState(title);
  return (
    <main className="">
      <Button
        color={COLORS.LIGHT_GRAY}
        filled
        onClick={() => setOpenDropDown(!openDropDown)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-around gap-5 text-xl font-medium text-m-dark-gray">
            {selected.icon}
            {selected.currency}
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
        <div className="bg-m-light-gray w-inherit z-10 rounded-lg">
          <ul className="overflow-y-auto p-3 text-m-dark-gray">
            {options.map((option, index) => {
              return (
                <>
                  <li
                    key={index}
                    className="flex cursor-pointer gap-5 p-3"
                    onClick={() => {
                      setSelected(option);
                    }}
                  >
                    {option.icon}
                    {option.currency}
                  </li>
                  {index < options.length - 1 && <hr />}
                </>
              );
            })}
          </ul>
        </div>
      )}
    </main>
  );
};
