import Image from "next/image";
import FullscreenIcon from "public/fullscreen.svg";
import SearchIcon from "public/search.svg";
import { useEffect, useState, type ChangeEvent } from "react";
import { COLORS, ICON_SIZES } from "~/utils";
import { tokensData, type Asset } from "~/utils/tokens";
import { Button, SIZE } from "../Button/Button";
import { Input } from "../Input/Input";
import { Modal } from "../Modal/Modal";
import { TokenElement } from "./TokenElement";

interface TokensModalProps {
  assets?: Asset[];
}

export const TokensModal = ({ assets }: TokensModalProps) => {
  const [open, setOpen] = useState(false);

  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);

  const [query, setQuery] = useState("");
  const [options, setOptions] = useState(assets);

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
    setQuery(e.target.value || "");
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
            <span className="text-xs font-medium text-m-dark-gray">
              Token Select
            </span>
            <Image
              src={FullscreenIcon as string}
              alt=""
              height={ICON_SIZES.S}
            />
          </div>
        </Button>
      </div>

      <Modal closeModal={closeModal} open={open} title="Token Select">
        <div className="flex flex-col gap-4 pt-2">
          <Input
            value={query}
            onChange={handleSearch}
            startContent={
              <Image
                src={SearchIcon as string}
                height={ICON_SIZES.S}
                alt="Search by Token Name"
              />
            }
            placeholder="Search by Token Name"
          />
          <div className="flex max-h-96 flex-col gap-4 overflow-auto">
            {assets
              ? options!.map((token) => {
                  return <TokenElement key={token.policyId} token={token} />;
                })
              : Object.values(tokensData).map((token) => {
                  return <TokenElement key={token.policyId} token={token} />;
                })}
          </div>
        </div>
      </Modal>
    </>
  );
};
