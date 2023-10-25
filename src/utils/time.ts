export const getExpiration = (expiry: string) => {
  const difference = new Date(expiry).getTime() - new Date().getTime();
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  return days > 0
    ? `${days} days ${hours}h`
    : hours > 0
    ? `${hours} hours ${minutes}m`
    : `${minutes} minutes`;
};
