import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import type { Product } from "../../types/product";
import { ROUTES } from "../../constants/routes";
import { useAddToCart } from "../../hooks/useCart";
import { useFormatCurrency } from "../../utils/currency";

interface WishlistItemCardProps {
  product: Product;
  onRemove: (productId: string) => void;
  isRemoving?: boolean;
}

export function WishlistItemCard({ product, onRemove, isRemoving = false }: WishlistItemCardProps) {
  const addToCart = useAddToCart();
  const formatCurrency = useFormatCurrency();
  const [showCartSuccess, setShowCartSuccess] = useState(false);

  const primaryImage = product.images.find((image) => image.isPrimary) ?? product.images[0];
  const isOutOfStock = product.stock === 0 || product.status === "HIDDEN";
  const isLowStock = !isOutOfStock && product.stock <= 3;
  const hasDiscount = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;
  const productUrl = `${ROUTES.customerDashboard}/${product.slug}`;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart.mutate(
      { productId: product.id, quantity: 1 },
      { onSuccess: () => setShowCartSuccess(true) },
    );
  };

  return (
    <>
      <Card
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "180px minmax(0, 1fr) auto auto" },
          gap: { xs: 0, sm: 2.5 },
          overflow: "hidden",
          alignItems: "stretch",
          opacity: isRemoving ? 0 : 1,
          transform: isRemoving ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 180ms ease, transform 180ms ease, box-shadow 180ms ease",
          "&:hover": {
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
            transform: isRemoving ? "translateY(8px)" : "translateY(-2px)",
          },
        }}
      >
        <Box
          component={RouterLink}
          to={productUrl}
          aria-label={`View ${product.name}`}
          sx={{
            position: "relative",
            minHeight: { xs: 220, sm: "100%" },
            bgcolor: "grey.100",
            display: "block",
            textDecoration: "none",
          }}
        >
          {primaryImage ? (
            <CardMedia
              component="img"
              image={primaryImage.imageUrl}
              alt={primaryImage.altText || product.name}
              sx={{ width: "100%", height: "100%", minHeight: { xs: 220, sm: 190 }, objectFit: "cover" }}
            />
          ) : (
            <Box sx={{ height: "100%", minHeight: { xs: 220, sm: 190 }, display: "grid", placeItems: "center", p: 2 }}>
              <Typography color="text.secondary" align="center">{product.name}</Typography>
            </Box>
          )}
          {hasDiscount && (
            <Chip
              label={`${discountPercent}% off`}
              color="error"
              size="small"
              sx={{ position: "absolute", top: 12, left: 12, fontWeight: 700 }}
            />
          )}
        </Box>

        <Stack spacing={1} sx={{ p: { xs: 2, sm: 2.5 }, minWidth: 0, justifyContent: "center" }}>
          <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1.2, fontWeight: 700 }}>
            {product.brand.name} · {product.category.name}
          </Typography>
          <Typography component={RouterLink} to={productUrl} variant="h6" color="text.primary" sx={{ textDecoration: "none", fontWeight: 700, lineHeight: 1.3 }}>
            {product.name}
          </Typography>
          <Typography variant="body2" color={isOutOfStock ? "error.main" : isLowStock ? "warning.main" : "success.main"} sx={{ fontWeight: 700 }}>
            {isOutOfStock ? "Out of stock" : isLowStock ? `Only ${product.stock} left` : "In stock"}
          </Typography>
          {product.averageRating > 0 && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <StarIcon sx={{ color: "warning.main", fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {product.averageRating.toFixed(1)}{product.reviewCount > 0 ? ` (${product.reviewCount})` : ""}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Stack spacing={0.5} sx={{ px: { xs: 2, sm: 0 }, pb: { xs: 2, sm: 2.5 }, justifyContent: "center", minWidth: { sm: 120 } }}>
          <Typography variant="h6" color={hasDiscount ? "error.main" : "primary.main"} sx={{ fontWeight: 800 }}>
            {formatCurrency(product.price)}
          </Typography>
          {hasDiscount && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
              {formatCurrency(product.compareAtPrice!)}
            </Typography>
          )}
        </Stack>

        <Stack spacing={1} sx={{ p: { xs: 2, sm: 2.5 }, pt: { xs: 0, sm: 2.5 }, justifyContent: "center", minWidth: { sm: 150 } }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={isOutOfStock || addToCart.isPending}
            aria-label={`Add ${product.name} to cart`}
          >
            {isOutOfStock ? "Out of stock" : "Add to cart"}
          </Button>
          <Button
            component={RouterLink}
            to={productUrl}
            variant="outlined"
            fullWidth
            startIcon={<VisibilityOutlinedIcon />}
            aria-label={`View ${product.name}`}
          >
            View product
          </Button>
          <Button
            color="inherit"
            fullWidth
            startIcon={<DeleteOutlineIcon />}
            onClick={() => onRemove(product.id)}
            disabled={isRemoving}
            aria-label={`Remove ${product.name} from wishlist`}
          >
            Remove
          </Button>
        </Stack>
      </Card>

      <Snackbar open={showCartSuccess} autoHideDuration={3000} onClose={() => setShowCartSuccess(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" onClose={() => setShowCartSuccess(false)} variant="filled">
          {product.name} was added to your cart.
        </Alert>
      </Snackbar>
    </>
  );
}
