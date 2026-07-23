import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import { ROUTES } from "../../constants/routes";
import type { Product } from "../../types/product";
import { useAddToCart } from "../../hooks/useCart";
import { useFavorites, useAddToFavorites, useRemoveFromFavorites } from "../../hooks/useFavorites";
import { useFormatCurrency } from "../../utils/currency";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const theme = useTheme();
  const { data: favorites } = useFavorites();
  const isFavorited = favorites ? favorites.some((f) => f.id === product.id) : false;

  const [showCartSuccess, setShowCartSuccess] = useState(false);
  const [showFavoriteSuccess, setShowFavoriteSuccess] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("Added to wishlist!");
  const formatCurrency = useFormatCurrency();

  const addToCart = useAddToCart();
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const isOutOfStock = product.stock === 0 || product.status === "HIDDEN";
  const isLowStock = product.stock > 0 && product.stock <= 3 && product.status !== "HIDDEN";
  const hasSalePrice = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const savings = hasSalePrice ? (product.compareAtPrice! - product.price) : 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart.mutate(
        { productId: product.id, quantity: 1 },
        {
          onSuccess: () => {
            setShowCartSuccess(true);
          },
        }
      );
    }
  };

  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeFromFavorites.mutate(product.id, {
        onSuccess: () => {
          setFavoriteMessage("Removed from wishlist!");
          setShowFavoriteSuccess(true);
        },
      });
    } else {
      addToFavorites.mutate(product.id, {
        onSuccess: () => {
          setFavoriteMessage("Added to wishlist!");
          setShowFavoriteSuccess(true);
        },
      });
    }
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            pt: "100%",
            overflow: "hidden",
            bgcolor: "#F8FAFC",
          }}
        >
          <Box
            component={RouterLink}
            to={`/products/${product.slug}`}
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {primaryImage ? (
              <CardMedia
                component="img"
                image={primaryImage.imageUrl}
                alt={primaryImage.altText || product.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: `linear-gradient(135deg, ${theme.palette.primary.main}22 0%, ${theme.palette.primary.main}44 100%)`,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    textAlign: "center",
                    p: 2,
                  }}
                >
                  {product.name}
                </Typography>
              </Box>
            )}
          </Box>

          <Stack
            direction="column"
            spacing={0.5}
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 1,
            }}
          >
            {isOutOfStock ? (
              <Chip label="Out of Stock" size="small" color="error" sx={{ fontWeight: 600, fontSize: "0.7rem" }} />
            ) : (
              <>
                {product.featured && <Chip label="Featured" size="small" color="primary" sx={{ fontWeight: 600, fontSize: "0.7rem" }} />}
                {product.isTrending && <Chip label="Trending" size="small" color="secondary" sx={{ fontWeight: 600, fontSize: "0.7rem" }} />}
                {product.isNewArrival && <Chip label="New" size="small" color="info" sx={{ fontWeight: 600, fontSize: "0.7rem" }} />}
                {product.isBestSeller && <Chip label="Best Seller" size="small" color="warning" sx={{ fontWeight: 600, fontSize: "0.7rem" }} />}
                {hasSalePrice && <Chip label={`Save ${formatCurrency(savings)}`} size="small" color="error" variant="outlined" sx={{ fontWeight: 700, fontSize: "0.7rem" }} />}
              </>
            )}
          </Stack>

          <IconButton
            onClick={handleToggleFavorite}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: "white",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                bgcolor: "white",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
            }}
            size="small"
            disabled={addToFavorites.isPending || removeFromFavorites.isPending}
          >
            {isFavorited ? (
              <FavoriteIcon fontSize="small" color="error" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Stack spacing={1}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {product.brand.name}
            </Typography>
            <Box
              component={RouterLink}
              to={`/products/${product.slug}`}
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "none" },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  color: "text.primary",
                  lineHeight: 1.3,
                }}
              >
                {product.name}
              </Typography>
            </Box>

            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: hasSalePrice ? "error.main" : "primary.main",
                }}
              >
                {formatCurrency(product.price)}
              </Typography>
              {hasSalePrice && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textDecoration: "line-through" }}
                >
                  {formatCurrency(product.compareAtPrice!)}
                </Typography>
              )}
            </Stack>
            {isLowStock && (
              <Typography variant="caption" sx={{ color: "warning.main", fontWeight: 600 }}>
                ⚡ Only {product.stock} left in stock!
              </Typography>
            )}

            {product.averageRating > 0 && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <StarIcon sx={{ fontSize: 16, color: "#FFB800" }} />
                <Typography variant="body2" color="text.secondary">
                  {product.averageRating.toFixed(1)} ({product.reviewCount})
                </Typography>
              </Stack>
            )}

            <Stack direction="row" spacing={1} flexWrap="wrap">
              {product.variants.slice(0, 3).map((variant) => (
                <Chip
                  key={variant.id}
                  label={variant.size}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "0.7rem",
                    bgcolor: variant.stock > 0 ? "#F8FAFC" : "#FFE5E5",
                    color: variant.stock > 0 ? "text.primary" : "#DC2626",
                  }}
                />
              ))}
              {product.variants.length > 3 && (
                <Chip
                  label={`+${product.variants.length - 3}`}
                  size="small"
                  sx={{ height: 24, fontSize: "0.7rem", bgcolor: "#F8FAFC" }}
                />
              )}
            </Stack>
          </Stack>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingCartIcon />}
            disabled={isOutOfStock || addToCart.isPending}
            onClick={handleAddToCart}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              flex: 1,
              ...(isOutOfStock && { bgcolor: "action.disabledBackground" }),
            }}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardActions>
      </Card>

      <Snackbar
        open={showCartSuccess}
        autoHideDuration={3000}
        onClose={() => setShowCartSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setShowCartSuccess(false)}>
          Added to cart!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showFavoriteSuccess}
        autoHideDuration={3000}
        onClose={() => setShowFavoriteSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setShowFavoriteSuccess(false)}>
          {favoriteMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
