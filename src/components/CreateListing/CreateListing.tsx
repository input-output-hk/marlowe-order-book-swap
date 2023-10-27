import Image from "next/image";
import Link from "next/link";
import CalendarIcon from "public/calendar.svg";
import DownIcon from "public/down_arrow.svg";
import OpenIcon from "public/open_input.svg";
import { Button, SIZE } from "~/components/Button/Button";
import type { IToken } from "~/utils";
import { COLORS, PAGES } from "~/utils";
import { DropDown } from "../DropDown/DropDown";
import { Input } from "../Input/Input";

interface CreateListingProps {
  tokenOptions: IToken[];
}

export const CreateListing = ({
  tokenOptions: options,
}: CreateListingProps) => {
  return (
    <main className="flex flex-col items-center text-m-disabled">
      <div className="shadow-container flex w-4/5 flex-col items-center justify-center gap-5 rounded-lg border px-7 py-8 align-middle md:w-2/3 lg:w-2/5">
        <h1 className="flex items-start self-stretch text-2xl font-bold">
          Token Swap Listing
        </h1>
        <div className="flex w-full flex-col content-start items-start gap-2">
          <div className="font-bold">Details</div>
          <Input
            label="You will swap"
            type="number"
            min={0}
            pointerEvents
            placeholder="0"
            endContent={<DropDown options={options} />}
          />
          <Image
            src={DownIcon as string}
            alt="↓"
            height={30}
            className="flex justify-center self-center"
          />
          <Input
            label="You will receive"
            type="number"
            min={0}
            pointerEvents
            placeholder="0"
            endContent={<DropDown options={options} />}
          />
        </div>
        <div className="flex w-full flex-col content-start items-start gap-4">
          <div className="font-bold">Expiry</div>
          <div className="flex w-full flex-col gap-8 text-sm font-normal md:flex-row ">
            <div className="flex w-full flex-col gap-2">
              <Input
                label="Listing start date"
                type="date"
                endContent={
                  <div className="flex">
                    <Image src={CalendarIcon as string} alt="" height={20} />
                    <Image src={OpenIcon as string} alt="" height={20} />
                  </div>
                }
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Input
                label="Listing expiry date"
                type="date"
                endContent={
                  <div className="flex">
                    <Image src={CalendarIcon as string} alt="" height={20} />
                    <Image src={OpenIcon as string} alt="" height={20} />
                  </div>
                }
              />
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end pt-5 text-sm">
          <div className="flex w-2/3 items-center justify-end gap-6">
            <Link href={PAGES.LISTING}>
              <Button size={SIZE.SMALL} color={COLORS.BLACK}>
                Cancel
              </Button>
            </Link>
            <Link href={PAGES.LISTING}>
              <Button size={SIZE.SMALL} filled>
                Accept
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
