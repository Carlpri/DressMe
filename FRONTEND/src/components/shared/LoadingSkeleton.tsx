import { Box, Skeleton, useTheme } from "@mui/material";

interface LoadingSkeletonProps {
  height?: number;
  width?: number | string;
  variant?: "rectangular" | "circular" | "text";
}

export function LoadingSkeleton({ height = 200, width = "100%", variant = "rectangular" }: LoadingSkeletonProps) {
  const theme = useTheme();

  return (
    <Skeleton
      variant={variant}
      width={width}
      height={height}
      sx={{
        bgcolor: `${theme.palette.primary.main}22`,
        borderRadius: variant === "circular" ? "50%" : 2,
      }}
    />
  );
}
