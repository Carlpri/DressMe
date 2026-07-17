import { Container, Stack, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export function AccessDeniedPage() {
  return (
    <Container maxWidth="md" sx={{ py: 12 }}>
      <Stack spacing={4} alignItems="center" textAlign="center">
        <Box
          sx={{
            fontSize: "4rem",
            fontWeight: 700,
            color: "error.main",
          }}
        >
          403
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Access Denied
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 500 }}>
          Your current role does not have access to this workspace. If you believe this is an error, please contact support.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            component={RouterLink}
            to={ROUTES.landing}
            variant="contained"
          >
            Go to Homepage
          </Button>
          <Button
            component={RouterLink}
            to={ROUTES.webLogin}
            variant="outlined"
          >
            Sign In with Different Account
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
