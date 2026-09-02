import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
  Divider,
  Chip,
  TextField,
  Snackbar,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useCart } from "../../hooks/useCart";
import { useAddresses } from "../../hooks/useAddresses";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";
import { useSiteSettingsContext } from "../../contexts/SiteSettingsContext";
import { useFormatCurrency } from "../../utils/currency";
import {
  buildVendorOrderMessage,
  buildAdminCheckoutNotificationMessage,
  buildWhatsAppUrl,
} from "../../utils/whatsapp";
import type { CartItem } from "../../hooks/useCart";

interface VendorCheckoutGroup {
  vendorId: string;
  businessName: string;
  phone: string;
  items: CartItem[];
  subtotal: number;
}

function groupItemsByVendor(items: CartItem[]): VendorCheckoutGroup[] {
  const groups = new Map<string, VendorCheckoutGroup>();

  for (const item of items) {
    const vendor = item.product.vendor;
    if (!vendor) continue;

    const existing = groups.get(vendor.id);
    const lineTotal = (item.variant?.price ?? item.product.price) * item.quantity;

    if (existing) {
      existing.items.push(item);
      existing.subtotal += lineTotal;
    } else {
      groups.set(vendor.id, {
        vendorId: vendor.id,
        businessName: vendor.businessName,
        phone: vendor.whatsappNumber || "",
        items: [item],
        subtotal: lineTotal,
      });
    }
  }

  return Array.from(groups.values());
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const { settings } = useSiteSettingsContext();
  const formatCurrency = useFormatCurrency();
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [adminNotified, setAdminNotified] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const items = cart?.items ?? [];
  const vendorGroups = useMemo(() => groupItemsByVendor(items), [items]);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity,
    0
  );
  const defaultShippingFee = settings?.defaultShippingFee || 500;
  const isFreeShipping = subtotal > 5000;
  const shipping = isFreeShipping ? 0 : defaultShippingFee;
  const total = subtotal + shipping;

  const selectedAddress = addresses?.find((address) => address.id === selectedAddressId);
  const adminWhatsApp = settings?.whatsappNumber || settings?.supportPhone || "254700000000";

  /**
   * Dispatches WhatsApp Checkout Notification to DressMe Admin
   */
  const handleNotifyAdmin = () => {
    setError(null);

    const message = buildAdminCheckoutNotificationMessage({
      customerName: user?.name || "Guest Customer",
      customerPhone: selectedAddress?.phone || (user as any)?.phone || undefined,
      customerEmail: user?.email || undefined,
      items,
      address: selectedAddress as any,
      currency: settings?.currency ?? "KES",
      notes: orderNotes.trim() || undefined,
      subtotal,
      shipping,
      total,
      vendorGroups: vendorGroups.map((g) => ({
        businessName: g.businessName,
        itemsCount: g.items.length,
        subtotal: g.subtotal,
      })),
    });

    const url = buildWhatsAppUrl(adminWhatsApp, message);
    if (!url) {
      setError("Admin WhatsApp number is not configured properly in Settings.");
      return;
    }

    setAdminNotified(true);
    setSnackbarMsg("Admin notification generated for WhatsApp!");
    setSnackbarOpen(true);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  /**
   * Dispatches WhatsApp Order to a specific store/vendor and offers admin notification
   */
  const handleWhatsAppCheckout = (group: VendorCheckoutGroup) => {
    setError(null);

    if (!selectedAddress) {
      setError("Please select a delivery address before messaging the store.");
      return;
    }

    if (!user?.name) {
      setError("Your account name is required for the order message.");
      return;
    }

    const message = buildVendorOrderMessage({
      businessName: group.businessName,
      customerName: user.name,
      items: group.items,
      address: selectedAddress as any,
      currency: settings?.currency ?? "KES",
      notes: orderNotes.trim() || undefined,
    });

    const url = buildWhatsAppUrl(group.phone || adminWhatsApp, message);
    if (!url) {
      setError(`${group.businessName} does not have a valid WhatsApp number. Please contact admin.`);
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (cartLoading || addressesLoading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#07090E", py: { xs: 4, sm: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <LoadingSkeleton height={60} />
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 8 }}>
                <LoadingSkeleton height={300} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <LoadingSkeleton height={350} />
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#07090E", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <Card
            sx={{
              p: 5,
              textAlign: "center",
              bgcolor: "#0B0E14",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
            }}
          >
            <Typography variant="h4" sx={{ color: "#FFF", fontWeight: 800, mb: 2 }}>
              Your shopping bag is empty
            </Typography>
            <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", mb: 4 }}>
              Add some items to your bag before proceeding to checkout.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(ROUTES.customerDashboard)}
              sx={{
                bgcolor: "#00C896",
                color: "#07130F",
                fontWeight: 800,
                borderRadius: "12px",
                px: 4,
                py: 1.2,
                "&:hover": { bgcolor: "#00E0A7" },
              }}
            >
              Explore Products
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#07090E", py: { xs: 4, sm: 6, md: 8 } }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          {/* Header */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: "#00C896",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontSize: "0.75rem",
              }}
            >
              Instant WhatsApp Checkout
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#FFF", letterSpacing: "-0.02em" }}>
              Checkout & Order Confirmation
            </Typography>
            <Typography sx={{ color: "rgba(255, 255, 255, 0.55)", mt: 0.5 }}>
              Confirm your delivery address and send your order directly on WhatsApp. Admin is notified automatically.
            </Typography>
          </Box>

          {/* Error Banner */}
          {error && (
            <Alert
              severity="error"
              onClose={() => setError(null)}
              sx={{ borderRadius: "14px", bgcolor: "rgba(239, 68, 68, 0.15)", color: "#FFF" }}
            >
              {error}
            </Alert>
          )}

          {/* Admin Real-Time Notification Notification Banner */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: "16px",
              bgcolor: "rgba(0, 200, 150, 0.08)",
              border: "1px solid rgba(0, 200, 150, 0.25)",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  bgcolor: "rgba(0, 200, 150, 0.15)",
                  display: "grid",
                  placeItems: "center",
                  color: "#00C896",
                  flexShrink: 0,
                }}
              >
                <NotificationsActiveOutlinedIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography sx={{ color: "#FFF", fontWeight: 700, fontSize: "0.92rem" }}>
                  Real-Time Admin WhatsApp Notification
                </Typography>
                <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.8rem" }}>
                  The central DressMe Admin ({adminWhatsApp}) receives instant WhatsApp alerts when you proceed with this order.
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="outlined"
              size="small"
              startIcon={<WhatsAppIcon sx={{ color: "#25D366 !important" }} />}
              onClick={handleNotifyAdmin}
              sx={{
                color: "#FFF",
                borderColor: "rgba(37, 211, 102, 0.4)",
                bgcolor: "rgba(37, 211, 102, 0.08)",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.78rem",
                px: 2,
                py: 0.8,
                flexShrink: 0,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "rgba(37, 211, 102, 0.18)",
                  borderColor: "#25D366",
                },
              }}
            >
              {adminNotified ? "Re-send Alert to Admin" : "Send WhatsApp Alert to Admin"}
            </Button>
          </Box>

          {/* Main Grid */}
          <Grid container spacing={{ xs: 3, md: 4 }}>
            {/* Left Column: Address & Vendor Order Cards */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                {/* ── 1. Delivery Address Card ──────────────────────────────── */}
                <Card
                  sx={{
                    bgcolor: "#0B0E14",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    p: { xs: 2.5, sm: 3 },
                  }}
                >
                  <Stack spacing={2.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <LocationOnOutlinedIcon sx={{ color: "#00C896" }} />
                      <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 800 }}>
                        1. Select Delivery Address
                      </Typography>
                    </Stack>

                    {!addresses || addresses.length === 0 ? (
                      <Alert
                        severity="info"
                        action={
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(ROUTES.customerAddresses)}
                            sx={{ color: "#00C896", borderColor: "#00C896" }}
                          >
                            Add Address
                          </Button>
                        }
                        sx={{ bgcolor: "rgba(0, 200, 150, 0.1)", color: "#FFF", borderRadius: "12px" }}
                      >
                        You haven't saved any delivery address yet. Please add one to continue.
                      </Alert>
                    ) : (
                      <RadioGroup
                        value={selectedAddressId}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                      >
                        <Stack spacing={1.5}>
                          {addresses.map((address) => {
                            const isSelected = selectedAddressId === address.id;
                            return (
                              <Box
                                key={address.id}
                                onClick={() => setSelectedAddressId(address.id)}
                                sx={{
                                  p: 2,
                                  borderRadius: "14px",
                                  bgcolor: isSelected
                                    ? "rgba(0, 200, 150, 0.08)"
                                    : "rgba(255, 255, 255, 0.02)",
                                  border: "1px solid",
                                  borderColor: isSelected
                                    ? "#00C896"
                                    : "rgba(255, 255, 255, 0.08)",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 1.5,
                                  "&:hover": {
                                    borderColor: "rgba(0, 200, 150, 0.4)",
                                  },
                                }}
                              >
                                <Radio
                                  checked={isSelected}
                                  value={address.id}
                                  sx={{
                                    p: 0,
                                    mt: 0.3,
                                    color: "rgba(255,255,255,0.3)",
                                    "&.Mui-checked": { color: "#00C896" },
                                  }}
                                />
                                <Box sx={{ flex: 1 }}>
                                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                    <Typography sx={{ color: "#FFF", fontWeight: 700, fontSize: "0.95rem" }}>
                                      {address.label || "Home / Office"}
                                    </Typography>
                                    {address.isDefault && (
                                      <Chip
                                        label="Default"
                                        size="small"
                                        sx={{
                                          bgcolor: "rgba(0,200,150,0.15)",
                                          color: "#00C896",
                                          height: 20,
                                          fontSize: "0.65rem",
                                          fontWeight: 800,
                                        }}
                                      />
                                    )}
                                  </Stack>
                                  <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
                                    {address.fullName} · {address.phone}
                                  </Typography>
                                  <Typography sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem" }}>
                                    {[address.street, address.building, address.area, address.city, address.county]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          })}
                        </Stack>
                      </RadioGroup>
                    )}
                  </Stack>
                </Card>

                {/* ── 2. Order Notes ───────────────────────────────────────── */}
                <Card
                  sx={{
                    bgcolor: "#0B0E14",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    p: { xs: 2.5, sm: 3 },
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 800, mb: 1.5 }}>
                    2. Order Notes & Customization (Optional)
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Specific delivery instructions, preferred delivery time, sizing notes, or gift requests..."
                    multiline
                    minRows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(255, 255, 255, 0.04)",
                        borderRadius: "14px",
                        color: "#FFF",
                        "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                        "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.25)" },
                        "&.Mui-focused fieldset": { borderColor: "#00C896" },
                      },
                    }}
                  />
                </Card>

                {/* ── 3. Vendor Orders breakdown ──────────────────────────── */}
                <Typography variant="h6" sx={{ color: "#FFF", fontWeight: 800, pt: 1 }}>
                  3. Store Orders ({vendorGroups.length} {vendorGroups.length === 1 ? "Store" : "Stores"})
                </Typography>

                {vendorGroups.map((group) => (
                  <Card
                    key={group.vendorId}
                    sx={{
                      bgcolor: "#0B0E14",
                      borderRadius: "20px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      p: { xs: 2.5, sm: 3 },
                    }}
                  >
                    <Stack spacing={2.5}>
                      {/* Store Header */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: "10px",
                              bgcolor: "rgba(0, 200, 150, 0.12)",
                              color: "#00C896",
                              display: "grid",
                              placeItems: "center",
                            }}
                          >
                            <StorefrontIcon sx={{ fontSize: 20 }} />
                          </Box>
                          <Box>
                            <Typography sx={{ color: "#FFF", fontWeight: 800, fontSize: "1.05rem" }}>
                              {group.businessName}
                            </Typography>
                            <Typography sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.78rem" }}>
                              {group.items.length} {group.items.length === 1 ? "item" : "items"} · Subtotal:{" "}
                              <strong style={{ color: "#00C896" }}>{formatCurrency(group.subtotal)}</strong>
                            </Typography>
                          </Box>
                        </Stack>

                        <Chip
                          label={group.phone ? "Direct Store WhatsApp" : "Admin Coordinated"}
                          size="small"
                          sx={{
                            bgcolor: "rgba(37, 211, 102, 0.12)",
                            color: "#25D366",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            borderRadius: "8px",
                          }}
                        />
                      </Stack>

                      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.06)" }} />

                      {/* Items */}
                      <Stack spacing={1.5}>
                        {group.items.map((item) => {
                          const primaryImage =
                            (item.product.images ?? []).find((img) => img.isPrimary) ||
                            item.product.images?.[0];
                          const price = item.variant?.price || item.product.price;

                          return (
                            <Stack
                              key={item.id}
                              direction="row"
                              spacing={2}
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                                <Box
                                  sx={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                    bgcolor: "#0E131C",
                                    flexShrink: 0,
                                  }}
                                >
                                  {primaryImage ? (
                                    <Box
                                      component="img"
                                      src={primaryImage.imageUrl}
                                      alt={item.product.name}
                                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                  ) : (
                                    <Box sx={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
                                      <Typography sx={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>DM</Typography>
                                    </Box>
                                  )}
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography
                                    sx={{
                                      color: "#FFF",
                                      fontWeight: 600,
                                      fontSize: "0.9rem",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {item.product.name}
                                  </Typography>
                                  <Typography sx={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "0.75rem" }}>
                                    {[item.variant?.sizeValue, item.variant?.colorValue].filter(Boolean).join(" · ") || "Standard"} · Qty: {item.quantity}
                                  </Typography>
                                </Box>
                              </Stack>

                              <Typography sx={{ color: "#FFF", fontWeight: 700, fontSize: "0.95rem" }}>
                                {formatCurrency(price * item.quantity)}
                              </Typography>
                            </Stack>
                          );
                        })}
                      </Stack>

                      {/* Store WhatsApp Button */}
                      <Button
                        variant="contained"
                        size="medium"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => handleWhatsAppCheckout(group)}
                        disabled={!selectedAddressId}
                        sx={{
                          borderRadius: "12px",
                          py: 1.1,
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          textTransform: "none",
                          bgcolor: "#25D366",
                          color: "#07130F",
                          boxShadow: "0 4px 16px rgba(37, 211, 102, 0.35)",
                          "&:hover": {
                            bgcolor: "#20BA5A",
                            boxShadow: "0 6px 22px rgba(37, 211, 102, 0.5)",
                          },
                        }}
                      >
                        Send Order to {group.businessName} on WhatsApp
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Grid>

            {/* Right Column: Order Summary & Unified Admin Checkout Deck */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  bgcolor: "#0B0E14",
                  borderRadius: "24px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 16px 40px -10px rgba(0, 0, 0, 0.7)",
                  position: { md: "sticky" },
                  top: { md: 100 },
                }}
              >
                <Stack spacing={3}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#FFF", letterSpacing: "-0.01em" }}>
                    Order Summary
                  </Typography>

                  {/* Financial Breakdown */}
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.92rem" }}>
                        Subtotal ({items.length} {items.length === 1 ? "item" : "items"})
                      </Typography>
                      <Typography sx={{ color: "#FFF", fontWeight: 700, fontSize: "0.95rem" }}>
                        {formatCurrency(subtotal)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.92rem" }}>
                        Estimated Shipping
                      </Typography>
                      <Typography
                        sx={{
                          color: isFreeShipping ? "#00C896" : "#FFF",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                        }}
                      >
                        {isFreeShipping ? "FREE" : formatCurrency(shipping)}
                      </Typography>
                    </Stack>

                    <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 1 }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                      <Typography sx={{ color: "#FFF", fontWeight: 800, fontSize: "1.1rem" }}>
                        Total Amount
                      </Typography>
                      <Typography
                        sx={{
                          color: "#00C896",
                          fontWeight: 900,
                          fontSize: "1.5rem",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {formatCurrency(total)}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Unified Admin WhatsApp Checkout Action */}
                  <Stack spacing={1.5}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<WhatsAppIcon />}
                      onClick={handleNotifyAdmin}
                      sx={{
                        borderRadius: "14px",
                        py: 1.4,
                        fontWeight: 900,
                        fontSize: "0.92rem",
                        letterSpacing: "0.02em",
                        textTransform: "none",
                        bgcolor: "#00C896",
                        color: "#07130F",
                        boxShadow: "0 6px 24px rgba(0, 200, 150, 0.4)",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          bgcolor: "#00E0A7",
                          boxShadow: "0 8px 30px rgba(0, 200, 150, 0.6)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Notify Admin on WhatsApp
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<AdminPanelSettingsOutlinedIcon />}
                      onClick={handleNotifyAdmin}
                      sx={{
                        borderRadius: "12px",
                        py: 1,
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        color: "#FFF",
                        borderColor: "rgba(255, 255, 255, 0.15)",
                        bgcolor: "rgba(255, 255, 255, 0.03)",
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.08)",
                          borderColor: "rgba(255, 255, 255, 0.3)",
                        },
                      }}
                    >
                      Coordinate Full Order with Admin
                    </Button>

                    <Button
                      variant="text"
                      fullWidth
                      startIcon={<ArrowBackRoundedIcon />}
                      onClick={() => navigate(ROUTES.customerCart)}
                      sx={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        textTransform: "none",
                        borderRadius: "12px",
                        "&:hover": {
                          color: "#FFF",
                          bgcolor: "rgba(255, 255, 255, 0.05)",
                        },
                      }}
                    >
                      Back to Shopping Bag
                    </Button>
                  </Stack>

                  {/* Trust & Safety Highlights */}
                  <Stack spacing={1.2} sx={{ pt: 1, borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <Stack direction="row" alignItems="center" spacing={1.2}>
                      <ShieldOutlinedIcon sx={{ color: "#00C896", fontSize: 18 }} />
                      <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.78rem" }}>
                        Orders verified by DressMe Admin Team
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1.2}>
                      <WhatsAppIcon sx={{ color: "#25D366", fontSize: 18 }} />
                      <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.78rem" }}>
                        Instant WhatsApp confirmation with store owners
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Container>

      {/* Snackbar Feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setSnackbarOpen(false)}
          sx={{
            bgcolor: "#00C896",
            color: "#07130F",
            fontWeight: 700,
            boxShadow: "0 8px 30px rgba(0,200,150,0.4)",
          }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
