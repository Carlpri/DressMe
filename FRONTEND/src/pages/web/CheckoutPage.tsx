import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  Button,
  Radio,
  RadioGroup,
  Alert,
  Divider,
  Chip,
  TextField,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { useCart } from "../../hooks/useCart";
import { useAddresses } from "../../hooks/useAddresses";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";
import { useSiteSettingsContext } from "../../contexts/SiteSettingsContext";
import { useFormatCurrency } from "../../utils/currency";
import {
  buildAdminCheckoutNotificationMessage,
  buildWhatsAppUrl,
} from "../../utils/whatsapp";

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

  const items = cart?.items ?? [];

  const subtotal = items.reduce(
    (sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity,
    0
  );
  const defaultShippingFee = settings?.defaultShippingFee || 500;
  const isFreeShipping = subtotal > 5000;
  const shipping = isFreeShipping ? 0 : defaultShippingFee;
  const total = subtotal + shipping;

  const selectedAddress = addresses?.find((a) => a.id === selectedAddressId);
  const adminWhatsApp = settings?.whatsappNumber || settings?.supportPhone || "254700000000";

  /**
   * The single checkout action — sends a consolidated order to the DressMe admin WhatsApp.
   * Vendor/store info is included internally in the message for admin fulfilment, but
   * the customer only sees and interacts with DressMe as the single point of contact.
   */
  const handleCheckout = () => {
    setError(null);

    if (!selectedAddressId || !selectedAddress) {
      setError("Please select a delivery address to continue.");
      return;
    }

    if (!user?.name) {
      setError("Your account name is required to place an order.");
      return;
    }

    const message = buildAdminCheckoutNotificationMessage({
      customerName: user.name,
      customerPhone: selectedAddress.phone || (user as any)?.phone || undefined,
      customerEmail: user.email || undefined,
      items,
      address: selectedAddress as any,
      currency: settings?.currency ?? "KES",
      notes: orderNotes.trim() || undefined,
      subtotal,
      shipping,
      total,
    });

    const url = buildWhatsAppUrl(adminWhatsApp, message);
    if (!url) {
      setError("Checkout is temporarily unavailable. Please contact support.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (cartLoading || addressesLoading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#F8FAFC", py: { xs: 4, sm: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <LoadingSkeleton height={60} />
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 8 }}>
                <LoadingSkeleton height={320} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <LoadingSkeleton height={380} />
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#F8FAFC", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <Card
            sx={{
              p: 5,
              textAlign: "center",
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "24px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h4" sx={{ color: "#0F172A", fontWeight: 800, mb: 2 }}>
              Your shopping bag is empty
            </Typography>
            <Typography sx={{ color: "#64748B", mb: 4 }}>
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
                textTransform: "none",
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#F8FAFC", py: { xs: 4, sm: 6, md: 8 } }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          {/* ── Page Header ──────────────────────────────────────────── */}
          <Box>
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => navigate(ROUTES.customerCart)}
              sx={{
                color: "#64748B",
                fontWeight: 600,
                textTransform: "none",
                px: 0,
                mb: 2,
                "&:hover": { color: "#0F172A", bgcolor: "transparent" },
              }}
            >
              Back to Bag
            </Button>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
              Checkout
            </Typography>
            <Typography sx={{ color: "#64748B", mt: 0.5, fontSize: "0.95rem" }}>
              Confirm your delivery details and place your order instantly.
            </Typography>
          </Box>

          {/* ── Error Banner ─────────────────────────────────────────── */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: "14px" }}>
              {error}
            </Alert>
          )}

          {/* ── Main Grid ────────────────────────────────────────────── */}
          <Grid container spacing={{ xs: 3, md: 4 }}>

            {/* ── Left: Delivery + Order Notes + Items preview ── */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>

                {/* 1. Delivery Address */}
                <Card
                  sx={{
                    bgcolor: "#FFFFFF",
                    borderRadius: "20px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    p: { xs: 2.5, sm: 3 },
                  }}
                >
                  <Stack spacing={2.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <LocationOnOutlinedIcon sx={{ color: "#00C896" }} />
                      <Typography variant="h6" sx={{ color: "#0F172A", fontWeight: 800 }}>
                        Delivery Address
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
                            sx={{ color: "#00C896", borderColor: "#00C896", textTransform: "none" }}
                          >
                            Add Address
                          </Button>
                        }
                        sx={{ borderRadius: "12px" }}
                      >
                        No delivery address saved. Please add one to continue.
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
                                  bgcolor: isSelected ? "rgba(0, 200, 150, 0.06)" : "#F8FAFC",
                                  border: "1px solid",
                                  borderColor: isSelected ? "#00C896" : "#E2E8F0",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 1.5,
                                  "&:hover": { borderColor: "#00C896" },
                                }}
                              >
                                <Radio
                                  checked={isSelected}
                                  value={address.id}
                                  sx={{ p: 0, mt: 0.3, "&.Mui-checked": { color: "#00C896" } }}
                                />
                                <Box sx={{ flex: 1 }}>
                                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                    <Typography sx={{ color: "#0F172A", fontWeight: 700, fontSize: "0.95rem" }}>
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
                                  <Typography sx={{ color: "#334155", fontSize: "0.85rem" }}>
                                    {address.fullName} · {address.phone}
                                  </Typography>
                                  <Typography sx={{ color: "#64748B", fontSize: "0.82rem" }}>
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

                {/* 2. Order Notes */}
                <Card
                  sx={{
                    bgcolor: "#FFFFFF",
                    borderRadius: "20px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    p: { xs: 2.5, sm: 3 },
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#0F172A", fontWeight: 800, mb: 1.5 }}>
                    Order Notes
                    <Typography component="span" sx={{ color: "#94A3B8", fontWeight: 400, fontSize: "0.85rem", ml: 1 }}>
                      (optional)
                    </Typography>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Delivery instructions, preferred time, sizing notes, gift message..."
                    multiline
                    minRows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#F8FAFC",
                        borderRadius: "14px",
                        "& fieldset": { borderColor: "#CBD5E1" },
                        "&:hover fieldset": { borderColor: "#94A3B8" },
                        "&.Mui-focused fieldset": { borderColor: "#00C896" },
                      },
                    }}
                  />
                </Card>

                {/* 3. Items in your order */}
                <Card
                  sx={{
                    bgcolor: "#FFFFFF",
                    borderRadius: "20px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    p: { xs: 2.5, sm: 3 },
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#0F172A", fontWeight: 800, mb: 2 }}>
                    Order Items
                    <Typography component="span" sx={{ color: "#64748B", fontWeight: 500, fontSize: "0.85rem", ml: 1 }}>
                      ({items.length} {items.length === 1 ? "item" : "items"})
                    </Typography>
                  </Typography>

                  <Stack spacing={1.5} divider={<Divider sx={{ borderColor: "#F1F5F9" }} />}>
                    {items.map((item) => {
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
                                width: 60,
                                height: 60,
                                borderRadius: "12px",
                                overflow: "hidden",
                                bgcolor: "#F1F5F9",
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
                                  <Typography sx={{ color: "#94A3B8", fontSize: "0.7rem", fontWeight: 700 }}>DM</Typography>
                                </Box>
                              )}
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{
                                  color: "#0F172A",
                                  fontWeight: 600,
                                  fontSize: "0.9rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {item.product.name}
                              </Typography>
                              <Typography sx={{ color: "#64748B", fontSize: "0.75rem" }}>
                                {[item.variant?.sizeValue, item.variant?.colorValue]
                                  .filter(Boolean)
                                  .join(" · ") || "Standard"}{" "}
                                · Qty: {item.quantity}
                              </Typography>
                            </Box>
                          </Stack>

                          <Typography sx={{ color: "#0F172A", fontWeight: 700, fontSize: "0.95rem", flexShrink: 0 }}>
                            {formatCurrency(price * item.quantity)}
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Card>
              </Stack>
            </Grid>

            {/* ── Right: Order Summary + Single Checkout Button ── */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: { xs: 2.5, sm: 3.5 },
                  bgcolor: "#FFFFFF",
                  borderRadius: "24px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 20px -4px rgba(0,0,0,0.08)",
                  position: { md: "sticky" },
                  top: { md: 100 },
                }}
              >
                <Stack spacing={3}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em" }}>
                    Order Summary
                  </Typography>

                  {/* Financial Breakdown */}
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ color: "#64748B", fontSize: "0.92rem" }}>
                        Subtotal ({items.length} {items.length === 1 ? "item" : "items"})
                      </Typography>
                      <Typography sx={{ color: "#0F172A", fontWeight: 700, fontSize: "0.95rem" }}>
                        {formatCurrency(subtotal)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ color: "#64748B", fontSize: "0.92rem" }}>
                        Estimated Shipping
                      </Typography>
                      <Typography
                        sx={{
                          color: isFreeShipping ? "#00C896" : "#0F172A",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                        }}
                      >
                        {isFreeShipping ? "FREE" : formatCurrency(shipping)}
                      </Typography>
                    </Stack>

                    {isFreeShipping && (
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: "#00C896",
                          bgcolor: "rgba(0,200,150,0.08)",
                          borderRadius: "8px",
                          px: 1.5,
                          py: 0.5,
                          fontWeight: 600,
                        }}
                      >
                        🎉 You qualify for free shipping!
                      </Typography>
                    )}

                    <Divider sx={{ borderColor: "#E2E8F0", my: 0.5 }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                      <Typography sx={{ color: "#0F172A", fontWeight: 800, fontSize: "1.1rem" }}>
                        Total
                      </Typography>
                      <Typography
                        sx={{
                          color: "#00C896",
                          fontWeight: 900,
                          fontSize: "1.6rem",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {formatCurrency(total)}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* ── THE SINGLE CHECKOUT BUTTON ─────────────── */}
                  <Button
                    id="checkout-whatsapp-btn"
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<WhatsAppIcon sx={{ fontSize: "1.3rem !important" }} />}
                    onClick={handleCheckout}
                    disabled={!selectedAddressId}
                    sx={{
                      borderRadius: "16px",
                      py: 1.7,
                      fontWeight: 900,
                      fontSize: "1rem",
                      letterSpacing: "0.01em",
                      textTransform: "none",
                      bgcolor: "#25D366",
                      color: "#FFFFFF",
                      boxShadow: "0 6px 24px rgba(37, 211, 102, 0.4)",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        bgcolor: "#1DAA54",
                        boxShadow: "0 8px 32px rgba(37, 211, 102, 0.55)",
                        transform: "translateY(-2px)",
                      },
                      "&:disabled": {
                        bgcolor: "#CBD5E1",
                        color: "#94A3B8",
                        boxShadow: "none",
                        transform: "none",
                      },
                    }}
                  >
                    Place Order via WhatsApp
                  </Button>

                  {!selectedAddressId && (
                    <Typography sx={{ fontSize: "0.78rem", color: "#94A3B8", textAlign: "center", mt: -1 }}>
                      Select a delivery address to continue
                    </Typography>
                  )}

                  {/* Trust Signals */}
                  <Stack spacing={1} sx={{ pt: 0.5, borderTop: "1px solid #E2E8F0" }}>
                    <Stack direction="row" alignItems="center" spacing={1.2}>
                      <ShieldOutlinedIcon sx={{ color: "#00C896", fontSize: 17 }} />
                      <Typography sx={{ color: "#64748B", fontSize: "0.78rem" }}>
                        Secure, managed by DressMe
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1.2}>
                      <LocalShippingOutlinedIcon sx={{ color: "#00C896", fontSize: 17 }} />
                      <Typography sx={{ color: "#64748B", fontSize: "0.78rem" }}>
                        Free delivery on orders over {formatCurrency(5000)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1.2}>
                      <WhatsAppIcon sx={{ color: "#25D366", fontSize: 17 }} />
                      <Typography sx={{ color: "#64748B", fontSize: "0.78rem" }}>
                        Order confirmed instantly on WhatsApp
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
