import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import { useProducts } from "../../hooks/useProducts";
import { ProductDiscoveryCard } from "./ProductDiscoveryCard";
import { LoadingSkeleton } from "../shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";

const DEEP_EMERALD = "#166534";
const CHARCOAL = "#111827";

export function FeaturedSection() {
  const navigate = useNavigate();

  // Retrieve featured products from database
  const { data: featuredData, isLoading } = useProducts({
    featured: true,
    limit: 4,
    status: "ACTIVE",
  });

  const products = featuredData?.items ?? [];

  if (!isLoading && products.length === 0) {
    return null; // Gracefully hide section if no featured items
  }

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#FFFFFF" }}>
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
                    bgcolor: "rgba(22, 101, 52, 0.12)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <StarRoundedIcon sx={{ color: DEEP_EMERALD, fontSize: 18 }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    color: DEEP_EMERALD,
                    textTransform: "uppercase",
                  }}
                >
                  CURATOR'S SPOTLIGHT
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
                Featured on DressMe
              </Typography>
              <Typography sx={{ color: "#64748B", mt: 0.5, fontSize: "0.95rem" }}>
                Handpicked, standout pieces recognized for quality craftsmanship and design excellence
              </Typography>
            </Box>

            <Button
              variant="text"
              endIcon={<NorthEastRoundedIcon />}
              onClick={() => navigate(`${ROUTES.customerDashboard}?featured=true`)}
              sx={{
                color: DEEP_EMERALD,
                fontWeight: 700,
                fontSize: "0.92rem",
                "&:hover": { bgcolor: "rgba(22, 101, 52, 0.06)" },
              }}
            >
              View All Featured
            </Button>
          </Stack>

          {isLoading ? (
            <Grid container spacing={3}>
              {[...Array(4)].map((_, i) => (
                <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={i}>
                  <LoadingSkeleton height={380} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {products.slice(0, 4).map((product) => (
                <Grid size={{ xs: 6, sm: 6, md: 4, lg: 3 }} key={product.id}>
                  <ProductDiscoveryCard
                    product={product}
                    badge="Featured"
                    aspectRatio="4/5"
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
