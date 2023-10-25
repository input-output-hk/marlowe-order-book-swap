export interface IToken {
  token: string;
  icon: JSX.Element;
}

export interface ITokenAmount extends IToken {
  amount: number;
}
