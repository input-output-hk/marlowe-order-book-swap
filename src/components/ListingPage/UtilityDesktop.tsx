import Image from "next/image";
import Link from "next/link";
import SearchIcon from "public/search.svg";
import type { ChangeEvent } from "react";
import { ICON_SIZES, PAGES } from "~/utils";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Switch } from "../Switch/Switch";
import type { UtilityProps } from "./listing.interface";

export const UtilityDesktop = ({ filters, setFilters }: UtilityProps) => {
  const setEnabledSwitch = () =>
    setFilters((prev) => {
      return { ...prev, filterOwnListings: !prev.filterOwnListings };
    });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => {
      return { ...prev, searchQuery: e.target.value };
    });
  };

  return (
    <div className="w-inherit mx-12 hidden justify-between md:flex lg:mx-24 xl:mx-32">
      <div className="w-1/3">
        <Input
          value={filters.searchQuery}
          onChange={handleChange}
          startContent={
            <Image
              src={SearchIcon as string}
              height={ICON_SIZES.S}
              alt="Search"
            />
          }
          placeholder="Search"
        />
      </div>

      <div className="flex w-1/2 items-center justify-end gap-4 lg:w-5/12 lg:gap-6 xl:w-1/3 xl:gap-8">
        <div className="flex items-center gap-2">
          <label
            className="cursor-pointer font-bold"
            onClick={setEnabledSwitch}
          >
            My listings
          </label>
          <Switch
            enabled={filters.filterOwnListings}
            setEnabled={setEnabledSwitch}
          />
        </div>

        <div className="flex w-fit">
          <Link href={PAGES.CREATE}>
            <Button hovered>Create a listing</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
