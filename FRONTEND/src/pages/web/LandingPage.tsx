import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
  Chip,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StoreIcon from "@mui/icons-material/Store";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";
import { useVendors } from "../../hooks/useVendors";
import { ROUTES } from "../../constants/routes";
import { ProductCard } from "../../components/shared/ProductCard";
import { MasonryGrid } from "../../components/shared/MasonryGrid";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { useSiteSettingsContext } from "../../contexts/SiteSettingsContext";

/* ── Light Mode Luxury Palette ───────────────────────────────────────────── */
const GOLD = "#C9A96E";
const GOLD_DARK = "#9E7B3B";
const DARK = "#0D0D0D";
const BG_PAGE = "#FFFFFF";
const BG_ALT = "#F9F6F2";
const CARD_BG = "#FFFFFF";
const BORDER_LIGHT = "rgba(0, 0, 0, 0.07)";

/* ── 3-D rotating hero images ─────────────────────────────────────────────
   Pure CSS perspective + rotateY — no canvas, no lib, zero bundle cost.     */
const HERO_SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
    label: "Editorial",
    caption: "Curated Looks",
  },
  {
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    label: "Trending",
    caption: "What's Hot Now",
  },
  {
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
    label: "New Arrival",
    caption: "Just Dropped",
  },
];

/* ── Stat counter ────────────────────────────────────────────────────────── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          setCount(start);
          if (start >= target) clearInterval(timer);
        }, 16);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── Section header ──────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5} mb={0.5}>
      <Box sx={{ width: 32, height: 2, bgcolor: GOLD_DARK, borderRadius: 1, flexShrink: 0 }} />
      <Typography
        sx={{
          fontSize: "0.72rem",
          fontWeight: 800,
          letterSpacing: "0.12em",
          color: GOLD_DARK,
          textTransform: "uppercase",
        }}
      >
        {children}
      </Typography>
    </Stack>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
export function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const { settings } = useSiteSettingsContext();

  /* ── data ──────────────────────────────────────────────────────────────── */
  const { data: trendingProducts, isLoading: trendingLoading } = useProducts({
    featured: true,
    limit: 8,
    sort: "popular",
  });
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { data: vendors, isLoading: vendorsLoading } = useVendors();
  const { data: newProducts, isLoading: newLoading } = useProducts({
    limit: 4,
    sort: "newest",
  });

  /* ── auto-rotate hero every 3 s ─────────────────────────────────────────  */
  useEffect(() => {
    const id = setInterval(() => setActiveSlide((s) => (s + 1) % HERO_SLIDES.length), 3200);
    return () => clearInterval(id);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.customerDashboard}?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Box sx={{ bgcolor: BG_PAGE, color: DARK, minHeight: "100vh" }}>
      {/* ════════════════════════════════════════════════════════════════════
          HERO (Light Mode)
      ════════════════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "100vh", md: "100vh" },
          bgcolor: BG_ALT,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          borderBottom: `1px solid ${BORDER_LIGHT}`,
        }}
      >
        {/* ambient blobs — luxury warm champagne radial gradients */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(ellipse 65% 50% at 75% 40%, rgba(201,169,110,0.13) 0%, transparent 70%),
              radial-gradient(ellipse 45% 45% at 20% 70%, rgba(201,169,110,0.08) 0%, transparent 60%)
            `,
            pointerEvents: "none",
          }}
        />
        {/* subtle grid texture */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2, py: { xs: 10, md: 0 } }}>
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center" minHeight={{ md: "100vh" }}>
            {/* ── LEFT: editorial copy ─────────────────────────────────── */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={4}>
                {/* eyebrow */}
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.45,
                      borderRadius: "6px",
                      bgcolor: "rgba(201,169,110,0.14)",
                      border: "1px solid rgba(201,169,110,0.32)",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 13, color: GOLD_DARK }} />
                    <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: GOLD_DARK, letterSpacing: "0.08em" }}>
                      THE FUTURE OF FASHION
                    </Typography>
                  </Box>
                </Stack>

                {/* headline */}
                <Box>
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: "3rem", sm: "3.8rem", md: "4.5rem", lg: "5.2rem" },
                      lineHeight: 1.05,
                      color: DARK,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    Dress Like
                    <br />
                    <Box
                      component="span"
                      sx={{
                        background: `linear-gradient(135deg, ${GOLD_DARK} 0%, ${GOLD} 50%, #B89355 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      a Model.
                    </Box>
                    <br />
                    <Box component="span" sx={{ color: "rgba(0,0,0,0.36)", fontWeight: 400, fontSize: "0.72em" }}>
                      Look Every Part.
                    </Box>
                  </Typography>
                </Box>

                {/* sub-copy */}
                <Typography
                  sx={{
                    color: "#475569",
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    lineHeight: 1.7,
                    maxWidth: 480,
                  }}
                >
                  {settings?.tagline ||
                    "DressMe curates full outfit collections — head to toe — so every look you add to your cart is already model-approved and ready to wear."}
                </Typography>

                {/* search */}
                <Box
                  component="form"
                  onSubmit={handleSearch}
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    maxWidth: 520,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Search styles, brands, outfits…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#FFFFFF",
                        borderRadius: "12px",
                        height: 52,
                        color: DARK,
                        boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
                        "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                        "&:hover fieldset": { borderColor: GOLD },
                        "&.Mui-focused fieldset": { borderColor: GOLD },
                      },
                      "& input::placeholder": { color: "#94A3B8", opacity: 1 },
                    }}
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ color: "#94A3B8", mr: 1.5, fontSize: 20 }} />,
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      height: 52,
                      px: 3.5,
                      borderRadius: "12px",
                      fontWeight: 700,
                      bgcolor: GOLD,
                      color: DARK,
                      minWidth: { xs: "100%", sm: 120 },
                      "&:hover": { bgcolor: "#D8B87D", boxShadow: `0 8px 24px rgba(201,169,110,0.35)` },
                      transition: "all 0.25s ease",
                    }}
                  >
                    Search
                  </Button>
                </Box>

                {/* CTAs */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<NorthEastIcon />}
                    onClick={() => navigate(ROUTES.customerDashboard)}
                    sx={{
                      px: 3.5,
                      py: 1.5,
                      borderRadius: "12px",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      bgcolor: DARK,
                      color: "#FFFFFF",
                      "&:hover": { bgcolor: GOLD, color: DARK, boxShadow: `0 8px 24px rgba(201,169,110,0.35)` },
                      transition: "all 0.25s ease",
                    }}
                  >
                    Start Shopping
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(ROUTES.aiStylist)}
                    sx={{
                      px: 3.5,
                      py: 1.5,
                      borderRadius: "12px",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: DARK,
                      borderColor: "rgba(0,0,0,0.18)",
                      bgcolor: "#FFFFFF",
                      "&:hover": { borderColor: GOLD, color: GOLD_DARK, bgcolor: "rgba(201,169,110,0.06)" },
                      transition: "all 0.25s ease",
                    }}
                  >
                    Build Your Outfit →
                  </Button>
                </Stack>

                {/* stats */}
                <Stack
                  direction="row"
                  spacing={0}
                  divider={
                    <Box sx={{ width: "1px", bgcolor: "rgba(0,0,0,0.08)", mx: 3, alignSelf: "stretch" }} />
                  }
                  sx={{ mt: 2 }}
                >
                  {[
                    { value: 10000, suffix: "+", label: "Styles" },
                    { value: 500, suffix: "+", label: "Brands" },
                    { value: 48, suffix: "hr", label: "Delivery" },
                  ].map((stat) => (
                    <Box key={stat.label}>
                      <Typography
                        sx={{ fontWeight: 800, fontSize: "1.5rem", color: DARK, lineHeight: 1 }}
                      >
                        <CountUp target={stat.value} suffix={stat.suffix} />
                      </Typography>
                      <Typography sx={{ fontSize: "0.72rem", color: "#64748B", mt: 0.4, letterSpacing: "0.06em", fontWeight: 600 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Grid>

            {/* ── RIGHT: 3D rotating card stack (scaled down & proportional on mobile) ── */}
            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: { xs: 4, md: 0 },
                mb: { xs: 4, md: 0 },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 260, sm: 320, md: 380, lg: 400 },
                  height: { xs: 350, sm: 430, md: 510, lg: 540 },
                  perspective: { xs: "800px", md: "1200px" },
                }}
              >
                {HERO_SLIDES.map((slide, i) => {
                  const offset = (i - activeSlide + HERO_SLIDES.length) % HERO_SLIDES.length;
                  /* Proportional 3D transforms for mobile & desktop */
                  const transformsMobile: Record<number, string> = {
                    0: "rotateY(0deg) translateZ(0px) scale(1)",
                    1: "rotateY(18deg) translateZ(-50px) translateX(45px) scale(0.9)",
                    2: "rotateY(-18deg) translateZ(-50px) translateX(-45px) scale(0.9)",
                  };
                  const transformsDesktop: Record<number, string> = {
                    0: "rotateY(0deg) translateZ(0px) scale(1)",
                    1: "rotateY(28deg) translateZ(-120px) translateX(110px) scale(0.88)",
                    2: "rotateY(-28deg) translateZ(-120px) translateX(-110px) scale(0.88)",
                  };

                  const zIndexes: Record<number, number> = { 0: 3, 1: 2, 2: 1 };
                  const opacities: Record<number, number> = { 0: 1, 1: 0.7, 2: 0.5 };

                  return (
                    <Box
                      key={slide.img}
                      onClick={() => setActiveSlide(i)}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: { xs: "18px", md: "24px" },
                        overflow: "hidden",
                        transformStyle: "preserve-3d",
                        transform: {
                          xs: transformsMobile[offset] ?? transformsMobile[2],
                          md: transformsDesktop[offset] ?? transformsDesktop[2],
                        },
                        zIndex: zIndexes[offset] ?? 1,
                        opacity: opacities[offset] ?? 0.4,
                        transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.7s ease",
                        cursor: offset === 0 ? "default" : "pointer",
                        boxShadow:
                          offset === 0
                            ? "0 24px 48px rgba(0,0,0,0.16), 0 0 0 1px rgba(201,169,110,0.3)"
                            : "0 12px 24px rgba(0,0,0,0.08)",
                      }}
                    >
                      {/* image */}
                      <Box
                        component="img"
                        src={slide.img}
                        alt={slide.label}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      {/* gradient overlay */}
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.1) 55%, transparent 100%)",
                        }}
                      />
                      {/* card footer info */}
                      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: { xs: 2, md: 3 } }}>
                        <Chip
                          label={slide.label}
                          size="small"
                          sx={{
                            bgcolor: "rgba(201,169,110,0.9)",
                            color: DARK,
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            border: "1px solid rgba(201,169,110,0.4)",
                            mb: 0.75,
                          }}
                        />
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "white",
                            fontSize: { xs: "0.95rem", md: "1.1rem" },
                            lineHeight: 1.2,
                          }}
                        >
                          {slide.caption}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}

                {/* dot indicators */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    position: "absolute",
                    bottom: { xs: -24, md: -32 },
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                  }}
                >
                  {HERO_SLIDES.map((_, i) => (
                    <Box
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      sx={{
                        width: i === activeSlide ? 24 : 8,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: i === activeSlide ? GOLD_DARK : "rgba(0,0,0,0.2)",
                        cursor: "pointer",
                        transition: "all 0.4s ease",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* scroll indicator */}
        <Box
          sx={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.75,
            opacity: 0.5,
            animation: "bounce 2s ease infinite",
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
              "50%": { transform: "translateX(-50%) translateY(8px)" },
            },
          }}
        >
          <Typography sx={{ fontSize: "0.65rem", color: "#64748B", letterSpacing: "0.1em", fontWeight: 700 }}>SCROLL</Typography>
          <Box sx={{ width: 1, height: 32, bgcolor: "#94A3B8", borderRadius: 1 }} />
        </Box>
      </Box>

      {/* ════════════════════════════════════════════════════════════════════
          FEATURES STRIP (Light Mode)
      ════════════════════════════════════════════════════════════════════ */}
      <Box sx={{ bgcolor: CARD_BG, borderBottom: `1px solid ${BORDER_LIGHT}` }}>
        <Container maxWidth="xl">
          <Grid container>
            {[
              { icon: <CheckroomIcon />, text: "Model-Curated Outfits" },
              { icon: <AutoAwesomeIcon />, text: "Build Your Outfit (AI)" },
              { icon: <LocalShippingOutlinedIcon />, text: "48-Hour Delivery" },
              { icon: <StoreIcon />, text: "500+ Verified Brands" },
            ].map((item, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i}>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{
                    py: 2.5,
                    px: 3,
                    borderRight: i < 3 ? `1px solid ${BORDER_LIGHT}` : "none",
                    "& svg": { color: GOLD_DARK, fontSize: 22 },
                  }}
                >
                  {item.icon}
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>
                    {item.text}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════════════════════════════
          TRENDING NOW (Light Mode)
      ════════════════════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: BG_PAGE }}>
        <Container maxWidth="xl">
          <Stack spacing={5}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
              <Box>
                <SectionLabel>Trending in 2026</SectionLabel>
                <Typography variant="h3" sx={{ fontWeight: 800, color: DARK, letterSpacing: "-0.02em" }}>
                  Trending in 2026
                </Typography>
                <Typography sx={{ color: "#64748B", mt: 0.5 }}>
                  The defining looks, cuts, and staples setting the pace this year in Nairobi
                </Typography>
              </Box>
              <Button
                variant="text"
                endIcon={<NorthEastIcon />}
                onClick={() => navigate(ROUTES.customerDashboard)}
                sx={{ display: { xs: "none", md: "flex" }, color: DARK, fontWeight: 700, "&:hover": { color: GOLD_DARK } }}
              >
                View All
              </Button>
            </Stack>

            {trendingLoading ? (
              <MasonryGrid columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
                {[...Array(6)].map((_, i) => (
                  <LoadingSkeleton key={i} height={400} />
                ))}
              </MasonryGrid>
            ) : (
              <MasonryGrid columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}>
                {trendingProducts?.items.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} variant="trending" size="large" />
                ))}
              </MasonryGrid>
            )}

            <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center" }}>
              <Button variant="outlined" endIcon={<ArrowForwardIcon />} onClick={() => navigate(ROUTES.customerDashboard)} fullWidth sx={{ borderColor: DARK, color: DARK }}>
                View All Products
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════════════════════════════
          SHOP BY CATEGORY (Light Mode)
      ════════════════════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: BG_ALT, borderTop: `1px solid ${BORDER_LIGHT}`, borderBottom: `1px solid ${BORDER_LIGHT}` }}>
        <Container maxWidth="xl">
          <Stack spacing={6}>
            <Box sx={{ textAlign: "center" }}>
              <SectionLabel>Categories</SectionLabel>
              <Typography variant="h3" sx={{ fontWeight: 800, color: DARK, letterSpacing: "-0.02em" }}>
                Shop by Style
              </Typography>
              <Typography sx={{ color: "#64748B", mt: 0.5 }}>
                Find exactly what you're looking for
              </Typography>
            </Box>

            {categoriesLoading ? (
              <Grid container spacing={3}>
                {[...Array(4)].map((_, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                    <LoadingSkeleton height={220} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={2}>
                {categories?.slice(0, 8).map((category, i) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={category.id}>
                    <Box
                      onClick={() => navigate(`${ROUTES.categories}/${category.slug}`)}
                      sx={{
                        position: "relative",
                        height: { xs: 160, md: 220 },
                        borderRadius: "16px",
                        overflow: "hidden",
                        cursor: "pointer",
                        border: `1px solid ${BORDER_LIGHT}`,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                        "&:hover .cat-overlay": { opacity: 1 },
                        "&:hover .cat-img": { transform: "scale(1.07)" },
                        "&:hover": { boxShadow: `0 8px 28px rgba(0,0,0,0.12), 0 0 0 1.5px ${GOLD}` },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {category.image ? (
                        <Box
                          component="img"
                          className="cat-img"
                          src={category.image}
                          alt={category.name}
                          sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", display: "block" }}
                        />
                      ) : (
                        <Box
                          className="cat-img"
                          sx={{
                            width: "100%",
                            height: "100%",
                            background: `linear-gradient(135deg, #e5e5e5 ${i * 8}%, #f0f0f0 100%)`,
                            transition: "transform 0.5s ease",
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)",
                        }}
                      />
                      <Box
                        className="cat-overlay"
                        sx={{
                          position: "absolute",
                          inset: 0,
                          bgcolor: "rgba(201,169,110,0.12)",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                        }}
                      />
                      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 2 }}>
                        <Typography sx={{ fontWeight: 700, color: "white", fontSize: "0.95rem", letterSpacing: "0.02em" }}>
                          {category.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Stack>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════════════════════════════
          BRANDS (Light Mode)
      ════════════════════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: BG_PAGE }}>
        <Container maxWidth="xl">
          <Stack spacing={6}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
              <Box>
                <SectionLabel>Brands</SectionLabel>
                <Typography variant="h3" sx={{ fontWeight: 800, color: DARK, letterSpacing: "-0.02em" }}>
                  Curated Collections
                </Typography>
                <Typography sx={{ color: "#64748B", mt: 0.5 }}>
                  Discover leading African and international fashion labels
                </Typography>
              </Box>
            </Stack>

            {brandsLoading ? (
              <Grid container spacing={3}>
                {[...Array(6)].map((_, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                    <LoadingSkeleton height={100} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={2}>
                {brands?.slice(0, 6).map((brand) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={brand.id}>
                    <Box
                      onClick={() => navigate(`${ROUTES.brands}/${brand.slug}`)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2.5,
                        borderRadius: "16px",
                        bgcolor: "#FFFFFF",
                        border: "1px solid rgba(0,0,0,0.07)",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          borderColor: GOLD,
                          boxShadow: `0 10px 24px rgba(0,0,0,0.08)`,
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: "12px",
                          bgcolor: brand.logo ? "transparent" : alpha(GOLD, 0.12),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          flexShrink: 0,
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        {brand.logo ? (
                          <Box component="img" src={brand.logo} alt={brand.name} sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        ) : (
                          <Typography sx={{ fontWeight: 800, color: GOLD_DARK, fontSize: "1.2rem" }}>
                            {brand.name.charAt(0)}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, color: DARK }}>
                          {brand.name}
                        </Typography>
                        {brand.description && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#64748B",
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {brand.description}
                          </Typography>
                        )}
                      </Box>
                      <NorthEastIcon sx={{ fontSize: 18, color: "rgba(0,0,0,0.25)" }} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Stack>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════════════════════════════
          FEATURED STORES (Light Mode)
      ════════════════════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: BG_ALT, borderTop: `1px solid ${BORDER_LIGHT}`, borderBottom: `1px solid ${BORDER_LIGHT}` }}>
        <Container maxWidth="xl">
          <Stack spacing={6}>
            <Box sx={{ textAlign: "center" }}>
              <SectionLabel>Stores</SectionLabel>
              <Typography variant="h3" sx={{ fontWeight: 800, color: DARK, letterSpacing: "-0.02em" }}>
                Meet Our Vendors
              </Typography>
              <Typography sx={{ color: "#64748B", mt: 0.5 }}>
                Kenya's finest fashion retailers, all in one place
              </Typography>
            </Box>

            {vendorsLoading ? (
              <Grid container spacing={3}>
                {[...Array(3)].map((_, i) => (
                  <Grid size={{ xs: 12, md: 4 }} key={i}>
                    <LoadingSkeleton height={300} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {vendors?.slice(0, 3).map((vendor) => (
                  <Grid size={{ xs: 12, md: 4 }} key={vendor.id}>
                    <Card
                      sx={{
                        height: "100%",
                        bgcolor: "#FFFFFF",
                        border: "1px solid rgba(0,0,0,0.08)",
                        borderRadius: "20px",
                        overflow: "hidden",
                        cursor: "pointer",
                        boxShadow: "0 4px 18px rgba(0,0,0,0.04)",
                        transition: "all 0.3s ease",
                        "&:hover": { borderColor: GOLD, transform: "translateY(-4px)", boxShadow: `0 16px 36px rgba(0,0,0,0.1)` },
                      }}
                    >
                      <Box sx={{ height: 180, position: "relative", overflow: "hidden" }}>
                        {vendor.coverImage ? (
                          <CardMedia component="img" image={vendor.coverImage} alt={vendor.businessName} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <Box sx={{ width: "100%", height: "100%", background: `linear-gradient(135deg, rgba(201,169,110,0.15) 0%, rgba(201,169,110,0.05) 100%)` }} />
                        )}
                        {vendor.isVerified && (
                          <Chip
                            label="Verified ✓"
                            size="small"
                            sx={{ position: "absolute", top: 14, right: 14, bgcolor: GOLD, color: DARK, fontWeight: 700, fontSize: "0.65rem" }}
                          />
                        )}
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                          <Box
                            sx={{
                              width: 46,
                              height: 46,
                              borderRadius: "12px",
                              bgcolor: vendor.logo ? "transparent" : alpha(GOLD, 0.12),
                              border: "1px solid rgba(0,0,0,0.08)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            {vendor.logo ? (
                              <Box component="img" src={vendor.logo} alt={vendor.businessName} sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
                            ) : (
                              <Typography sx={{ fontWeight: 800, color: GOLD_DARK }}>{vendor.businessName.charAt(0)}</Typography>
                            )}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 700, color: DARK }}>{vendor.businessName}</Typography>
                            <Typography sx={{ fontSize: "0.78rem", color: "#64748B" }}>{vendor.location}</Typography>
                          </Box>
                        </Stack>
                        {vendor.description && (
                          <Typography
                            sx={{
                              color: "#475569",
                              fontSize: "0.85rem",
                              lineHeight: 1.6,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              mb: 2,
                            }}
                          >
                            {vendor.description}
                          </Typography>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            borderColor: "rgba(0,0,0,0.15)",
                            color: DARK,
                            borderRadius: "10px",
                            fontWeight: 600,
                            "&:hover": { borderColor: GOLD, color: GOLD_DARK, bgcolor: "rgba(201,169,110,0.08)" },
                          }}
                        >
                          Visit Store →
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Stack>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════════════════════════════
          NEW ARRIVALS (Light Mode)
      ════════════════════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: BG_PAGE }}>
        <Container maxWidth="xl">
          <Stack spacing={5}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
              <Box>
                <SectionLabel>New Arrivals</SectionLabel>
                <Typography variant="h3" sx={{ fontWeight: 800, color: DARK, letterSpacing: "-0.02em" }}>
                  Just Dropped
                </Typography>
                <Typography sx={{ color: "#64748B", mt: 0.5 }}>
                  Fresh styles just landed in our collection
                </Typography>
              </Box>
              <Button
                variant="text"
                endIcon={<NorthEastIcon />}
                onClick={() => navigate(ROUTES.customerDashboard)}
                sx={{ display: { xs: "none", md: "flex" }, color: DARK, fontWeight: 700, "&:hover": { color: GOLD_DARK } }}
              >
                View All
              </Button>
            </Stack>

            {newLoading ? (
              <MasonryGrid columns={{ xs: 2, sm: 2, md: 3, lg: 4 }}>
                {[...Array(4)].map((_, i) => (
                  <LoadingSkeleton key={i} height={340} />
                ))}
              </MasonryGrid>
            ) : (
              <MasonryGrid columns={{ xs: 2, sm: 2, md: 3, lg: 4 }}>
                {newProducts?.items.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} variant="compact" size="medium" />
                ))}
              </MasonryGrid>
            )}
          </Stack>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════════════════════════════
          AI STYLIST BANNER (Light Mode)
      ════════════════════════════════════════════════════════════════════ */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(135deg, #FAF7F2 0%, #F5ECE0 50%, #FAF6EE 100%)`,
          position: "relative",
          overflow: "hidden",
          borderTop: `1px solid ${BORDER_LIGHT}`,
          borderBottom: `1px solid ${BORDER_LIGHT}`,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 60% 80% at 80% 50%, rgba(201,169,110,0.18) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="xl" sx={{ position: "relative" }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <SectionLabel>AI-Powered</SectionLabel>
              <Typography variant="h2" sx={{ fontWeight: 900, color: DARK, letterSpacing: "-0.03em", mt: 1, mb: 2 }}>
                Build Your Outfit with{" "}
                <Box component="span" sx={{ background: `linear-gradient(135deg, ${GOLD_DARK}, #C9A96E)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  AI Precision
                </Box>
              </Typography>
              <Typography sx={{ color: "#475569", fontSize: "1.1rem", lineHeight: 1.7, mb: 4, maxWidth: 520 }}>
                Tell us your occasion, body type, and style goals. We'll curate a complete outfit — head to toe — with matching pieces from our catalog ready to add to your cart instantly.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate(ROUTES.aiStylist)}
                  sx={{
                    px: 4,
                    py: 1.75,
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    bgcolor: DARK,
                    color: "#FFFFFF",
                    "&:hover": { bgcolor: GOLD, color: DARK, boxShadow: `0 8px 24px rgba(201,169,110,0.35)` },
                  }}
                >
                  Build Your Outfit Free →
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate(ROUTES.customerDashboard)}
                  sx={{
                    px: 4,
                    py: 1.75,
                    borderRadius: "12px",
                    fontWeight: 600,
                    color: DARK,
                    borderColor: "rgba(0,0,0,0.2)",
                    bgcolor: "#FFFFFF",
                    "&:hover": { borderColor: GOLD, color: GOLD_DARK },
                  }}
                >
                  Browse Catalog
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} sx={{ display: "flex", justifyContent: "center", mt: { xs: 4, md: 0 }, width: "100%" }}>
              <Stack spacing={1.5} sx={{ width: "100%", maxWidth: { xs: 340, sm: 400, md: 440 } }}>
                {["Occasion: Business Casual", "Budget: KES 5,000–15,000", "Style: Modern Minimalist"].map((tag, i) => (
                  <Box
                    key={tag}
                    sx={{
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1.2, sm: 1.5 },
                      bgcolor: "rgba(255,255,255,0.9)",
                      border: "1px solid rgba(201,169,110,0.28)",
                      borderRadius: "12px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      transform: { xs: "none", md: `translateX(${[0, 20, -10][i]}px)` },
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 16, color: GOLD_DARK }} />
                    <Typography sx={{ color: "#334155", fontSize: { xs: "0.82rem", sm: "0.9rem" }, fontWeight: 600 }}>{tag}</Typography>
                  </Box>
                ))}
                <Box
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1.5, sm: 2 },
                    bgcolor: alpha(GOLD, 0.16),
                    border: `1px solid ${alpha(GOLD, 0.35)}`,
                    borderRadius: "12px",
                    mt: 1,
                    transform: { xs: "none", md: "translateX(10px)" },
                  }}
                >
                  <Typography sx={{ color: GOLD_DARK, fontWeight: 700, fontSize: { xs: "0.8rem", sm: "0.85rem" } }}>
                    ✨ Generating your perfect outfit…
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ════════════════════════════════════════════════════════════════════
          NEWSLETTER (Light Mode)
      ════════════════════════════════════════════════════════════════════ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: BG_PAGE }}>
        <Container maxWidth="md">
          <Stack spacing={4} alignItems="center" textAlign="center">
            <SectionLabel>Newsletter</SectionLabel>
            <Typography variant="h3" sx={{ fontWeight: 800, color: DARK, letterSpacing: "-0.02em" }}>
              Stay Ahead of the Trend
            </Typography>
            <Typography sx={{ color: "#64748B", maxWidth: 480, lineHeight: 1.7 }}>
              Get early access to new collections, exclusive offers, and style tips curated by our AI every week.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: "100%", maxWidth: 480 }}>
              <TextField
                fullWidth
                placeholder="Your email address"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 52,
                    borderRadius: "12px",
                    bgcolor: BG_ALT,
                    "& fieldset": { borderColor: "rgba(0,0,0,0.12)" },
                    "&:hover fieldset": { borderColor: GOLD },
                    "&.Mui-focused fieldset": { borderColor: GOLD },
                  },
                }}
              />
              <Button
                variant="contained"
                size="large"
                sx={{
                  height: 52,
                  px: 3.5,
                  borderRadius: "12px",
                  fontWeight: 700,
                  bgcolor: DARK,
                  color: "#FFFFFF",
                  minWidth: { xs: "100%", sm: 140 },
                  "&:hover": { bgcolor: GOLD, color: DARK },
                  transition: "all 0.25s ease",
                }}
              >
                Subscribe
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
