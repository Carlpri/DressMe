import { Box, Container, Stack, Typography } from "@mui/material";
import { PageFrame } from "../PageFrame";

export function PrivacyPage() {
  return (
    <PageFrame>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Privacy Policy
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last updated: January 2026
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Information We Collect
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes your name, email address, phone number, shipping address, and payment information. We also collect information about your use of our platform, including browsing history and preferences.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              How We Use Your Information
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              We use your information to process orders, provide customer service, improve our services, and send you marketing communications (with your consent). We may also use your information to personalize your experience and provide recommendations.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Information Sharing
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              We share your information with vendors to fulfill your orders. We may also share information with service providers who assist us in operating our platform. We do not sell your personal information to third parties.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Data Security
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Your Rights
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              You have the right to access, update, or delete your personal information. You can do this by logging into your account or contacting us directly.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Contact Us
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              If you have questions about this Privacy Policy, please contact us at privacy@dressme.co.ke.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </PageFrame>
  );
}
