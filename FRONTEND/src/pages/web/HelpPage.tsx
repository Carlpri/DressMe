import { Box, Container, Stack, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PageFrame } from "../PageFrame";

export function HelpPage() {
  return (
    <PageFrame>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Help Center
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Find answers to frequently asked questions about using DressMe.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Frequently Asked Questions
            </Typography>
            <Stack spacing={2}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    How do I create an account?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    Click the "Sign Up" button in the top right corner of our website. Fill in your name, email, and password to create your account. You'll receive a confirmation email to verify your account.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    How do I place an order?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    Browse our products, select the items you want, choose your size and color, and add them to your cart. Proceed to checkout, enter your shipping details, select a payment method, and confirm your order.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    What payment methods do you accept?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    We accept M-Pesa, credit/debit cards, and bank transfers. Payment options are displayed at checkout.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    How long does delivery take?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    Delivery times vary by location. Nairobi and metropolitan areas typically receive orders within 2-3 business days. Other areas in Kenya take 5-7 business days. See our Shipping page for more details.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Can I track my order?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    Yes! Once your order ships, you'll receive a tracking number via SMS and email. Use this to track your package in real-time.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    What is your return policy?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    You can return items within 7 days of delivery if they're unworn, unwashed, and in original condition. See our Returns page for full details.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    How do I become a vendor?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    If you're interested in becoming a vendor, please contact us through our Contact page. We'll review your application and get back to you with next steps.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    How does the AI Stylist work?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary">
                    Our AI Stylist analyzes your preferences, style choices, and browsing history to recommend outfits that match your taste. Simply answer a few questions about your style, and we'll provide personalized recommendations.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Still Need Help?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Can't find the answer you're looking for? Contact our customer service team via WhatsApp or email, and we'll be happy to assist you.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </PageFrame>
  );
}
