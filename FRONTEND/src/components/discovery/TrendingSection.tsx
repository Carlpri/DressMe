import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";
import { useProducts } from "../../hooks/useProducts";
import { ProductCard } from "../shared/ProductCard";
import { MasonryGrid } from "../shared/MasonryGrid";
import { LoadingSkeleton } from "../shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";

const DEEP_EMERALD = "#166534";
const CHARCOAL = "#111827";

export function TrendingSection() {
  const navigate = useNavigate();

  // Retrieve trending products from database
  const { data: trendingData, isLoading } = useProducts({
    limit: 8,
    sort: "popular",
    status: "ACTIVE",
  });

  const products = trendingData?.items ?? [];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#FFFFFF" }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          {/* Section Header */}
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
                    bgcolor: "rgba(239, 68, 68, 0.12)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <WhatshotRoundedIcon sx={{ color: "#EF4444", fontSize: 18 }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    color: "#EF4444",
                    textTransform: "uppercase",
                  }}
                >
                  HOTTEST RIGHT NOW
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
                Trending in 2026
              </Typography>
              <Typography sx={{ color: "#64748B", mt: 0.5, fontSize: "0.95rem" }}>
                What fashion tastemakers and shoppers are loving most across Kenya this season
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
              View All Trending
            </Button>
          </Stack>

          {/* Product Grid */}
          {isLoading ? (
            <MasonryGrid columns={{ xs: 2, sm: 2, md: 3, lg: 4 }}>
              {[...Array(8)].map((_, i) => (
                <LoadingSkeleton key={i} height={i % 3 === 0 ? 420 : i % 2 === 0 ? 360 : 300} />
              ))}
            </MasonryGrid>
          ) : products.length > 0 ? (
            <MasonryGrid columns={{ xs: 2, sm: 2, md: 3, lg: 4 }}>
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} badge="Trending" />
              ))}
            </MasonryGrid>
          ) : (
            <Box
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: "20px",
                bgcolor: "#F8FAFC",
                border: "1px dashed rgba(17, 24, 39, 0.15)",
              }}
            >
              <Typography sx={{ color: "#64748B", fontWeight: 600 }}>
                Check back soon for new trending drops!
              </Typography>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
