import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import CalendarIcon from "public/calendar.svg";
import DownIcon from "public/down_arrow.svg";
import OpenIcon from "public/open_input.svg";
import type { FormEvent } from "react";
import { Button, SIZE } from "~/components/Button/Button";
import type { IToken } from "~/utils";
import { COLORS, ICON_SIZES, PAGES } from "~/utils";
import { DropDown } from "../DropDown/DropDown";
import { Input } from "../Input/Input";

interface CreateListingProps {
  tokenOptions: IToken[];
}

export const CreateListing = ({
  tokenOptions: options,
}: CreateListingProps) => {
  const router = useRouter();
  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void router.push(PAGES.LISTING);
    // TODO: Check if form is valid
  };
  return (
    <form
      className="flex flex-col items-center text-m-disabled"
      onSubmit={submitForm}
    >
      <div className="flex w-4/5 flex-col items-center justify-center gap-5 rounded-lg border px-7 py-8 align-middle shadow-container md:w-2/3 lg:w-2/5">
        <h1 className="flex items-start self-stretch text-2xl font-bold">
          Token Swap Listing
        </h1>
        <div className="flex w-full flex-col content-start items-start gap-2">
          <div className="font-bold">Details</div>
          <Input
            required
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
            height={ICON_SIZES.L}
            className="flex justify-center self-center"
          />
          <Input
            required
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
                    <Image
                      src={CalendarIcon as string}
                      alt=""
                      height={ICON_SIZES.M}
                    />
                    <Image
                      src={OpenIcon as string}
                      alt="↓"
                      height={ICON_SIZES.M}
                    />
                  </div>
                }
              />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Input
                required
                label="Listing expiry date"
                type="date"
                endContent={
                  <div className="flex">
                    <Image
                      src={CalendarIcon as string}
                      alt=""
                      height={ICON_SIZES.M}
                    />
                    <Image
                      src={OpenIcon as string}
                      alt="↓"
                      height={ICON_SIZES.M}
                    />
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
            <div>
              <Button size={SIZE.SMALL} filled type="submit">
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
