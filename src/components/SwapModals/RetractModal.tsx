import { contractId } from "@marlowe.io/runtime-core";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { COLORS, ICON_SIZES, getAddress } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import { DropDown } from "../DropDown/DropDown";
import { Input } from "../Input/Input";
import { Loading } from "../Loading/Loading";
import { Modal } from "../Modal/Modal";
import { type ModalProps } from "./interface";

export const RetractModal = ({
  open,
  setOpen,
  offered,
  desired,
  id,
  setModalOpen,
}: ModalProps) => {
  const [myAddress, setMyAddress] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { runtimeLifecycle } = useContext(TSSDKContext);

  useEffect(() => {
    if (runtimeLifecycle) void getAddress(runtimeLifecycle, setMyAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimeLifecycle]);

  const closeModal = () => {
    setOpen(false);
    setModalOpen(false);
  };

  const handleRetract = async () => {
    if (runtimeLifecycle && myAddress) {
      setError(null);
      try {
        setLoading(true);
        await runtimeLifecycle.contracts.applyInputs(contractId(id), {
          inputs: [
            {
              for_choice_id: {
                choice_name: "retract",
                choice_owner: { address: myAddress },
              },
              input_that_chooses_num: BigInt(0),
            },
          ],
        });

        setLoading(false);
        void router.reload();
      } catch (err) {
        console.log(err);
        setError("There was an error on the transaction.");
      }
    }
  };

  return (
    <Modal
      open={open}
      closeModal={closeModal}
      title="Retract Swap Offer"
      loading={loading}
    >
      <main className="flex w-full flex-col items-center text-m-disabled">
        <div className="flex w-full flex-col items-center justify-center gap-5 align-middle">
          <div className="flex w-full flex-col content-start items-start gap-2">
            <Input
              label="You will swap"
              type="number"
              disabled
              placeholder={offered.amount!.toString()}
              endContent={
                <DropDown
                  options={[{ option: offered.tokenName, icon: offered.icon }]}
                  disabled
                />
              }
              className="py-4"
            />

            <hr className="mb-5 mt-9 h-1 w-full " />
            <Input
              label="You will receive"
              type="number"
              disabled
              placeholder={desired.amount!.toString()}
              endContent={
                <DropDown
                  options={[{ option: desired.tokenName, icon: desired.icon }]}
                  disabled
                />
              }
              className="py-4"
            />
          </div>
          <div className="flex w-full flex-col content-start items-start gap-4">
            Retracting an offer is permanent and will still incur a transaction
            fee.
          </div>
          <div className="flex w-full flex-col justify-end gap-5 pt-5 text-sm sm:flex-row">
            <Button size={SIZE.SMALL} color={COLORS.BLACK} onClick={closeModal}>
              Cancel
            </Button>
            <Button
              color={COLORS.RED}
              size={SIZE.SMALL}
              filled
              onClick={handleRetract}
              disabled={!myAddress}
            >
              Retract Swap
            </Button>
          </div>
          {error && <div className="font-semibold text-m-red">{error}</div>}
          {loading && !error && (
            <div className="flex w-full items-center gap-4">
              <Loading sizeDesktop={ICON_SIZES.XS} sizeMobile={ICON_SIZES.XS} />
              <b className="text-base text-m-purple">
                Don&apos;t leave the page. Waiting confirmation...
              </b>
            </div>
          )}
        </div>
      </main>
    </Modal>
  );
};
