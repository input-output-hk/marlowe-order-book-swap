import { unContractId, type ContractId } from "@marlowe.io/runtime-core";
import { COLORS } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import { type IMoreContractDetails } from "./WithdrawPage";

interface ContractListProps {
  possibleWithdraws: IMoreContractDetails[];
  handleContract: ({
    id,
    toAdd,
  }: {
    id: ContractId;
    toAdd: boolean;
  }) => () => Promise<void>;
  selectAll: () => Promise<void>;
}

export const ContractsList = ({
  possibleWithdraws,
  handleContract,
  selectAll,
}: ContractListProps) => {
  return (
    <div className="flex flex-col gap-3 ">
      <div className="flex justify-between rounded-md bg-m-light-purple p-5 text-center text-2xl font-semibold">
        Pending Withdrawals
        <div className="text-base">
          <Button size={SIZE.XSMALL} onClick={selectAll}>
            Select All
          </Button>
        </div>
      </div>
      <div>
        {possibleWithdraws.map((payout, index) => {
          return (
            <div className="w-inherit flex flex-col gap-3" key={index}>
              <div className="flex items-center justify-between gap-4 p-3">
                <div className="flex w-4/5 flex-col">
                  <div className="flex flex-col break-all lg:flex-row">
                    <b>Contract Id:</b>&nbsp;
                    {unContractId(payout.contractId)}
                  </div>
                  <div className="flex">
                    <b>Withdraw amount:</b>&nbsp;
                    {payout.error === "" ? Number(payout.amount) : payout.error}
                  </div>
                </div>
                <div className="h-10 w-28">
                  {payout.adding ? (
                    <Button
                      size={SIZE.XSMALL}
                      onClick={handleContract({
                        id: payout.contractId,
                        toAdd: !payout.added,
                      })}
                    >
                      <div className="animate-pulse">Adding</div>
                    </Button>
                  ) : (
                    <Button
                      size={SIZE.XSMALL}
                      color={payout.added ? COLORS.GREEN : COLORS.PURPLE}
                      onClick={handleContract({
                        id: payout.contractId,
                        toAdd: !payout.added,
                      })}
                      disabled={payout.error !== ""}
                    >
                      {payout.added ? "✓" : "+"}
                    </Button>
                  )}
                </div>
              </div>
              {index < possibleWithdraws.length - 1 && <hr />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
