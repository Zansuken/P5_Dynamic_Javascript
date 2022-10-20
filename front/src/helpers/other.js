// -- Other -- //

// Format number to €
export const formatToEuro = (number) =>
  Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(number);

// Capitalize strings
export const capitalize = (string) => {
  const lowerCase = string.toLowerCase();
  return string.charAt(0).toUpperCase() + lowerCase.slice(1);
};
