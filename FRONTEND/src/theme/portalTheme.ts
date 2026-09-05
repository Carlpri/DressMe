import { createTheme } from "@mui/material/styles";

export const portalTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0D5E4B",
      light: "#00C896",
      dark: "#072B22",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#111827",
      light: "#1F2937",
      dark: "#0A0D14",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0D0D0D",
      secondary: "#52525B",
    },
    divider: "#F0F0F0",
    success: { main: "#10B981" },
    error: { main: "#DC2626" },
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: { fontWeight: 800, fontSize: "3rem", lineHeight: 1.1, letterSpacing: "-0.025em" },
    h2: { fontWeight: 800, fontSize: "2.25rem", lineHeight: 1.2, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, fontSize: "1.75rem", lineHeight: 1.3, letterSpacing: "-0.015em" },
    h4: { fontWeight: 700, fontSize: "1.4rem", lineHeight: 1.4, letterSpacing: "-0.01em" },
    h5: { fontWeight: 600, fontSize: "1.15rem", lineHeight: 1.5 },
    h6: { fontWeight: 600, fontSize: "0.95rem", lineHeight: 1.6 },
    subtitle1: { fontWeight: 500, fontSize: "0.95rem" },
    subtitle2: { fontWeight: 500, fontSize: "0.85rem" },
    body1: { fontSize: "0.95rem", lineHeight: 1.6 },
    body2: { fontSize: "0.85rem", lineHeight: 1.5 },
    button: { fontWeight: 600, textTransform: "none", letterSpacing: "0.01em" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 20px",
          fontSize: "0.9rem",
          textTransform: "none",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 14px rgba(13, 94, 75, 0.25)",
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
          border: "none",
          backgroundImage: "none",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontWeight: 600,
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
          maxWidth: "1400px",
        },
      },
    },
  },
});

export const webTheme = createTheme({
  ...portalTheme,
  palette: {
    ...portalTheme.palette,
    primary: {
      main: "#0D5E4B",
      light: "#00C896",
      dark: "#072B22",
      contrastText: "#FFFFFF",
    },
    background: { default: "#FFFFFF", paper: "#FFFFFF" },
  },
});
