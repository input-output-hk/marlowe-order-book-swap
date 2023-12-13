import { type ContractId, type PayoutId } from "@marlowe.io/runtime-core";
import { type ContractDetails } from "@marlowe.io/runtime-rest-client/contract/details";
import Image from "next/image";
import { useRouter } from "next/router";
import NoWithdrawalIcon from "public/no-withdrawal.svg";
import { useContext, useEffect, useState } from "react";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { ICON_SIZES, PAGES, getPayouts } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import { Loading } from "../Loading/Loading";
import { ContractsList } from "./ContractsList";
import { WithdrawFooter } from "./WithdrawFooter";

export interface IMoreContractDetails extends ContractDetails {
  added: boolean;
  adding: boolean;
  payoutId: PayoutId[] | null;
  error: string;
  amount: bigint;
}

export const WithdrawPage = () => {
  const [loadingContracts, setLoadingContracts] = useState(true);
  const [loadingWithdrawal, setLoadingWithdrawal] = useState(false);
  const [errorWithdrawal, setErrorWithdrawal] = useState(false);

  const [possibleWithdraws, setPossibleWithdraws] = useState<
    IMoreContractDetails[]
  >([]);
  const { runtimeLifecycle, client } = useContext(TSSDKContext);
  const router = useRouter();

  useEffect(() => {
    void getPayouts(
      runtimeLifecycle,
      client,
      setPossibleWithdraws,
      setLoadingContracts,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, runtimeLifecycle]);

  const withdraw = async () => {
    setLoadingWithdrawal(true);
    const isContractToWithdraw = possibleWithdraws.some(
      (contract) => contract.added,
    );

    if (isContractToWithdraw) {
      try {
        const withdrawList = possibleWithdraws
          .filter((contract) => contract.added)
          .filter((contract) => contract.error === "")
          .flatMap((contract) => contract.payoutId!);
        await runtimeLifecycle?.payouts.withdraw(withdrawList);
        void router.push(PAGES.LISTING);
      } catch (e) {
        console.log(e);
        setErrorWithdrawal(true);
      }
    }
  };

  const selectAll = async () => {
    const remainingWithdraws = possibleWithdraws
      .filter((contract) => !contract.added)
      .map((contract) => contract.contractId);

    setPossibleWithdraws((prev) =>
      prev.map((contract) => {
        if (
          remainingWithdraws.includes(contract.contractId) &&
          contract.error === ""
        ) {
          return { ...contract, adding: true };
        }
        return contract;
      }),
    );

    const availableWithdraws = await runtimeLifecycle?.payouts.available({
      byContractIds: remainingWithdraws,
      byMyRoleTokens: (myRolesOnWallet) => myRolesOnWallet,
    });
    const payoutIds = availableWithdraws?.map((payout) => payout.payoutId);
    if (payoutIds) {
      setPossibleWithdraws((prev) =>
        prev.map((contract) => {
          if (
            remainingWithdraws.includes(contract.contractId) &&
            contract.error === ""
          ) {
            return {
              ...contract,
              added: true,
              adding: false,
              payoutId: payoutIds,
            };
          }
          return contract;
        }),
      );
    }
  };

  const handleContract =
    ({ id, toAdd }: { id: ContractId; toAdd: boolean }) =>
    async () => {
      if (toAdd) {
        setPossibleWithdraws((prev) =>
          prev.map((contract) => {
            if (contract.contractId === id) {
              return { ...contract, adding: true };
            }
            return contract;
          }),
        );
        const payout = await runtimeLifecycle?.payouts
          .available({
            byContractIds: [id],
            byMyRoleTokens: (myRolesOnWallet) => myRolesOnWallet,
          })
          .then((res) => res.map((payout) => payout.payoutId));
        if (payout) {
          setPossibleWithdraws((prev) =>
            prev.map((contract) => {
              if (contract.contractId === id) {
                return {
                  ...contract,
                  added: toAdd,
                  adding: false,
                  payoutId: payout,
                };
              }
              return contract;
            }),
          );
        }
      } else {
        setPossibleWithdraws((prev) =>
          prev.map((contract) => {
            if (contract.contractId === id) {
              return {
                ...contract,
                added: toAdd,
                adding: false,
                payoutId: null,
              };
            }
            return contract;
          }),
        );
      }
    };

  const isAdding = possibleWithdraws.some((contract) => contract.adding);
  const contractsToWitdhraw =
    possibleWithdraws.filter((contract) => contract.added).length === 0;

  if (loadingContracts) {
    return (
      <div className="flex flex-grow items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex h-fit flex-grow flex-col items-center justify-between gap-3 text-m-disabled">
      {possibleWithdraws.length === 0 ? (
        <div className="m-auto flex flex-col items-center gap-3 rounded-md p-5 text-center text-3xl font-semibold">
          <Image
            src={NoWithdrawalIcon as string}
            alt=""
            height={ICON_SIZES.XXL}
          />
          No pending withdrawals
        </div>
      ) : (
        <div className="w-2/3 rounded-md border p-7 py-10 shadow-container">
          <div className="flex flex-col gap-3 ">
            <ContractsList
              possibleWithdraws={possibleWithdraws}
              handleContract={handleContract}
              selectAll={selectAll}
              loadingWithdrawal={loadingWithdrawal}
            />
          </div>
          <div className="flex items-center justify-between gap-3 px-3 pt-10">
            <WithdrawFooter
              errorWithdrawal={errorWithdrawal}
              loadingWithdrawal={loadingWithdrawal}
            />
            <div className="w-28">
              <Button
                size={SIZE.XSMALL}
                onClick={withdraw}
                disabled={isAdding || loadingWithdrawal || contractsToWitdhraw}
                filled
              >
                Withdraw
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
