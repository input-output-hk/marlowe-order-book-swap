import { COLORS } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import { DropDown } from "../DropDown/DropDown";
import { Input } from "../Input/Input";
import { Modal } from "../Modal/Modal";
import { type ModalProps } from "./interface";

export const RetractModal = ({
  open,
  setOpen,
  offered,
  desired,
}: ModalProps) => {
  const closeModal = () => {
    setOpen(false);
  };
  return (
    <Modal open={open} setOpen={setOpen} title="Retract Swap Offer">
      <main className="flex w-full flex-col items-center text-m-disabled">
        <div className="flex w-full flex-col items-center justify-center gap-5 align-middle">
          <div className="flex w-full flex-col content-start items-start gap-2">
            <Input
              label="You will swap"
              type="number"
              disabled
              placeholder={offered.amount.toString()}
              endContent={
                <DropDown
                  options={[{ option: offered.token, icon: offered.icon }]}
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
              placeholder={desired.amount.toString()}
              endContent={
                <DropDown
                  options={[{ option: desired.token, icon: desired.icon }]}
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
              onClick={closeModal}
            >
              Retract Swap
            </Button>
          </div>
        </div>
      </main>
    </Modal>
  );
};
