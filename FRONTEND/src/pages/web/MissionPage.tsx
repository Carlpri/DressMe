import { Box, Container, Stack, Typography } from "@mui/material";
import { PageFrame } from "../PageFrame";

export function MissionPage() {
  return (
    <PageFrame>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Our Mission
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              To connect African fashion with the world
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Our mission is to bridge the gap between talented African fashion vendors and customers who appreciate unique, quality fashion. We're committed to making African fashion accessible, discoverable, and celebrated globally.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              What We Do Daily
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • <strong>Curate Quality:</strong> We carefully select vendors who meet our quality standards, ensuring customers receive only the best.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • <strong>Innovate Continuously:</strong> We constantly improve our platform with new features and AI capabilities to enhance the shopping experience.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • <strong>Support Vendors:</strong> We provide tools, resources, and support to help our vendors succeed and grow their businesses.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • <strong>Delight Customers:</strong> We go above and beyond to ensure every customer has an exceptional experience from discovery to delivery.
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Our Values
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                <strong>Quality:</strong> We never compromise on quality, whether it's the products we feature or the service we provide.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                <strong>Innovation:</strong> We embrace technology and creativity to solve problems and create better experiences.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                <strong>Community:</strong> We believe in the power of community and work to foster connections between vendors and customers.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                <strong>Integrity:</strong> We operate with transparency, honesty, and fairness in all our dealings.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                <strong>Passion:</strong> We're passionate about African fashion and driven by our love for what we do.
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </PageFrame>
  );
}
