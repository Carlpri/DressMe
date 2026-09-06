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
import { ProductCard } from "../shared/ProductCard";
import { MasonryGrid } from "../shared/MasonryGrid";
import { LoadingSkeleton } from "../shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";

const DEEP_EMERALD = "#166534";
const CHARCOAL = "#111827";

export function BestSellersSection() {
  const navigate = useNavigate();

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
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#FAF8F5",
        borderTop: "1px solid rgba(17, 24, 39, 0.06)",
        borderBottom: "1px solid rgba(17, 24, 39, 0.06)",
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={4}>
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
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    color: "#CA8A04",
                    textTransform: "uppercase",
                  }}
                >
                  CUSTOMER FAVORITES
                </Typography>
              </Stack>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "1.8rem", sm: "2.3rem", md: "2.8rem" },
                  color: CHARCOAL,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                }}
              >
                Best Sellers
              </Typography>
              <Typography sx={{ color: "#64748B", mt: 0.5, fontSize: "0.95rem" }}>
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
                <ProductCard
                  key={product.id}
                  product={product}
                  badge={product.sales > 0 ? "Top Seller" : undefined}
                />
              ))}
            </MasonryGrid>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
