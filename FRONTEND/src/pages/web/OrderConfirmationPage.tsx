import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Divider,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { ROUTES } from "../../constants/routes";
import type { Order } from "../../hooks/useOrders";
import { useFormatCurrency } from "../../utils/currency";
import { useAppSettings } from "../../hooks/useAppSettings";
import { WhatsAppService } from "../../services/whatsapp.service";

const ORDER_STEPS = [
  "Order Placed",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
];

function getActiveStepIndex(status: string): number {
  switch (status) {
    case "PENDING":
      return 0;
    case "CONFIRMED":
      return 1;
    case "PROCESSING":
    case "PACKED":
      return 2;
    case "SHIPPED":
      return 3;
    case "DELIVERED":
      return 4;
    case "CANCELLED":
    case "RETURNED":
      return -1;
    default:
      return 0;
  }
}

export function OrderConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order as Order | undefined;
  const formatCurrency = useFormatCurrency();
  const { settings } = useAppSettings();

  if (!order) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Alert severity="error" action={<Button onClick={() => navigate(ROUTES.orders)}>View Orders</Button>}>
          Order information not found
        </Alert>
      </Container>
    );
  }

  const activeStep = getActiveStepIndex(order.status);
  const whatsappNumber = settings?.whatsappNumber || "254700000000";

  const rawMessageText = `Hello DressMe.

I have just placed Order #${order.orderNumber}.

Name: ${order.address.fullName}
Phone: ${order.address.phone}
Delivery Location: ${order.address.city}, ${order.address.area}

Total: ${formatCurrency(order.total)}

Items:
${order.items.map((i) => `• ${i.productName || "Item"} x${i.quantity}`).join("\n")}

Kindly confirm availability and payment instructions.`;

  const handleWhatsAppChat = () => {
    const url = WhatsAppService.generateOrderMessage(whatsappNumber, {
      orderNumber: order.orderNumber,
      customerName: order.address.fullName,
      phone: order.address.phone,
      city: order.address.city,
      area: order.address.area,
      county: order.address.county,
      total: order.total,
      currency: settings?.currency || "KES",
      items: order.items.map((i) => ({
        name: i.productName || "Product",
        quantity: i.quantity,
        price: i.price,
        variantName: i.variantName || undefined,
      })),
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={5} alignItems="center">
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
        <Stack spacing={1} textAlign="center" maxWidth={600}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Order Received!
          </Typography>
          <Typography color="text.secondary">
            Your order <strong>#{order.orderNumber}</strong> has been created in our database.
          </Typography>
        </Stack>

        {/* Status Stepper Timeline */}
        <Card variant="outlined" sx={{ maxWidth: 700, width: "100%", p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}>
            Order Timeline Status
          </Typography>
          {activeStep === -1 ? (
            <Alert severity="error">This order was cancelled.</Alert>
          ) : (
            <Stepper activeStep={activeStep} alternativeLabel>
              {ORDER_STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
        </Card>

        {/* Next Step Action Box */}
        <Paper
          elevation={0}
          sx={{
            maxWidth: 600,
            width: "100%",
            p: 3,
            bgcolor: "#F0FDF4",
            border: "1.5px dashed #22C55E",
            borderRadius: 3,
          }}
        >
          <Stack spacing={2} alignItems="center" textAlign="center">
            <WhatsAppIcon sx={{ fontSize: 40, color: "#25D366" }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#15803D" }}>
              Next Step: Contact Us on WhatsApp
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please contact our store on WhatsApp so we can confirm stock availability, delivery details, and payment instructions.
            </Typography>

            {/* Pre-formatted Message Preview */}
            <Box
              sx={{
                width: "100%",
                p: 2,
                bgcolor: "#FFFFFF",
                borderRadius: 2,
                border: "1px solid #DCFCE7",
                textAlign: "left",
                fontFamily: "monospace",
                fontSize: "0.85rem",
                whiteSpace: "pre-wrap",
                color: "#166534",
              }}
            >
              {rawMessageText}
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<WhatsAppIcon />}
              onClick={handleWhatsAppChat}
              sx={{
                bgcolor: "#25D366",
                color: "#FFFFFF",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#128C7E",
                },
              }}
            >
              Chat on WhatsApp
            </Button>
          </Stack>
        </Paper>

        {/* Order Details Summary Card */}
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
                      Delivery Address
                    </Typography>
                    <Typography sx={{ fontWeight: 500 }}>
                      {order.address.fullName} ({order.address.phone})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.address.street}, {order.address.area}, {order.address.city}, {order.address.county}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Order Items ({order.items.length})
                </Typography>
                {order.items.map((item) => (
                  <Stack key={item.id} direction="row" justifyContent="space-between">
                    <Typography variant="body2">
                      {item.productName || item.product?.name} × {item.quantity}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(item.price * item.quantity)}
                    </Typography>
                  </Stack>
                ))}
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
            View Orders
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(ROUTES.landing)}
          >
            Continue Shopping
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
