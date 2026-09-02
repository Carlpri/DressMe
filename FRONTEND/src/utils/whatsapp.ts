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

  // Support international numbers (e.g. 10 to 15 digits)
  if (digits.length >= 10 && digits.length <= 15) {
    return digits;
  }

  return null;
}

export function buildWhatsAppUrl(phone: string, message: string): string | null {
  const normalized = normalizeWhatsAppNumber(phone);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export interface VendorOrderMessageOptions {
  businessName: string;
  customerName: string;
  items: CartItem[];
  address: Address;
  currency?: string;
  notes?: string;
}

export function buildVendorOrderMessage({
  businessName,
  customerName,
  items,
  address,
  currency = "KES",
  notes,
}: VendorOrderMessageOptions): string {
  const lines = items.map((item) => {
    const price = item.variant?.price ?? item.product.price;
    const variantLabel = item.variant
      ? ` (${[item.variant.sizeValue, item.variant.colorValue].filter(Boolean).join(", ")})`
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
    `Hi ${businessName},`,
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

export interface AdminCheckoutNotificationOptions {
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  items: CartItem[];
  address?: Address;
  currency?: string;
  notes?: string;
  subtotal: number;
  shipping: number;
  total: number;
  vendorGroups?: Array<{ businessName: string; itemsCount: number; subtotal: number }>;
}

/**
 * Builds a rich WhatsApp notification payload to alert the DressMe Admin
 * whenever any user proceeds to checkout or places an order.
 */
export function buildAdminCheckoutNotificationMessage({
  customerName,
  customerPhone,
  customerEmail,
  items,
  address,
  currency = "KES",
  notes,
  subtotal,
  shipping,
  total,
  vendorGroups,
}: AdminCheckoutNotificationOptions): string {
  const now = new Date();
  const timeStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemLines = items.map((item) => {
    const price = item.variant?.price ?? item.product.price;
    const variantLabel = item.variant
      ? ` (${[item.variant.sizeValue, item.variant.colorValue].filter(Boolean).join(", ")})`
      : "";
    const vendorTag = item.product.vendor?.businessName ? ` [Store: ${item.product.vendor.businessName}]` : "";
    return `• ${item.product.name}${variantLabel} × ${item.quantity} = ${formatCurrency(price * item.quantity, currency)}${vendorTag}`;
  });

  const addressDetails = address
    ? [
        `*Name/Phone:* ${address.fullName} (${address.phone})`,
        `*Address:* ${[address.street, address.building, address.area, address.city, address.county].filter(Boolean).join(", ")}`,
        address.landmark ? `*Landmark:* ${address.landmark}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    : "_Delivery address not yet specified_";

  const vendorSummary =
    vendorGroups && vendorGroups.length > 0
      ? [
          "",
          `🏪 *Vendors Involved (${vendorGroups.length}):*`,
          ...vendorGroups.map(
            (g) => `• ${g.businessName} (${g.itemsCount} item${g.itemsCount !== 1 ? "s" : ""} — ${formatCurrency(g.subtotal, currency)})`
          ),
        ]
      : [];

  return [
    `🔔 *NEW CHECKOUT INITIATED — DressMe Admin Alert*`,
    `📅 _${timeStr}_`,
    "",
    `👤 *Customer Info:*`,
    `• Name: ${customerName}`,
    customerPhone ? `• Phone: ${customerPhone}` : null,
    customerEmail ? `• Email: ${customerEmail}` : null,
    "",
    `📍 *Delivery Location:*`,
    addressDetails,
    "",
    `🛍️ *Order Items (${items.length}):*`,
    ...itemLines,
    ...vendorSummary,
    "",
    `💰 *Financial Breakdown:*`,
    `• Subtotal: ${formatCurrency(subtotal, currency)}`,
    `• Shipping: ${shipping === 0 ? "FREE" : formatCurrency(shipping, currency)}`,
    `• *Grand Total: ${formatCurrency(total, currency)}*`,
    notes ? `\n📝 *Customer Notes:* ${notes}` : null,
    "",
    `⚡ *Admin Action:* Review order status and coordinate fulfillment with stores.`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}
