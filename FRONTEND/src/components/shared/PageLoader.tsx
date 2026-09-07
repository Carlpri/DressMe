import { Box, Typography } from "@mui/material";

export function PageLoader() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        gap: 3,
      }}
    >
      {/* Animated logo mark */}
      <Box
        sx={{
          position: "relative",
          width: 56,
          height: 56,
        }}
      >
        {/* Outer ring */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid",
            borderColor: "divider",
          }}
        />
        {/* Spinning arc */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "#166534",
            borderRightColor: "#166534",
            animation: "dm-spin 0.9s cubic-bezier(0.4,0,0.2,1) infinite",
            "@keyframes dm-spin": {
              from: { transform: "rotate(0deg)" },
              to:   { transform: "rotate(360deg)" },
            },
          }}
        />
        {/* D letter mark */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.1rem",
              fontWeight: 800,
              fontFamily: "'Playfair Display', serif",
              color: "#166534",
              letterSpacing: "-0.5px",
              lineHeight: 1,
              animation: "dm-pulse 1.8s ease-in-out infinite",
              "@keyframes dm-pulse": {
                "0%, 100%": { opacity: 1 },
                "50%":       { opacity: 0.4 },
              },
            }}
          >
            D
          </Typography>
        </Box>
      </Box>

      {/* Brand wordmark */}
      <Typography
        sx={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: "0.85rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "text.disabled",
          animation: "dm-fadein 0.6s ease-out",
          "@keyframes dm-fadein": {
            from: { opacity: 0, transform: "translateY(4px)" },
            to:   { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        DressMe
      </Typography>
    </Box>
  );
}
