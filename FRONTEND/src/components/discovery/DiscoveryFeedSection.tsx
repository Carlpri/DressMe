import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useProducts } from "../../hooks/useProducts";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { HorizontalProductRail } from "./HorizontalProductRail";
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
  const sectionRef = useScrollReveal<HTMLDivElement>({ threshold: 0.05, staggerMs: 60 });

  const activeTab = FILTER_TABS.find((t) => t.id === activeTabId) || FILTER_TABS[0];

  const { data: feedData, isLoading } = useProducts({
    ...activeTab.filters,
    limit: 16,
    status: "ACTIVE",
    sort: "popular",
  });

  const products = feedData?.items ?? [];

  return (
    <Box ref={sectionRef} id={id} sx={{ py: { xs: 10, md: 16 }, bgcolor: "#FFFFFF" }}>
      <Container maxWidth="xl">
        <Stack spacing={{ xs: 5, md: 6 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", maxWidth: 760, mx: "auto" }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              mb={1.5}
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
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  color: DEEP_EMERALD,
                  textTransform: "uppercase",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                VISUAL INSPIRATION FEED
              </Typography>
            </Stack>
            <Typography
              variant="h2"
              className="font-display"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.1rem", sm: "2.8rem", md: "3.4rem" },
                color: CHARCOAL,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Explore the Discovery Stream
            </Typography>
            <Typography sx={{ color: "#64748B", mt: 1.5, fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.6 }}>
              A moving edit of ready-to-wear pieces and fashion drops.
            </Typography>
          </Box>

          {/* Smooth Segmented Filter Pills */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              px: 1,
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 1,
                p: 0.75,
                bgcolor: "#F8FAFC",
                borderRadius: "9999px",
                border: "1px solid rgba(17, 24, 39, 0.08)",
                maxWidth: "100%",
              }}
            >
              {FILTER_TABS.map((tab) => {
                const active = tab.id === activeTabId;
                return (
                  <Button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    sx={{
                      px: { xs: 2, sm: 2.5 },
                      py: 1.1,
                      borderRadius: "9999px",
                      fontWeight: 700,
                      fontSize: { xs: "0.82rem", sm: "0.88rem" },
                      textTransform: "none",
                      letterSpacing: "0.01em",
                      cursor: "pointer",
                      transition: "all 260ms cubic-bezier(0.16, 1, 0.3, 1)",
                      bgcolor: active ? CHARCOAL : "transparent",
                      color: active ? "#FFFFFF" : "#475569",
                      boxShadow: active ? "0 4px 14px rgba(17, 24, 39, 0.18)" : "none",
                      transform: active ? "scale(1.02)" : "scale(1)",
                      "&:hover": {
                        bgcolor: active ? CHARCOAL : "rgba(17, 24, 39, 0.05)",
                        color: active ? "#FFFFFF" : CHARCOAL,
                      },
                    }}
                  >
                    {tab.label}
                  </Button>
                );
              })}
            </Box>
          </Box>

          {isLoading || products.length > 0 ? (
            <HorizontalProductRail
              products={products}
              isLoading={isLoading}
              renderCard={(product) => <ProductDiscoveryCard product={product} />}
            />
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
