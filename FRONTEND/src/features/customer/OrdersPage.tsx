import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import { useOrders } from "../../hooks/useOrders";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";
import type { Order } from "../../hooks/useOrders";

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

export function OrdersPage() {
  const { data: orders, isLoading, error, refetch } = useOrders();

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={6}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>My Orders</Typography>

        {isLoading ? (
          <Stack spacing={3}>
            <LoadingSkeleton height={150} />
            <LoadingSkeleton height={150} />
            <LoadingSkeleton height={150} />
          </Stack>
        ) : error ? (
          <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
            Failed to load orders
          </Alert>
        ) : !orders || orders.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              You haven't placed any orders yet
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
          <Stack spacing={3}>
            {orders.map((order) => (
              <Card key={order.id} variant="outlined">
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 8 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Order #{order.orderNumber}
                          </Typography>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status)}
                            size="small"
                            icon={getStatusIcon(order.status)}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={4} flexWrap="wrap">
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Items
                            </Typography>
                            <Typography sx={{ fontWeight: 500 }}>
                              {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Total
                            </Typography>
                            <Typography sx={{ fontWeight: 500 }}>
                              KES {order.total.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Shipping Address
                            </Typography>
                            <Typography sx={{ fontWeight: 500 }}>
                              {order.address.city}, {order.address.county}
                            </Typography>
                          </Box>
                        </Stack>

                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Order Items
                          </Typography>
                          <Stack spacing={1}>
                            {order.items.slice(0, 3).map((item) => (
                              <Stack
                                key={item.id}
                                direction="row"
                                spacing={2}
                                alignItems="center"
                              >
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 1,
                                    bgcolor: "#F8FAFC",
                                    overflow: "hidden",
                                  }}
                                >
                                  {item.productImage && (
                                    <Box
                                      component="img"
                                      src={item.productImage}
                                      alt={item.productName}
                                      sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  )}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {item.productName}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Qty: {item.quantity} · KES {item.price.toLocaleString()}
                                  </Typography>
                                </Box>
                              </Stack>
                            ))}
                            {order.items.length > 3 && (
                              <Typography variant="caption" color="text.secondary">
                                +{order.items.length - 3} more items
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Stack spacing={2} alignItems={{ xs: "flex-start", sm: "flex-end" }}>
                        <Button
                          component={RouterLink}
                          to={`/orders/${order.id}`}
                          variant="outlined"
                          size="small"
                          fullWidth
                        >
                          View Details
                        </Button>
                        {order.status === "PENDING" && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            fullWidth
                          >
                            Cancel Order
                          </Button>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
