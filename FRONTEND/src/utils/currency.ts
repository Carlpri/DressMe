import { useSiteSettingsContext } from "../contexts/SiteSettingsContext";

export function useCurrency() {
  const { settings } = useSiteSettingsContext();
  return settings?.currency || "KES";
}

export function formatCurrency(amount: number, currency: string = "KES"): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function useFormatCurrency() {
  const currency = useCurrency();
  return (amount: number) => formatCurrency(amount, currency);
}
