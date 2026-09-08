import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
  Chip,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import { ROUTES } from "../../constants/routes";
import { useProducts } from "../../hooks/useProducts";

const DEEP_EMERALD = "#166534";
const EMERALD = "#22C55E";
const CHARCOAL = "#111827";
const WARM_BG = "#FAF8F5";

const QUICK_TRENDS = [
  "Streetwear",
  "Date night",
  "White sneakers under 3000",
  "Campus fits",
  "Africa wear",
  "Smart casual",
];

export function DiscoveryHero({ onExploreClick }: { onExploreClick?: () => void }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: productData, isLoading: productsLoading } = useProducts({
    limit: 4,
    sort: "popular",
    status: "ACTIVE",
  });
  const heroProducts = productData?.items ?? [];

  const executeSearch = (query: string) => {
    const q = query.trim();
    if (q) {
      navigate(`/products?search=${encodeURIComponent(q)}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: WARM_BG,
        pt: { xs: 7, sm: 9, md: 12 },
        pb: { xs: 11, sm: 13, md: 16 },
        overflow: "hidden",
        borderBottom: "1px solid rgba(17, 24, 39, 0.06)",
      }}
    >
      {/* Ambient background glow */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 60%, rgba(22, 101, 52, 0.09) 0%, transparent 55%)
          `,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        <Stack spacing={{ xs: 4, md: 5.5 }} alignItems="center" textAlign="center">
          {/* Minimalist Top Eyebrow */}
          <Typography
            className="animate-hero-eyebrow"
            sx={{
              fontSize: "0.76rem",
              fontWeight: 800,
              letterSpacing: "0.16em",
              color: DEEP_EMERALD,
              textTransform: "uppercase",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            AFRICAN FASHION-TECH DISCOVERY
          </Typography>

          {/* Minimalist Headline */}
          <Box sx={{ maxWidth: 880 }}>
            <Typography
              variant="h1"
              className="animate-hero-headline font-display"
              sx={{
                fontSize: { xs: "3rem", sm: "4.4rem", md: "5.5rem" },
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.02,
                color: CHARCOAL,
              }}
            >
              Find your style.
            </Typography>

            {/* Single Short Supporting Sentence */}
            <Typography
              className="animate-hero-subhead"
              sx={{
                mt: 2.5,
                fontSize: { xs: "1.05rem", md: "1.25rem" },
                color: "#475569",
                lineHeight: 1.6,
                maxWidth: 620,
                mx: "auto",
                fontWeight: 400,
              }}
            >
              Curated looks, streetwear, and designer staples from Kenya's top fashion creators.
            </Typography>
          </Box>

          {/* CTAs */}
          <Stack
            className="animate-hero-actions"
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={onExploreClick}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                bgcolor: DEEP_EMERALD,
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "1rem",
                px: 4,
                py: 1.6,
                borderRadius: "16px",
                boxShadow: "0 8px 24px rgba(22, 101, 52, 0.3)",
                "&:hover": {
                  bgcolor: "#14532D",
                  boxShadow: "0 12px 28px rgba(22, 101, 52, 0.4)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Explore Fashion
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(ROUTES.aiStylist)}
              startIcon={<AutoAwesomeRoundedIcon />}
              sx={{
                borderColor: "rgba(17, 24, 39, 0.2)",
                color: CHARCOAL,
                fontWeight: 700,
                fontSize: "1rem",
                px: 3.5,
                py: 1.6,
                borderRadius: "16px",
                bgcolor: "#FFFFFF",
                "&:hover": {
                  borderColor: DEEP_EMERALD,
                  color: DEEP_EMERALD,
                  bgcolor: "rgba(22, 101, 52, 0.04)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Find My Style
            </Button>
          </Stack>

          {/* ══════════════════════════════════════════════════════════════════
              UNIVERSAL SEARCH BAR WITH VISIBLE SEARCH BUTTON
          ══════════════════════════════════════════════════════════════════ */}
          <Box
            component="form"
            className="animate-hero-actions"
            onSubmit={handleSearchSubmit}
            sx={{
              width: "100%",
              maxWidth: 720,
              bgcolor: "#FFFFFF",
              borderRadius: { xs: "20px", sm: "24px" },
              p: { xs: 1, sm: 1.25 },
              boxShadow:
                "0 12px 36px -8px rgba(17, 24, 39, 0.12), 0 0 0 1px rgba(17, 24, 39, 0.08)",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 1,
              transition: "all 0.25s ease",
              "&:focus-within": {
                boxShadow: `0 16px 48px -10px rgba(22, 101, 52, 0.2), 0 0 0 2px ${DEEP_EMERALD}`,
              },
            }}
          >
            <TextField
              fullWidth
              placeholder="Search looks, cargo pants, white sneakers under 3000..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start" sx={{ pl: 1.5, mr: 1.5 }}>
                    <SearchIcon sx={{ color: DEEP_EMERALD, fontSize: 24 }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end" sx={{ pr: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      <ClearRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                "& input": {
                  fontSize: { xs: "0.95rem", sm: "1.05rem" },
                  fontWeight: 500,
                  py: { xs: 1, sm: 1.25 },
                  color: CHARCOAL,
                  "&::placeholder": {
                    color: "#94A3B8",
                    opacity: 1,
                  },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              id="hero-discovery-search-btn"
              startIcon={<SearchIcon sx={{ fontSize: 20 }} />}
              sx={{
                bgcolor: DEEP_EMERALD,
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "1rem",
                borderRadius: { xs: "14px", sm: "18px" },
                px: { xs: 3, sm: 4 },
                py: { xs: 1.3, sm: 1.5 },
                width: { xs: "100%", sm: "auto" },
                minWidth: 130,
                boxShadow: "0 6px 20px rgba(22, 101, 52, 0.3)",
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: "#14532D",
                },
                transition: "all 0.2s ease",
              }}
            >
              Search
            </Button>
          </Box>

          {/* Quick Trend Chips */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
            gap={1}
            sx={{ maxWidth: 840 }}
          >
            {QUICK_TRENDS.map((item) => (
              <Chip
                key={item}
                label={item}
                onClick={() => {
                  setSearchQuery(item);
                  executeSearch(item);
                }}
                sx={{
                  bgcolor: "#FFFFFF",
                  color: CHARCOAL,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  border: "1px solid rgba(17, 24, 39, 0.1)",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(22, 101, 52, 0.08)",
                    borderColor: DEEP_EMERALD,
                    color: DEEP_EMERALD,
                    transform: "translateY(-1px)",
                  },
                }}
              />
            ))}
          </Stack>

          {/* ══════════════════════════════════════════════════════════════════
              VISUAL EDITORIAL SHOWCASE (Authentic Kenyan Models in Site Outfits)
          ══════════════════════════════════════════════════════════════════ */}
          <Box className="animate-hero-showcase" sx={{ width: "100%", pt: { xs: 2, md: 4 } }}>
            <Grid container spacing={2.5}>
              {Array.from({ length: productsLoading ? 4 : heroProducts.length }).map((_, idx) => {
                const product = productsLoading ? undefined : heroProducts[idx];
                const image = product?.images?.find((item) => item.isPrimary) ?? product?.images?.[0];
                const title = product?.name ?? "Discovering the latest drop";

                return (
                <Grid size={{ xs: 6, md: 3 }} key={product?.id ?? idx}>
                  <Box
                    onClick={() => product ? navigate(`/products/${product.slug}`) : undefined}
                    sx={{
                      position: "relative",
                      height: { xs: 240, sm: 300, md: 360 },
                      borderRadius: "22px",
                      overflow: "hidden",
                      cursor: "pointer",
                      boxShadow: "0 8px 24px rgba(17, 24, 39, 0.08)",
                      border: "1px solid rgba(17, 24, 39, 0.08)",
                      transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 22px 45px rgba(22, 101, 52, 0.2), 0 0 0 2px #22C55E",
                      },
                      "&:hover .hero-img": {
                        transform: "scale(1.06)",
                      },
                      animationDelay: `${idx * 90}ms`,
                      animationName: productsLoading ? "heroCardPulse" : "heroCardReveal",
                    }}
                  >
                    <Box
                      component="img"
                      className="hero-img"
                      src={image?.imageUrl || undefined}
                      alt={image?.altText || title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />

                    {/* Gradient */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(17, 24, 39, 0.92) 0%, rgba(17, 24, 39, 0.2) 50%, transparent 80%)",
                      }}
                    />

                    {/* Label Overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: { xs: 1.75, sm: 2.25 },
                        textAlign: "left",
                        color: "#FFFFFF",
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: { xs: "0.95rem", sm: "1.1rem" },
                            lineHeight: 1.2,
                          }}
                        >
                          {title}
                        </Typography>
                        <NorthEastRoundedIcon sx={{ fontSize: 16, color: EMERALD }} />
                      </Stack>
                      <Typography
                        sx={{
                          fontSize: "0.72rem",
                          color: "rgba(255, 255, 255, 0.75)",
                          mt: 0.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product ? `${product.brand?.name ?? "DressMe"} • ${product.categories?.[0]?.name ?? "Featured piece"}` : "Loading catalog styles"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                );
              })}
            </Grid>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
