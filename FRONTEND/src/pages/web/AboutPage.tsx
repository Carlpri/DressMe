import { Box, Container, Stack, Typography, useTheme } from "@mui/material";
import { PageFrame } from "../PageFrame";

export function AboutPage() {
  const theme = useTheme();

  return (
    <PageFrame>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              About DressMe
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              DressMe is Kenya's premier fashion marketplace, connecting talented local vendors with fashion-forward customers across the country. Our platform leverages cutting-edge AI technology to provide personalized styling recommendations, making it easier than ever to discover your perfect look.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Our Story
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Founded in 2024, DressMe was born from a simple observation: African fashion deserves a dedicated platform that celebrates local talent while providing customers with a seamless shopping experience. We've built a community where vendors can showcase their creations and customers can discover unique pieces that tell a story.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              What We Do
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              We provide a curated marketplace featuring hundreds of local vendors, from established boutiques to emerging designers. Our AI-powered stylist helps you discover outfits that match your style, occasion, and budget. Whether you're looking for everyday wear, special occasion outfits, or the latest trends, DressMe has you covered.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Our Commitment
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              We are committed to supporting local businesses, promoting sustainable fashion, and providing exceptional customer service. Every purchase on DressMe directly supports Kenyan vendors and contributes to the growth of our local fashion industry.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </PageFrame>
  );
}
