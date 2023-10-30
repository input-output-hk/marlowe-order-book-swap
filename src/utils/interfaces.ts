export interface IToken {
  token: string;
  icon: JSX.Element;
}

export interface ITokenAmount extends IToken {
  amount: number;
}

export interface ITableData {
  id: number;
  createdBy: string;
  offered: ITokenAmount;
  desired: ITokenAmount;
  expiry: string;
}
