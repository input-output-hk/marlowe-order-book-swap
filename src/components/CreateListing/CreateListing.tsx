import Image from "next/image";
import { useRouter } from "next/router";
import CalendarIcon from "public/calendar.svg";
import DownIcon from "public/down_arrow.svg";
import OpenIcon from "public/open_input.svg";
import { Button, SIZE } from "~/components/Button/Button";
import type { IToken } from "~/utils";
import { COLORS, PAGES } from "~/utils";
import { DropDown } from "../DropDown/DropDown";
import { Input } from "../Input/Input";

interface CreateListingProps {
  TokenOptions: IToken[];
}

export const CreateListing = ({
  TokenOptions: options,
}: CreateListingProps) => {
  const router = useRouter();

  const goToListing = async () => {
    await router.push(PAGES.LISTING);
  };

  return (
    <main className="flex flex-col items-center text-m-disabled">
      <div className="flex w-4/5 flex-col items-center justify-center gap-5 rounded-lg border px-7 py-8 align-middle md:w-2/3 lg:w-2/5">
        <h1 className="flex items-start self-stretch text-2xl font-bold">
          Token Swap Listing
        </h1>
        <div className="flex w-full flex-col content-start items-start gap-2">
          <div className="font-bold">Details</div>
          <div className="text-sm font-normal">You will swap</div>
          <Input
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
          <div className="text-sm font-normal">You will receive</div>
          <Input
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
              Listing start date
              <Input
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
              Listing expiry date
              <Input
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
            <Button
              size={SIZE.SMALL}
              color={COLORS.BLACK}
              onClick={goToListing}
            >
              Cancel
            </Button>
            <Button size={SIZE.SMALL} filled onClick={goToListing}>
              Accept
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};
