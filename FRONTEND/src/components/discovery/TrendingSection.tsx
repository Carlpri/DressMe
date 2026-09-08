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
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { ProductCard } from "../shared/ProductCard";
import { HorizontalProductRail } from "./HorizontalProductRail";
import { ROUTES } from "../../constants/routes";

const DEEP_EMERALD = "#166534";
const CHARCOAL = "#111827";

export function TrendingSection() {
  const navigate = useNavigate();
  const sectionRef = useScrollReveal<HTMLDivElement>({ threshold: 0.08, staggerMs: 60 });

  // Retrieve trending products from database
  const { data: trendingData, isLoading } = useProducts({
    limit: 8,
    sort: "popular",
    status: "ACTIVE",
  });

  const products = trendingData?.items ?? [];

  return (
    <Box ref={sectionRef} sx={{ py: { xs: 9, md: 14 }, bgcolor: "#FFFFFF" }}>
      <Container maxWidth="xl">
        <Stack spacing={{ xs: 4, md: 5 }}>
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
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    color: "#EF4444",
                    textTransform: "uppercase",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  HOTTEST RIGHT NOW
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
                Trending in 2026
              </Typography>
              <Typography sx={{ color: "#64748B", mt: 0.75, fontSize: "0.95rem" }}>
                What fashion tastemakers and shoppers are loving most across Kenya this season
              </Typography>
            </Box>

            <Button
              variant="text"
              endIcon={<NorthEastRoundedIcon />}
              onClick={() => navigate("/products?sort=popular")}
              sx={{
                color: DEEP_EMERALD,
                fontWeight: 700,
                fontSize: "0.92rem",
                "&:hover": { bgcolor: "rgba(22, 101, 52, 0.06)" },
              }}
            >
              View more
            </Button>
          </Stack>

          {/* Product Grid */}
          {isLoading || products.length > 0 ? (
            <HorizontalProductRail products={products.slice(0, 8)} isLoading={isLoading} badge="Trending" />
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
