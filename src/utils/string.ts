export const truncateString = (string: string, letters: number) => {
  return string.length > letters
    ? string.substring(0, letters) + "..."
    : string;
};
