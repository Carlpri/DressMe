import { Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { PageFrame } from "./PageFrame";

export function StudioWelcomePage() {
  return (
    <PageFrame>
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 } }}>
        <Stack spacing={2.5}>
          <Typography component="h1" variant="h3">DressMe Studio</Typography>
          <Typography color="text.secondary">
            Internal developer QA and operations console for the DressMe API.
          </Typography>
          <Button component={RouterLink} to={ROUTES.login} variant="contained" sx={{ alignSelf: "flex-start" }}>
            Continue to sign in
          </Button>
        </Stack>
      </Paper>
    </PageFrame>
  );
}
