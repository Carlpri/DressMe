import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Paper,
  Alert,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import WarningIcon from "@mui/icons-material/Warning";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";
import { useFormatCurrency } from "../../utils/currency";
import { WhatsAppService } from "../../services/whatsapp.service";
import { useAppSettings } from "../../hooks/useAppSettings";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function AdminDashboardPage() {
  const formatCurrency = useFormatCurrency();
  const { settings } = useAppSettings();

  const getAuthHeader = () => {
    const token = localStorage.getItem("dressme_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: orders = [], isLoading: ordersLoading } = useQuery<any[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/orders`, { headers: getAuthHeader() });
      return res.data.data;
    },
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<any[]>({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/products?limit=100`, { headers: getAuthHeader() });
      return res.data.data.items;
    },
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<any[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/users`, { headers: getAuthHeader() });
      return res.data.data;
    },
  });

  if (ordersLoading || productsLoading || usersLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const ordersToday = orders.filter((o) => o.createdAt.startsWith(todayStr)).length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const lowStockProducts = products.filter((p) => p.stock <= 5);
  const recentOrders = orders.slice(0, 5);

  const whatsappNumber = settings?.whatsappNumber || "254700000000";

  return (
    <Stack spacing={4}>
      {/* Title */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Dashboard Overview
          </Typography>
          <Typography color="text.secondary">
            Welcome back! Here's what's happening with DressMe today.
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/admin/products"
          variant="contained"
          startIcon={<ShoppingBagIcon />}
        >
          Add Product
        </Button>
      </Box>

      {/* 5 Key Metric Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Orders Today
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {ordersToday}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#EFF6FF", color: "#3B82F6" }}>
                  <ShoppingCartIcon />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {orders.length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#ECFDF5", color: "#10B981" }}>
                  <ShoppingCartIcon />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Products
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {products.length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#F5F3FF", color: "#8B5CF6" }}>
                  <ShoppingBagIcon />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Customers
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {users.length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#FFF7ED", color: "#F97316" }}>
                  <PeopleIcon />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Low Stock Alerts
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: lowStockProducts.length > 0 ? "error.main" : "text.primary" }}>
                    {lowStockProducts.length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#FEF2F2", color: "#EF4444" }}>
                  <WarningIcon />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Operational Widget: Pending Orders Requiring WhatsApp Follow-Up */}
      <Paper elevation={0} sx={{ p: 3, border: "1.5px solid #25D366", borderRadius: 3, bgcolor: "#F0FDF4" }}>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <WhatsAppIcon sx={{ color: "#25D366", fontSize: 32 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#166534" }}>
                  Pending Orders Requiring WhatsApp Follow-Up ({pendingOrders.length})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  These customers placed orders and are waiting for stock & payment confirmation.
                </Typography>
              </Box>
            </Stack>
            <Button
              component={RouterLink}
              to="/admin/orders?status=PENDING"
              variant="outlined"
              color="success"
              endIcon={<ArrowForwardIcon />}
            >
              Manage All Pending
            </Button>
          </Box>

          {pendingOrders.length === 0 ? (
            <Alert severity="success">Great job! No pending orders requiring follow-up.</Alert>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order #</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Placed At</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingOrders.slice(0, 5).map((order) => {
                  const customerPhone = order.address?.phone || "N/A";
                  const chatUrl = WhatsAppService.generateOrderMessage(customerPhone, {
                    orderNumber: order.orderNumber,
                    customerName: order.address?.fullName || "Customer",
                    phone: customerPhone,
                    city: order.address?.city || "",
                    area: order.address?.area || "",
                    total: order.total,
                    currency: settings?.currency || "KES",
                    items: order.items.map((i: any) => ({
                      name: i.productName || "Product",
                      quantity: i.quantity,
                      price: i.price,
                      variantName: i.variantName || undefined,
                    })),
                  });

                  return (
                    <TableRow key={order.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>#{order.orderNumber}</TableCell>
                      <TableCell>{order.address?.fullName || order.user?.name}</TableCell>
                      <TableCell>{customerPhone}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(order.total)}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          startIcon={<WhatsAppIcon />}
                          onClick={() => window.open(chatUrl, "_blank")}
                          sx={{ bgcolor: "#25D366", "&:hover": { bgcolor: "#128C7E" } }}
                        >
                          Chat with Customer
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Stack>
      </Paper>

      {/* Grid: Recent Orders & Low Stock Table */}
      <Grid container spacing={3}>
        {/* Recent 5 Orders */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Recent Orders
                </Typography>
                <Button component={RouterLink} to="/admin/orders" size="small">
                  View All Orders
                </Button>
              </Box>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Order #</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>#{order.orderNumber}</TableCell>
                      <TableCell>{order.address?.fullName || order.user?.name}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          size="small"
                          color={
                            order.status === "DELIVERED"
                              ? "success"
                              : order.status === "CANCELLED"
                              ? "error"
                              : "primary"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Warning Table */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "error.main" }}>
                  Low Stock Warnings
                </Typography>
                <Button component={RouterLink} to="/admin/products" size="small">
                  Manage Inventory
                </Button>
              </Box>

              {lowStockProducts.length === 0 ? (
                <Typography color="text.secondary" py={2}>
                  No low stock warnings.
                </Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockProducts.slice(0, 5).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell sx={{ fontWeight: 500 }}>{product.name}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${product.stock} left`}
                            color={product.stock === 0 ? "error" : "warning"}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
