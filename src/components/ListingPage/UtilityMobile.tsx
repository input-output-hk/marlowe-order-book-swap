import Image from "next/image";
import Link from "next/link";
import PlusIcon from "public/add.svg";
import SearchIcon from "public/search.svg";
import type { ChangeEvent } from "react";
import { PAGES } from "~/utils";
import { Input } from "../Input/Input";
import { Switch } from "../Switch/Switch";
import type { UtilityProps } from "./listing.interface";

export const UtilityMobile = ({ filters, setFilters }: UtilityProps) => {
  const handleLabelClick = () =>
    setFilters((prev) => {
      return { ...prev, filterOwnListings: !prev.filterOwnListings };
    });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => {
      return { ...prev, searchQuery: e.target.value };
    });
  };

  return (
    <div className="md:hidden">
      <div className="mx-4 flex items-center justify-between gap-2 sm:flex-row sm:gap-0">
        <div className="w-1/2">
          <Input
            value={filters.searchQuery}
            onChange={handleChange}
            placeholder="Search"
            startContent={
              <Image src={SearchIcon as string} width={20} alt="Search" />
            }
          />
        </div>
        <div className="mr-4 flex items-center gap-2">
          <label className="font-bold" onClick={handleLabelClick}>
            My listings
          </label>
          <Switch enabled={filters.filterOwnListings} setEnabled={setFilters} />
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
