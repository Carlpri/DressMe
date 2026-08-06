import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { PageFrame } from "../PageFrame";

export function CareersPage() {
  return (
    <PageFrame>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Careers at DressMe
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Join us in revolutionizing African fashion. We're always looking for talented individuals who are passionate about fashion, technology, and making a difference.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Why Work With Us
            </Typography>
            <Stack spacing={2}>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • Work with a passionate team dedicated to transforming African fashion
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • Competitive compensation and benefits
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • Flexible work arrangements
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • Opportunities for growth and development
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                • Be part of a fast-growing startup with big ambitions
              </Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Open Positions
            </Typography>
            <Stack spacing={3}>
              <Box sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Senior Frontend Developer
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Nairobi · Full-time
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  We're looking for an experienced frontend developer to help build our next-generation fashion platform. Experience with ReactTypeScript, and modern web technologies is required.
                </Typography>
                <Button variant="outlined" size="small">
                  Apply Now
                </Button>
              </Box>

              <Box sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Backend Engineer
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Nairobi · Full-time
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Join our backend team to build scalable APIs and services. Experience with Node.js, PostgreSQL, and cloud services is preferred.
                </Typography>
                <Button variant="outlined" size="small">
                  Apply Now
                </Button>
              </Box>

              <Box sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Product Designer
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Nairobi · Full-time
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Help us create beautiful, intuitive experiences for our users. Experience with design systems and user research is a plus.
                </Typography>
                <Button variant="outlined" size="small">
                  Apply Now
                </Button>
              </Box>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              How to Apply
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Send your CV and portfolio to careers@dressme.co.ke with the position title in the subject line. We review all applications and will contact shortlisted candidates.
            </Typography>
          </Box>
        </Stack>
      </Container>
    </PageFrame>
  );
}
