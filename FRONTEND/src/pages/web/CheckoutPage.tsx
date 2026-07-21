import { useMemo, useState, useEffect } from "react";
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
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useCart } from "../../hooks/useCart";
import { useAddresses } from "../../hooks/useAddresses";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";
import { useSiteSettingsContext } from "../../contexts/SiteSettingsContext";
import { useFormatCurrency } from "../../utils/currency";
import { buildVendorOrderMessage, buildWhatsAppUrl } from "../../utils/whatsapp";
import type { CartItem } from "../../hooks/useCart";

interface VendorCheckoutGroup {
  vendorId: string;
  shopName: string;
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
        shopName: vendor.shopName,
        phone: vendor.phone,
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

  const items = cart?.items ?? [];
  const vendorGroups = useMemo(() => groupItemsByVendor(items), [items]);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity,
    0
  );
  const defaultShippingFee = settings?.defaultShippingFee || 500;
  const shipping = subtotal > 5000 ? 0 : defaultShippingFee;
  const total = subtotal + shipping;

  const selectedAddress = addresses?.find((address) => address.id === selectedAddressId);

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
      shopName: group.shopName,
      customerName: user.name,
      items: group.items,
      address: selectedAddress,
      currency: settings?.currency ?? "KES",
      notes: orderNotes.trim() || undefined,
    });

    const url = buildWhatsAppUrl(group.phone, message);
    if (!url) {
      setError(`${group.shopName} does not have a valid WhatsApp number. Please contact support.`);
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (cartLoading || addressesLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Stack spacing={3}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>Checkout</Typography>
          <LoadingSkeleton height={200} />
          <LoadingSkeleton height={200} />
        </Stack>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Alert severity="info" action={<Button onClick={() => navigate(ROUTES.customerDashboard)}>Shop Now</Button>}>
          Your cart is empty
        </Alert>
      </Container>
    );
  }

  if (vendorGroups.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Alert severity="warning" action={<Button onClick={() => navigate(ROUTES.customerCart)}>Back to Cart</Button>}>
          Store information is missing for items in your cart. Please try again or contact support.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={6}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>Checkout</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Complete your order on WhatsApp with each store. Your cart will be split by vendor.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={4}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={3}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Delivery Address
                    </Typography>

                    {!addresses || addresses.length === 0 ? (
                      <Alert severity="info" action={<Button onClick={() => navigate(ROUTES.customerAddresses)}>Add Address</Button>}>
                        Add a delivery address to include in your WhatsApp order message.
                      </Alert>
                    ) : (
                      <RadioGroup value={selectedAddressId} onChange={(e) => setSelectedAddressId(e.target.value)}>
                        {addresses.map((address) => (
                          <FormControlLabel
                            key={address.id}
                            value={address.id}
                            control={<Radio />}
                            label={
                              <Box sx={{ ml: 2 }}>
                                <Typography sx={{ fontWeight: 500 }}>
                                  {address.label || "Address"}
                                  {address.isDefault && <Chip label="Default" size="small" sx={{ ml: 1 }} />}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {address.fullName} · {address.phone}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {address.street}, {address.area}, {address.city}, {address.county}
                                </Typography>
                              </Box>
                            }
                          />
                        ))}
                      </RadioGroup>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              <TextField
                fullWidth
                label="Order notes (optional)"
                placeholder="Size preferences, delivery instructions, etc."
                multiline
                minRows={2}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />

              {vendorGroups.map((group) => (
                <Card key={group.vendorId} variant="outlined">
                  <CardContent>
                    <Stack spacing={3}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <StorefrontIcon color="primary" />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {group.shopName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {group.items.length} item{group.items.length !== 1 ? "s" : ""} · {formatCurrency(group.subtotal)}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack spacing={2}>
                        {group.items.map((item) => {
                          const primaryImage = item.product.images.find((img) => img.isPrimary) || item.product.images[0];
                          const price = item.variant?.price || item.product.price;
                          return (
                            <Stack key={item.id} direction="row" spacing={3} alignItems="center">
                              <Box
                                sx={{
                                  width: 56,
                                  height: 56,
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  bgcolor: "#F8FAFC",
                                  flexShrink: 0,
                                }}
                              >
                                {primaryImage && (
                                  <Box
                                    component="img"
                                    src={primaryImage.imageUrl}
                                    alt={item.product.name}
                                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  />
                                )}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography sx={{ fontWeight: 500 }}>{item.product.name}</Typography>
                                {item.variant && (
                                  <Typography variant="body2" color="text.secondary">
                                    {item.variant.size} · {item.variant.color}
                                  </Typography>
                                )}
                                <Typography variant="body2" color="text.secondary">
                                  Qty: {item.quantity}
                                </Typography>
                              </Box>
                              <Typography sx={{ fontWeight: 600 }}>{formatCurrency(price * item.quantity)}</Typography>
                            </Stack>
                          );
                        })}
                      </Stack>

                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => handleWhatsAppCheckout(group)}
                        disabled={!selectedAddressId}
                        sx={{
                          fontWeight: 700,
                          bgcolor: "#25D366",
                          "&:hover": { bgcolor: "#1DA851" },
                        }}
                      >
                        Order on WhatsApp
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={3}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Order Summary
                  </Typography>

                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Subtotal</Typography>
                      <Typography>{formatCurrency(subtotal)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Est. shipping</Typography>
                      <Typography>{shipping === 0 ? "Free" : formatCurrency(shipping)}</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>Estimated total</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                        {formatCurrency(total)}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Alert severity="info">
                    {vendorGroups.length > 1
                      ? `Your cart includes items from ${vendorGroups.length} stores. You'll send a separate WhatsApp message to each store.`
                      : "You'll finish payment and delivery details directly with the store on WhatsApp."}
                  </Alert>

                  {error && <Alert severity="error">{error}</Alert>}

                  <Button variant="text" fullWidth onClick={() => navigate(ROUTES.customerCart)}>
                    Back to Cart
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
