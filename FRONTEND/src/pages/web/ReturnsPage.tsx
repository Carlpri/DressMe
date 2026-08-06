import { Box, Container, Stack, Typography } from "@mui/material";
import { PageFrame } from "../PageFrame";

export function ReturnsPage() {
  return (
    <PageFrame>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Returns & Refunds
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              We want you to be completely satisfied with your purchase. Here's our return and refund policy.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Return Policy
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • You may return items within 7 days of delivery
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • Items must be unworn, unwashed, and in original condition with tags attached
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • Original packaging must be included
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • Proof of purchase (order confirmation) is required
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Non-Returnable Items
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • Personalized or custom-made items
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • Items marked as "Final Sale"
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • Underwear and intimate apparel for hygiene reasons
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • Items damaged after delivery due to improper care
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              How to Initiate a Return
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                1. Contact our customer service via WhatsApp or email within 7 days of delivery
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                2. Provide your order number and reason for return
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                3. Our team will review your request and provide return instructions
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                4. Package the item securely and ship it back using the provided return label
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                5. Once received and inspected, we'll process your refund
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Refund Process
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • Refunds are processed within 5-7 business days after we receive and inspect the returned item
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • Refunds are issued to the original payment method
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • Shipping costs are non-refundable unless the return is due to our error
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • You'll receive an email confirmation once your refund is processed
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Exchanges
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Exchanges are subject to availability. If you'd like to exchange for a different size or color, please contact us and we'll do our best to accommodate your request.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Damaged or Defective Items
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              If you receive a damaged or defective item, please contact us immediately with photos of the damage. We'll arrange for a replacement or full refund at no additional cost to you.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Questions?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              If you have any questions about our return policy, please contact our customer service team.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </PageFrame>
  );
}
