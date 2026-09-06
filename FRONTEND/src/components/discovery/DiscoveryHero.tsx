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
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import { ROUTES } from "../../constants/routes";

const DEEP_EMERALD = "#166534";
const EMERALD = "#22C55E";
const CHARCOAL = "#111827";
const WARM_BG = "#FAF8F5";

const QUICK_TRENDS = [
  "White sneakers under 3000",
  "Streetwear",
  "Interview outfit",
  "Date night look",
  "Campus fits",
  "Red dinner dress",
  "Black trousers",
];

export function DiscoveryHero({ onExploreClick }: { onExploreClick?: () => void }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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
        pt: { xs: 5, md: 8 },
        pb: { xs: 8, md: 12 },
        overflow: "hidden",
        borderBottom: "1px solid rgba(17, 24, 39, 0.06)",
      }}
    >
      {/* Ambient background glows */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 15% 20%, rgba(34, 197, 94, 0.07) 0%, transparent 50%),
            radial-gradient(circle at 85% 65%, rgba(22, 101, 52, 0.08) 0%, transparent 55%)
          `,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        <Stack spacing={{ xs: 4, md: 6 }} alignItems="center" textAlign="center">
          
          {/* Eyebrow badge */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              px: 2,
              py: 0.75,
              borderRadius: "30px",
              bgcolor: "rgba(22, 101, 52, 0.08)",
              border: "1px solid rgba(22, 101, 52, 0.18)",
              display: "inline-flex",
            }}
          >
            <SparklesIcon sx={{ fontSize: 16, color: DEEP_EMERALD }} />
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 800,
                color: DEEP_EMERALD,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              FASHION DISCOVERY & INSPIRATION
            </Typography>
          </Stack>

          {/* Headline */}
          <Box sx={{ maxWidth: 880 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.4rem", sm: "3.4rem", md: "4.4rem" },
                fontWeight: 900,
                letterSpacing: "-0.035em",
                lineHeight: { xs: 1.12, md: 1.06 },
                color: CHARCOAL,
              }}
            >
              Discover Outfits.
              <br />
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(135deg, ${DEEP_EMERALD} 0%, ${EMERALD} 70%, #15803D 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Curate Your Look.
              </Box>{" "}
              Shop Nairobi's Best.
            </Typography>
            <Typography
              sx={{
                mt: 2.5,
                fontSize: { xs: "1rem", md: "1.2rem" },
                color: "#475569",
                lineHeight: 1.6,
                maxWidth: 650,
                mx: "auto",
              }}
            >
              From campus streetwear to boardroom power looks and date nights. Search in plain English and discover model-curated pieces from verified Kenyan designers and vendors.
            </Typography>
          </Box>

          {/* ══════════════════════════════════════════════════════════════════
              UNIVERSAL SEARCH BAR WITH EXPLICIT SEARCH BUTTON
          ══════════════════════════════════════════════════════════════════ */}
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              width: "100%",
              maxWidth: 740,
              bgcolor: "#FFFFFF",
              borderRadius: { xs: "20px", sm: "24px" },
              p: { xs: 1, sm: 1.25 },
              boxShadow: "0 12px 36px -8px rgba(17, 24, 39, 0.12), 0 0 0 1px rgba(17, 24, 39, 0.08)",
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
              placeholder="Search by occasion, style, color, or budget (e.g. 'white sneakers under 3000')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start" sx={{ pl: 1.5, mr: 1.5 }}>
                    <SearchIcon sx={{ color: DEEP_EMERALD, fontSize: 26 }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end" sx={{ pr: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search query"
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

            {/* Clear, Prominent SEARCH BUTTON */}
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
                letterSpacing: "0.02em",
                borderRadius: { xs: "14px", sm: "18px" },
                px: { xs: 3, sm: 4 },
                py: { xs: 1.4, sm: 1.6 },
                width: { xs: "100%", sm: "auto" },
                minWidth: 140,
                boxShadow: "0 6px 20px rgba(22, 101, 52, 0.35)",
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: "#14532D",
                  boxShadow: "0 8px 24px rgba(22, 101, 52, 0.45)",
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
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#64748B",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                mr: 0.5,
              }}
            >
              Popular:
            </Typography>
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
                  fontSize: "0.82rem",
                  border: "1px solid rgba(17, 24, 39, 0.1)",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(22, 101, 52, 0.08)",
                    borderColor: DEEP_EMERALD,
                    color: DEEP_EMERALD,
                    transform: "translateY(-2px)",
                  },
                }}
              />
            ))}
          </Stack>

          {/* Secondary Action Link / Fast Jump */}
          <Stack direction="row" spacing={3} alignItems="center" pt={1}>
            <Button
              variant="text"
              endIcon={<ArrowDownwardRoundedIcon />}
              onClick={onExploreClick}
              sx={{
                color: CHARCOAL,
                fontWeight: 700,
                fontSize: "0.9rem",
                "&:hover": { color: DEEP_EMERALD, bgcolor: "transparent" },
              }}
            >
              Scroll to Explore Feed
            </Button>
            <Button
              variant="outlined"
              endIcon={<AutoAwesomeRoundedIcon />}
              onClick={() => navigate(ROUTES.aiStylist)}
              sx={{
                borderRadius: "14px",
                borderColor: "rgba(22, 101, 52, 0.3)",
                color: DEEP_EMERALD,
                fontWeight: 700,
                fontSize: "0.9rem",
                px: 2.5,
                py: 0.8,
                "&:hover": {
                  borderColor: DEEP_EMERALD,
                  bgcolor: "rgba(22, 101, 52, 0.06)",
                },
              }}
            >
              AI Outfit Builder
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
