import { type ContractId } from "@marlowe.io/runtime-core";
import { COLORS, truncateString } from "~/utils";
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
  loadingWithdrawal: boolean;
}

export const ContractsList = ({
  possibleWithdraws,
  handleContract,
  selectAll,
  loadingWithdrawal,
}: ContractListProps) => {
  const noContractAvailable = possibleWithdraws.reduce((acc, curr) => {
    return acc && curr.error !== "";
  }, true);

  const isAdding = possibleWithdraws.reduce((acc, curr) => {
    return acc || curr.adding;
  }, false);

  return (
    <div className="flex flex-col gap-3 ">
      <div className="flex flex-col items-center justify-between gap-3 rounded-md bg-m-light-purple p-5 text-center text-2xl font-semibold sm:flex-row">
        Pending Withdrawals
        <div className="text-base">
          <Button
            size={SIZE.XSMALL}
            onClick={selectAll}
            disabled={loadingWithdrawal || noContractAvailable || isAdding}
          >
            Select All
          </Button>
        </div>
      </div>
      <div>
        {possibleWithdraws.map((payout, index) => {
          return (
            <div className="w-inherit flex flex-col gap-3" key={index}>
              <div className="flex flex-col items-center justify-between gap-4 p-3 sm:flex-row">
                <div className="flex w-4/5 flex-col">
                  <div className="flex flex-col break-all md:flex-row lg:flex-col 2xl:flex-row">
                    <b>Contract Id:&nbsp;</b>
                    <div className="hidden lg:block">
                      {String(payout.contractId)}
                    </div>
                    <div className="block lg:hidden">
                      {truncateString(String(payout.contractId), 20)}
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row">
                    <b>Withdraw amount for provider:&nbsp;</b>
                    {payout.error === ""
                      ? Number(payout.amount.provider) +
                        " " +
                        payout.token.provider
                      : payout.error}
                  </div>
                  <div className="flex flex-col lg:flex-row">
                    <b>Withdraw amount for swapper:&nbsp;</b>
                    {payout.error === ""
                      ? Number(payout.amount.swapper) +
                        " " +
                        payout.token.swapper
                      : payout.error}
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
                      disabled
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
                      disabled={payout.error !== "" || loadingWithdrawal}
                    >
                      {payout.added ? "✓" : "+"}
                    </Button>
                  )}
                </div>
              </div>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
};
