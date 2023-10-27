import Image from "next/image";
import Link from "next/link";
import PlusIcon from "public/add.svg";
import SearchIcon from "public/search.svg";
import { PAGES } from "~/utils";
import { Input } from "../Input/Input";
import { Switch } from "../Switch/Switch";
import { type UtilityProps } from "./listing.interface";

export const UtilityMobile = ({
  filterOwnListings,
  setFilterOwnListings,
}: UtilityProps) => {
  return (
    <div className="md:hidden">
      <div className="mx-4 flex items-center justify-between gap-2 sm:flex-row sm:gap-0">
        <Input
          placeholder="Search"
          startContent={
            <Image src={SearchIcon as string} width={20} alt="Search" />
          }
          className="w-1/2"
        />
        <div className="mr-4 flex items-center gap-2">
          <label className="font-bold">My listings</label>
          <Switch
            enabled={filterOwnListings}
            setEnabled={setFilterOwnListings}
          />
        </div>
      </div>
      <Link
        href={PAGES.CREATE}
        className="shadow-add fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-m-purple"
      >
        <Image src={PlusIcon as string} alt="+" className="scale-125 invert" />
      </Link>
    </div>
  );
};
