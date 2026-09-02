import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { WebHeader } from "./WebHeader";
import { WebFooter } from "./WebFooter";
import { ScrollToTop } from "../shared/ScrollToTop";

export function WebLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#FFFFFF",
      }}
    >
      <ScrollToTop />
      <WebHeader />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <WebFooter />
    </Box>
  );
}
