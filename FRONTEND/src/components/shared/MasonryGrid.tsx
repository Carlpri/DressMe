import React from "react";
import { Box } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

export interface MasonryGridProps {
  children: React.ReactNode;
  /** Number of columns at each breakpoint. Defaults to 1 (mobile) / 2 (tablet) / 3 (md) / 4 (lg) / 5 (xl) */
  columns?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  /** Gap between items in pixels or responsive object. Defaults to { xs: "12px", sm: "14px", md: "16px" } */
  gap?: number | string | { xs?: string | number; sm?: string | number; md?: string | number; lg?: string | number; xl?: string | number };
  sx?: SxProps<Theme>;
}

/**
 * Pinterest-style masonry layout using CSS `column-count`.
 * Responsive: Collapses gracefully to 1 column on mobile (xs) and 2 columns on tablet (sm).
 * Items flow top-to-bottom within each column without split breaks.
 */
export function MasonryGrid({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  gap,
  sx,
}: MasonryGridProps) {
  const colXs = columns.xs ?? 1;
  const colSm = columns.sm ?? 2;
  const colMd = columns.md ?? 3;
  const colLg = columns.lg ?? 4;
  const colXl = columns.xl ?? (colLg >= 4 ? 5 : colLg);

  const gapValue = gap ?? { xs: "12px", sm: "14px", md: "16px" };

  return (
    <Box
      sx={{
        columnCount: {
          xs: colXs,
          sm: colSm,
          md: colMd,
          lg: colLg,
          xl: colXl,
        },
        columnGap: gapValue,
        "& > *": {
          breakInside: "avoid",
          marginBottom: gapValue,
          display: "block",
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
