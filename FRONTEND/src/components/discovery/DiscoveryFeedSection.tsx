import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useProducts } from "../../hooks/useProducts";
import { MasonryGrid } from "../shared/MasonryGrid";
import { ProductDiscoveryCard } from "./ProductDiscoveryCard";
import { LoadingSkeleton } from "../shared/LoadingSkeleton";
import { EmptySearchState } from "./EmptySearchState";
import { ROUTES } from "../../constants/routes";
import type { ProductFilters } from "../../types/product";

const DEEP_EMERALD = "#166534";
const CHARCOAL = "#111827";

interface FilterTab {
  id: string;
  label: string;
  filters: ProductFilters;
}

const FILTER_TABS: FilterTab[] = [
  { id: "all", label: "All Looks", filters: {} },
  { id: "women", label: "Women's", filters: { gender: "FEMALE" } },
  { id: "men", label: "Men's", filters: { gender: "MALE" } },
  { id: "streetwear", label: "Streetwear", filters: { search: "streetwear" } },
  { id: "formal", label: "Formal & Office", filters: { search: "formal" } },
  { id: "footwear", label: "Footwear", filters: { category: "footwear" } },
  { id: "budget", label: "Under KES 3,000", filters: { priceMax: 3000 } },
];

export function DiscoveryFeedSection({ id }: { id?: string }) {
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState("all");

  const activeTab = FILTER_TABS.find((t) => t.id === activeTabId) || FILTER_TABS[0];

  const { data: feedData, isLoading, refetch } = useProducts({
    ...activeTab.filters,
    limit: 16,
    status: "ACTIVE",
    sort: "popular",
  });

  const products = feedData?.items ?? [];

  return (
    <Box id={id} sx={{ py: { xs: 8, md: 14 }, bgcolor: "#FFFFFF" }}>
      <Container maxWidth="xl">
        <Stack spacing={5}>
          {/* Header */}
          <Box sx={{ textAlign: "center", maxWidth: 720, mx: "auto" }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              mb={1}
            >
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
                <AutoAwesomeRoundedIcon sx={{ color: DEEP_EMERALD, fontSize: 18 }} />
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
                VISUAL INSPIRATION FEED
              </Typography>
            </Stack>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                color: CHARCOAL,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
              }}
            >
              Explore the Discovery Stream
            </Typography>
            <Typography sx={{ color: "#64748B", mt: 1, fontSize: "1rem" }}>
              A curated masonry flow of ready-to-wear pieces, outfits, and fashion drops
            </Typography>
          </Box>

          {/* Filter Pills */}
          <Stack
            direction="row"
            justifyContent="center"
            flexWrap="wrap"
            gap={1}
            sx={{ px: 1 }}
          >
            {FILTER_TABS.map((tab) => {
              const active = tab.id === activeTabId;
              return (
                <Chip
                  key={tab.id}
                  label={tab.label}
                  onClick={() => setActiveTabId(tab.id)}
                  sx={{
                    px: 1.5,
                    py: 2.2,
                    borderRadius: "24px",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    bgcolor: active ? CHARCOAL : "#F1F5F9",
                    color: active ? "#FFFFFF" : "#475569",
                    border: "1px solid",
                    borderColor: active ? CHARCOAL : "transparent",
                    "&:hover": {
                      bgcolor: active ? CHARCOAL : "#E2E8F0",
                      transform: "translateY(-1px)",
                    },
                  }}
                />
              );
            })}
          </Stack>

          {/* Masonry Discovery Grid */}
          {isLoading ? (
            <MasonryGrid columns={{ xs: 2, sm: 2, md: 3, lg: 4 }} gap={{ xs: "12px", sm: "16px", md: "20px" }}>
              {[...Array(8)].map((_, i) => (
                <LoadingSkeleton key={i} height={i % 2 === 0 ? 380 : 440} />
              ))}
            </MasonryGrid>
          ) : products.length > 0 ? (
            <MasonryGrid columns={{ xs: 2, sm: 2, md: 3, lg: 4 }} gap={{ xs: "12px", sm: "16px", md: "20px" }}>
              {products.map((product, index) => {
                // Vary aspect ratios dynamically for natural Pinterest rhythm
                const aspectRatios: Array<"3/4" | "4/5" | "1/1"> = ["4/5", "3/4", "4/5", "1/1"];
                const ratio = aspectRatios[index % aspectRatios.length];

                return (
                  <ProductDiscoveryCard
                    key={product.id}
                    product={product}
                    aspectRatio={ratio}
                  />
                );
              })}
            </MasonryGrid>
          ) : (
            <EmptySearchState
              query={activeTab.label}
              onReset={() => setActiveTabId("all")}
            />
          )}

          {/* View Complete Catalog CTA */}
          <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => navigate(ROUTES.customerDashboard)}
              sx={{
                bgcolor: CHARCOAL,
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "1rem",
                px: 5,
                py: 1.75,
                borderRadius: "16px",
                boxShadow: "0 10px 28px rgba(17, 24, 39, 0.2)",
                "&:hover": {
                  bgcolor: DEEP_EMERALD,
                  boxShadow: "0 14px 32px rgba(22, 101, 52, 0.35)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.25s ease",
              }}
            >
              View Full DressMe Catalog
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
