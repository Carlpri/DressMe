import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Rating,
  Divider,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShareIcon from "@mui/icons-material/Share";
import { useProducts, useProduct } from "../../hooks/useProducts";
import { useAddToCart } from "../../hooks/useCart";
import { useAddToFavorites, useRemoveFromFavorites } from "../../hooks/useFavorites";
import { useReviews, useAddReview } from "../../hooks/useReviews";
import { ProductCard } from "../../components/shared/ProductCard";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";
import { Link as RouterLink } from "react-router-dom";

export function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const { data: product, isLoading, error } = useProduct(slug || "");
  const { data: relatedProducts } = useProducts({
    category: product?.category.slug,
    limit: 4,
  });
  const { data: reviews } = useReviews(product?.id || "");

  const addToCart = useAddToCart();
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();
  const addReview = useAddReview();

  const primaryImage = product?.images.find((img) => img.isPrimary) || product?.images[0];
  const currentVariant = product?.variants.find((v) => v.id === selectedVariant);
  const displayPrice = currentVariant?.price || product?.price || 0;
  const availableStock = currentVariant?.stock || product?.stock || 0;

  const handleAddToCart = () => {
    if (product) {
      addToCart.mutate({
        productId: product.id,
        variantId: selectedVariant || undefined,
        quantity,
      });
    }
  };

  const handleToggleFavorite = () => {
    if (product) {
      // TODO: Check if already favorited and call appropriate mutation
      addToFavorites.mutate(product.id);
    }
  };

  const handleSubmitReview = () => {
    if (product) {
      addReview.mutate({
        productId: product.id,
        rating: reviewRating,
        comment: reviewComment || undefined,
      });
      setReviewDialogOpen(false);
      setReviewRating(5);
      setReviewComment("");
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <LoadingSkeleton height={500} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <LoadingSkeleton height={60} />
              <LoadingSkeleton height={40} />
              <LoadingSkeleton height={200} />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Alert severity="error">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={6}>
        {/* Breadcrumb */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Typography
            component={RouterLink}
            to={ROUTES.landing}
            color="text.secondary"
            sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
          >
            Home
          </Typography>
          <Typography color="text.secondary">/</Typography>
          <Typography
            component={RouterLink}
            to={ROUTES.customerDashboard}
            color="text.secondary"
            sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
          >
            Products
          </Typography>
          <Typography color="text.secondary">/</Typography>
          <Typography color="text.primary" sx={{ fontWeight: 500 }}>
            {product.name}
          </Typography>
        </Stack>

        {/* Product Details */}
        <Grid container spacing={4}>
          {/* Images */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <Box
                sx={{
                  position: "relative",
                  pt: "100%",
                  bgcolor: "#F8FAFC",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                {product.images[selectedImage] ? (
                  <Box
                    component="img"
                    src={product.images[selectedImage].imageUrl}
                    alt={product.images[selectedImage].altText || product.name}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      No image available
                    </Typography>
                  </Box>
                )}
              </Box>

              {product.images.length > 1 && (
                <Stack direction="row" spacing={1}>
                  {product.images.map((image, index) => (
                    <Box
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        border: selectedImage === index ? "2px solid" : "2px solid transparent",
                        borderColor: selectedImage === index ? "primary.main" : "divider",
                      }}
                    >
                      <Box
                        component="img"
                        src={image.imageUrl}
                        alt={image.altText || product.name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
            </Stack>
          </Grid>

          {/* Product Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Box>
                {product.featured && (
                  <Chip label="Featured" color="primary" size="small" sx={{ mb: 2 }} />
                )}
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {product.name}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    component={RouterLink}
                    to={`${ROUTES.brands}/${product.brand.slug}`}
                    color="text.secondary"
                    sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
                  >
                    {product.brand.name}
                  </Typography>
                  <Typography color="text.secondary">•</Typography>
                  <Typography color="text.secondary">{product.category.name}</Typography>
                </Stack>
              </Box>

              <Stack direction="row" spacing={2} alignItems="baseline">
                <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                  KES {displayPrice.toLocaleString()}
                </Typography>
                {product.averageRating > 0 && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Rating value={product.averageRating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      ({product.reviewCount})
                    </Typography>
                  </Stack>
                )}
              </Stack>

              <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {product.description}
              </Typography>

              {/* Variants */}
              {product.variants.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Select Variant
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    {product.variants.map((variant) => (
                      <Chip
                        key={variant.id}
                        label={`${variant.size} - ${variant.color}`}
                        onClick={() => setSelectedVariant(variant.id)}
                        sx={{
                          border: selectedVariant === variant.id ? "2px solid" : "1px solid",
                          borderColor: selectedVariant === variant.id ? "primary.main" : "divider",
                          bgcolor: variant.stock === 0 ? "#FFE5E5" : "background.paper",
                          color: variant.stock === 0 ? "#DC2626" : "text.primary",
                          cursor: variant.stock === 0 ? "not-allowed" : "pointer",
                          "&:hover": variant.stock > 0 ? {
                            borderColor: "primary.main",
                          } : {},
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Quantity */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Quantity
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Typography sx={{ minWidth: 40, textAlign: "center" }}>
                    {quantity}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                    disabled={quantity >= availableStock}
                  >
                    +
                  </Button>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {availableStock} in stock
                </Typography>
              </Box>

              {/* Actions */}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleAddToCart}
                  disabled={availableStock === 0 || addToCart.isPending}
                >
                  {availableStock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
                <IconButton
                  onClick={handleToggleFavorite}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <FavoriteBorderIcon />
                </IconButton>
                <IconButton
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Stack>

              {/* Vendor Info */}
              <Card variant="outlined">
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: "#F8FAFC",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {product.vendor.logo ? (
                        <Box
                          component="img"
                          src={product.vendor.logo}
                          alt={product.vendor.shopName}
                          sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      ) : (
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                          {product.vendor.shopName.charAt(0)}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {product.vendor.shopName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.vendor.verified && "✓ Verified Vendor"}
                      </Typography>
                    </Box>
                    {product.vendor.verified && (
                      <Chip label="Verified" color="success" size="small" />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        <Divider />

        {/* Reviews Section */}
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Reviews
            </Typography>
            <Button variant="outlined" onClick={() => setReviewDialogOpen(true)}>
              Write a Review
            </Button>
          </Stack>

          {reviews && reviews.length > 0 ? (
            <Stack spacing={2}>
              {reviews.map((review) => (
                <Card key={review.id} variant="outlined">
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              bgcolor: "#F8FAFC",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {review.user.name.charAt(0)}
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {review.user.name}
                          </Typography>
                        </Stack>
                        <Rating value={review.rating} readOnly size="small" />
                      </Stack>
                      {review.comment && (
                        <Typography variant="body2" color="text.secondary">
                          {review.comment}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">No reviews yet. Be the first to review!</Typography>
          )}
        </Box>

        {/* Related Products */}
        {relatedProducts && relatedProducts.items.length > 0 && (
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
              Related Products
            </Typography>
            <Grid container spacing={3}>
              {relatedProducts.items
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={relatedProduct.id}>
                    <ProductCard product={relatedProduct} />
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}
      </Stack>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>Rating</Typography>
              <Rating
                value={reviewRating}
                onChange={(_, newValue) => setReviewRating(newValue || 5)}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your experience with this product..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={addReview.isPending}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
