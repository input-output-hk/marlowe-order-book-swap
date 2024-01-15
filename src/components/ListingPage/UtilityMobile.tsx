import Image from "next/image";
import Link from "next/link";
import PlusIcon from "public/add.svg";
import SearchIcon from "public/search.svg";
import { useEffect, useState, type ChangeEvent } from "react";
import { ICON_SIZES, PAGES, type IWalletInStorage } from "~/utils";
import { Input } from "../Input/Input";
import { FiltersAndSort } from "./FilterAndSort";
import type { UtilityPropsMobile } from "./listing.interface";

export const UtilityMobile = ({
  filters,
  setFilters,
  sort,
  setSort,
}: UtilityPropsMobile) => {
  const [address, setAddress] = useState<string | undefined>(undefined);

  useEffect(() => {
    const walletInfo = window.localStorage.getItem("walletInfo");

    if (walletInfo) {
      const { address } = JSON.parse(walletInfo) as IWalletInStorage;

      setAddress(address);
    }
  }, []);

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
            placeholder="Search by Token Name"
            startContent={
              <Image
                src={SearchIcon as string}
                height={ICON_SIZES.S}
                alt="Search by Token Name"
              />
            }
          />
        </div>
        {address && (
          <div className="mr-4 flex items-center gap-2">
            <FiltersAndSort
              filters={filters}
              setFilters={setFilters}
              sort={sort}
              setSort={setSort}
            />
          </div>
        )}
      </div>
      <Link
        href={PAGES.CREATE}
        className="fixed bottom-8 right-8 z-0 flex h-16 w-16 items-center justify-center rounded-full bg-m-purple shadow-add"
      >
        <Image
          src={PlusIcon as string}
          alt="+"
          className="scale-125 invert"
          height={ICON_SIZES.S}
        />
      </Link>
    </div>
  );
};
