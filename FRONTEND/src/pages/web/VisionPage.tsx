import { Box, Container, Stack, Typography } from "@mui/material";
import { PageFrame } from "../PageFrame";

export function VisionPage() {
  return (
    <PageFrame>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Our Vision
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              To be Africa's leading fashion marketplace
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              We envision a future where every African fashion enthusiast can discover, purchase, and celebrate local fashion effortlessly. Our vision is to create a platform that not only connects customers with vendors but also tells the story of African fashion to the world.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Empowering Local Talent
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              We see a future where local designers and vendors have equal opportunity to showcase their talent and reach customers across Kenya and beyond. By providing the tools and platform they need, we empower them to build sustainable businesses.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Technology-Driven Fashion
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              We believe in the power of technology to transform the fashion experience. Our AI-powered styling recommendations, seamless checkout process, and intuitive platform are just the beginning of how we're using technology to make fashion more accessible and enjoyable.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Sustainable Fashion
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Our vision includes promoting sustainable fashion practices. We encourage vendors who use sustainable materials and ethical production methods, and we educate our customers about making conscious fashion choices.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Community Building
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              We're building more than a marketplace—we're building a community of fashion lovers, designers, and enthusiasts who share a passion for African fashion. Our vision is to create spaces where this community can connect, share, and grow together.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </PageFrame>
  );
}
