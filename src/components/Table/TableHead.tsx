import Image from "next/image";
import CalendarIcon from "public/calendar-dark.svg";
import HandShakeIcon from "public/handshake.svg";
import TagIcon from "public/tag.svg";
import { ICON_SIZES } from "~/utils";

export const TableHead = () => {
  const columns = [
    {
      column: "Token Offered",
      icon: <Image src={TagIcon as string} alt="tag" height={ICON_SIZES.M} />,
    },
    {
      column: "Desired Token",
      icon: <Image src={TagIcon as string} alt="tag" height={ICON_SIZES.M} />,
    },
    {
      column: "Expiry Date",
      icon: (
        <Image
          src={CalendarIcon as string}
          alt="calendar"
          height={ICON_SIZES.M}
        />
      ),
    },
    {
      column: "actions",
      icon: (
        <Image
          src={HandShakeIcon as string}
          alt="actions"
          height={ICON_SIZES.M}
        />
      ),
    },
  ];

  const columnStyle = (index: number) => {
    if (index === 0) {
      return "rounded-l-lg";
    } else if (index === columns.length - 1) {
      return "rounded-r-lg";
    } else {
      return "";
    }
  };

  return (
    <div className="hidden bg-m-light-purple md:table-header-group">
      <div className="table-row">
        {columns.map(({ column, icon }, index) => (
          <div
            key={index}
            className={`table-cell ${columnStyle(
              index,
            )} py-4 text-center text-base font-medium`}
          >
            <div className="flex justify-center">{icon}</div>
            {column}
          </div>
        ))}
      </div>
    </div>
  );
};
