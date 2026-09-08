import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import { useProducts } from "../../hooks/useProducts";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { ProductCard } from "../shared/ProductCard";
import { HorizontalProductRail } from "./HorizontalProductRail";
import { ROUTES } from "../../constants/routes";

const DEEP_EMERALD = "#166534";
const CHARCOAL = "#111827";

export function FeaturedSection() {
  const navigate = useNavigate();
  const sectionRef = useScrollReveal<HTMLDivElement>({ threshold: 0.08, staggerMs: 60 });

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
    <Box ref={sectionRef} sx={{ py: { xs: 9, md: 14 }, bgcolor: "#FFFFFF" }}>
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
                    bgcolor: "rgba(22, 101, 52, 0.12)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <StarRoundedIcon sx={{ color: DEEP_EMERALD, fontSize: 18 }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    color: DEEP_EMERALD,
                    textTransform: "uppercase",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  CURATOR'S SPOTLIGHT
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
                Featured on DressMe
              </Typography>
              <Typography sx={{ color: "#64748B", mt: 0.75, fontSize: "0.95rem" }}>
                Handpicked, standout pieces recognized for quality craftsmanship and design excellence
              </Typography>
            </Box>

            <Button
              variant="text"
              endIcon={<NorthEastRoundedIcon />}
              onClick={() => navigate("/products?featured=true")}
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

          <HorizontalProductRail products={products.slice(0, 8)} isLoading={isLoading} badge="Featured" />
        </Stack>
      </Container>
    </Box>
  );
}
