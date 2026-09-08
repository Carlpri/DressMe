import { Box, IconButton, Stack } from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useRef } from "react";
import { ProductCard } from "../shared/ProductCard";
import { LoadingSkeleton } from "../shared/LoadingSkeleton";
import type { Product } from "../../types/product";

interface HorizontalProductRailProps {
  products: Product[];
  isLoading?: boolean;
  badge?: string;
  renderCard?: (product: Product) => React.ReactNode;
}

export function HorizontalProductRail({ products, isLoading, badge, renderCard }: HorizontalProductRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const scrollRail = (direction: number) => {
    railRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  };

  return (
    <Box sx={{ position: "relative", mx: { xs: -2, md: 0 } }}>
      <Stack
        ref={railRef}
        direction="row"
        spacing={{ xs: 1.5, sm: 2.5 }}
        sx={{
          overflowX: "auto",
          px: { xs: 2, md: 0 },
          pb: 2,
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          "& > *": {
            flex: "0 0 clamp(230px, 27vw, 300px)",
            scrollSnapAlign: "start",
          },
        }}
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <LoadingSkeleton key={index} height={390} />
            ))
          : products.map((product) => (
              <Box key={product.id} className="reveal-child">
                {renderCard ? renderCard(product) : <ProductCard product={product} badge={badge} />}
              </Box>
            ))}
      </Stack>

      {!isLoading && products.length > 2 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            display: { xs: "none", md: "flex" },
            position: "absolute",
            top: "45%",
            right: 12,
            transform: "translateY(-50%)",
          }}
        >
          <IconButton
            aria-label="Previous products"
            onClick={() => scrollRail(-1)}
            sx={{ bgcolor: "rgba(255,255,255,0.94)", boxShadow: "0 6px 18px rgba(15,23,42,0.14)", "&:hover": { bgcolor: "#FFFFFF" } }}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>
          <IconButton
            aria-label="Next products"
            onClick={() => scrollRail(1)}
            sx={{ bgcolor: "rgba(255,255,255,0.94)", boxShadow: "0 6px 18px rgba(15,23,42,0.14)", "&:hover": { bgcolor: "#FFFFFF" } }}
          >
            <ChevronRightRoundedIcon />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
}
