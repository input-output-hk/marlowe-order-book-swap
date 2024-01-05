import Image from "next/image";
import CardanoIcon from "public/cardano.svg";
import FullscreenIcon from "public/fullscreen.svg";
import { useState, type Dispatch, type SetStateAction } from "react";
import { COLORS, ICON_SIZES, textToHexa } from "~/utils";
import { lookupTokenMetadata } from "~/utils/lookupTokenMetadata";
import { tokensData, type Asset } from "~/utils/tokens";
import { Button, SIZE } from "../Button/Button";
import { Input } from "../Input/Input";
import { Modal } from "../Modal/Modal";

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
  const [policyId, setPolicyId] = useState("");
  const [assetName, setAssetName] = useState("");

  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);

  const searchToken = async () => {
    try {
      const token = await lookupTokenMetadata(
        policyId,
        textToHexa(assetName),
        "preprod",
      );

      if (token) {
        setSelectedOffered({
          assetName: token.ticker ?? token.name,
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
          decimals: token.decimals ?? 0,
        });

        closeModal();
      } else {
        throw new Error("Token not found");
      }
    } catch (err) {
      console.log(err);
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
            {selectedOffered.assetName === "" ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-medium text-m-dark-gray">
                  Token Select
                </span>
                <Image
                  src={FullscreenIcon as string}
                  alt=""
                  height={ICON_SIZES.S}
                />
              </div>
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
        <div className="flex flex-col gap-6 pb-4">
          <div className="flex flex-col gap-4 pt-2">
            {assets
              ? //TODO add own tokens instead of null
                null
              : Object.values(tokensData).map((token) => {
                  return (
                    <TokenElement
                      key={token.policyId}
                      setSelectedOffered={setSelectedOffered}
                      closeModal={closeModal}
                      token={token}
                    />
                  );
                })}
          </div>

          <div className="flex items-end justify-between">
            <div className="flex gap-2">
              <div className="flex flex-col">
                <Input
                  className="p-1 text-sm"
                  label="Policy ID"
                  value={policyId}
                  onChange={handlePolicyChange}
                />
              </div>
              <div className="flex flex-col">
                <Input
                  className="p-1 text-sm"
                  label="Asset Name (not encoded)"
                  value={assetName}
                  onChange={handleAssetChange}
                />
              </div>
            </div>
            <div className="w-fit">
              <Button size={SIZE.XSMALL} onClick={searchToken} type="button">
                Select
              </Button>
            </div>
          </div>
        </div>
        <span>
          <b>Warning:</b> Some tokens might not be listed
        </span>
      </Modal>
    </>
  );
};
