export const getExpiration = (expiry: string) => {
  const difference = new Date(expiry).getTime() - new Date().getTime();
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  if (difference < 0) return "Expired";
  return days > 0
    ? `${days} days ${hours}h`
    : hours > 0
    ? `${hours} hours ${minutes}m`
    : `${minutes} minutes`;
};

export const dateTimeOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

export const UPDATING_INTERVAL = 50 * 1000;
