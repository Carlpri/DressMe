import { useState } from "react";
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
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { useProducts } from "../../hooks/useProducts";
import { ProductCard } from "../../components/shared/ProductCard";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";

const STYLE_OPTIONS = [
  "Casual",
  "Formal",
  "Streetwear",
  "Bohemian",
  "Minimalist",
  "Vintage",
  "Athleisure",
  "Business",
];

const OCCASION_OPTIONS = [
  "Everyday",
  "Work",
  "Party",
  "Date Night",
  "Weekend",
  "Special Event",
  "Travel",
];

const SEASON_OPTIONS = [
  "Spring",
  "Summer",
  "Fall",
  "Winter",
  "All Season",
];

export function AIStylistPage() {
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [preferences, setPreferences] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const searchTerms = [selectedStyle, selectedOccasion, selectedSeason, preferences]
    .filter(Boolean)
    .join(" ");

  const { data: recommendations, isLoading: recommendationsLoading } = useProducts({
    search: hasSearched && searchTerms ? searchTerms : undefined,
    limit: 8,
    sort: "popular",
    featured: hasSearched && !searchTerms ? true : undefined,
  });

  const handleGenerateOutfit = () => {
    setHasSearched(true);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={6}>
        <Box sx={{ textAlign: "center" }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "primary.main",
              margin: "0 auto 16px",
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            AI Stylist
          </Typography>
          <Typography color="text.secondary" maxWidth={600} mx="auto">
            Get personalized fashion recommendations based on your style, occasion, and preferences.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={3}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <PsychologyIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Style Preferences
                    </Typography>
                  </Stack>

                  <FormControl fullWidth>
                    <InputLabel>Style</InputLabel>
                    <Select
                      value={selectedStyle}
                      label="Style"
                      onChange={(e) => setSelectedStyle(e.target.value)}
                    >
                      <MenuItem value="">Select style</MenuItem>
                      {STYLE_OPTIONS.map((style) => (
                        <MenuItem key={style} value={style}>
                          {style}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Occasion</InputLabel>
                    <Select
                      value={selectedOccasion}
                      label="Occasion"
                      onChange={(e) => setSelectedOccasion(e.target.value)}
                    >
                      <MenuItem value="">Select occasion</MenuItem>
                      {OCCASION_OPTIONS.map((occasion) => (
                        <MenuItem key={occasion} value={occasion}>
                          {occasion}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Season</InputLabel>
                    <Select
                      value={selectedSeason}
                      label="Season"
                      onChange={(e) => setSelectedSeason(e.target.value)}
                    >
                      <MenuItem value="">Select season</MenuItem>
                      {SEASON_OPTIONS.map((season) => (
                        <MenuItem key={season} value={season}>
                          {season}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Additional Preferences"
                    placeholder="e.g., colors, brands, specific items"
                    multiline
                    rows={3}
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                  />

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={handleGenerateOutfit}
                    disabled={!selectedStyle && !selectedOccasion && !preferences.trim()}
                    fullWidth
                  >
                    Get Recommendations
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={4}>
              {!hasSearched ? (
                <Alert severity="info">
                  Select your style preferences and click &quot;Get Recommendations&quot; to see matching products.
                </Alert>
              ) : recommendationsLoading ? (
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Personalized Recommendations
                  </Typography>
                  <Grid container spacing={2}>
                    {[...Array(4)].map((_, i) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={i}>
                        <LoadingSkeleton height={250} />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              ) : recommendations && recommendations.items.length > 0 ? (
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Personalized Recommendations
                  </Typography>
                  <Grid container spacing={2}>
                    {recommendations.items.map((product) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={product.id}>
                        <ProductCard product={product} />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              ) : (
                <Alert severity="warning">
                  No products matched your preferences. Try adjusting your filters.
                </Alert>
              )}

              <Divider />

              <Box textAlign="center" py={2}>
                <Chip
                  icon={<AutoAwesomeIcon />}
                  label="AI recommendations powered by DressMe"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600, py: 2, px: 1, fontSize: "0.9rem" }}
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
