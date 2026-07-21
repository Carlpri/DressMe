import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "../../hooks/useCart";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";
import { Link as RouterLink } from "react-router-dom";
import { useSiteSettingsContext } from "../../contexts/SiteSettingsContext";
import { useFormatCurrency } from "../../utils/currency";

export function CartPage() {
  const { data: cart, isLoading, error, refetch } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();
  const { settings } = useSiteSettingsContext();
  const formatCurrency = useFormatCurrency();

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity,
    0
  );
  const defaultShippingFee = settings?.defaultShippingFee || 500;
  const shipping = subtotal > 5000 ? 0 : defaultShippingFee;
  const total = subtotal + shipping;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateItem.mutate({ itemId, quantity: newQuantity });
    }
  };

  const handleRemove = (itemId: string) => {
    removeItem.mutate(itemId);
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Stack spacing={3}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>Shopping Cart</Typography>
          <LoadingSkeleton height={200} />
          <LoadingSkeleton height={200} />
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
          Failed to load cart
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={6}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>Shopping Cart</Typography>

        {items.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Your cart is empty
            </Typography>
            <Button
              component={RouterLink}
              to={ROUTES.customerDashboard}
              variant="contained"
            >
              Start Shopping
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                {items.map((item) => {
                  const primaryImage = item.product.images.find((img) => img.isPrimary) || item.product.images[0];
                  const price = item.variant?.price || item.product.price;
                  const itemTotal = price * item.quantity;

                  return (
                    <Card key={item.id} variant="outlined">
                      <CardContent>
                        <Grid container spacing={3} alignItems="center">
                          <Grid size={{ xs: 4, sm: 3, md: 2 }}>
                            <Box
                              sx={{
                                position: "relative",
                                pt: "100%",
                                bgcolor: "#F8FAFC",
                                borderRadius: 2,
                                overflow: "hidden",
                              }}
                            >
                              {primaryImage ? (
                                <Box
                                  component={RouterLink}
                                  to={`${ROUTES.customerDashboard}/${item.product.slug}`}
                                  sx={{
                                    position: "absolute",
                                    inset: 0,
                                  }}
                                >
                                  <Box
                                    component="img"
                                    src={primaryImage.imageUrl}
                                    alt={item.product.name}
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                </Box>
                              ) : (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    inset: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Typography variant="caption" color="text.secondary">
                                    No image
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 8, sm: 9, md: 6 }}>
                            <Stack spacing={1}>
                              <Typography
                                component={RouterLink}
                                to={`${ROUTES.customerDashboard}/${item.product.slug}`}
                                sx={{
                                  fontWeight: 600,
                                  textDecoration: "none",
                                  "&:hover": {
                                    color: "primary.main",
                                    textDecoration: "none",
                                  },
                                }}
                              >
                                {item.product.name}
                              </Typography>
                              {item.variant && (
                                <Typography variant="body2" color="text.secondary">
                                  {item.variant.size} - {item.variant.color}
                                </Typography>
                              )}
                              <Typography variant="body2" color="text.secondary">
                                {formatCurrency(price)}
                              </Typography>
                            </Stack>
                          </Grid>

                          <Grid size={{ xs: 6, md: 2 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updateItem.isPending}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography sx={{ minWidth: 32, textAlign: "center" }}>
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={updateItem.isPending}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleRemove(item.id)}
                                disabled={removeItem.isPending}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Grid>

                          <Grid size={{ xs: 6, md: 2 }}>
                            <Typography sx={{ fontWeight: 600 }}>
                              {formatCurrency(itemTotal)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  );
                })}
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
                        <Typography color="text.secondary">Shipping</Typography>
                        <Typography>
                          {shipping === 0 ? "Free" : formatCurrency(shipping)}
                        </Typography>
                      </Stack>
                      <Divider />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Total
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                          {formatCurrency(total)}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        placeholder="Enter promo code"
                        size="small"
                      />
                      <Button variant="outlined" size="small">
                        Apply Code
                      </Button>
                    </Stack>

                    <Button
                      component={RouterLink}
                      to={ROUTES.checkout}
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ fontWeight: 700 }}
                    >
                      Proceed to Checkout
                    </Button>

                    <Button
                      component={RouterLink}
                      to={ROUTES.customerDashboard}
                      variant="text"
                      fullWidth
                    >
                      Continue Shopping
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Stack>
    </Container>
  );
}
