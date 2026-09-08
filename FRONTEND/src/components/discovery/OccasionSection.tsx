import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import StyleRoundedIcon from "@mui/icons-material/StyleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const DEEP_EMERALD = "#166534";
const EMERALD = "#22C55E";
const CHARCOAL = "#111827";

export interface OccasionItem {
  id: string;
  name: string;
  tagline: string;
  catalogOutfit: string;
  searchQuery: string;
  image: string;
  isSpotlight?: boolean;
}

const OCCASIONS: OccasionItem[] = [
  {
    id: "nairobi-streetwear",
    name: "Nairobi Streetwear",
    tagline: "Corduroy jackets, cargo pants & Airforce kicks",
    catalogOutfit: "Corduroy Jacket • Baggy Cargos • AF1s",
    searchQuery: "streetwear",
    image: "/hero-african-models.jpg",
    isSpotlight: true,
  },
  {
    id: "date-wear",
    name: "Date Night & Evening",
    tagline: "Vintage tea dress, red-bottom heels & studded purse",
    catalogOutfit: "Tea Cocktail Dress • Designer Heels • Star Necklace",
    searchQuery: "date",
    image: "/Kenyan%20Fashion%20designers%20Put%20Kenya%20on%20the%20NYFW%202024%20Map.jpg",
    isSpotlight: true,
  },
  {
    id: "campus",
    name: "Campus & Casual Fits",
    tagline: "Blue denim, summer tops & Vans sneakers",
    catalogOutfit: "Relaxed Jeans • Graphic Tops • Vans Sneakers",
    searchQuery: "campus",
    image: "/aesthetic%20man's%20clothes%20%F0%9F%94%A5_%20tap%20on%20the%20link%20to%20get%20more%20info__.jpg",
    isSpotlight: true,
  },
  {
    id: "smart-casual",
    name: "Smart Casual & Afro-Tech",
    tagline: "Textured collar shirts, dress pants & tassel loafers",
    catalogOutfit: "Short-Sleeve Textured Shirt • Tassel Loafers",
    searchQuery: "smart casual",
    image: "/African%20Print%20Shirt%20for%20Men,%20Ankara%20Short%20Sleeve%20Shirt,%20Patchwork%20Top.jpg",
    isSpotlight: true,
  },
  {
    id: "african-modern",
    name: "African Modern & Celebrations",
    tagline: "Tailored ivory kaftan suit with gold embroidery",
    catalogOutfit: "African Men Suit • Gold Embroidery • Leather Sandals",
    searchQuery: "Africa wear",
    image: "/Pre%20order%20Sizes%20(S,M,L,XL%D8%8C2XL)%20Price_155%20thousand%20Height%20_%2097%20cm%20Delivery%20service%20to%20all%20parts%20of___.jpg",
    isSpotlight: true,
  },
  {
    id: "official-wear",
    name: "Official & Boardroom",
    tagline: "Sharp blazers & crisp corporate tailoring",
    catalogOutfit: "Tailored Shirts • Dress Trousers",
    searchQuery: "office",
    image: "/African%20Print%20Shirt%20for%20Men,%20Ankara%20Short%20Sleeve%20Shirt,%20Patchwork%20Top.jpg",
  },
  {
    id: "weekend",
    name: "Weekend & Brunch",
    tagline: "Effortless chill fits for spontaneous road trips",
    catalogOutfit: "Birko-Flor Sandals • Casual Shirts • Sunnies",
    searchQuery: "weekend",
    image: "/aesthetic%20man's%20clothes%20%F0%9F%94%A5_%20tap%20on%20the%20link%20to%20get%20more%20info__.jpg",
  },
  {
    id: "wedding",
    name: "Wedding & Galas",
    tagline: "Distinguished guest elegance & bespoke attire",
    catalogOutfit: "Cocktail Gowns • African Celebration Suits",
    searchQuery: "wedding",
    image: "/Kenyan%20Fashion%20designers%20Put%20Kenya%20on%20the%20NYFW%202024%20Map.jpg",
  },
];

function OccasionCard({ occasion }: { occasion: OccasionItem }) {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartedWhileRevealed = useRef(false);
  const touchMoved = useRef(false);

  useEffect(() => {
    return () => {
      if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    };
  }, []);

  // Dismiss on outside tap
  useEffect(() => {
    if (!isRevealed) return;
    const dismiss = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsRevealed(false);
        if (autoCloseTimer.current) {
          clearTimeout(autoCloseTimer.current);
          autoCloseTimer.current = null;
        }
      }
    };
    document.addEventListener("mousedown", dismiss);
    document.addEventListener("touchstart", dismiss);
    return () => {
      document.removeEventListener("mousedown", dismiss);
      document.removeEventListener("touchstart", dismiss);
    };
  }, [isRevealed]);

  const triggerReveal = () => {
    setIsRevealed(true);
    if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    autoCloseTimer.current = setTimeout(() => {
      setIsRevealed(false);
      autoCloseTimer.current = null;
    }, 2800);
  };

  const handleTouchStart = () => {
    touchMoved.current = false;
    touchStartedWhileRevealed.current = isRevealed;
  };

  const handleTouchMove = () => {
    touchMoved.current = true;
  };

  const handleClick = () => {
    if (touchMoved.current) {
      touchMoved.current = false;
      return;
    }
    if (touchStartedWhileRevealed.current || !("ontouchstart" in window)) {
      navigate(`/products?search=${encodeURIComponent(occasion.searchQuery)}`);
    } else {
      triggerReveal();
    }
  };

  return (
    <Box
      ref={cardRef}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
      sx={{
        position: "relative",
        height: { xs: 240, sm: 280, md: 320 },
        borderRadius: "22px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: isRevealed
          ? "0 20px 45px rgba(22, 101, 52, 0.22), 0 0 0 2px #22C55E"
          : "0 6px 20px rgba(17, 24, 39, 0.08)",
        border: "1px solid rgba(17, 24, 39, 0.08)",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: isRevealed ? "translateY(-6px)" : "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Model Photo featuring real catalog outfits */}
      <Box
        component="img"
        src={occasion.image}
        alt={occasion.name}
        loading="lazy"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: isRevealed ? "scale(1.07)" : "scale(1)",
        }}
      />

      {/* Gradient Overlay for Editorial Legibility */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: isRevealed
            ? "linear-gradient(to top, rgba(17, 24, 39, 0.94) 0%, rgba(17, 24, 39, 0.45) 50%, rgba(17, 24, 39, 0.2) 100%)"
            : "linear-gradient(to top, rgba(17, 24, 39, 0.88) 0%, rgba(17, 24, 39, 0.28) 45%, transparent 75%)",
          transition: "all 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Top Badge: Catalog Outfit Cue */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <Chip
          label="REAL OUTFITS ON SITE"
          size="small"
          sx={{
            bgcolor: "rgba(17, 24, 39, 0.8)",
            backdropFilter: "blur(8px)",
            color: "#22C55E",
            fontWeight: 800,
            fontSize: "0.62rem",
            letterSpacing: "0.06em",
            height: 22,
            border: "1px solid rgba(34, 197, 94, 0.3)",
          }}
        />
      </Box>

      {/* Content overlay & Touch reveal drawer */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 2, sm: 2.5 },
          color: "#FFFFFF",
          zIndex: 2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {occasion.name}
          </Typography>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: isRevealed ? EMERALD : "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(8px)",
              display: "grid",
              placeItems: "center",
              transition: "all 0.25s ease",
            }}
          >
            <ArrowForwardRoundedIcon
              sx={{
                fontSize: 16,
                color: isRevealed ? "#07130F" : "#FFFFFF",
                transform: isRevealed ? "translateX(2px)" : "none",
                transition: "transform 0.2s ease",
              }}
            />
          </Box>
        </Stack>

        <Typography
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.8rem" },
            color: "rgba(255, 255, 255, 0.8)",
            mt: 0.5,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {occasion.tagline}
        </Typography>

        {/* Revealed Catalog Outfit Details */}
        <Box
          sx={{
            mt: 1.2,
            pt: 1,
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(6px)",
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "#86EFAC",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {occasion.catalogOutfit}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "#FFFFFF",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              flexShrink: 0,
            }}
          >
            Shop Look →
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export function OccasionSection() {
  const navigate = useNavigate();
  const sectionRef = useScrollReveal<HTMLDivElement>({ threshold: 0.08, staggerMs: 50 });

  return (
    <Box ref={sectionRef} sx={{ py: { xs: 9, md: 14 }, bgcolor: "#FFFFFF" }}>
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
                <StyleRoundedIcon sx={{ color: DEEP_EMERALD, fontSize: 18 }} />
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
                OCCASION CURATION
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
              Find Your Look
            </Typography>
            <Typography sx={{ color: "#64748B", mt: 1.5, fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.6 }}>
              Looks for every moment, built from real DressMe pieces.
            </Typography>
            <Button
              variant="text"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => navigate("/products")}
              sx={{ mt: 1, color: DEEP_EMERALD, fontWeight: 800, textTransform: "none" }}
            >
              View more looks
            </Button>
          </Box>

          {/* Horizontal occasion rail */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1.5, sm: 2.5 },
              overflowX: "auto",
              mx: { xs: -2, md: 0 },
              px: { xs: 2, md: 0 },
              pb: 2,
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              "& > *": { flex: "0 0 clamp(250px, 29vw, 340px)", scrollSnapAlign: "start" },
            }}
          >
            {OCCASIONS.map((occasion) => (
              <Box key={occasion.id} className="reveal-child">
                <OccasionCard occasion={occasion} />
              </Box>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
