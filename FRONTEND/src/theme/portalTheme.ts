import { createTheme } from "@mui/material/styles";

export const portalTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#166534", // Deep Emerald
      light: "#22C55E",
      dark: "#0F3822",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#111827", // Deep Charcoal
      light: "#1F2937",
      dark: "#0F172A",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#475569",
    },
    divider: "rgba(17, 24, 39, 0.08)",
    success: { main: "#166534" },
    error: { main: "#DC2626" },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontFamily: "'Bodoni Moda', 'Playfair Display', 'Cormorant Garamond', Georgia, serif",
      fontWeight: 800,
      fontSize: "clamp(2.75rem, 5.5vw, 4.75rem)",
      lineHeight: 1.05,
      letterSpacing: "-0.035em",
      color: "#111827",
    },
    h2: {
      fontFamily: "'Bodoni Moda', 'Playfair Display', 'Cormorant Garamond', Georgia, serif",
      fontWeight: 800,
      fontSize: "clamp(2rem, 3.8vw, 3rem)",
      lineHeight: 1.15,
      letterSpacing: "-0.025em",
      color: "#111827",
    },
    h3: {
      fontFamily: "'Bodoni Moda', 'Playfair Display', 'Cormorant Garamond', Georgia, serif",
      fontWeight: 700,
      fontSize: "1.75rem",
      lineHeight: 1.25,
      letterSpacing: "-0.02em",
      color: "#111827",
    },
    h4: {
      fontWeight: 800,
      fontSize: "1.35rem",
      lineHeight: 1.35,
      letterSpacing: "-0.015em",
      color: "#111827",
    },
    h5: {
      fontWeight: 700,
      fontSize: "1.1rem",
      lineHeight: 1.4,
      letterSpacing: "-0.01em",
      color: "#111827",
    },
    h6: {
      fontWeight: 700,
      fontSize: "0.95rem",
      lineHeight: 1.5,
      color: "#111827",
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "1rem",
      lineHeight: 1.55,
      color: "#475569",
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: "0.85rem",
      color: "#64748B",
    },
    body1: {
      fontSize: "0.975rem",
      lineHeight: 1.65,
      color: "#475569",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.55,
      color: "#64748B",
    },
    overline: {
      fontWeight: 800,
      fontSize: "0.75rem",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "#166534",
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
      letterSpacing: "0.01em",
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true, // Remove generic Android Material ripple for a bespoke tactile feel
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: "10px 22px",
          fontSize: "0.92rem",
          fontWeight: 700,
          textTransform: "none",
          transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
          "&:focus-visible": {
            outline: "none",
            boxShadow: "0 0 0 3px rgba(22, 101, 52, 0.35)",
          },
        },
        contained: {
          boxShadow: "0 4px 14px rgba(22, 101, 52, 0.2)",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(22, 101, 52, 0.32)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        outlined: {
          borderColor: "rgba(17, 24, 39, 0.16)",
          color: "#111827",
          "&:hover": {
            borderColor: "#166534",
            color: "#166534",
            backgroundColor: "rgba(22, 101, 52, 0.04)",
            transform: "translateY(-1px)",
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
          borderRadius: 20,
          boxShadow: "0 4px 20px rgba(17, 24, 39, 0.04)",
          border: "1px solid rgba(17, 24, 39, 0.07)",
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
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontWeight: 700,
          fontSize: "0.82rem",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 14,
            "& fieldset": {
              borderColor: "rgba(17, 24, 39, 0.12)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(17, 24, 39, 0.25)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#166534",
              borderWidth: "1.5px",
            },
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: "1440px",
        },
      },
    },
  },
});

export const webTheme = createTheme({
  ...portalTheme,
});
