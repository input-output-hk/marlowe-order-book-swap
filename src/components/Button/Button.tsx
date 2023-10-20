import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { COLORS } from "~/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: COLORS;
  size?: string;
  filled?: boolean;
  hovered?: boolean;
}

export const SIZE = {
  REGULAR: "regular",
  SMALL: "small",
};

export type SIZE = (typeof SIZE)[keyof typeof SIZE];

export const Button = ({
  children,
  color = COLORS.PURPLE,
  size = SIZE.REGULAR,
  filled = false,
  onClick,
  disabled,
  hovered,
}: PropsWithChildren<ButtonProps>) => {
  const getBgColor = () => {
    if (disabled) return "bg-m-disabled cursor-not-allowed";
    if (!filled && hovered) {
      switch (color) {
        case COLORS.DARK_GRAY:
          return "bg-white hover:bg-m-dark-gray hover:text-white transition ease-in-out duration-500";
        case COLORS.GREEN:
          return "bg-white hover:bg-m-green hover:text-white transition ease-in-out duration-500";
        case COLORS.BLACK:
          return "bg-white hover:bg-near-black hover:text-white transition ease-in-out duration-500";
        case COLORS.RED:
          return "bg-white hover:bg-m-red hover:text-white transition ease-in-out duration-500";
        default:
          return "bg-white hover:bg-m-purple hover:text-white transition ease-in-out duration-500";
      }
    }
    if (!filled) return "bg-white";
    switch (color) {
      case COLORS.DARK_GRAY:
        return "text-white bg-m-dark-gray";
      case COLORS.GREEN:
        return "text-white bg-m-green";
      case COLORS.BLACK:
        return "text-white bg-near-black";
      case COLORS.RED:
        return "text-white bg-m-red";
      case COLORS.WHITE:
        return "text-black bg-white";
      default:
        return "text-white bg-m-purple";
    }
  };

  const getBorder = () => {
    if (disabled) return "border border-m-disabled text-white";
    switch (color) {
      case COLORS.RED:
        return "border border-m-red text-m-red";
      case COLORS.BLACK:
        return "border border-near-black text-near-black";
      default:
        return "border border-m-purple text-m-purple";
    }
  };

  const getPadding = () => {
    switch (size) {
      case SIZE.SMALL:
        return "px-4 py-2";
      default:
        return "px-6 py-3";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-min w-full whitespace-nowrap rounded-md font-bold ${getBgColor()} ${getBorder()} ${getPadding()}`}
    >
      {children}
    </button>
  );
};
