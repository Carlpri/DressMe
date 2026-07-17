import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { useCategories, useCategory } from "../../hooks/useCategories";
import { useProducts } from "../../hooks/useProducts";
import { ProductCard } from "../../components/shared/ProductCard";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";
import { Link as RouterLink } from "react-router-dom";

export function CategoriesPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: category, isLoading: categoryLoading } = useCategory(slug || "");
  const { data: products, isLoading: productsLoading } = useProducts(
    slug ? { category: slug, limit: 24 } : { limit: 24 }
  );

  // If no slug, show all categories
  if (!slug) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Stack spacing={6}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Shop by Category
            </Typography>
            <Typography color="text.secondary">
              Explore our curated fashion collections
            </Typography>
          </Box>

          {categoriesLoading ? (
            <Grid container spacing={3}>
              {[...Array(8)].map((_, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                  <LoadingSkeleton height={200} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {categories?.map((category) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={category.id}>
                  <Card
                    component={RouterLink}
                    to={`${ROUTES.categories}/${category.slug}`}
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      textDecoration: "none",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 180,
                        bgcolor: category.image
                          ? "transparent"
                          : "linear-gradient(135deg, rgba(0, 200, 150, 0.1) 0%, rgba(0, 200, 150, 0.2) 100%)",
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
    );
  }

  // Show specific category
  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={6}>
        {/* Category Header */}
        {categoryLoading ? (
          <LoadingSkeleton height={200} />
        ) : category ? (
          <Box
            sx={{
              position: "relative",
              height: 200,
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: "#F8FAFC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {category.image && (
              <Box
                component="img"
                src={category.image}
                alt={category.name}
                sx={{
                  position: "absolute",
                  inset: 0,
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
                bgcolor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {category.name}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Alert severity="error">Category not found</Alert>
        )}

        {/* Products in Category */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Products in {category?.name}
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
                No products found in this category
              </Typography>
              <Button
                component={RouterLink}
                to={ROUTES.categories}
                sx={{ mt: 2 }}
              >
                Browse All Categories
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
