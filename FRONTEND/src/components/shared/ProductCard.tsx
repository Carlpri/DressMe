import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Stack,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NorthEastIcon from "@mui/icons-material/NorthEast";
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
  const { data: favorites } = useFavorites();
  const isFavorited = favorites ? favorites.some((f) => f.id === product.id) : false;

  const [showCartSuccess, setShowCartSuccess] = useState(false);
  const [showFavoriteSuccess, setShowFavoriteSuccess] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("Added to wishlist!");
  const [hovered, setHovered] = useState(false);
  const formatCurrency = useFormatCurrency();

  const addToCart = useAddToCart();
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const primaryImage = (product.images ?? []).find((img) => img.isPrimary) || product.images?.[0];
  const totalStock = (product.variants ?? []).reduce((sum, v) => sum + (v.stock ?? 0), 0);
  const isOutOfStock = totalStock === 0 || product.status === "HIDDEN";
  const isLowStock = totalStock > 0 && totalStock <= 3 && product.status !== "HIDDEN";
  const hasSalePrice = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const savings = hasSalePrice ? (product.compareAtPrice! - product.price) : 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart.mutate(
        { productId: product.id, quantity: 1 },
        { onSuccess: () => setShowCartSuccess(true) }
      );
    }
  };

  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeFromFavorites.mutate(product.id, {
        onSuccess: () => { setFavoriteMessage("Removed from wishlist!"); setShowFavoriteSuccess(true); },
      });
    } else {
      addToFavorites.mutate(product.id, {
        onSuccess: () => { setFavoriteMessage("Added to wishlist!"); setShowFavoriteSuccess(true); },
      });
    }
  };

  // ─── Size deduplication ───────────────────────────────────────────────────
  const sizeMap = new Map<string, boolean>();
  for (const v of product.variants ?? []) {
    if (v.sizeValue) {
      const key = v.sizeValue.trim().toUpperCase();
      if (!sizeMap.has(key)) sizeMap.set(key, v.stock > 0);
      else if (v.stock > 0) sizeMap.set(key, true);
    }
  }
  const sizes = [...sizeMap.entries()];
  const visibleSizes = sizes.slice(0, 4);
  const sizeOverflow = sizes.length - 4;

  // ─── Color deduplication ──────────────────────────────────────────────────
  const colorMap = new Map<string, boolean>();
  for (const v of product.variants ?? []) {
    if (v.colorValue) {
      const key = v.colorValue.trim();
      if (!colorMap.has(key)) colorMap.set(key, v.stock > 0);
      else if (v.stock > 0) colorMap.set(key, true);
    }
  }
  const colors = [...colorMap.entries()];
  const visibleColors = colors.slice(0, 5);
  const colorOverflow = colors.length - 5;

  const isValidCssColor = (c: string): boolean => {
    const s = new Option().style;
    s.color = c.toLowerCase();
    return s.color !== "";
  };
  const useSwatches = visibleColors.length > 0 && visibleColors.every(([label]) => isValidCssColor(label));

  return (
    <>
      <Card
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          bgcolor: "#141414",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
          "&:hover": {
            transform: "translateY(-6px) scale(1.01)",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.25)",
          },
        }}
      >
        {/* ── Image Area ─────────────────────────────────────────────────── */}
        <Box
          sx={{
            position: "relative",
            pt: "62%",
            overflow: "hidden",
            bgcolor: "#1a1a1a",
            flexShrink: 0,
          }}
        >
          <Box
            component={RouterLink}
            to={`/products/${product.slug}`}
            sx={{ position: "absolute", inset: 0, display: "block" }}
          >
            {primaryImage ? (
              <Box
                component="img"
                src={primaryImage.imageUrl}
                alt={primaryImage.altText || product.name}
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                  transform: hovered ? "scale(1.06)" : "scale(1)",
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
                  background: "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)",
                }}
              >
                <Typography sx={{ fontWeight: 800, color: "rgba(255,255,255,0.12)", fontSize: "2.5rem", letterSpacing: -1 }}>
                  DM
                </Typography>
              </Box>
            )}

            {/* Bottom gradient overlay */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "50%",
                background: "linear-gradient(to top, rgba(20,20,20,0.85) 0%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
          </Box>

          {/* ── Price badge — top-right ───────────────────────────────── */}
          <Box
            sx={{
              position: "absolute",
              top: 14,
              right: 14,
              zIndex: 2,
              bgcolor: "white",
              borderRadius: "10px",
              px: 1.25,
              py: 0.5,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: "#0D0D0D", lineHeight: 1.2 }}>
              {formatCurrency(product.price)}
            </Typography>
            {hasSalePrice && (
              <Typography sx={{ fontSize: "0.65rem", color: "#888", textDecoration: "line-through", lineHeight: 1 }}>
                {formatCurrency(product.compareAtPrice!)}
              </Typography>
            )}
          </Box>

          {/* ── Promotion badges — top-left ───────────────────────────── */}
          <Stack
            direction="column"
            spacing={0.5}
            sx={{ position: "absolute", top: 14, left: 14, zIndex: 2 }}
          >
            {isOutOfStock ? (
              <Chip
                label="Sold Out"
                size="small"
                sx={{ bgcolor: "rgba(220,38,38,0.85)", color: "white", fontWeight: 700, fontSize: "0.65rem", height: 22, backdropFilter: "blur(4px)" }}
              />
            ) : (
              <>
                {isLowStock && (
                  <Chip label={`${totalStock} left`} size="small" sx={{ bgcolor: "rgba(234,88,12,0.85)", color: "white", fontWeight: 700, fontSize: "0.65rem", height: 22 }} />
                )}
                {product.isNewArrival && (
                  <Chip label="New" size="small" sx={{ bgcolor: "rgba(20,20,20,0.75)", color: "#C9A96E", fontWeight: 700, fontSize: "0.65rem", height: 22, border: "1px solid rgba(201,169,110,0.4)", backdropFilter: "blur(4px)" }} />
                )}
                {product.isTrending && (
                  <Chip label="Hot" size="small" sx={{ bgcolor: "rgba(201,169,110,0.9)", color: "#0D0D0D", fontWeight: 800, fontSize: "0.65rem", height: 22 }} />
                )}
                {product.featured && !product.isTrending && (
                  <Chip label="Featured" size="small" sx={{ bgcolor: "rgba(20,20,20,0.75)", color: "white", fontWeight: 600, fontSize: "0.65rem", height: 22, backdropFilter: "blur(4px)" }} />
                )}
                {hasSalePrice && (
                  <Chip label={`-${Math.round((savings / product.compareAtPrice!) * 100)}%`} size="small" sx={{ bgcolor: "rgba(220,38,38,0.85)", color: "white", fontWeight: 800, fontSize: "0.65rem", height: 22 }} />
                )}
              </>
            )}
          </Stack>

          {/* ── Wishlist button ───────────────────────────────────────── */}
          <IconButton
            onClick={handleToggleFavorite}
            disabled={addToFavorites.isPending || removeFromFavorites.isPending}
            size="small"
            sx={{
              position: "absolute",
              bottom: 12,
              right: 12,
              zIndex: 2,
              bgcolor: "rgba(20,20,20,0.7)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.1)",
              width: 34,
              height: 34,
              "&:hover": { bgcolor: "rgba(201,169,110,0.15)", borderColor: "rgba(201,169,110,0.5)" },
            }}
          >
            {isFavorited ? (
              <FavoriteIcon sx={{ fontSize: 16, color: "#C9A96E" }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }} />
            )}
          </IconButton>

          {/* ── Rating ───────────────────────────────────────────────── */}
          {product.averageRating > 0 && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.4}
              sx={{
                position: "absolute",
                bottom: 12,
                left: 12,
                zIndex: 2,
                bgcolor: "rgba(20,20,20,0.7)",
                backdropFilter: "blur(8px)",
                borderRadius: "8px",
                px: 1,
                py: 0.4,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <StarIcon sx={{ fontSize: 12, color: "#C9A96E" }} />
              <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>
                {product.averageRating.toFixed(1)}
              </Typography>
              <Typography sx={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>
                ({product.reviewCount})
              </Typography>
            </Stack>
          )}
        </Box>

        {/* ── Footer Area ─────────────────────────────────────────────────── */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            p: "14px 16px 16px",
            gap: 1,
          }}
        >
          {/* Brand */}
          <Typography
            sx={{
              fontSize: "0.68rem",
              fontWeight: 600,
              color: "rgba(201,169,110,0.75)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {product.brand?.name || "DressMe"}
          </Typography>

          {/* Name + Shop Now row */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Box
              component={RouterLink}
              to={`/products/${product.slug}`}
              sx={{ textDecoration: "none", flex: 1 }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  lineHeight: 1.25,
                  color: "rgba(255,255,255,0.95)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  "&:hover": { color: "#C9A96E" },
                  transition: "color 0.2s",
                }}
              >
                {product.name}
              </Typography>
            </Box>
            <Box
              component={RouterLink}
              to={`/products/${product.slug}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.25,
                color: "rgba(255,255,255,0.45)",
                textDecoration: "none",
                flexShrink: 0,
                mt: 0.2,
                "&:hover": { color: "#C9A96E" },
                transition: "color 0.2s",
              }}
            >
              <Typography sx={{ fontSize: "0.7rem", fontWeight: 600 }}>Shop</Typography>
              <NorthEastIcon sx={{ fontSize: 12 }} />
            </Box>
          </Stack>

          {/* Sizes */}
          {visibleSizes.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" alignItems="center" sx={{ mt: 0.25 }}>
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em", mr: 0.25 }}>
                SIZE
              </Typography>
              {visibleSizes.map(([label, inStock]) => (
                <Box
                  key={label}
                  sx={{
                    px: 0.75,
                    py: 0.2,
                    borderRadius: "5px",
                    border: "1px solid",
                    borderColor: inStock ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    color: inStock ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.2)",
                    lineHeight: 1.5,
                    textDecoration: inStock ? "none" : "line-through",
                  }}
                >
                  {label}
                </Box>
              ))}
              {sizeOverflow > 0 && (
                <Typography sx={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>
                  +{sizeOverflow}
                </Typography>
              )}
            </Stack>
          )}

          {/* Colors */}
          {visibleColors.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" alignItems="center">
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em", mr: 0.25 }}>
                COLOR
              </Typography>
              {visibleColors.map(([label, inStock]) =>
                useSwatches ? (
                  <Box
                    key={label}
                    title={label}
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      bgcolor: label.toLowerCase(),
                      border: "1.5px solid rgba(255,255,255,0.2)",
                      opacity: inStock ? 1 : 0.3,
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Box
                    key={label}
                    sx={{
                      px: 0.75,
                      py: 0.2,
                      borderRadius: "5px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: "0.6rem",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.5)",
                      opacity: inStock ? 1 : 0.35,
                      lineHeight: 1.5,
                    }}
                  >
                    {label}
                  </Box>
                )
              )}
              {colorOverflow > 0 && (
                <Typography sx={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>
                  +{colorOverflow}
                </Typography>
              )}
            </Stack>
          )}

          {/* Add to Cart CTA */}
          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingCartOutlinedIcon sx={{ fontSize: "15px !important" }} />}
            disabled={isOutOfStock || addToCart.isPending}
            onClick={handleAddToCart}
            sx={{
              mt: "auto",
              pt: 0.75,
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.04em",
              bgcolor: isOutOfStock ? "rgba(255,255,255,0.06)" : "rgba(201,169,110,0.15)",
              color: isOutOfStock ? "rgba(255,255,255,0.25)" : "#C9A96E",
              border: "1px solid",
              borderColor: isOutOfStock ? "rgba(255,255,255,0.06)" : "rgba(201,169,110,0.3)",
              boxShadow: "none",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#C9A96E",
                color: "#0D0D0D",
                borderColor: "#C9A96E",
                boxShadow: "0 4px 16px rgba(201,169,110,0.4)",
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.18)",
                borderColor: "rgba(255,255,255,0.04)",
              },
              transition: "all 0.25s ease",
            }}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </Box>
      </Card>

      <Snackbar open={showCartSuccess} autoHideDuration={3000} onClose={() => setShowCartSuccess(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" onClose={() => setShowCartSuccess(false)}>Added to cart!</Alert>
      </Snackbar>

      <Snackbar open={showFavoriteSuccess} autoHideDuration={3000} onClose={() => setShowFavoriteSuccess(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" onClose={() => setShowFavoriteSuccess(false)}>{favoriteMessage}</Alert>
      </Snackbar>
    </>
  );
}
