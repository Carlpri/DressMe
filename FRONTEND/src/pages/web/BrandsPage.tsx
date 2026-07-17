import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useBrands, useBrand } from "../../hooks/useBrands";
import { useProducts } from "../../hooks/useProducts";
import { ProductCard } from "../../components/shared/ProductCard";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";
import { Link as RouterLink } from "react-router-dom";

export function BrandsPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { data: brand, isLoading: brandLoading } = useBrand(slug || "");
  const { data: products, isLoading: productsLoading } = useProducts(
    slug ? { brand: slug, limit: 24 } : { limit: 24 }
  );

  // If no slug, show all brands
  if (!slug) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Stack spacing={6}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
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
              {brands?.map((brand) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={brand.id}>
                  <Card
                    component={RouterLink}
                    to={`${ROUTES.brands}/${brand.slug}`}
                    sx={{
                      p: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      cursor: "pointer",
                      textDecoration: "none",
                      transition: "box-shadow 0.3s",
                      "&:hover": {
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        bgcolor: brand.logo
                          ? "transparent"
                          : "linear-gradient(135deg, rgba(0, 200, 150, 0.1) 0%, rgba(0, 200, 150, 0.2) 100%)",
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
    );
  }

  // Show specific brand
  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={6}>
        {/* Brand Header */}
        {brandLoading ? (
          <LoadingSkeleton height={200} />
        ) : brand ? (
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={4} alignItems="center">
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: 2,
                    bgcolor: brand.logo
                      ? "transparent"
                      : "linear-gradient(135deg, rgba(0, 200, 150, 0.1) 0%, rgba(0, 200, 150, 0.2) 100%)",
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
                    <Typography variant="h3" sx={{ fontWeight: 700, color: "primary.main" }}>
                      {brand.name.charAt(0)}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {brand.name}
                  </Typography>
                  {brand.description && (
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {brand.description}
                    </Typography>
                  )}
                  {brand.website && (
                    <Button
                      component="a"
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      size="small"
                    >
                      Visit Website
                    </Button>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Alert severity="error">Brand not found</Alert>
        )}

        {/* Products by Brand */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Products by {brand?.name}
            </Typography>
            <Typography color="text.secondary">
              {products?.total || 0} products
            </Typography>
          </Stack>

          {productsLoading ? (
            <Grid container spacing={3}>
              {[...Array(8)].map((_, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                  <LoadingSkeleton height={400} />
                </Grid>
              ))}
            </Grid>
          ) : products?.items.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No products found for this brand
              </Typography>
              <Button
                component={RouterLink}
                to={ROUTES.brands}
                sx={{ mt: 2 }}
              >
                Browse All Brands
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {products?.items.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Stack>
    </Container>
  );
}
