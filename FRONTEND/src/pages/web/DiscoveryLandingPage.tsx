import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StoreIcon from "@mui/icons-material/Store";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

import { DiscoveryHero } from "../../components/discovery/DiscoveryHero";
import { TrendingSection } from "../../components/discovery/TrendingSection";
import { NewArrivalsSection } from "../../components/discovery/NewArrivalsSection";
import { OccasionSection } from "../../components/discovery/OccasionSection";
import { CategoryDiscoverySection } from "../../components/discovery/CategoryDiscoverySection";
import { FeaturedSection } from "../../components/discovery/FeaturedSection";
import { BestSellersSection } from "../../components/discovery/BestSellersSection";
import { DiscoveryFeedSection } from "../../components/discovery/DiscoveryFeedSection";
import { ROUTES } from "../../constants/routes";

const DEEP_EMERALD = "#166534";
const EMERALD = "#22C55E";
const CHARCOAL = "#111827";

export function DiscoveryLandingPage() {
  const navigate = useNavigate();
  const feedRef = useRef<HTMLDivElement>(null);

  const scrollToFeed = () => {
    feedRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box sx={{ bgcolor: "#FFFFFF", color: CHARCOAL, minHeight: "100vh" }}>
      {/* 1. DISCOVERY HERO WITH VISIBLE SEARCH BUTTON */}
      <DiscoveryHero onExploreClick={scrollToFeed} />

      {/* 2. VALUE PROPOSITION STRIP */}
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          borderBottom: "1px solid rgba(17, 24, 39, 0.07)",
          py: 2.5,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            {[
              {
                icon: <CheckroomIcon sx={{ color: DEEP_EMERALD, fontSize: 22 }} />,
                title: "Model-Curated Outfits",
                desc: "Complete head-to-toe looks",
              },
              {
                icon: <AutoAwesomeIcon sx={{ color: DEEP_EMERALD, fontSize: 22 }} />,
                title: "AI Outfit Builder",
                desc: "Tailored to your body & occasion",
              },
              {
                icon: <LocalShippingOutlinedIcon sx={{ color: DEEP_EMERALD, fontSize: 22 }} />,
                title: "Controlled Fulfillment",
                desc: "Inspected, packaged & delivered",
              },
              {
                icon: <SecurityOutlinedIcon sx={{ color: DEEP_EMERALD, fontSize: 22 }} />,
                title: "100% Buyer Protection",
                desc: "Secure checkout through DressMe",
              },
            ].map((item, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "12px",
                      bgcolor: "rgba(22, 101, 52, 0.08)",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: "0.82rem", sm: "0.88rem" },
                        color: CHARCOAL,
                        lineHeight: 1.2,
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: "0.74rem", color: "#64748B", mt: 0.25 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 3. TRENDING IN 2026 */}
      <TrendingSection />

      {/* 4. NEW ARRIVALS */}
      <NewArrivalsSection />

      {/* 5. EXPLORE BY OCCASION ("FIND YOUR LOOK") */}
      <OccasionSection />

      {/* 6. SHOP BY CATEGORY */}
      <CategoryDiscoverySection />

      {/* 7. FEATURED ON DRESSME */}
      <FeaturedSection />

      {/* 8. BEST SELLERS */}
      <BestSellersSection />

      {/* 9. AI STYLIST DISCOVERY PROMO BANNER */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: `linear-gradient(135deg, #0F3822 0%, #166534 60%, #15803D 100%)`,
          color: "#FFFFFF",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(ellipse 60% 70% at 85% 40%, rgba(34, 197, 94, 0.25) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AutoAwesomeIcon sx={{ color: EMERALD, fontSize: 20 }} />
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      color: EMERALD,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    AI STYLIST & OUTFIT BUILDER
                  </Typography>
                </Stack>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: "2rem", sm: "2.8rem", md: "3.2rem" },
                    letterSpacing: "-0.03em",
                    lineHeight: 1.15,
                  }}
                >
                  Can't decide what to wear?
                  <br />
                  Let AI build your entire look.
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255, 255, 255, 0.82)",
                    fontSize: { xs: "0.95rem", md: "1.1rem" },
                    maxWidth: 620,
                    lineHeight: 1.6,
                  }}
                >
                  Tell our AI your occasion, preferred colors, and budget. It instantly pairs matching tops, bottoms, shoes, and accessories directly from the DressMe inventory.
                </Typography>
              </Stack>
            </Grid>
            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                onClick={() => navigate(ROUTES.aiStylist)}
                sx={{
                  bgcolor: "#FFFFFF",
                  color: DEEP_EMERALD,
                  fontWeight: 900,
                  fontSize: "1rem",
                  px: 4,
                  py: 1.75,
                  borderRadius: "16px",
                  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
                  "&:hover": {
                    bgcolor: "#F0FDF4",
                    transform: "translateY(-2px)",
                    boxShadow: "0 16px 36px rgba(0, 0, 0, 0.35)",
                  },
                  transition: "all 0.25s ease",
                }}
              >
                Try Outfit Builder Free
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 10. CONTINUOUS DISCOVERY STREAM (MASONRY GRID) */}
      <Box ref={feedRef}>
        <DiscoveryFeedSection id="discovery-stream" />
      </Box>
    </Box>
  );
}
