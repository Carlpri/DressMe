import { useState } from "react";
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
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import { useCart } from "../../hooks/useCart";
import { useAddresses } from "../../hooks/useAddresses";
import { useCreateOrder } from "../../hooks/useOrders";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const checkout = useCreateOrder();
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [error, setError] = useState<string | null>(null);

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity,
    0
  );
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!selectedAddressId) {
      setError("Please select a shipping address");
      return;
    }
    checkout.mutate(
      { addressId: selectedAddressId },
      {
        onSuccess: (order) => {
          navigate(ROUTES.orderConfirmation, { state: { order } });
        },
        onError: (err) => {
          setError("Failed to place order. Please try again.");
        },
      }
    );
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

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={6}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>Checkout</Typography>

        <Grid container spacing={4}>
          {/* Left Column - Address & Items */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={4}>
              {/* Shipping Address */}
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={3}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Shipping Address
                    </Typography>

                    {!addresses || addresses.length === 0 ? (
                      <Alert severity="info" action={<Button onClick={() => navigate(ROUTES.customerAddresses)}>Add Address</Button>}>
                        No addresses saved
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
                                  {address.fullName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {address.phone}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {address.street}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {address.area}, {address.city}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {address.county}
                                </Typography>
                                {address.postalCode && (
                                  <Typography variant="body2" color="text.secondary">
                                    {address.postalCode}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        ))}
                      </RadioGroup>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={3}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Order Items ({items.length})
                    </Typography>

                    <Stack spacing={2}>
                      {items.map((item) => {
                        const primaryImage = item.product.images.find((img) => img.isPrimary) || item.product.images[0];
                        const price = item.variant?.price || item.product.price;
                        return (
                          <Stack key={item.id} direction="row" spacing={3} alignItems="center">
                            <Box
                              sx={{
                                width: 64,
                                height: 64,
                                borderRadius: 2,
                                overflow: "hidden",
                                bgcolor: "#F8FAFC",
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
                              ) : null}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontWeight: 500 }}>{item.product.name}</Typography>
                              {item.variant && (
                                <Typography variant="body2" color="text.secondary">
                                  {item.variant.size} - {item.variant.color}
                                </Typography>
                              )}
                              <Typography variant="body2" color="text.secondary">
                                Qty: {item.quantity} × KES {price.toLocaleString()}
                              </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 600 }}>
                              KES {(price * item.quantity).toLocaleString()}
                            </Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Right Column - Order Summary */}
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
                      <Typography>KES {subtotal.toLocaleString()}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Shipping</Typography>
                      <Typography>
                        {shipping === 0 ? "Free" : `KES ${shipping.toLocaleString()}`}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Total
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                        KES {total.toLocaleString()}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider />

                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Payment Method
                    </Typography>
                    <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <FormControlLabel value="mpesa" control={<Radio />} label="M-Pesa" />
                      <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
                      <FormControlLabel value="cash" control={<Radio />} label="Cash on Delivery" />
                    </RadioGroup>
                  </Stack>

                  {error && <Alert severity="error">{error}</Alert>}

                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleCheckout}
                    disabled={!selectedAddressId || checkout.isPending}
                    sx={{ fontWeight: 700 }}
                  >
                    {checkout.isPending ? <CircularProgress size={24} /> : "Place Order"}
                  </Button>

                  <Button
                    variant="text"
                    fullWidth
                    onClick={() => navigate(ROUTES.customerCart)}
                  >
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
