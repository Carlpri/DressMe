import React from "react";
import { Box } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

interface MasonryGridProps {
  children: React.ReactNode;
  /** Number of columns at each breakpoint. Defaults to 2 / 3 / 4 / 5 */
  columns?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  /** Gap between items in pixels. Defaults to 12 on xs, 16 on md+ */
  gap?: number | string;
  sx?: SxProps<Theme>;
}

/**
 * Pinterest-style masonry layout using CSS `column-count`.
 * Items flow top-to-bottom within each column.
 */
export function MasonryGrid({
  children,
  columns = { xs: 2, sm: 2, md: 3, lg: 4 },
  gap,
  sx,
}: MasonryGridProps) {
  const colXs = columns.xs ?? 2;
  const colSm = columns.sm ?? 2;
  const colMd = columns.md ?? 3;
  const colLg = columns.lg ?? 4;
  const colXl = columns.xl ?? colLg;

  const gapValue = gap ?? { xs: "10px", sm: "12px", md: "16px" };

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
