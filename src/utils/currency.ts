export const SUPPORTED_CURRENCIES = ['USD', 'CAD', 'EUR', 'GBP'] as const;
export type Currency = typeof SUPPORTED_CURRENCIES[number];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  CAD: 'CAD$',
  EUR: '€',
  GBP: '£',
};

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toFixed(2)}`;
}

export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency] || '$';
}

export function validateCurrency(currency: string): currency is Currency {
  return SUPPORTED_CURRENCIES.includes(currency as Currency);
}
