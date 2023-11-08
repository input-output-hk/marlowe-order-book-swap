export const truncateString = (string: string, letters: number) => {
  return string.length > letters
    ? string.substring(0, letters) + "..."
    : string;
};

export const hexaToText = (hexa: string) => {
  let text = "";
  for (let i = 0; i < hexa.length; i += 2) {
    text += String.fromCharCode(parseInt(hexa.substring(i, i + 2), 16));
  }
  return text;
};
