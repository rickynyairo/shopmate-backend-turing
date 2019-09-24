/* eslint-disable import/prefer-default-export */
export const creditCardValidator = creditCard => {
  const isVisa = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/.test(creditCard) === true; /** Visa card regex */
  const isMasterCard = /^(?:5[1-5][0-9]{14})$/.test(creditCard) === true; /** Master card regex */
  const isAmex = /^(?:3[47][0-9]{13})$/ === true; /** American Express card regex */
  const isValid = isVisa || isMasterCard || isAmex;
  return isValid;
};
