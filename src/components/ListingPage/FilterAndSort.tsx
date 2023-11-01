import Image from "next/image";
import FilterIcon from "public/filter.svg";
import { useState, type Dispatch, type SetStateAction } from "react";
import { ICON_SIZES, type IFilters, type ISort } from "~/utils";
import { Modal } from "../Modal/Modal";
import { Switch } from "../Switch/Switch";

interface FiltersAndSortProps {
  filters: IFilters;
  setFilters: Dispatch<SetStateAction<IFilters>>;
  sort: ISort;
  setSort: Dispatch<SetStateAction<ISort>>;
}

export const FiltersAndSort = ({
  filters,
  setFilters,
  sort,
  setSort,
}: FiltersAndSortProps) => {
  const [open, setOpen] = useState(false);

  const setEnabledSwitch = () =>
    setFilters((prev) => {
      return { ...prev, filterOwnListings: !prev.filterOwnListings };
    });

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <div
        className="flex h-full w-full gap-1 rounded-lg bg-m-light-purple px-2 py-2"
        onClick={handleClick}
      >
        <Image src={FilterIcon as string} alt="Filter" height={ICON_SIZES.M} />
        <p>Filters & Sort</p>
      </div>
      <Modal open={open} setOpen={setOpen} title="Filters & Sort">
        <p className="font-semibold text-black">Filters</p>
        <hr className="mb-6" />
        <div className="mb-6 flex justify-between">
          <label className="text-black" onClick={setEnabledSwitch}>
            My listings
          </label>
          <Switch
            enabled={filters.filterOwnListings}
            setEnabled={setEnabledSwitch}
          />
        </div>

        <p className="font-semibold text-black">Sort</p>
        <hr className="mb-6" />
        <div className="flex justify-between gap-8">
          <label className="w-3/4 text-black">Expiry date</label>
        </div>
      </Modal>
    </>
  );
};
