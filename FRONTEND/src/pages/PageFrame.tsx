import type { PropsWithChildren } from "react";
import { Box, Container } from "@mui/material";

export function PageFrame({ children }: PropsWithChildren) {
  return (
    <Box component="main" sx={{ minHeight: "100vh", py: { xs: 3, sm: 7 } }}>
      <Container maxWidth="md">{children}</Container>
    </Box>
  );
}
