import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StarIcon from "@mui/icons-material/Star";
import StorefrontIcon from "@mui/icons-material/Storefront";
import VerifiedIcon from "@mui/icons-material/Verified";
import type { Product } from "../../types/product";
import { useAddToCart } from "../../hooks/useCart";
import { useFavorites, useAddToFavorites, useRemoveFromFavorites } from "../../hooks/useFavorites";
import { useFormatCurrency } from "../../utils/currency";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { data: favorites } = useFavorites();
  const isFavorited = favorites ? favorites.some((f) => f.id === product.id) : false;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCartSuccess, setShowCartSuccess] = useState(false);
  const [showFavoriteSuccess, setShowFavoriteSuccess] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("Added to wishlist!");
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const formatCurrency = useFormatCurrency();
  const addToCart = useAddToCart();
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  // Sort images by displayOrder if available
  const images =
    product.images && product.images.length > 0
      ? [...product.images].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      : [];

  const activeImage = images[currentImageIndex] || images[0];

  const totalStock = (product.variants ?? []).reduce((sum, v) => sum + (v.stock ?? 0), 0);
  const isOutOfStock = totalStock === 0 || product.status === "HIDDEN";
  const isLowStock = totalStock > 0 && totalStock <= 3 && product.status !== "HIDDEN";
  const hasSalePrice = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const savings = hasSalePrice ? product.compareAtPrice! - product.price : 0;
  const discountPercent = hasSalePrice
    ? Math.round((savings / product.compareAtPrice!) * 100)
    : 0;

  // Multi-image navigation handlers
  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  // Add to cart handler
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || addToCart.isPending) return;

    const variantId =
      selectedVariantId ||
      (product.variants?.find((v) => (v.stock ?? 0) > 0) || product.variants?.[0])?.id;

    addToCart.mutate(
      {
        productId: product.id,
        variantId,
        quantity: 1,
        product,
      },
      {
        onSuccess: () => setShowCartSuccess(true),
      }
    );
  };

  // Wishlist toggle handler
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  // Card click navigation
  const handleCardClick = () => {
    navigate(`/products/${product.slug}`);
  };

  // Size deduplication
  const sizeMap = new Map<string, { id: string; inStock: boolean }>();
  for (const v of product.variants ?? []) {
    if (v.sizeValue) {
      const key = v.sizeValue.trim().toUpperCase();
      if (!sizeMap.has(key)) {
        sizeMap.set(key, { id: v.id, inStock: (v.stock ?? 0) > 0 });
      } else if ((v.stock ?? 0) > 0) {
        sizeMap.set(key, { id: v.id, inStock: true });
      }
    }
  }
  const sizes = [...sizeMap.entries()];
  const visibleSizes = sizes.slice(0, 4);
  const sizeOverflow = sizes.length - 4;

  // Color deduplication
  const colorMap = new Map<string, { id: string; inStock: boolean }>();
  for (const v of product.variants ?? []) {
    if (v.colorValue) {
      const key = v.colorValue.trim();
      if (!colorMap.has(key)) {
        colorMap.set(key, { id: v.id, inStock: (v.stock ?? 0) > 0 });
      } else if ((v.stock ?? 0) > 0) {
        colorMap.set(key, { id: v.id, inStock: true });
      }
    }
  }
  const colors = [...colorMap.entries()];
  const visibleColors = colors.slice(0, 4);

  const isValidCssColor = (c: string): boolean => {
    const s = new Option().style;
    s.color = c.toLowerCase();
    return s.color !== "";
  };
  const useSwatches =
    visibleColors.length > 0 && visibleColors.every(([label]) => isValidCssColor(label));

  return (
    <>
      {/* ────────────────────────── LUXURY MINIMAL CONTINUOUS CARD ────────────────────────── */}
      <Box
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="article"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        sx={{
          position: "relative",
          height: "100%",
          minHeight: { xs: 410, sm: 450, md: 470 },
          borderRadius: "24px",
          overflow: "hidden",
          cursor: "pointer",
          bgcolor: "#0B0E14",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: isHovered
            ? "0 24px 48px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0, 200, 150, 0.35)"
            : "0 10px 30px -5px rgba(0, 0, 0, 0.5)",
          transform: isHovered ? "translateY(-6px)" : "translateY(0)",
          transition: "all 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
          outline: "none",
          "&:focus-visible": { boxShadow: "0 0 0 3px #00C896" },
        }}
      >
        {/* ── 1. FULL CARD PRODUCT IMAGE (100% COVERAGE BACKSTAGE) ───────────────────────── */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "radial-gradient(circle at 50% 30%, #1A212D 0%, #0E131C 60%, #080A0E 100%)",
            overflow: "hidden",
          }}
        >
          {activeImage ? (
            <Box
              component="img"
              src={activeImage.imageUrl}
              alt={activeImage.altText || product.name}
              loading="lazy"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center 30%",
                display: "block",
                p: 2, // Minimal padding so full product fits gracefully within card
                transition: "transform 0.5s ease",
                transform: isHovered ? "scale(1.035)" : "scale(1)",
                filter: "drop-shadow(0 14px 28px rgba(0, 0, 0, 0.55))",
              }}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255, 255, 255, 0.15)",
              }}
            >
              <Typography sx={{ fontWeight: 900, fontSize: "3rem", letterSpacing: -1 }}>
                DM
              </Typography>
              <Typography
                sx={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}
              >
                DressMe
              </Typography>
            </Box>
          )}

          {/* Ambient top vignette for top badge contrast */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "35%",
              pointerEvents: "none",
              background:
                "linear-gradient(to bottom, rgba(8, 10, 14, 0.55) 0%, transparent 100%)",
            }}
          />
        </Box>

        {/* ── 2. TOP BAR BADGES & WISHLIST ────────────────────── */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ position: "relative", zIndex: 5, p: 1.5, pointerEvents: "none" }}
        >
          {/* Top-Left Badges */}
          <Stack direction="column" spacing={0.5} sx={{ pointerEvents: "auto" }}>
            {isOutOfStock ? (
              <Chip
                label="Sold Out"
                size="small"
                sx={{
                  bgcolor: "rgba(220, 38, 38, 0.85)",
                  color: "#FFF",
                  fontWeight: 800,
                  fontSize: "0.62rem",
                  letterSpacing: "0.06em",
                  height: 22,
                  px: 0.5,
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 4px 12px rgba(220, 38, 38, 0.35)",
                }}
              />
            ) : (
              <>
                {discountPercent > 0 && (
                  <Chip
                    label={`-${discountPercent}%`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(220, 38, 38, 0.88)",
                      color: "#FFF",
                      fontWeight: 800,
                      fontSize: "0.65rem",
                      height: 22,
                      px: 0.5,
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
                    }}
                  />
                )}
                {product.isNewArrival && (
                  <Chip
                    label="NEW"
                    size="small"
                    sx={{
                      bgcolor: "rgba(0, 200, 150, 0.85)",
                      color: "#07130F",
                      fontWeight: 800,
                      fontSize: "0.62rem",
                      letterSpacing: "0.08em",
                      height: 22,
                      px: 0.5,
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 4px 12px rgba(0, 200, 150, 0.3)",
                    }}
                  />
                )}
                {product.isTrending && (
                  <Chip
                    label="HOT"
                    size="small"
                    sx={{
                      bgcolor: "rgba(245, 158, 11, 0.88)",
                      color: "#180E02",
                      fontWeight: 800,
                      fontSize: "0.62rem",
                      letterSpacing: "0.06em",
                      height: 22,
                      px: 0.5,
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.25)",
                    }}
                  />
                )}
                {product.featured && !product.isTrending && (
                  <Chip
                    label="FEATURED"
                    size="small"
                    sx={{
                      bgcolor: "rgba(30, 41, 59, 0.82)",
                      color: "#FFF",
                      fontWeight: 700,
                      fontSize: "0.58rem",
                      letterSpacing: "0.06em",
                      height: 22,
                      px: 0.5,
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                    }}
                  />
                )}
                {isLowStock && (
                  <Chip
                    label={`Only ${totalStock} left`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(234, 88, 12, 0.85)",
                      color: "#FFF",
                      fontWeight: 700,
                      fontSize: "0.6rem",
                      height: 22,
                      backdropFilter: "blur(8px)",
                    }}
                  />
                )}
              </>
            )}
          </Stack>

          {/* Top-Right: Image Counter & Wishlist Button */}
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ pointerEvents: "auto" }}>
            {images.length > 1 && (
              <Box
                sx={{
                  bgcolor: "rgba(15, 23, 42, 0.5)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "rgba(255, 255, 255, 0.85)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  px: 0.9,
                  py: 0.35,
                  borderRadius: "20px",
                  letterSpacing: "0.05em",
                }}
              >
                {currentImageIndex + 1} / {images.length}
              </Box>
            )}

            <IconButton
              onClick={handleToggleFavorite}
              disabled={addToFavorites.isPending || removeFromFavorites.isPending}
              aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
              size="small"
              sx={{
                bgcolor: "rgba(15, 23, 42, 0.5)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: isFavorited ? "#00C896" : "rgba(255, 255, 255, 0.85)",
                width: 36,
                height: 36,
                transition: "all 0.25s ease",
                "&:hover": {
                  bgcolor: isFavorited
                    ? "rgba(0, 200, 150, 0.25)"
                    : "rgba(255, 255, 255, 0.2)",
                  borderColor: isFavorited ? "#00C896" : "rgba(255, 255, 255, 0.3)",
                  transform: "scale(1.08)",
                },
              }}
            >
              {isFavorited ? (
                <FavoriteIcon sx={{ fontSize: 18, color: "#00C896" }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Stack>
        </Stack>

        {/* ── Multi-Image Left/Right Navigation Arrows ────────────────── */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevImage}
              aria-label="Previous product image"
              size="small"
              sx={{
                position: "absolute",
                top: "40%",
                left: 8,
                zIndex: 5,
                bgcolor: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#FFF",
                width: 32,
                height: 32,
                opacity: { xs: 0.85, md: isHovered ? 1 : 0 },
                transform: isHovered ? "translateX(0)" : "translateX(-6px)",
                transition: "all 0.25s ease",
                "&:hover": {
                  bgcolor: "#00C896",
                  color: "#0B131E",
                  borderColor: "#00C896",
                },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton
              onClick={handleNextImage}
              aria-label="Next product image"
              size="small"
              sx={{
                position: "absolute",
                top: "40%",
                right: 8,
                zIndex: 5,
                bgcolor: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#FFF",
                width: 32,
                height: 32,
                opacity: { xs: 0.85, md: isHovered ? 1 : 0 },
                transform: isHovered ? "translateX(0)" : "translateX(6px)",
                transition: "all 0.25s ease",
                "&:hover": {
                  bgcolor: "#00C896",
                  color: "#0B131E",
                  borderColor: "#00C896",
                },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </>
        )}

        {/* ── 3. FLOATING TRUE GLASSMORPHISM INFORMATION OVERLAY DECK ─────────────────── */}
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            right: 12,
            zIndex: 6,
            borderRadius: "16px",
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(18px) saturate(180%)",
            WebkitBackdropFilter: "blur(18px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            boxShadow:
              "0 10px 30px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)",
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            gap: 0.6,
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "rgba(0, 200, 150, 0.4)",
              background: "rgba(15, 23, 42, 0.52)",
            },
          }}
        >
          {/* Row 1: Brand (left) & Vendor / Rating (right) */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Typography
              sx={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "#00C896",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 0.4,
              }}
            >
              {product.brand?.name || "DressMe"}
            </Typography>

            {/* Rating / Vendor Badge */}
            {product.averageRating > 0 ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.3}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.08)",
                  px: 0.7,
                  py: 0.15,
                  borderRadius: "6px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <StarIcon sx={{ fontSize: 12, color: "#FBBF24" }} />
                <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#FFF" }}>
                  {product.averageRating.toFixed(1)}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.6rem", color: "rgba(255, 255, 255, 0.5)" }}
                >
                  ({product.reviewCount})
                </Typography>
              </Stack>
            ) : product.vendor?.businessName ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.3}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.08)",
                  px: 0.7,
                  py: 0.15,
                  borderRadius: "6px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <StorefrontIcon sx={{ fontSize: 11, color: "rgba(255, 255, 255, 0.7)" }} />
                <Typography
                  sx={{
                    fontSize: "0.6rem",
                    color: "rgba(255, 255, 255, 0.75)",
                    fontWeight: 600,
                  }}
                >
                  {product.vendor.businessName}
                </Typography>
              </Stack>
            ) : null}
          </Stack>

          {/* Row 2: Product Name — Prominent & Bold */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              lineHeight: 1.25,
              color: "#FFF",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              letterSpacing: "-0.015em",
            }}
          >
            {product.name}
          </Typography>

          {/* Row 3: Price + Compare-at strikethrough + Variants */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Stack direction="row" alignItems="baseline" spacing={0.75}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  color: "#FFF",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {formatCurrency(product.price)}
              </Typography>
              {hasSalePrice && (
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.4)",
                    textDecoration: "line-through",
                    fontWeight: 500,
                  }}
                >
                  {formatCurrency(product.compareAtPrice!)}
                </Typography>
              )}
            </Stack>

            {/* Size & Color indicators */}
            <Stack direction="row" alignItems="center" spacing={0.4}>
              {visibleSizes.slice(0, 2).map(([label, { id, inStock }]) => (
                <Box
                  key={label}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (inStock) setSelectedVariantId(id);
                  }}
                  sx={{
                    px: 0.55,
                    py: 0.15,
                    borderRadius: "4px",
                    bgcolor:
                      selectedVariantId === id
                        ? "rgba(0, 200, 150, 0.25)"
                        : inStock
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(255, 255, 255, 0.03)",
                    border: "1px solid",
                    borderColor:
                      selectedVariantId === id
                        ? "#00C896"
                        : inStock
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(255, 255, 255, 0.05)",
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    color:
                      selectedVariantId === id
                        ? "#00C896"
                        : inStock
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.25)",
                    textDecoration: inStock ? "none" : "line-through",
                    cursor: inStock ? "pointer" : "default",
                    flexShrink: 0,
                  }}
                >
                  {label}
                </Box>
              ))}

              {useSwatches &&
                visibleColors.slice(0, 2).map(([label, { inStock }]) => (
                  <Box
                    key={label}
                    title={label}
                    sx={{
                      width: 11,
                      height: 11,
                      borderRadius: "50%",
                      bgcolor: label.toLowerCase(),
                      border: "1.5px solid rgba(255, 255, 255, 0.3)",
                      opacity: inStock ? 1 : 0.3,
                      flexShrink: 0,
                    }}
                  />
                ))}
            </Stack>
          </Stack>

          {/* Row 4: Full-width compact Add to Cart Button inside the Glass Panel */}
          <Button
            variant="contained"
            fullWidth
            size="small"
            startIcon={
              addToCart.isPending ? (
                <CircularProgress size={12} color="inherit" />
              ) : (
                <ShoppingBagOutlinedIcon sx={{ fontSize: "14px !important" }} />
              )
            }
            disabled={isOutOfStock || addToCart.isPending}
            onClick={handleAddToCart}
            sx={{
              mt: 0.2,
              py: 0.65,
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.72rem",
              letterSpacing: "0.03em",
              bgcolor: isOutOfStock ? "rgba(255, 255, 255, 0.08)" : "#00C896",
              color: isOutOfStock ? "rgba(255, 255, 255, 0.3)" : "#07130F",
              border: "1px solid",
              borderColor: isOutOfStock ? "transparent" : "#00C896",
              boxShadow: isOutOfStock ? "none" : "0 4px 14px rgba(0, 200, 150, 0.35)",
              textTransform: "none",
              transition: "all 0.25s ease",
              "&:hover": {
                bgcolor: "#00E0A7",
                borderColor: "#00E0A7",
                color: "#050E0B",
                boxShadow: "0 6px 20px rgba(0, 200, 150, 0.5)",
                transform: "translateY(-1px)",
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(255, 255, 255, 0.05)",
                color: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </Button>
        </Box>
      </Box>

      {/* Feedback Snackbars */}
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
            fontWeight: 700,
            boxShadow: "0 8px 24px rgba(0, 200, 150, 0.4)",
            "& .MuiAlert-icon": { color: "#07130F" },
          }}
        >
          {product.name} added to cart!
        </Alert>
      </Snackbar>

      <Snackbar
        open={showFavoriteSuccess}
        autoHideDuration={3000}
        onClose={() => setShowFavoriteSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="info"
          onClose={() => setShowFavoriteSuccess(false)}
          sx={{
            bgcolor: "#1E293B",
            color: "#FFFFFF",
            fontWeight: 600,
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          {favoriteMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
