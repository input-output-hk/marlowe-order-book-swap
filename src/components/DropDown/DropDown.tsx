import Image from "next/image";
import DownArrowIcon from "public/open_input.svg";
import {
  useState,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";
import { COLORS, ICON_SIZES, truncateString, type IOptions } from "~/utils";
import { Button, SIZE } from "../Button/Button";

export interface DropdownProps {
  options: Array<IOptions>;
  selected?: IOptions;
  setSelected?: Dispatch<SetStateAction<IOptions>>;
  disabled?: boolean;
}

export const DropDown = ({
  options,
  selected,
  setSelected,
  disabled = false,
}: DropdownProps) => {
  const [openDropDown, setOpenDropDown] = useState(false);

  const selectOption = (option: IOptions) => () => {
    if (setSelected) {
      setSelected(option);
      setOpenDropDown(false);
    }
  };

  const truncatedOptions = options.map((option) => {
    return {
      option: truncateString(option.option, 5),
      icon: option.icon,
    };
  });

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    !disabled && setOpenDropDown(!openDropDown);
  };

  if (!selected && !disabled) {
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
        onClick={handleClick}
        type="button"
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center justify-around gap-2 text-xs font-medium text-m-dark-gray">
            {disabled ? (
              <>
                {options[0]!.icon}
                {options[0]!.option}
              </>
            ) : (
              <>
                {selected?.icon}
                {selected?.option}
              </>
            )}
          </div>
          {!disabled && (
            <Image
              src={DownArrowIcon as string}
              alt="↓"
              height={ICON_SIZES.M}
              className="h-auto w-auto"
            />
          )}
        </div>
      </Button>
      {openDropDown && (
        <div className="absolute z-10 w-full rounded-b-lg bg-m-light-gray px-1 text-xs ">
          <ul className="overflow-y-auto text-m-dark-gray">
            {truncatedOptions.map((option, index) => {
              return (
                <div key={index}>
                  <li
                    className=" flex cursor-pointer gap-4 p-2"
                    onClick={selectOption(option)}
                  >
                    {option.icon}
                    {option.option}
                  </li>
                  {index < truncatedOptions.length - 1 && <hr />}
                </div>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
