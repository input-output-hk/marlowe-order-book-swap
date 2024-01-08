import Image from "next/image";
import FullscreenIcon from "public/fullscreen.svg";
import SearchNoneIcon from "public/search-none.svg";
import SearchIcon from "public/search.svg";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { COLORS, ICON_SIZES } from "~/utils";
import { tokensData, type Asset } from "~/utils/tokens";
import { Button, SIZE } from "../Button/Button";
import { Input } from "../Input/Input";
import { Modal } from "../Modal/Modal";
import { Switch } from "../Switch/Switch";
import { TokenElement } from "./TokenElement";

interface TokensModalProps {
  selectedOffered: Asset;
  setSelectedOffered: Dispatch<SetStateAction<Asset>>;
  assets?: Asset[];
}

export const TokensModal = ({
  selectedOffered,
  setSelectedOffered,
  assets,
}: TokensModalProps) => {
  const [open, setOpen] = useState(false);

  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);

  const [query, setQuery] = useState("");
  const [options, setOptions] = useState(assets);
  const [switchEnabled, setSwitchEnabled] = useState(false);

  useEffect(() => {
    setOptions(
      assets?.filter(
        (option) =>
          option.assetName.toLowerCase().includes(query.toLocaleLowerCase()) ||
          option.policyId?.toLowerCase().includes(query.toLocaleLowerCase()),
      ),
    );
  }, [query, assets]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const changeSwitch = () => {
    setSwitchEnabled(!switchEnabled);
    if (!switchEnabled) {
      setOptions(options?.filter((token) => token.decimals > 0));
    } else if (query !== "") {
      setOptions(
        assets?.filter(
          (option) =>
            option.assetName
              .toLowerCase()
              .includes(query.toLocaleLowerCase()) ||
            option.policyId?.toLowerCase().includes(query.toLocaleLowerCase()),
        ),
      );
    } else {
      setOptions(assets);
    }
  };

  return (
    <>
      <div className="relative w-full">
        <Button
          size={SIZE.XSMALL}
          color={COLORS.LIGHT_GRAY}
          onClick={openModal}
          filled
        >
          <div className="flex items-center justify-center gap-1">
            {selectedOffered.assetName === "" ? (
              <>
                <span className="text-xs font-medium text-m-dark-gray">
                  Token Select
                </span>
                <Image
                  src={FullscreenIcon as string}
                  alt="[ ]"
                  height={ICON_SIZES.S}
                />
              </>
            ) : (
              <div className="flex items-center justify-center gap-2">
                {selectedOffered.icon}
                <span className="text-xs font-medium text-m-dark-gray">
                  {selectedOffered.assetName}
                </span>
              </div>
            )}
          </div>
        </Button>
      </div>

      <Modal closeModal={closeModal} open={open} title="Token Select">
        <div className="flex flex-col gap-4 pt-2">
          {assets && (
            <div className="flex items-center justify-between gap-4 ">
              <div className="w-4/5">
                <Input
                  value={query}
                  onChange={handleSearch}
                  startContent={
                    <Image
                      src={SearchIcon as string}
                      height={ICON_SIZES.S}
                      alt="Search"
                    />
                  }
                  placeholder="Search by Token Name or Policy ID"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-black" onClick={changeSwitch}>
                  Supported tokens
                </label>
                <Switch enabled={switchEnabled} setEnabled={changeSwitch} />
              </div>
            </div>
          )}
          <div className="flex h-96 flex-col gap-4 overflow-auto overscroll-contain pr-2">
            {options !== undefined ? (
              options.length > 0 ? (
                options.map((token) => (
                  <TokenElement
                    key={token.policyId + token.assetName}
                    token={token}
                    setSelectedOffered={setSelectedOffered}
                    closeModal={closeModal}
                  />
                ))
              ) : (
                <div className="flex h-96 flex-col items-center justify-center gap-4">
                  <Image
                    src={SearchNoneIcon as string}
                    alt="X"
                    height={ICON_SIZES.XXXL}
                  />
                  <div className="text-2xl font-bold text-m-dark-gray">
                    No results found
                  </div>
                </div>
              )
            ) : (
              Object.values(tokensData).map((token) => {
                return (
                  <TokenElement
                    key={token.policyId}
                    setSelectedOffered={setSelectedOffered}
                    closeModal={closeModal}
                    token={token}
                  />
                );
              })
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
