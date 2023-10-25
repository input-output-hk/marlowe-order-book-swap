export interface TableBodyProps {
  data: Array<{
    id: number;
    createdBy: string;
    offered: { token: string; amount: number };
    desired: { token: string; amount: number };
    expiry: string;
  }>;
}
