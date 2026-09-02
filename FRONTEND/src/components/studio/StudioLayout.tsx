import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ScrollToTop } from "../shared/ScrollToTop";

export function StudioLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
      }}
    >
      <ScrollToTop />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
