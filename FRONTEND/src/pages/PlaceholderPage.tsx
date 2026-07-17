import { Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { PageFrame } from "./PageFrame";
import { STUDIO_ROUTES } from "../constants/routes";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <PageFrame>
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 } }}>
        <Stack spacing={2}>
          <Typography component="h1" variant="h4">{title}</Typography>
          <Typography color="text.secondary">{description}</Typography>
          <Button component={RouterLink} to={STUDIO_ROUTES.root} variant="text" sx={{ alignSelf: "flex-start" }}>
            Back to Studio
          </Button>
          <Button component={RouterLink} to={STUDIO_ROUTES.backendRegistry} variant="outlined" sx={{ alignSelf: "flex-start" }}>
            Open Backend Capability Registry
          </Button>
        </Stack>
      </Paper>
    </PageFrame>
  );
}
