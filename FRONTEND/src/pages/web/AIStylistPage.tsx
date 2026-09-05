import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Paper,
  LinearProgress,
  Tabs,
  Tab,
  InputAdornment,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyIcon from "@mui/icons-material/Psychology";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import SparklesIcon from "@mui/icons-material/AutoFixHigh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useAuth } from "../../hooks/useAuth";
import {
  aiService,
  type AIStylistResponseData,
  type AISearchResponseData,
} from "../../services/ai.service";
import { ProductCard } from "../../components/shared/ProductCard";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import type { Product } from "../../types/product";

const STYLE_OPTIONS = [
  "Casual",
  "Formal",
  "Streetwear",
  "Bohemian",
  "Minimalist",
  "Vintage",
  "Athleisure",
  "Business Casual",
];

const OCCASION_OPTIONS = [
  "Everyday",
  "Work & Office",
  "Campus",
  "Party & Night Out",
  "Date Night",
  "Weekend Hangout",
  "Special Event / Wedding",
  "Travel & Vacation",
];

const SEASON_OPTIONS = [
  "Warm / Sunny",
  "Cool / Rainy",
  "Hot / Summer",
  "Cold / Chilly",
  "All Season",
];

const QUICK_PROMPTS = [
  {
    label: "Campus Streetwear",
    style: "Streetwear",
    occasion: "Campus",
    season: "Warm / Sunny",
    gender: "UNISEX" as const,
    pref: "Comfortable oversized fit with sneakers",
  },
  {
    label: "Men's Smart Office",
    style: "Business Casual",
    occasion: "Work & Office",
    season: "All Season",
    gender: "MALE" as const,
    pref: "Polished neutral tones with crisp formal shirts",
  },
  {
    label: "Women's Date Night",
    style: "Minimalist",
    occasion: "Date Night",
    season: "All Season",
    gender: "FEMALE" as const,
    pref: "Sleek and elevated dresses with statement accents",
  },
  {
    label: "Weekend Brunch",
    style: "Casual",
    occasion: "Weekend Hangout",
    season: "Warm / Sunny",
    gender: "" as const,
    pref: "Chic and relaxed with stylish footwear",
  },
];

const QUICK_SEARCH_EXAMPLES = [
  "Black men's sneakers under 3000",
  "Women's dress for date night under 2500",
  "White sneakers",
  "Smart office shirt for men",
  "African wear outfit",
];

export function AIStylistPage() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<0 | 1>(0);

  // Stylist Form States
  const [selectedGender, setSelectedGender] = useState<"" | "MALE" | "FEMALE" | "UNISEX">("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [preferences, setPreferences] = useState("");

  const [loadingStylist, setLoadingStylist] = useState(false);
  const [stylistError, setStylistError] = useState<string | null>(null);
  const [stylistResult, setStylistResult] = useState<AIStylistResponseData | null>(null);
  const [hasRequestedStylist, setHasRequestedStylist] = useState(false);

  // Search Form States
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<AISearchResponseData | null>(null);
  const [hasRequestedSearch, setHasRequestedSearch] = useState(false);

  const applyQuickPrompt = (prompt: typeof QUICK_PROMPTS[number]) => {
    setSelectedStyle(prompt.style);
    setSelectedOccasion(prompt.occasion);
    setSelectedSeason(prompt.season);
    setSelectedGender(prompt.gender);
    setPreferences(prompt.pref);
    setStylistError(null);
  };

  const handleResetStylist = () => {
    setSelectedGender("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedStyle("");
    setSelectedOccasion("");
    setSelectedSeason("");
    setPreferences("");
    setStylistError(null);
    setStylistResult(null);
    setHasRequestedStylist(false);
  };

  const handleGenerateOutfit = async () => {
    if (
      !selectedStyle &&
      !selectedOccasion &&
      !selectedSeason &&
      !selectedGender &&
      !minPrice &&
      !maxPrice &&
      !preferences.trim()
    ) {
      setStylistError("Please select at least one styling preference or filter.");
      return;
    }

    const parsedMin = minPrice ? parseFloat(minPrice) : undefined;
    const parsedMax = maxPrice ? parseFloat(maxPrice) : undefined;

    if (parsedMin !== undefined && parsedMax !== undefined && parsedMin > parsedMax) {
      setStylistError("Minimum budget cannot be higher than maximum budget.");
      return;
    }

    setLoadingStylist(true);
    setStylistError(null);
    setHasRequestedStylist(true);

    try {
      const data = await aiService.getStylistRecommendations({
        style: selectedStyle || undefined,
        occasion: selectedOccasion || undefined,
        season: selectedSeason || undefined,
        gender: selectedGender || undefined,
        priceMin: parsedMin,
        priceMax: parsedMax,
        preferences: preferences.trim() || undefined,
      });

      setStylistResult(data);

      if (window.innerWidth < 900) {
        setTimeout(() => {
          document.getElementById("recommendations-section")?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    } catch (err: unknown) {
      const errObj = err as Error;
      setStylistError(errObj.message || "Unable to generate styling recommendations. Please try again.");
    } finally {
      setLoadingStylist(false);
    }
  };

  const handleSearchAI = async (customQuery?: string) => {
    const q = (customQuery || searchQuery).trim();
    if (!q) {
      setSearchError("Please enter what you are looking for.");
      return;
    }

    if (customQuery) {
      setSearchQuery(customQuery);
    }

    setLoadingSearch(true);
    setSearchError(null);
    setHasRequestedSearch(true);

    try {
      const data = await aiService.searchProducts(q);
      setSearchResult(data);

      if (window.innerWidth < 900) {
        setTimeout(() => {
          document.getElementById("search-results-section")?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    } catch (err: unknown) {
      const errObj = err as Error;
      setSearchError(errObj.message || "Unable to search catalog. Please try again.");
    } finally {
      setLoadingSearch(false);
    }
  };

  const getProductsForOutfit = (productIds: string[]): Product[] => {
    if (!stylistResult?.products) return [];
    const productMap = new Map(stylistResult.products.map((p) => [p.id, p]));
    return productIds
      .map((id) => productMap.get(id))
      .filter((p): p is Product => Boolean(p));
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
      <Stack spacing={4}>
        {/* Hero Header */}
        <Box sx={{ textAlign: "center", position: "relative" }}>
          <Avatar
            sx={{
              width: 76,
              height: 76,
              bgcolor: "#00C896",
              color: "#07130F",
              margin: "0 auto 16px",
              boxShadow: "0 10px 30px rgba(0, 200, 150, 0.4)",
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "2.75rem" },
              mb: 1.5,
              letterSpacing: "-0.02em",
              color: "text.primary",
            }}
          >
            DressMe AI Shopping Assistant
          </Typography>
          <Typography
            color="text.secondary"
            maxWidth={680}
            mx="auto"
            sx={{ fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.6 }}
          >
            Ask for complete curated looks or search our marketplace using plain natural language.
            Everything is matched against real, in-stock products.
          </Typography>

          {/* Navigation Tabs */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                p: 0.5,
                borderRadius: "16px",
                bgcolor: "background.paper",
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, val) => setActiveTab(val)}
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  "& .MuiTab-root": {
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: "12px",
                    px: { xs: 2, sm: 3 },
                    py: 1,
                    minHeight: 44,
                  },
                }}
              >
                <Tab
                  icon={<CheckroomIcon sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  label="Outfit Builder"
                />
                <Tab
                  icon={<SearchIcon sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  label="Natural-Language Search (AI Discovery)"
                />
              </Tabs>
            </Paper>
          </Box>
        </Box>

        {/* TAB 0: CURATED OUTFITS */}
        {activeTab === 0 && (
          <Grid container spacing={4}>
            {/* Left Column: Preferences Form */}
            <Grid size={{ xs: 12, md: 4.5, lg: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 4,
                  position: { md: "sticky" },
                  top: 90,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Stack spacing={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <PsychologyIcon color="primary" sx={{ fontSize: 24 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Your Style Blueprint
                        </Typography>
                      </Stack>

                      {(selectedStyle ||
                        selectedOccasion ||
                        selectedSeason ||
                        selectedGender ||
                        minPrice ||
                        maxPrice ||
                        preferences) && (
                        <Button
                          size="small"
                          color="inherit"
                          startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />}
                          onClick={handleResetStylist}
                          sx={{ fontSize: "0.78rem", py: 0.2, px: 1, minWidth: "auto", opacity: 0.7 }}
                        >
                          Reset
                        </Button>
                      )}
                    </Stack>

                    {/* Quick Vibe Presets */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "text.secondary",
                          mb: 1,
                        }}
                      >
                        Quick Inspirations
                      </Typography>
                      <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap>
                        {QUICK_PROMPTS.map((qp) => (
                          <Chip
                            key={qp.label}
                            label={qp.label}
                            size="small"
                            onClick={() => applyQuickPrompt(qp)}
                            variant="outlined"
                            sx={{
                              borderRadius: "8px",
                              fontWeight: 600,
                              fontSize: "0.72rem",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              borderColor:
                                selectedStyle === qp.style && selectedOccasion === qp.occasion
                                  ? "#00C896"
                                  : "rgba(0,0,0,0.12)",
                              bgcolor:
                                selectedStyle === qp.style && selectedOccasion === qp.occasion
                                  ? "rgba(0, 200, 150, 0.1)"
                                  : "transparent",
                              "&:hover": {
                                borderColor: "#00C896",
                                bgcolor: "rgba(0, 200, 150, 0.08)",
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Shopping For (Gender) */}
                    <FormControl fullWidth size="medium">
                      <InputLabel id="gender-select-label">Shopping For</InputLabel>
                      <Select
                        labelId="gender-select-label"
                        value={selectedGender}
                        label="Shopping For"
                        onChange={(e) => setSelectedGender(e.target.value as any)}
                      >
                        <MenuItem value="">Anyone / All Collections</MenuItem>
                        <MenuItem value="MALE">Men&apos;s Fashion</MenuItem>
                        <MenuItem value="FEMALE">Women&apos;s Fashion</MenuItem>
                        <MenuItem value="UNISEX">Unisex / All-Gender</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Budget Filters */}
                    <Grid container spacing={1.5}>
                      <Grid size={{ xs: 6 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Min Budget"
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          placeholder="e.g. 500"
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                    KES
                                  </Typography>
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Max Budget"
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          placeholder="e.g. 5000"
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                    KES
                                  </Typography>
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Aesthetic / Style */}
                    <FormControl fullWidth size="medium">
                      <InputLabel id="style-select-label">Aesthetic / Style</InputLabel>
                      <Select
                        labelId="style-select-label"
                        value={selectedStyle}
                        label="Aesthetic / Style"
                        onChange={(e) => setSelectedStyle(e.target.value)}
                      >
                        <MenuItem value="">Any Style</MenuItem>
                        {STYLE_OPTIONS.map((style) => (
                          <MenuItem key={style} value={style}>
                            {style}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Occasion / Setting */}
                    <FormControl fullWidth size="medium">
                      <InputLabel id="occasion-select-label">Occasion / Setting</InputLabel>
                      <Select
                        labelId="occasion-select-label"
                        value={selectedOccasion}
                        label="Occasion / Setting"
                        onChange={(e) => setSelectedOccasion(e.target.value)}
                      >
                        <MenuItem value="">Any Occasion</MenuItem>
                        {OCCASION_OPTIONS.map((occasion) => (
                          <MenuItem key={occasion} value={occasion}>
                            {occasion}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Season / Weather */}
                    <FormControl fullWidth size="medium">
                      <InputLabel id="season-select-label">Season / Weather</InputLabel>
                      <Select
                        labelId="season-select-label"
                        value={selectedSeason}
                        label="Season / Weather"
                        onChange={(e) => setSelectedSeason(e.target.value)}
                      >
                        <MenuItem value="">Any Season</MenuItem>
                        {SEASON_OPTIONS.map((season) => (
                          <MenuItem key={season} value={season}>
                            {season}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Notes / Preferences */}
                    <Box>
                      <TextField
                        fullWidth
                        label="Notes & Specific Preferences"
                        placeholder="e.g., I prefer earthy neutrals, relaxed silhouettes, black sneakers, or gold jewelry"
                        multiline
                        rows={3}
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        slotProps={{ htmlInput: { maxLength: 500 } }}
                      />
                      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 0.5 }}>
                        <Typography
                          variant="caption"
                          sx={{ color: preferences.length > 450 ? "error.main" : "text.secondary" }}
                        >
                          {preferences.length}/500
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Action Buttons */}
                    {isAuthenticated ? (
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={
                          loadingStylist ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <SparklesIcon sx={{ fontSize: "20px !important" }} />
                          )
                        }
                        onClick={handleGenerateOutfit}
                        disabled={
                          loadingStylist ||
                          (!selectedStyle &&
                            !selectedOccasion &&
                            !selectedSeason &&
                            !selectedGender &&
                            !minPrice &&
                            !maxPrice &&
                            !preferences.trim())
                        }
                        fullWidth
                        sx={{
                          py: 1.5,
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          borderRadius: "10px",
                          bgcolor: "#00C896",
                          color: "#07130F",
                          "&:hover": {
                            bgcolor: "#00E0A7",
                          },
                        }}
                      >
                        {loadingStylist ? "Styling Your Looks..." : "Generate My Outfits"}
                      </Button>
                    ) : (
                      <Stack spacing={1.5}>
                        <Alert
                          severity="info"
                          icon={<LockOutlinedIcon fontSize="inherit" />}
                          sx={{ borderRadius: 2, fontSize: "0.85rem" }}
                        >
                          Sign in to get personalized AI styling recommendations.
                        </Alert>
                        <Button
                          component={RouterLink}
                          to="/auth"
                          variant="contained"
                          size="large"
                          fullWidth
                          sx={{ py: 1.4, fontWeight: 700, borderRadius: "10px" }}
                        >
                          Sign In to Get Styled
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column: Output / Looks */}
            <Grid size={{ xs: 12, md: 7.5, lg: 8 }} id="recommendations-section">
              <Stack spacing={4}>
                {/* Error Banner */}
                {stylistError && (
                  <Alert severity="error" onClose={() => setStylistError(null)} sx={{ borderRadius: 3 }}>
                    {stylistError}
                  </Alert>
                )}

                {/* Initial / Empty State */}
                {!hasRequestedStylist && !loadingStylist && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: { xs: 4, sm: 6 },
                      textAlign: "center",
                      bgcolor: "background.paper",
                      borderRadius: 4,
                      borderStyle: "dashed",
                      borderColor: "rgba(0,0,0,0.15)",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        margin: "0 auto 16px",
                        bgcolor: "rgba(0, 200, 150, 0.12)",
                        color: "#00C896",
                      }}
                    >
                      <LightbulbOutlinedIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.01em" }}>
                      Let&apos;s Build Your Perfect Look
                    </Typography>
                    <Typography
                      color="text.secondary"
                      maxWidth={480}
                      mx="auto"
                      sx={{ lineHeight: 1.6, fontSize: "0.95rem" }}
                    >
                      Select your target gender, budget, occasion, or custom notes on the left. Our AI
                      Stylist will curate cohesive outfit sets drawn directly from DressMe&apos;s live inventory.
                    </Typography>
                  </Paper>
                )}

                {/* Loading State */}
                {loadingStylist && (
                  <Stack spacing={3}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: "background.paper",
                        border: "1px solid rgba(0, 200, 150, 0.35)",
                        boxShadow: "0 8px 24px rgba(0, 200, 150, 0.1)",
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <CircularProgress size={32} sx={{ color: "#00C896" }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                              DressMe Stylist is putting together your looks...
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Filtering active inventory by gender, budget & aesthetic guidelines.
                            </Typography>
                          </Box>
                        </Stack>
                        <LinearProgress color="primary" sx={{ height: 4, borderRadius: 2 }} />
                      </Stack>
                    </Paper>

                    <Grid container spacing={2}>
                      {[...Array(4)].map((_, i) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={i}>
                          <LoadingSkeleton height={380} />
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                )}

                {/* Results Presentation */}
                {stylistResult && !loadingStylist && (
                  <Stack spacing={4}>
                    {/* Stylist Advice Card */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 2.5, sm: 3.5 },
                        borderRadius: 4,
                        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                        color: "#FFFFFF",
                        boxShadow: "0 12px 36px rgba(15, 23, 42, 0.15)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar
                          sx={{
                            bgcolor: "#00C896",
                            color: "#07130F",
                            width: 44,
                            height: 44,
                            fontWeight: 800,
                          }}
                        >
                          <AutoAwesomeIcon sx={{ fontSize: 24 }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: 0.75 }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 800,
                                fontSize: "0.82rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "#00C896",
                              }}
                            >
                              Stylist Notes & Advice
                            </Typography>
                            <Chip
                              label="MiniMax AI"
                              size="small"
                              sx={{
                                bgcolor: "rgba(255, 255, 255, 0.1)",
                                color: "rgba(255, 255, 255, 0.7)",
                                fontSize: "0.68rem",
                                height: 20,
                              }}
                            />
                          </Stack>
                          <Typography
                            variant="body1"
                            sx={{
                              fontSize: { xs: "0.95rem", sm: "1.05rem" },
                              lineHeight: 1.6,
                              color: "rgba(255, 255, 255, 0.95)",
                            }}
                          >
                            {stylistResult.advice}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>

                    {/* Outfits Section */}
                    {stylistResult.outfits && stylistResult.outfits.length > 0 ? (
                      stylistResult.outfits.map((outfit, index) => {
                        const outfitProducts = getProductsForOutfit(outfit.productIds);

                        return (
                          <Card
                            key={index}
                            variant="outlined"
                            sx={{
                              borderRadius: 4,
                              overflow: "hidden",
                              border: "1px solid rgba(0,0,0,0.09)",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                              bgcolor: "background.paper",
                            }}
                          >
                            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                              <Stack spacing={3}>
                                <Box>
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ mb: 1 }}
                                  >
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Chip
                                        icon={<CheckroomIcon sx={{ fontSize: "15px !important" }} />}
                                        label={`Look #${index + 1}`}
                                        size="small"
                                        sx={{
                                          fontWeight: 800,
                                          fontSize: "0.75rem",
                                          bgcolor: "rgba(0, 200, 150, 0.15)",
                                          color: "#009E77",
                                        }}
                                      />
                                      <Typography
                                        variant="caption"
                                        sx={{ color: "text.secondary", fontWeight: 600 }}
                                      >
                                        {outfitProducts.length}{" "}
                                        {outfitProducts.length === 1 ? "item" : "items"}
                                      </Typography>
                                    </Stack>
                                  </Stack>

                                  <Typography
                                    variant="h5"
                                    component="h2"
                                    sx={{ fontWeight: 800, letterSpacing: "-0.01em", mb: 1 }}
                                  >
                                    {outfit.title}
                                  </Typography>

                                  <Paper
                                    variant="outlined"
                                    sx={{
                                      p: 1.5,
                                      borderRadius: 2,
                                      bgcolor: "rgba(248, 250, 252, 0.8)",
                                      border: "1px solid rgba(0,0,0,0.06)",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ fontStyle: "italic", lineHeight: 1.5 }}
                                    >
                                      &ldquo;{outfit.reason}&rdquo;
                                    </Typography>
                                  </Paper>
                                </Box>

                                <Divider />

                                <Grid container spacing={2.5}>
                                  {outfitProducts.map((product) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={product.id}>
                                      <ProductCard product={product} />
                                    </Grid>
                                  ))}
                                </Grid>
                              </Stack>
                            </CardContent>
                          </Card>
                        );
                      })
                    ) : (
                      <Alert
                        severity="info"
                        sx={{ borderRadius: 3, p: 2, fontSize: "0.95rem" }}
                      >
                        No complete looks could be assembled for those exact parameters. Try widening your budget or selecting an alternative aesthetic above!
                      </Alert>
                    )}

                    <Box textAlign="center" py={1}>
                      <Chip
                        icon={<AutoAwesomeIcon />}
                        label="All recommended pieces are live on DressMe"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600, py: 2, px: 1, fontSize: "0.85rem" }}
                      />
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Grid>
          </Grid>
        )}

        {/* TAB 1: NATURAL-LANGUAGE AI SEARCH */}
        {activeTab === 1 && (
          <Stack spacing={4} maxWidth={1000} mx="auto" width="100%" id="search-results-section">
            {/* Search Input Bar */}
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.08)",
                bgcolor: "background.paper",
              }}
            >
              <Stack spacing={2.5}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Search With Natural Language
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Describe exactly what you need with colors, budget, occasion, or style. Our AI extracts
                  your intent and queries our live PostgreSQL catalog.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <TextField
                    fullWidth
                    placeholder="e.g., Show me black men's sneakers under 3000"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loadingSearch) {
                        handleSearchAI();
                      }
                    }}
                    slotProps={{
                      htmlInput: { maxLength: 200 },
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="action" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  {isAuthenticated ? (
                    <Button
                      variant="contained"
                      size="large"
                      disabled={loadingSearch || !searchQuery.trim()}
                      onClick={() => handleSearchAI()}
                      startIcon={
                        loadingSearch ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SparklesIcon />
                        )
                      }
                      sx={{
                        px: 4,
                        py: { xs: 1.5, sm: "auto" },
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        borderRadius: "10px",
                        bgcolor: "#00C896",
                        color: "#07130F",
                        "&:hover": { bgcolor: "#00E0A7" },
                      }}
                    >
                      {loadingSearch ? "Searching..." : "AI Search"}
                    </Button>
                  ) : (
                    <Button
                      component={RouterLink}
                      to="/auth"
                      variant="contained"
                      size="large"
                      sx={{
                        px: 3,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        borderRadius: "10px",
                      }}
                    >
                      Sign In to Search
                    </Button>
                  )}
                </Stack>

                {/* Example Query Pills */}
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "text.secondary",
                      mb: 1,
                    }}
                  >
                    Try These Prompts
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {QUICK_SEARCH_EXAMPLES.map((ex) => (
                      <Chip
                        key={ex}
                        label={ex}
                        size="small"
                        onClick={() => handleSearchAI(ex)}
                        variant="outlined"
                        sx={{
                          cursor: "pointer",
                          fontWeight: 600,
                          borderRadius: "8px",
                          "&:hover": {
                            borderColor: "#00C896",
                            bgcolor: "rgba(0, 200, 150, 0.08)",
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Paper>

            {/* Error Display */}
            {searchError && (
              <Alert severity="error" onClose={() => setSearchError(null)} sx={{ borderRadius: 3 }}>
                {searchError}
              </Alert>
            )}

            {/* Loading Search State */}
            {loadingSearch && (
              <Stack spacing={3}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    border: "1px solid rgba(0, 200, 150, 0.35)",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CircularProgress size={28} sx={{ color: "#00C896" }} />
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        Interpreting search intent & querying database...
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Matching requested categories, colors, sizes, and price constraints.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                <Grid container spacing={3}>
                  {[...Array(4)].map((_, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                      <LoadingSkeleton height={380} />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            )}

            {/* Search Results */}
            {searchResult && !loadingSearch && (
              <Stack spacing={3}>
                {/* Extracted Intent Card */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: "rgba(248, 250, 252, 0.9)",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <FilterAltOutlinedIcon color="primary" sx={{ fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                      Interpreted AI Filters
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {searchResult.intent.gender && (
                      <Chip
                        label={`Gender: ${searchResult.intent.gender}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                      />
                    )}
                    {searchResult.intent.priceMax && (
                      <Chip
                        label={`Max Budget: KES ${searchResult.intent.priceMax.toLocaleString()}`}
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                      />
                    )}
                    {searchResult.intent.categories?.map((cat) => (
                      <Chip
                        key={cat}
                        label={`Category: ${cat}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    ))}
                    {searchResult.intent.colors?.map((col) => (
                      <Chip
                        key={col}
                        label={`Color: ${col}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    ))}
                    {searchResult.intent.style && (
                      <Chip
                        label={`Style: ${searchResult.intent.style}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                    {searchResult.intent.occasion && (
                      <Chip
                        label={`Occasion: ${searchResult.intent.occasion}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Stack>
                </Paper>

                {/* Product Grid */}
                {searchResult.products.length > 0 ? (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                      Found {searchResult.count} Matching{" "}
                      {searchResult.count === 1 ? "Product" : "Products"}
                    </Typography>

                    <Grid container spacing={3}>
                      {searchResult.products.map((product) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                          <ProductCard product={product} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ) : (
                  <Alert severity="info" sx={{ borderRadius: 3, p: 2 }}>
                    No products in the current live collection match those exact search parameters. Try a broader search or different keyword!
                  </Alert>
                )}
              </Stack>
            )}

            {/* Initial Empty Search State */}
            {!hasRequestedSearch && !loadingSearch && (
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 4, sm: 6 },
                  textAlign: "center",
                  bgcolor: "background.paper",
                  borderRadius: 4,
                  borderStyle: "dashed",
                  borderColor: "rgba(0,0,0,0.15)",
                }}
              >
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    margin: "0 auto 16px",
                    bgcolor: "rgba(0, 200, 150, 0.12)",
                    color: "#00C896",
                  }}
                >
                  <SearchIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  Find Fashion with Everyday Language
                </Typography>
                <Typography
                  color="text.secondary"
                  maxWidth={480}
                  mx="auto"
                  sx={{ lineHeight: 1.6, fontSize: "0.95rem" }}
                >
                  Type what you want to wear — mention clothing items, colors, occasions, or max budget in KES.
                  Our AI maps it to actual in-stock products in the catalog.
                </Typography>
              </Paper>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
