import {
  unContractId,
  type ContractId,
  type PayoutId,
} from "@marlowe.io/runtime-core";
import { type ContractDetails } from "@marlowe.io/runtime-rest-client/contract/details";

import { useEffect, type Dispatch, type SetStateAction } from "react";
import { COLORS, initialContractSchema, lovelaceToAda } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import { type MoreContractDetails } from "./WithdrawPage";

interface ContractListProps {
  possibleWithdraws: (ContractDetails & {
    added: boolean;
    adding: boolean;
    payoutId: PayoutId[] | null;
    error: string;
    amount: bigint;
  })[];
  handleContract: ({
    id,
    add,
  }: {
    id: ContractId;
    add: boolean;
  }) => () => Promise<void>;
  selectAll: () => Promise<void>;
  setPossibleWithdraws: Dispatch<SetStateAction<MoreContractDetails[]>>;
}

export const ContractsList = ({
  possibleWithdraws,
  setPossibleWithdraws,
  handleContract,
  selectAll,
}: ContractListProps) => {
  useEffect(() => {
    setPossibleWithdraws((prev) =>
      prev.map((contract) => {
        const parsedPayout = initialContractSchema.safeParse(
          contract.initialContract,
        );
        if (parsedPayout.success) {
          const token =
            parsedPayout.data.when[0].then.when[0].case.of_token.token_name;
          const amount =
            token === ""
              ? (lovelaceToAda(
                  parsedPayout.data.when[0].then.when[0].case.deposits,
                ) as bigint)
              : parsedPayout.data.when[0].then.when[0].then.pay;
          return {
            ...contract,
            amount: amount,
          };
        } else {
          return {
            ...contract,
            error: "Error obtaining amount",
          };
        }
      }),
    );
  }, [setPossibleWithdraws]);

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
                        add: !payout.added,
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
                        add: !payout.added,
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
