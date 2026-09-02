import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
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

  const primaryImage = (product.images ?? []).find((image) => image.isPrimary) ?? product.images?.[0];
  const totalStock = (product.variants ?? []).reduce((sum, v) => sum + (v.stock ?? 0), 0);
  const isOutOfStock = totalStock === 0 || product.status === "HIDDEN";
  const isLowStock = !isOutOfStock && totalStock <= 3;
  const hasDiscount = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;
  const productUrl = `${ROUTES.customerDashboard}/${product.slug}`;

  const handleAddToCart = () => {
    if (isOutOfStock || addToCart.isPending) return;

    addToCart.mutate(
      { productId: product.id, quantity: 1, product },
      { onSuccess: () => setShowCartSuccess(true) }
    );
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          bgcolor: "#0B0E14",
          borderRadius: { xs: "18px", sm: "22px" },
          border: "1px solid rgba(255, 255, 255, 0.08)",
          overflow: "hidden",
          opacity: isRemoving ? 0 : 1,
          transform: isRemoving ? "scale(0.96)" : "translateY(0)",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: "0 8px 30px -6px rgba(0, 0, 0, 0.5)",
          "&:hover": {
            borderColor: "rgba(0, 200, 150, 0.35)",
            boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(0, 200, 150, 0.2)",
            transform: "translateY(-4px)",
          },
        }}
      >
        {/* ── IMAGE WRAPPER ─────────────────────────────────────────── */}
        <Box
          component={RouterLink}
          to={productUrl}
          aria-label={`View ${product.name}`}
          sx={{
            position: "relative",
            width: { xs: "100%", sm: 220, md: 240 },
            minHeight: { xs: 240, sm: 240 },
            flexShrink: 0,
            bgcolor: "#0E131C",
            display: "block",
            textDecoration: "none",
            overflow: "hidden",
          }}
        >
          {primaryImage ? (
            <Box
              component="img"
              src={primaryImage.imageUrl}
              alt={primaryImage.altText || product.name}
              loading="lazy"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
                transition: "transform 0.5s ease",
                "&:hover": {
                  transform: "scale(1.06)",
                },
              }}
            />
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                color: "rgba(255, 255, 255, 0.15)",
              }}
            >
              <Typography sx={{ fontWeight: 900, fontSize: "2rem" }}>DM</Typography>
            </Box>
          )}

          {/* Badges on Image */}
          <Stack
            direction="row"
            spacing={0.6}
            sx={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}
          >
            {hasDiscount && (
              <Chip
                label={`-${discountPercent}%`}
                size="small"
                sx={{
                  bgcolor: "rgba(220, 38, 38, 0.9)",
                  color: "#FFF",
                  fontWeight: 800,
                  fontSize: "0.65rem",
                  height: 22,
                  px: 0.5,
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              />
            )}
            {product.isNewArrival && (
              <Chip
                label="NEW"
                size="small"
                sx={{
                  bgcolor: "rgba(0, 200, 150, 0.9)",
                  color: "#07130F",
                  fontWeight: 800,
                  fontSize: "0.62rem",
                  height: 22,
                  px: 0.5,
                  backdropFilter: "blur(8px)",
                }}
              />
            )}
          </Stack>
        </Box>

        {/* ── DETAILS & ACTIONS AREA (SPACIOUS & EDGY) ──────────────── */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2.5, sm: 3 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Top meta & title */}
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: "#00C896",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {product.brand?.name || "DressMe"}
              </Typography>

              {/* Delete button */}
              <IconButton
                onClick={() => onRemove(product.id)}
                disabled={isRemoving}
                size="small"
                aria-label={`Remove ${product.name} from wishlist`}
                sx={{
                  color: "rgba(255, 255, 255, 0.4)",
                  bgcolor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px",
                  p: 0.8,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "#EF4444",
                    bgcolor: "rgba(239, 68, 68, 0.12)",
                    borderColor: "rgba(239, 68, 68, 0.3)",
                    transform: "scale(1.08)",
                  },
                }}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>

            <Typography
              component={RouterLink}
              to={productUrl}
              sx={{
                color: "#FFF",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: { xs: "1.05rem", sm: "1.15rem" },
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                letterSpacing: "-0.01em",
                transition: "color 0.2s ease",
                "&:hover": { color: "#00C896" },
              }}
            >
              {product.name}
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <Chip
                label={isOutOfStock ? "Sold Out" : isLowStock ? `Only ${totalStock} left` : "In Stock"}
                size="small"
                sx={{
                  bgcolor: isOutOfStock
                    ? "rgba(220, 38, 38, 0.15)"
                    : isLowStock
                    ? "rgba(245, 158, 11, 0.15)"
                    : "rgba(0, 200, 150, 0.12)",
                  color: isOutOfStock ? "#EF4444" : isLowStock ? "#F59E0B" : "#00C896",
                  border: "1px solid",
                  borderColor: isOutOfStock
                    ? "rgba(220, 38, 38, 0.3)"
                    : isLowStock
                    ? "rgba(245, 158, 11, 0.3)"
                    : "rgba(0, 200, 150, 0.25)",
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  height: 22,
                }}
              />

              {product.averageRating > 0 && (
                <Stack direction="row" alignItems="center" spacing={0.4}>
                  <StarRoundedIcon sx={{ color: "#FBBF24", fontSize: 16 }} />
                  <Typography sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.75rem", fontWeight: 700 }}>
                    {product.averageRating.toFixed(1)}
                  </Typography>
                  <Typography sx={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.7rem" }}>
                    ({product.reviewCount})
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>

          {/* Bottom row: Price & Action Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
            sx={{ pt: 1, borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}
          >
            {/* Price display */}
            <Stack direction="row" alignItems="baseline" spacing={1}>
              <Typography sx={{ fontWeight: 800, fontSize: "1.3rem", color: "#FFF", letterSpacing: "-0.02em" }}>
                {formatCurrency(product.price)}
              </Typography>
              {hasDiscount && (
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: "rgba(255, 255, 255, 0.35)",
                    textDecoration: "line-through",
                    fontWeight: 500,
                  }}
                >
                  {formatCurrency(product.compareAtPrice!)}
                </Typography>
              )}
            </Stack>

            {/* Action buttons (Edgy & modern) */}
            <Stack direction="row" spacing={1.2}>
              <Button
                component={RouterLink}
                to={productUrl}
                variant="outlined"
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "16px !important" }} />}
                sx={{
                  borderRadius: "12px",
                  py: 0.9,
                  px: 2,
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  letterSpacing: "0.02em",
                  textTransform: "none",
                  color: "#FFF",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  bgcolor: "rgba(255, 255, 255, 0.03)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.35)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                View
              </Button>

              <Button
                variant="contained"
                startIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: "17px !important" }} />}
                onClick={handleAddToCart}
                disabled={isOutOfStock || addToCart.isPending}
                sx={{
                  borderRadius: "12px",
                  py: 0.9,
                  px: 2.5,
                  fontWeight: 800,
                  fontSize: "0.78rem",
                  letterSpacing: "0.03em",
                  textTransform: "none",
                  bgcolor: isOutOfStock ? "rgba(255, 255, 255, 0.08)" : "#00C896",
                  color: isOutOfStock ? "rgba(255, 255, 255, 0.3)" : "#07130F",
                  boxShadow: isOutOfStock ? "none" : "0 4px 16px rgba(0, 200, 150, 0.35)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    bgcolor: "#00E0A7",
                    boxShadow: "0 6px 24px rgba(0, 200, 150, 0.5)",
                    transform: "translateY(-2px)",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    color: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                {isOutOfStock ? "Sold Out" : "Move to Cart"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Snackbar feedback */}
      <Snackbar
        open={showCartSuccess}
        autoHideDuration={3000}
        onClose={() => setShowCartSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setShowCartSuccess(false)}
          sx={{
            bgcolor: "#00C896",
            color: "#07130F",
            fontWeight: 800,
            borderRadius: "12px",
            boxShadow: "0 8px 30px rgba(0, 200, 150, 0.4)",
            "& .MuiAlert-icon": { color: "#07130F" },
          }}
        >
          {product.name} moved to your cart!
        </Alert>
      </Snackbar>
    </>
  );
}
