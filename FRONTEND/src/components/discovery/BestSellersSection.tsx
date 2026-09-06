import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import { useProducts } from "../../hooks/useProducts";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { ProductCard } from "../shared/ProductCard";
import { MasonryGrid } from "../shared/MasonryGrid";
import { LoadingSkeleton } from "../shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";

const DEEP_EMERALD = "#166534";
const CHARCOAL = "#111827";

export function BestSellersSection() {
  const navigate = useNavigate();
  const sectionRef = useScrollReveal<HTMLDivElement>({ threshold: 0.08, staggerMs: 60 });

  // Retrieve best seller products ranked by actual sales & popularity
  const { data: bestSellersData, isLoading } = useProducts({
    limit: 4,
    sort: "popular",
    status: "ACTIVE",
  });

  const products = bestSellersData?.items ?? [];

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <Box
      ref={sectionRef}
      sx={{
        py: { xs: 9, md: 14 },
        bgcolor: "#FAF8F5",
        borderTop: "1px solid rgba(17, 24, 39, 0.06)",
        borderBottom: "1px solid rgba(17, 24, 39, 0.06)",
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={{ xs: 4, md: 5 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "flex-end" }}
            spacing={2}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "8px",
                    bgcolor: "rgba(234, 179, 8, 0.15)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <EmojiEventsRoundedIcon sx={{ color: "#CA8A04", fontSize: 18 }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    color: "#CA8A04",
                    textTransform: "uppercase",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  CUSTOMER FAVORITES
                </Typography>
              </Stack>
              <Typography
                variant="h2"
                className="font-display"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", sm: "2.6rem", md: "3.1rem" },
                  color: CHARCOAL,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                }}
              >
                Best Sellers
              </Typography>
              <Typography sx={{ color: "#64748B", mt: 0.75, fontSize: "0.95rem" }}>
                The most-ordered wardrobe staples and crowd favorites with proven customer satisfaction
              </Typography>
            </Box>

            <Button
              variant="text"
              endIcon={<NorthEastRoundedIcon />}
              onClick={() => navigate(`${ROUTES.customerDashboard}?sort=popular`)}
              sx={{
                color: DEEP_EMERALD,
                fontWeight: 700,
                fontSize: "0.92rem",
                "&:hover": { bgcolor: "rgba(22, 101, 52, 0.06)" },
              }}
            >
              Shop All Favorites
            </Button>
          </Stack>

          {isLoading ? (
            <MasonryGrid columns={{ xs: 2, sm: 2, md: 3, lg: 4 }}>
              {[...Array(4)].map((_, i) => (
                <LoadingSkeleton key={i} height={i % 2 === 0 ? 420 : 360} />
              ))}
            </MasonryGrid>
          ) : (
            <MasonryGrid columns={{ xs: 2, sm: 2, md: 3, lg: 4 }}>
              {products.slice(0, 4).map((product) => (
                <Box key={product.id} className="reveal-child">
                  <ProductCard
                    product={product}
                    badge={product.sales > 0 ? "Top Seller" : undefined}
                  />
                </Box>
              ))}
            </MasonryGrid>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
