export interface TableProps {
  data: Array<ITableData>;
}

interface ITableData {
  id: number;
  createdBy: string;
  offered: IToken;
  desired: IToken;
  expiry: string;
}

interface IToken {
  token: string;
  amount: number;
}
