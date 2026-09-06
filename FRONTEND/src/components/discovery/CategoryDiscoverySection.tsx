import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import { useCategories } from "../../hooks/useCategories";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { LoadingSkeleton } from "../shared/LoadingSkeleton";

const DEEP_EMERALD = "#166534";
const CHARCOAL = "#111827";

// Curated default high-res category imagery if category image is not stored
const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  dresses: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
  shirts: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
  pants: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
  skirts: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80",
  jackets: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
  accessories: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80",
  footwear: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
  intimates: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&q=80",
  streetwear: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
  sneakers: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
};

export function CategoryDiscoverySection() {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useCategories();
  const sectionRef = useScrollReveal<HTMLDivElement>({ threshold: 0.08, staggerMs: 50 });

  const handleCategoryClick = (slug: string) => {
    navigate(`/products?category=${encodeURIComponent(slug)}`);
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
                <CategoryRoundedIcon sx={{ color: DEEP_EMERALD, fontSize: 18 }} />
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
                BROWSE BY SILHOUETTE
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
                lineHeight: 1.12,
              }}
            >
              Explore Categories
            </Typography>
            <Typography sx={{ color: "#64748B", mt: 1.5, fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.6 }}>
              Dive into our complete catalog structured by design, style, and essential apparel types
            </Typography>
          </Box>

          {/* Categories Grid */}
          {isLoading ? (
            <Grid container spacing={2.5}>
              {[...Array(8)].map((_, i) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
                  <LoadingSkeleton height={180} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {(categories || []).slice(0, 8).map((cat) => {
                const categoryImg =
                  cat.image ||
                  DEFAULT_CATEGORY_IMAGES[cat.slug] ||
                  DEFAULT_CATEGORY_IMAGES[cat.name.toLowerCase()] ||
                  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80";

                return (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={cat.id} className="reveal-child">
                    <Box
                      onClick={() => handleCategoryClick(cat.slug)}
                      sx={{
                        position: "relative",
                        height: { xs: 160, sm: 190, md: 220 },
                        borderRadius: "20px",
                        overflow: "hidden",
                        cursor: "pointer",
                        border: "1px solid rgba(17, 24, 39, 0.08)",
                        boxShadow: "0 4px 16px rgba(17, 24, 39, 0.05)",
                        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 16px 36px rgba(22, 101, 52, 0.18), 0 0 0 2px #22C55E",
                        },
                        "&:hover .cat-photo": {
                          transform: "scale(1.08)",
                        },
                      }}
                    >
                      <Box
                        component="img"
                        className="cat-photo"
                        src={categoryImg}
                        alt={cat.name}
                        loading="lazy"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to top, rgba(17, 24, 39, 0.85) 0%, rgba(17, 24, 39, 0.2) 50%, transparent 80%)",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: { xs: 2, sm: 2.5 },
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: { xs: "1rem", sm: "1.15rem" },
                            color: "#FFFFFF",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {cat.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.72rem",
                            color: "rgba(255, 255, 255, 0.75)",
                            mt: 0.25,
                            fontWeight: 500,
                          }}
                        >
                          Explore Collection →
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
