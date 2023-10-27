import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { COLORS, stringedColors } from "~/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: COLORS;
  size?: string;
  filled?: boolean;
  hovered?: boolean;
}

export const SIZE = {
  REGULAR: "regular",
  SMALL: "small",
  XSMALL: "xsmall",
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
    if (color === COLORS.WHITE) return "bg-white text-black ";
    if (disabled) return "bg-m-disabled cursor-not-allowed text-white ";
    if (filled && hovered) {
      return `bg-${stringedColors[color]} text-white hover:bg-white hover:text-${stringedColors[color]} transition ease-in-out duration-500 `;
    }
    if (!filled && hovered) {
      return `bg-white text-${stringedColors[color]} hover:bg-${stringedColors[color]} hover:text-white transition ease-in-out duration-500 `;
    }
    if (!filled) return `bg-white text-${stringedColors[color]} `;
    return `text-white bg-${stringedColors[color]} `;
  };

  const getBorder = () => {
    if (disabled) return "border border-m-disabled ";
    return `border border-${stringedColors[color]} `;
  };

  const getPadding = () => {
    switch (size) {
      case SIZE.SMALL:
        return "px-4 py-2";
      case SIZE.XSMALL:
        return "px-3 py-1";
      default:
        return "px-6 py-3";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`shadow-button-shadow h-min w-full whitespace-nowrap rounded-md font-bold ${getBgColor()} ${getBorder()} ${getPadding()}`}
    >
      {children}
    </button>
  );
};
