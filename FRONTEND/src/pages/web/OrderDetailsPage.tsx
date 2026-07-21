import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import { useOrder } from "../../hooks/useOrders";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";
import { Link as RouterLink } from "react-router-dom";
import { useFormatCurrency } from "../../utils/currency";

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "warning";
    case "PROCESSING":
      return "info";
    case "SHIPPED":
      return "primary";
    case "DELIVERED":
      return "success";
    case "CANCELLED":
      return "error";
    default:
      return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <PendingIcon />;
    case "PROCESSING":
      return <PendingIcon />;
    case "SHIPPED":
      return <LocalShippingIcon />;
    case "DELIVERED":
      return <CheckCircleIcon />;
    case "CANCELLED":
      return <CancelIcon />;
    default:
      return <PendingIcon />;
  }
};

export function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(id || "");
  const formatCurrency = useFormatCurrency();

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Stack spacing={3}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(ROUTES.orders)}>
            Back to Orders
          </Button>
          <LoadingSkeleton height={300} />
        </Stack>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Stack spacing={3}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(ROUTES.orders)}>
            Back to Orders
          </Button>
          <Alert severity="error">Failed to load order details</Alert>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={6}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(ROUTES.orders)}>
            Back to Orders
          </Button>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Order #{order.orderNumber}
            </Typography>
            <Chip
              label={order.status}
              color={getStatusColor(order.status)}
              size="medium"
              icon={getStatusIcon(order.status)}
            />
          </Stack>
        </Stack>

        <Grid container spacing={4}>
          {/* Left Column - Order Info */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={4}>
              {/* Order Status */}
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Order Status
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {order.status === "PENDING" && "Your order is being processed."}
                      {order.status === "PROCESSING" && "Your order is being prepared for shipment."}
                      {order.status === "SHIPPED" && "Your order has been shipped and is on its way."}
                      {order.status === "DELIVERED" && "Your order has been delivered."}
                      {order.status === "CANCELLED" && "This order has been cancelled."}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Shipping Address
                    </Typography>
                    <Stack spacing={1}>
                      <Typography>{order.address.fullName}</Typography>
                      <Typography>{order.address.phone}</Typography>
                      <Typography>{order.address.street}</Typography>
                      <Typography>{order.address.area}, {order.address.city}</Typography>
                      <Typography>{order.address.county}</Typography>
                      {order.address.postalCode && <Typography>{order.address.postalCode}</Typography>}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={3}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Order Items ({order.items.length})
                    </Typography>

                    <Stack spacing={3}>
                      {order.items.map((item) => {
                        if (!item.product) return null;
                        const primaryImage = item.product.images.find((img) => img.isPrimary) || item.product.images[0];
                        return (
                          <Stack key={item.id} direction="row" spacing={3} alignItems="center">
                            <Box
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 2,
                                overflow: "hidden",
                                bgcolor: "#F8FAFC",
                                flexShrink: 0,
                              }}
                            >
                              {primaryImage ? (
                                <Box
                                  component={RouterLink}
                                  to={`${ROUTES.customerDashboard}/${item.product.slug}`}
                                  sx={{ display: "block", height: "100%" }}
                                >
                                  <Box
                                    component="img"
                                    src={primaryImage.imageUrl}
                                    alt={item.product.name}
                                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  />
                                </Box>
                              ) : null}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                component={RouterLink}
                                to={`${ROUTES.customerDashboard}/${item.product.slug}`}
                                sx={{ fontWeight: 600, textDecoration: "none", "&:hover": { color: "primary.main" } }}
                              >
                                {item.product.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Qty: {item.quantity}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatCurrency(item.price)} each
                              </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 600 }}>
                              {formatCurrency(item.price * item.quantity)}
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
                      <Typography>{formatCurrency(order.subtotal)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Shipping</Typography>
                      <Typography>Included</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Total
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                        {formatCurrency(order.total)}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider />

                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Need Help?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      If you have any questions about your order, please contact our support team.
                    </Typography>
                    <Button variant="outlined" fullWidth>
                      Contact Support
                    </Button>
                  </Stack>

                  {order.status === "PENDING" && (
                    <Button variant="outlined" color="error" fullWidth>
                      Cancel Order
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(ROUTES.customerDashboard)}
                  >
                    Continue Shopping
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
