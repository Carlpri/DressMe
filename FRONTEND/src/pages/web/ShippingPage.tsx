import { Box, Container, Stack, Typography } from "@mui/material";
import { PageFrame } from "../PageFrame";

export function ShippingPage() {
  return (
    <PageFrame>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Shipping Information
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              We want to make sure your orders reach you safely and on time. Here's everything you need to know about our shipping policies.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Shipping Zones & Delivery Times
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Nairobi & Metropolitan Area
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Standard: 2-3 business days | Express: Next day delivery
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Major Towns (Mombasa, Kisumu, Nakuru, Eldoret)
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Standard: 3-5 business days
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Other Areas in Kenya
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Standard: 5-7 business days
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Shipping Costs
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary">
                • Orders over KES 5,000: FREE shipping
              </Typography>
              <Typography variant="body1" color="text.secondary">
                • Orders KES 2,000 - KES 5,000: KES 200
              </Typography>
              <Typography variant="body1" color="text.secondary">
                • Orders under KES 2,000: KES 350
              </Typography>
              <Typography variant="body1" color="text.secondary">
                • Express delivery: Additional KES 200
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Order Processing
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Orders are processed within 24-48 hours on business days. You'll receive a confirmation email with tracking information once your order ships.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Delivery Methods
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary">
                <strong>Door-to-door delivery:</strong> Our delivery partners will bring your order directly to your doorstep.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Pickup points:</strong> Select pickup points are available in major towns for collection at your convenience.
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Tracking Your Order
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Once your order ships, you'll receive a tracking number via SMS and email. Use this to track your package's journey in real-time.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Questions?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              If you have any questions about shipping, please contact our customer service team via the contact page or WhatsApp.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </PageFrame>
  );
}
