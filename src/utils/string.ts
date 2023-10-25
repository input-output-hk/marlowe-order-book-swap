export const truncateTokenName = (tokenName: string, letters: number) => {
  return tokenName.length > letters
    ? tokenName.substring(0, letters) + "..."
    : tokenName;
};
