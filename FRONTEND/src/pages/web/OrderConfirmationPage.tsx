import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { ROUTES } from "../../constants/routes";
import type { Order } from "../../hooks/useOrders";
import { useFormatCurrency } from "../../utils/currency";

export function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as Order | undefined;
  const formatCurrency = useFormatCurrency();

  if (!order) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Alert severity="error" action={<Button onClick={() => navigate(ROUTES.orders)}>View Orders</Button>}>
          Order information not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={6} alignItems="center">
        {/* Success Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "#E8F5E9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 48, color: "#4CAF50" }} />
        </Box>

        {/* Success Message */}
        <Stack spacing={2} textAlign="center">
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Order Placed Successfully!
          </Typography>
          <Typography color="text.secondary">
            Thank you for your order. We'll send you an email with order details.
          </Typography>
        </Stack>

        {/* Order Details Card */}
        <Card variant="outlined" sx={{ maxWidth: 600, width: "100%" }}>
          <CardContent>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Order #{order.orderNumber}
                </Typography>
                <Chip label={order.status} color="primary" size="small" />
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <LocalShippingIcon color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Shipping Address
                    </Typography>
                    <Typography sx={{ fontWeight: 500 }}>
                      {order.address.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.address.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.address.street}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.address.area}, {order.address.city}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.address.county}
                    </Typography>
                    {order.address.postalCode && (
                      <Typography variant="body2" color="text.secondary">
                        {order.address.postalCode}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Order Items ({order.items.length})
                </Typography>
                {order.items.slice(0, 3).map((item) => (
                  item.product ? (
                    <Stack key={item.id} direction="row" justifyContent="space-between">
                      <Typography variant="body2">
                        {item.product.name} × {item.quantity}
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(item.price * item.quantity)}
                      </Typography>
                    </Stack>
                  ) : null
                ))}
                {order.items.length > 3 && (
                  <Typography variant="caption" color="text.secondary">
                    +{order.items.length - 3} more items
                  </Typography>
                )}
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
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() => navigate(ROUTES.orders)}
          >
            View Order Details
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(ROUTES.customerDashboard)}
          >
            Continue Shopping
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
