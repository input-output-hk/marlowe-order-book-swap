import Image from "next/image";
import CardanoIcon from "public/cardano.svg";
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
import { COLORS, ICON_SIZES, isEmpty, textToHexa } from "~/utils";
import { lookupTokenMetadata } from "~/utils/lookupTokenMetadata";
import { tokensData, type Asset } from "~/utils/tokens";
import { Button, SIZE } from "../Button/Button";
import { Input } from "../Input/Input";
import { Modal } from "../Modal/Modal";
import { Switch } from "../Switch/Switch";

import { Loading } from "../Loading/Loading";
import { TokenElement } from "./TokenElement";

interface TokensModalProps {
  selectedOffered: Asset;
  setSelectedOffered: Dispatch<SetStateAction<Asset>>;
  assets?: Asset[];
  loading: boolean;
}

export const TokensModal = ({
  selectedOffered,
  setSelectedOffered,
  assets,
  loading,
}: TokensModalProps) => {
  const [open, setOpen] = useState(false);

  const [error, setError] = useState<string | undefined>(undefined);
  const [policyId, setPolicyId] = useState("");
  const [assetName, setAssetName] = useState("");

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
    } else if (!isEmpty(query)) {
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

  const closeModal = () => setOpen(false);
  const openModal = () => {
    setError(undefined);
    setOpen(true);
  };

  const searchToken = async () => {
    try {
      const token = await lookupTokenMetadata(
        policyId,
        textToHexa(assetName),
        "preprod",
      );

      if (token) {
        if (!token.decimals) throw new Error("Token not found");
        setError(undefined);
        setSelectedOffered({
          tokenName: token.ticker ?? token.name,
          assetName: assetName,
          policyId: policyId,
          icon: (
            <Image
              src={
                token.logo
                  ? "data:image/png;base64," + token.logo
                  : (CardanoIcon as string)
              }
              alt=""
              height={ICON_SIZES.S}
              width={ICON_SIZES.S}
            />
          ),
          decimals: token.decimals,
        });

        closeModal();
      } else {
        throw new Error("Token not found");
      }
    } catch (err) {
      setError("Token not found");
    }
  };

  const handlePolicyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPolicyId(e.target.value);
  };

  const handleAssetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssetName(e.target.value);
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
            {isEmpty(selectedOffered.tokenName) ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-medium text-m-dark-gray">
                  Token Select
                </span>
                <Image
                  src={FullscreenIcon as string}
                  alt="[ ]"
                  height={ICON_SIZES.S}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                {selectedOffered.icon}
                <span className="text-xs font-medium text-m-dark-gray">
                  {selectedOffered.tokenName}
                </span>
              </div>
            )}
          </div>
        </Button>
      </div>

      <Modal closeModal={closeModal} open={open} title="Token Select">
        <div className="flex flex-col gap-6 pb-4">
          <div className="flex flex-col gap-4 pt-2">
            {assets && (
              <div className="flex items-center justify-between gap-4 ">
                <div className="w-5/6">
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
                <div className="flex flex-col items-stretch gap-1 text-center">
                  <label className="text-xs text-black" onClick={changeSwitch}>
                    Supported tokens
                  </label>
                  <Switch enabled={switchEnabled} setEnabled={changeSwitch} />
                </div>
              </div>
            )}
            {options !== undefined ? (
              <div className="flex h-96 flex-col gap-4 overflow-auto overscroll-contain pr-2">
                {loading ? (
                  <div className="flex flex-grow items-center justify-center">
                    <Loading
                      sizeDesktop={ICON_SIZES.XXL}
                      sizeMobile={ICON_SIZES.L}
                    />
                  </div>
                ) : options.length > 0 ? (
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
                )}
              </div>
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

            {!assets && (
              <>
                <div className="flex flex-col items-start justify-between gap-2 md:grid md:grid-cols-1">
                  <div className="flex w-full flex-col justify-between gap-2 lg:flex-row">
                    <div className="flex w-full flex-col">
                      <Input
                        className="p-1 text-sm"
                        label="Policy ID"
                        value={policyId}
                        onChange={handlePolicyChange}
                      />
                    </div>
                    <div className="flex w-full flex-col">
                      <Input
                        className="p-1 text-sm"
                        label="Asset Name (not encoded)"
                        value={assetName}
                        onChange={handleAssetChange}
                      />
                    </div>
                    <div className="w-fit pt-2 lg:pt-7">
                      <Button size={SIZE.XSMALL} onClick={searchToken}>
                        Search token
                      </Button>
                    </div>
                  </div>
                  <span className="self-start">
                    <b>Warning:</b> Some tokens might not be found
                  </span>
                  {error && (
                    <span className="self-start text-m-red">
                      <b>Error:</b> {error}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
