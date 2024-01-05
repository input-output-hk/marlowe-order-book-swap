import Image from "next/image";
import FilterIcon from "public/filter.svg";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  ICON_SIZES,
  SortOrder,
  type IFilters,
  type IOptions,
  type ISort,
} from "~/utils";
import { DropDown } from "../DropDown/DropDown";
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
  const [selectedSortByDate, setSelectedSortByDate] = useState({
    option: sort.sortOrder,
    icon: <></>,
  });

  const sortOptions: IOptions[] = [
    { option: SortOrder.ASC, icon: <></> },
    { option: SortOrder.DESC, icon: <></> },
  ];

  const setEnabledSwitch = () =>
    setFilters((prev) => {
      return { ...prev, filterOwnListings: !prev.filterOwnListings };
    });

  const handleClick = () => {
    setOpen(true);
  };

  useEffect(() => {
    setSort((prev) => {
      return { ...prev, sortOrder: selectedSortByDate.option };
    });
  }, [selectedSortByDate, setSort]);

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        className="flex h-full w-full gap-1 rounded-lg bg-m-light-purple px-2 py-2"
        onClick={handleClick}
      >
        <Image
          src={FilterIcon as string}
          alt="Filter"
          height={ICON_SIZES.M}
          className="h-auto w-auto"
        />
        <p>Filters & Sort</p>
      </div>
      <Modal open={open} closeModal={closeModal} title="Filters & Sort">
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
          <label className="text-black">Expiry date</label>
          <div className="w-20">
            <DropDown
              options={sortOptions}
              selected={selectedSortByDate}
              setSelected={setSelectedSortByDate}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
