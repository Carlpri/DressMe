import { Box, Container, Stack, Typography } from "@mui/material";
import { PageFrame } from "../PageFrame";

export function TermsPage() {
  return (
    <PageFrame>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Terms of Service
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last updated: January 2026
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Acceptance of Terms
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              By accessing or using DressMe, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Account Registration
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              To use certain features of our platform, you must register for an account. You agree to provide accurate and complete information, and to keep your account information updated.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Purchases and Payment
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              All prices are listed in Kenyan Shillings unless otherwise stated. We reserve the right to modify prices at any time. Payment is due at the time of purchase. We accept various payment methods as listed on our platform.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Shipping and Delivery
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Shipping times and costs are as specified in our Shipping Information page. We are not responsible for delays caused by third-party shipping providers.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Returns and Refunds
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Our return policy is outlined in our Returns page. Please review it before making a purchase.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              User Conduct
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              You agree not to use our platform for any illegal or unauthorized purpose. You may not use our platform to harass, abuse, or harm others.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Intellectual Property
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              All content on DressMe, including text, graphics, logos, and images, is the property of DressMe or its content suppliers and is protected by intellectual property laws.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Limitation of Liability
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              DressMe shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our platform.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Changes to Terms
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              We reserve the right to modify these terms at any time. Continued use of our platform after changes constitutes acceptance of the new terms.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </PageFrame>
  );
}
