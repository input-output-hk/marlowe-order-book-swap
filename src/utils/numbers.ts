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

export const adaToLovelace = (ada: number | bigint) => {
  if (typeof ada === "number") {
    return ada * 1e6;
  }
  return ada * BigInt(1e6);
};

export const lovelaceToAda = (lovelace: number | bigint) => {
  if (typeof lovelace === "number") {
    return lovelace / 1e6;
  }
  return lovelace / BigInt(1e6);
};
