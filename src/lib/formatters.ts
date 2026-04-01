export const formatCurrencyBRL = (amount: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);

export const formatCurrencyBRLFromCents = (amountInCents: number) => formatCurrencyBRL(amountInCents / 100);

export const formatDateBR = (isoDate: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(isoDate));
