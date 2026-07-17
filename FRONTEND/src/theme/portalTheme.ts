import { createTheme } from "@mui/material/styles";

export const portalTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#00C896" },
    secondary: { main: "#111827" },
    background: { default: "#F8FAFC", paper: "#FFFFFF" },
    text: { primary: "#111827", secondary: "#6B7280" },
    divider: "#E5E7EB",
    success: { main: "#22C55E" },
    error: { main: "#DC2626" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Poppins, "Inter", "Segoe UI", Roboto, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: "3.5rem", lineHeight: 1.1 },
    h2: { fontWeight: 700, fontSize: "2.5rem", lineHeight: 1.2 },
    h3: { fontWeight: 600, fontSize: "1.75rem", lineHeight: 1.3 },
    h4: { fontWeight: 600, fontSize: "1.5rem", lineHeight: 1.4 },
    h5: { fontWeight: 600, fontSize: "1.25rem", lineHeight: 1.5 },
    h6: { fontWeight: 600, fontSize: "1rem", lineHeight: 1.6 },
    subtitle1: { fontWeight: 500, fontSize: "1rem" },
    subtitle2: { fontWeight: 500, fontSize: "0.875rem" },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontSize: "0.875rem", lineHeight: 1.5 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "12px 24px",
          fontSize: "1rem",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 200, 150, 0.3)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: "1200px",
        },
      },
    },
  },
});

export const webTheme = createTheme({
  ...portalTheme,
  palette: {
    ...portalTheme.palette,
    primary: { main: "#00C896" },
    background: { default: "#FFFFFF", paper: "#FFFFFF" },
  },
});
