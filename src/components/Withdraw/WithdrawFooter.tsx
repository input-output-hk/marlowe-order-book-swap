import { ICON_SIZES } from "~/utils";
import { Loading } from "../Loading/Loading";

interface WithdrawalFooterProps {
  loadingWithdrawal: boolean;
  errorWithdrawal: boolean;
}

export const WithdrawFooter = ({
  errorWithdrawal,
  loadingWithdrawal,
}: WithdrawalFooterProps) => {
  return (
    <>
      {!errorWithdrawal ? (
        loadingWithdrawal ? (
          <div className="flex w-full items-center gap-4">
            <Loading sizeDesktop={ICON_SIZES.XS} sizeMobile={ICON_SIZES.XS} />
            <b className="text-base text-m-purple">
              Don&apos;t leave the page. Waiting confirmation...
            </b>
          </div>
        ) : (
          <b className="text-center text-m-blue">
            Once started a withdrawal, please don&apos;t close this page until
            the transaction is confirmed.
          </b>
        )
      ) : (
        <div className=" font-semibold text-m-red">
          There was an error on retracting the swap offer
        </div>
      )}
    </>
  );
};
