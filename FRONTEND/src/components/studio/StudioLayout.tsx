import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

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
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
