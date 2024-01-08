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

export const textToHexa = (text: string) => {
  let hexa = "";
  for (let i = 0; i < text.length; i++) {
    hexa += text.charCodeAt(i).toString(16);
  }
  return hexa;
};
