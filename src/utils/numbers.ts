export const humanReadable = (num: number, digits: number) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "t" },
    { value: 1e15, symbol: "q" },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });

  if (!item) {
    return num.toPrecision(2);
  }

  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
};

export const decimalToInt = (decimal: number | bigint, decimals: number) => {
  if (typeof decimal === "number") {
    return decimal * 10 ** decimals;
  }
  return decimal * BigInt(10 ** decimals);
};

export const intToDecimal = (int: number | bigint, decimals: number) => {
  if (typeof int === "number") {
    return int / 10 ** decimals;
  }
  return int / BigInt(10 ** decimals);
};

export const adaToLovelace = (ada: number | bigint) => {
  return decimalToInt(ada, 6);
};

export const lovelaceToAda = (lovelace: number | bigint) => {
  return intToDecimal(lovelace, 6);
};
