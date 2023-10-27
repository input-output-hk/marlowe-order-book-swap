import Image from "next/image";
import Link from "next/link";
import SearchIcon from "public/search.svg";
import { PAGES } from "~/utils";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Switch } from "../Switch/Switch";
import { type UtilityProps } from "./listing.interface";

export const UtilityDesktop = ({
  filterOwnListings,
  setFilterOwnListings,
}: UtilityProps) => {
  const handleLabelClick = () => setFilterOwnListings((prev) => !prev);

  return (
    <div className="w-inherit mx-12 hidden justify-between md:flex lg:mx-24 xl:mx-32">
      <Input
        className="w-1/3"
        startContent={
          <Image src={SearchIcon as string} width={20} alt="Search" />
        }
        placeholder="Search"
      />

      <div className="flex w-1/2 items-center justify-end gap-4 lg:w-5/12 lg:gap-6 xl:w-1/3 xl:gap-8">
        <div className="flex items-center gap-2">
          <label
            className="font-bold"
            htmlFor="test"
            onClick={handleLabelClick}
          >
            My listings
          </label>
          <Switch
            enabled={filterOwnListings}
            setEnabled={setFilterOwnListings}
          />
        </div>

        <div className="flex w-fit">
          <Button>
            <Link href={PAGES.CREATE}>Create a listing</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
