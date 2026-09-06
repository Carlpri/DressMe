import React from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

interface EmptySearchStateProps {
  query?: string;
  onSuggestionClick?: (suggestion: string) => void;
  onReset?: () => void;
}

const DEEP_EMERALD = "#166534";
const CHARCOAL = "#111827";

const SUGGESTIONS = [
  "Black sneakers",
  "Date night outfit",
  "Campus wear",
  "Linen shirt",
  "Oversized hoodie",
  "Tailored blazer",
];

export function EmptySearchState({
  query,
  onSuggestionClick,
  onReset,
}: EmptySearchStateProps) {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: "center",
        borderRadius: "24px",
        bgcolor: "#FAF8F5",
        border: "1px dashed rgba(17, 24, 39, 0.15)",
        maxWidth: 640,
        mx: "auto",
        my: 4,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "16px",
          bgcolor: "rgba(22, 101, 52, 0.08)",
          display: "grid",
          placeItems: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <SearchOffRoundedIcon sx={{ fontSize: 30, color: DEEP_EMERALD }} />
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "1.3rem", sm: "1.6rem" },
          color: CHARCOAL,
          letterSpacing: "-0.02em",
        }}
      >
        {query ? `No pieces found for "${query}"` : "No matching items found"}
      </Typography>

      <Typography sx={{ color: "#64748B", mt: 1, fontSize: "0.95rem" }}>
        Try searching with different style terms, broadening your budget filter, or exploring our suggested looks below.
      </Typography>

      {/* Suggested Search Pills */}
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        gap={1}
        sx={{ mt: 3, mb: 3 }}
      >
        {SUGGESTIONS.map((sugg) => (
          <Chip
            key={sugg}
            label={sugg}
            onClick={() => onSuggestionClick?.(sugg)}
            sx={{
              bgcolor: "#FFFFFF",
              color: CHARCOAL,
              fontWeight: 600,
              fontSize: "0.82rem",
              border: "1px solid rgba(17, 24, 39, 0.12)",
              cursor: "pointer",
              "&:hover": {
                bgcolor: "rgba(22, 101, 52, 0.08)",
                borderColor: DEEP_EMERALD,
                color: DEEP_EMERALD,
              },
            }}
          />
        ))}
      </Stack>

      {onReset && (
        <Button
          variant="outlined"
          startIcon={<RefreshRoundedIcon />}
          onClick={onReset}
          sx={{
            borderRadius: "12px",
            borderColor: "rgba(17, 24, 39, 0.2)",
            color: CHARCOAL,
            fontWeight: 700,
            "&:hover": {
              borderColor: DEEP_EMERALD,
              bgcolor: "rgba(22, 101, 52, 0.04)",
            },
          }}
        >
          Reset Filters
        </Button>
      )}
    </Box>
  );
}
