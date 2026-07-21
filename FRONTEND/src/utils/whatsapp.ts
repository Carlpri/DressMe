import type { Address } from "../hooks/useAddresses";
import type { CartItem } from "../hooks/useCart";
import { formatCurrency } from "./currency";

/** Normalize Kenyan phone numbers for wa.me links (254XXXXXXXXX). */
export function normalizeWhatsAppNumber(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("254") && digits.length === 12) {
    return digits;
  }

  if (digits.startsWith("0") && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }

  if (digits.length === 9 && digits.startsWith("7")) {
    return `254${digits}`;
  }

  return null;
}

export function buildWhatsAppUrl(phone: string, message: string): string | null {
  const normalized = normalizeWhatsAppNumber(phone);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

interface VendorOrderMessageOptions {
  shopName: string;
  customerName: string;
  items: CartItem[];
  address: Address;
  currency?: string;
  notes?: string;
}

export function buildVendorOrderMessage({
  shopName,
  customerName,
  items,
  address,
  currency = "KES",
  notes,
}: VendorOrderMessageOptions): string {
  const lines = items.map((item) => {
    const price = item.variant?.price ?? item.product.price;
    const variantLabel = item.variant
      ? ` (${item.variant.size}, ${item.variant.color})`
      : "";
    return `• ${item.product.name}${variantLabel} × ${item.quantity} — ${formatCurrency(price * item.quantity, currency)}`;
  });

  const subtotal = items.reduce(
    (sum, item) => sum + (item.variant?.price ?? item.product.price) * item.quantity,
    0
  );

  const addressLines = [
    address.fullName,
    address.phone,
    [address.street, address.building].filter(Boolean).join(", "),
    [address.area, address.city, address.county].filter(Boolean).join(", "),
    address.landmark ? `Landmark: ${address.landmark}` : null,
  ].filter(Boolean);

  return [
    `Hi ${shopName},`,
    "",
    `I'd like to place an order via DressMe.`,
    "",
    `Customer: ${customerName}`,
    "",
    "Items:",
    ...lines,
    "",
    `Subtotal: ${formatCurrency(subtotal, currency)}`,
    "",
    "Delivery address:",
    ...addressLines,
    notes ? `\nNotes: ${notes}` : "",
    "",
    "Please confirm availability and payment details. Thank you!",
  ]
    .filter((line) => line !== null)
    .join("\n");
}
