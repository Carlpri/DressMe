import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import FiberNewRoundedIcon from "@mui/icons-material/FiberNewRounded";
import { useProducts } from "../../hooks/useProducts";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { ProductDiscoveryCard } from "./ProductDiscoveryCard";
import { LoadingSkeleton } from "../shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";

const DEEP_EMERALD = "#166534";
const CHARCOAL = "#111827";

export function NewArrivalsSection() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useScrollReveal<HTMLDivElement>({ threshold: 0.08 });

  const { data: newArrivalsData, isLoading } = useProducts({
    limit: 10,
    sort: "newest",
    status: "ACTIVE",
  });

  const products = newArrivalsData?.items ?? [];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

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
          {/* Section Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            spacing={2}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "8px",
                    bgcolor: "rgba(34, 197, 94, 0.12)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <FiberNewRoundedIcon sx={{ color: DEEP_EMERALD, fontSize: 20 }} />
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
                  FRESH DROPS
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
                New Arrivals
              </Typography>
              <Typography sx={{ color: "#64748B", mt: 0.75, fontSize: "0.95rem" }}>
                Fresh releases just added to inventory from curated independent brands
              </Typography>
            </Box>

            {/* Desktop Carousel Controls & View All */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                variant="text"
                endIcon={<NorthEastRoundedIcon />}
                onClick={() => navigate(`${ROUTES.customerDashboard}?sort=newest`)}
                sx={{
                  color: DEEP_EMERALD,
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                View All New
              </Button>

              <IconButton
                onClick={() => scroll("left")}
                aria-label="Previous products"
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#FFFFFF",
                  border: "1px solid rgba(17, 24, 39, 0.1)",
                  color: CHARCOAL,
                  "&:hover": { bgcolor: "#F1F5F9" },
                }}
              >
                <ChevronLeftRoundedIcon />
              </IconButton>

              <IconButton
                onClick={() => scroll("right")}
                aria-label="Next products"
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#FFFFFF",
                  border: "1px solid rgba(17, 24, 39, 0.1)",
                  color: CHARCOAL,
                  "&:hover": { bgcolor: "#F1F5F9" },
                }}
              >
                <ChevronRightRoundedIcon />
              </IconButton>
            </Stack>
          </Stack>

          {/* Horizontal Scrollable Carousel */}
          {isLoading ? (
            <Stack direction="row" spacing={3} sx={{ overflowX: "hidden" }}>
              {[...Array(4)].map((_, i) => (
                <Box key={i} sx={{ minWidth: { xs: 240, sm: 280, md: 310 }, flexShrink: 0 }}>
                  <LoadingSkeleton height={380} />
                </Box>
              ))}
            </Stack>
          ) : (
            <Box
              ref={scrollContainerRef}
              sx={{
                display: "flex",
                gap: { xs: 2, sm: 2.5, md: 3 },
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
                py: 1,
                px: 0.5,
              }}
            >
              {products.map((product) => (
                <Box
                  key={product.id}
                  sx={{
                    minWidth: { xs: 230, sm: 270, md: 300 },
                    maxWidth: { xs: 230, sm: 270, md: 300 },
                    flexShrink: 0,
                    scrollSnapAlign: "start",
                  }}
                >
                  <ProductDiscoveryCard
                    product={product}
                    badge="New"
                    aspectRatio="4/5"
                  />
                </Box>
              ))}
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
