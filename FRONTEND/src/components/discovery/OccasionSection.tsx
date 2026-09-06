import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import StyleRoundedIcon from "@mui/icons-material/StyleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const DEEP_EMERALD = "#166534";
const CHARCOAL = "#111827";

export interface OccasionItem {
  id: string;
  name: string;
  tagline: string;
  searchQuery: string;
  image: string;
}

const OCCASIONS: OccasionItem[] = [
  {
    id: "streetwear",
    name: "Streetwear",
    tagline: "Oversized, hoodies, cargos & heat kicks",
    searchQuery: "streetwear",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=700&q=80",
  },
  {
    id: "date-wear",
    name: "Date Wear",
    tagline: "Effortlessly magnetic evening fits",
    searchQuery: "date",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&q=80",
  },
  {
    id: "official-wear",
    name: "Official Wear",
    tagline: "Sharp tailoring & crisp confidence",
    searchQuery: "official",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&q=80",
  },
  {
    id: "interview",
    name: "Interview",
    tagline: "Make an unforgettable first impression",
    searchQuery: "interview",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=80",
  },
  {
    id: "business",
    name: "Business",
    tagline: "Modern boardrooms & client meetings",
    searchQuery: "business",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=700&q=80",
  },
  {
    id: "campus",
    name: "Campus",
    tagline: "Low-effort, high-style lecture fits",
    searchQuery: "campus",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=700&q=80",
  },
  {
    id: "casual",
    name: "Casual",
    tagline: "Everyday essentials that stand out",
    searchQuery: "casual",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=700&q=80",
  },
  {
    id: "party",
    name: "Party",
    tagline: "Turn heads from sunset to sunrise",
    searchQuery: "party",
    image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=700&q=80",
  },
  {
    id: "wedding",
    name: "Wedding",
    tagline: "Guest elegance & celebration pieces",
    searchQuery: "wedding",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=80",
  },
  {
    id: "dinner",
    name: "Dinner",
    tagline: "Refined cuts for memorable nights out",
    searchQuery: "dinner",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700&q=80",
  },
  {
    id: "weekend",
    name: "Weekend",
    tagline: "Relaxed brunches & spontaneous road trips",
    searchQuery: "weekend",
    image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=700&q=80",
  },
  {
    id: "smart-casual",
    name: "Smart Casual",
    tagline: "The perfect balance of polished and relaxed",
    searchQuery: "smart casual",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80",
  },
];

export function OccasionSection() {
  const navigate = useNavigate();

  const handleOccasionClick = (occasion: OccasionItem) => {
    navigate(`/products?search=${encodeURIComponent(occasion.searchQuery)}`);
  };

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#FFFFFF" }}>
      <Container maxWidth="xl">
        <Stack spacing={5}>
          {/* Header */}
          <Box sx={{ textAlign: "center", maxWidth: 700, mx: "auto" }}>
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
                <StyleRoundedIcon sx={{ color: DEEP_EMERALD, fontSize: 18 }} />
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
                OCCASION CURATION
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
              Find Your Look
            </Typography>
            <Typography sx={{ color: "#64748B", mt: 1, fontSize: "1rem" }}>
              Explore curated styling aesthetics tailored to every moment of your week
            </Typography>
          </Box>

          {/* Occasion Cards Grid */}
          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {OCCASIONS.map((occasion) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={occasion.id}>
                <Box
                  onClick={() => handleOccasionClick(occasion)}
                  sx={{
                    position: "relative",
                    height: { xs: 200, sm: 250, md: 290 },
                    borderRadius: "22px",
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(17, 24, 39, 0.08)",
                    border: "1px solid rgba(17, 24, 39, 0.08)",
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 20px 40px rgba(22, 101, 52, 0.2), 0 0 0 2px #22C55E",
                    },
                    "&:hover .occ-img": {
                      transform: "scale(1.08)",
                    },
                    "&:hover .occ-arrow": {
                      transform: "translateX(4px)",
                      color: "#22C55E",
                    },
                  }}
                >
                  {/* Photo */}
                  <Box
                    component="img"
                    className="occ-img"
                    src={occasion.image}
                    alt={occasion.name}
                    loading="lazy"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />

                  {/* Gradient Overlay for Editorial Legibility */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(17, 24, 39, 0.92) 0%, rgba(17, 24, 39, 0.35) 45%, transparent 75%)",
                    }}
                  />

                  {/* Content overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: { xs: 2, sm: 2.5 },
                      color: "#FFFFFF",
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: { xs: "1.05rem", sm: "1.2rem" },
                          letterSpacing: "-0.01em",
                          lineHeight: 1.2,
                        }}
                      >
                        {occasion.name}
                      </Typography>
                      <ArrowForwardRoundedIcon
                        className="occ-arrow"
                        sx={{
                          fontSize: 18,
                          color: "#FFFFFF",
                          transition: "transform 0.25s ease, color 0.2s ease",
                        }}
                      />
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.72rem", sm: "0.78rem" },
                        color: "rgba(255, 255, 255, 0.75)",
                        mt: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {occasion.tagline}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
