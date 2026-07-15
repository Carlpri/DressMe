import { createTheme } from "@mui/material/styles";

export const portalTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2563eb" },
    background: { default: "#f8fafc", paper: "#ffffff" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'Inter, "Segoe UI", Roboto, Arial, sans-serif',
    h4: { fontWeight: 700 },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { borderColor: "#e2e8f0" } } },
  },
});
