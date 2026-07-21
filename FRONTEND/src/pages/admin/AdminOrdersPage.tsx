import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
  FormControl,
  Select,
  MenuItem,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useFormatCurrency } from "../../utils/currency";
import { WhatsAppService } from "../../services/whatsapp.service";
import { useAppSettings } from "../../hooks/useAppSettings";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const ORDER_STATUSES = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const formatCurrency = useFormatCurrency();
  const { settings } = useAppSettings();

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("dressme_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: orders = [], isLoading } = useQuery<any[]>({
    queryKey: ["admin-orders-page"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/orders`, { headers: getAuthHeader() });
      return res.data.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const res = await axios.patch(
        `${API_BASE_URL}/orders/${orderId}/status`,
        { status },
        { headers: getAuthHeader() }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders-page"] });
    },
  });

  const filteredOrders = statusFilter === "ALL"
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const handleWhatsAppChat = (order: any) => {
    const customerPhone = order.address?.phone || "N/A";
    const whatsappNumber = settings?.whatsappNumber || "254700000000";
    const url = WhatsAppService.generateOrderMessage(customerPhone, {
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
    window.open(url, "_blank");
  };

  return (
    <Stack spacing={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Orders Management
          </Typography>
          <Typography color="text.secondary">
            Process customer orders, update delivery status, and coordinate via WhatsApp.
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {ORDER_STATUSES.map((st) => (
              <MenuItem key={st} value={st}>
                {st === "ALL" ? "All Statuses" : st}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : filteredOrders.length === 0 ? (
        <Paper variant="outlined" sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No orders found matching status "{statusFilter}".
          </Typography>
        </Paper>
      ) : (
        <Paper variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Placed At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>#{order.orderNumber}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {order.address?.fullName || order.user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.address?.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {order.address?.city}, {order.address?.area}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={order.status}
                      onChange={(e) =>
                        updateStatusMutation.mutate({
                          orderId: order.id,
                          status: e.target.value,
                        })
                      }
                      sx={{ fontSize: "0.85rem", height: 32 }}
                    >
                      <MenuItem value="PENDING">PENDING</MenuItem>
                      <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                      <MenuItem value="PROCESSING">PROCESSING</MenuItem>
                      <MenuItem value="PACKED">PACKED</MenuItem>
                      <MenuItem value="SHIPPED">SHIPPED</MenuItem>
                      <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                      <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        color="success"
                        variant="outlined"
                        startIcon={<WhatsAppIcon />}
                        onClick={() => handleWhatsAppChat(order)}
                      >
                        WhatsApp
                      </Button>
                      <IconButton size="small" onClick={() => setSelectedOrder(order)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <Dialog open onClose={() => setSelectedOrder(null)} maxWidth="md" fullWidth>
          <DialogTitle>Order Details #{selectedOrder.orderNumber}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Customer Information</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedOrder.address?.fullName}</Typography>
                <Typography variant="body2">{selectedOrder.address?.phone}</Typography>
                <Typography variant="body2">{selectedOrder.user?.email}</Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Delivery Address</Typography>
                <Typography variant="body2">{selectedOrder.address?.street}</Typography>
                <Typography variant="body2">{selectedOrder.address?.area}, {selectedOrder.address?.city}</Typography>
                <Typography variant="body2">{selectedOrder.address?.county}</Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>Items ({selectedOrder.items?.length})</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.subtotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              <Divider />

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                  {formatCurrency(selectedOrder.total)}
                </Typography>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedOrder(null)}>Close</Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<WhatsAppIcon />}
              onClick={() => handleWhatsAppChat(selectedOrder)}
            >
              Chat on WhatsApp
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Stack>
  );
}
