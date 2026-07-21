import { useState } from "react";
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
  useTheme,
  Chip,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";
import { useVendors } from "../../hooks/useVendors";
import { ROUTES } from "../../constants/routes";
import { ProductCard } from "../../components/shared/ProductCard";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { useSiteSettingsContext } from "../../contexts/SiteSettingsContext";

export function LandingPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { settings } = useSiteSettingsContext();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.customerDashboard}?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "70vh", md: "85vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          bgcolor: "#111827",
          ...(settings?.heroBannerUrl && {
            backgroundImage: `url(${settings.heroBannerUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }),
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "linear-gradient(135deg, rgba(0, 200, 150, 0.1) 0%, rgba(17, 24, 39, 0.8) 100%)",
            zIndex: 1,
          }}
        />
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <Stack spacing={4} alignItems="center" maxWidth={800} mx="auto">
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.5rem", md: "4rem", lg: "5rem" },
                lineHeight: 1.1,
                color: "white",
                letterSpacing: -0.02,
              }}
            >
              {settings?.tagline || "Your Style. Powered by AI. Inspired by You."}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                maxWidth: 600,
              }}
            >
              Discover fashion that speaks to your unique personality. AI-powered
              recommendations tailored just for you.
            </Typography>

            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                width: "100%",
                maxWidth: 600,
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <TextField
                fullWidth
                placeholder="Search for products, brands, or styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    height: 56,
                  },
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 2 }} />,
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  height: 56,
                  px: 4,
                  borderRadius: 2,
                  fontWeight: 700,
                  minWidth: { xs: "100%", sm: "auto" },
                }}
              >
                Search
              </Button>
            </Box>

            <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(ROUTES.customerDashboard)}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700,
                }}
              >
                Start Styling
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(ROUTES.categories)}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  color: "white",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Browse Collection
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Trending Products */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  Trending Now
                </Typography>
                <Typography color="text.secondary">
                  Discover what's popular in African fashion
                </Typography>
              </Box>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate(ROUTES.customerDashboard)}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                View All
              </Button>
            </Stack>

            {trendingLoading ? (
              <Grid container spacing={3}>
                {[...Array(4)].map((_, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                    <LoadingSkeleton height={400} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {trendingProducts?.items.slice(0, 8).map((product) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            )}

            <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "center" }}>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate(ROUTES.customerDashboard)}
                fullWidth
              >
                View All Products
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Featured Categories */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F8FAFC" }}>
        <Container maxWidth="xl">
          <Stack spacing={6}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Shop by Category
              </Typography>
              <Typography color="text.secondary">
                Explore our curated fashion collections
              </Typography>
            </Box>

            {categoriesLoading ? (
              <Grid container spacing={3}>
                {[...Array(4)].map((_, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                    <LoadingSkeleton height={200} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {categories?.slice(0, 8).map((category) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={category.id}>
                    <Card
                      sx={{
                        height: "100%",
                        cursor: "pointer",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                      onClick={() => navigate(`${ROUTES.categories}/${category.slug}`)}
                    >
                      <Box
                        sx={{
                          height: 180,
                          bgcolor: category.image
                            ? "transparent"
                            : `linear-gradient(135deg, ${theme.palette.primary.main}22 0%, ${theme.palette.primary.main}44 100%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {category.image && (
                          <CardMedia
                            component="img"
                            image={category.image}
                            alt={category.name}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            bgcolor: "rgba(0, 0, 0, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              color: "white",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: 1,
                            }}
                          >
                            {category.name}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Featured Brands */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Stack spacing={6}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Featured Brands
              </Typography>
              <Typography color="text.secondary">
                Discover fashion from leading African and international brands
              </Typography>
            </Box>

            {brandsLoading ? (
              <Grid container spacing={3}>
                {[...Array(6)].map((_, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                    <LoadingSkeleton height={120} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {brands?.slice(0, 6).map((brand) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={brand.id}>
                    <Card
                      sx={{
                        p: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        cursor: "pointer",
                        transition: "box-shadow 0.3s",
                        "&:hover": {
                          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                      onClick={() => navigate(`${ROUTES.brands}/${brand.slug}`)}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          bgcolor: brand.logo
                            ? "transparent"
                            : `linear-gradient(135deg, ${theme.palette.primary.main}22 0%, ${theme.palette.primary.main}44 100%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        {brand.logo ? (
                          <Box
                            component="img"
                            src={brand.logo}
                            alt={brand.name}
                            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        ) : (
                          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                            {brand.name.charAt(0)}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {brand.name}
                        </Typography>
                        {brand.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
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
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Featured Stores */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#111827" }}>
        <Container maxWidth="xl">
          <Stack spacing={6}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, mb: 1, color: "white" }}
              >
                Featured Stores
              </Typography>
              <Typography sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Partner with Kenya's finest fashion retailers
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
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        cursor: "pointer",
                        transition: "transform 0.3s, border-color 0.3s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          borderColor: "#00C896",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          height: 160,
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            bgcolor: vendor.coverImage
                              ? "transparent"
                              : `linear-gradient(135deg, ${theme.palette.primary.main}33 0%, ${theme.palette.primary.main}66 100%)`,
                          }}
                        />
                        {vendor.coverImage && (
                          <CardMedia
                            component="img"
                            image={vendor.coverImage}
                            alt={vendor.shopName}
                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        )}
                        {vendor.verified && (
                          <Chip
                            label="Verified"
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              bgcolor: "#00C896",
                              color: "white",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              bgcolor: vendor.logo
                                ? "transparent"
                                : `linear-gradient(135deg, ${theme.palette.primary.main}22 0%, ${theme.palette.primary.main}44 100%)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                            }}
                          >
                            {vendor.logo ? (
                              <Box
                                component="img"
                                src={vendor.logo}
                                alt={vendor.shopName}
                                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                              />
                            ) : (
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 700, color: "primary.main" }}
                              >
                                {vendor.shopName.charAt(0)}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
                              {vendor.shopName}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                            >
                              {vendor.location}
                            </Typography>
                          </Box>
                        </Stack>
                        {vendor.description && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255, 255, 255, 0.7)",
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
                            borderColor: "rgba(255, 255, 255, 0.3)",
                            color: "white",
                            "&:hover": {
                              borderColor: "#00C896",
                              bgcolor: "rgba(0, 200, 150, 0.1)",
                            },
                          }}
                        >
                          View Store
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

      {/* New Arrivals */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  New Arrivals
                </Typography>
                <Typography color="text.secondary">
                  Fresh styles just added to our collection
                </Typography>
              </Box>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate(ROUTES.customerDashboard)}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                View All
              </Button>
            </Stack>

            {newLoading ? (
              <Grid container spacing={3}>
                {[...Array(4)].map((_, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                    <LoadingSkeleton height={400} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={3}>
                {newProducts?.items.slice(0, 4).map((product) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Stack>
        </Container>
      </Box>

      {/* AI Stylist Banner */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            justifyContent="space-between"
            spacing={4}
          >
            <Box sx={{ maxWidth: { xs: "100%", md: 600 } }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "white",
                }}
              >
                Meet Your AI Stylist
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  mb: 3,
                }}
              >
                Get personalized outfit recommendations based on your style
                preferences, body type, and fashion goals.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                  },
                }}
                onClick={() => navigate(ROUTES.aiStylist)}
              >
                Try AI Stylist
              </Button>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    color: "white",
                    fontWeight: 800,
                    fontSize: "4rem",
                  }}
                >
                  AI
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Newsletter */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F8FAFC" }}>
        <Container maxWidth="md">
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              Stay in Style
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 500 }}>
              Subscribe to our newsletter for exclusive offers, style tips, and
              early access to new collections.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%", maxWidth: 500 }}
            >
              <TextField
                fullWidth
                placeholder="Enter your email"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    height: 56,
                  },
                }}
              />
              <Button
                variant="contained"
                size="large"
                sx={{
                  height: 56,
                  px: 4,
                  borderRadius: 2,
                  fontWeight: 700,
                  minWidth: { xs: "100%", sm: "auto" },
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
