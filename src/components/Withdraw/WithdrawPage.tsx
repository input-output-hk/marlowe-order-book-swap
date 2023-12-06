import { type ContractId, type PayoutId } from "@marlowe.io/runtime-core";
import { type ContractDetails } from "@marlowe.io/runtime-rest-client/contract/details";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { ICON_SIZES, PAGES } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import { Loading } from "../Loading/Loading";
import { ContractsList } from "./ContractsList";

export interface MoreContractDetails extends ContractDetails {
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
    MoreContractDetails[]
  >([]);
  const { runtimeLifecycle, client } = useContext(TSSDKContext);
  const router = useRouter();

  useEffect(() => {
    const getPayouts = async () => {
      const availableWithdraws = await runtimeLifecycle?.payouts.available();
      availableWithdraws?.map((payout) => payout.contractId);

      if (availableWithdraws && client) {
        const contractsListPromise = availableWithdraws.map((contract) => {
          return client.getContractById(contract.contractId);
        });
        const contractsList = await Promise.all(contractsListPromise);
        setPossibleWithdraws(
          contractsList.map((contract) => ({
            ...contract,
            added: false,
            adding: false,
            payoutId: null,
            error: "",
            amount: BigInt(0),
          })),
        );
        setLoadingContracts(false);
      }
    };
    void getPayouts();
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
    ({ id, add }: { id: ContractId; add: boolean }) =>
    async () => {
      if (add) {
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
                  added: add,
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
                added: add,
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
        <div>No pending withdrawals</div>
      ) : (
        <div className="w-2/3 rounded-md border p-7 py-10 shadow-container">
          <div className="flex flex-col gap-3 ">
            <ContractsList
              possibleWithdraws={possibleWithdraws}
              handleContract={handleContract}
              selectAll={selectAll}
              setPossibleWithdraws={setPossibleWithdraws}
            />
          </div>
          <div className="flex items-center justify-between gap-3 px-3 pt-10">
            {errorWithdrawal && (
              <div className=" font-semibold text-m-red">
                There was an error on retracting the swap offer
              </div>
            )}
            {!errorWithdrawal &&
              (loadingWithdrawal ? (
                <div className="flex w-full items-center gap-4">
                  <Loading
                    sizeDesktop={ICON_SIZES.XS}
                    sizeMobile={ICON_SIZES.XS}
                  />
                  <b className="text-base text-m-purple">
                    Don&apos;t leave the page. Waiting confirmation...
                  </b>
                </div>
              ) : (
                <b className="text-center text-m-blue">
                  Please don&apos;t close this page until the transaction is
                  confirmed.
                </b>
              ))}
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
