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
      {/* ────────────────────────── CARD ────────────────────────── */}
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
          minHeight: { xs: 390, sm: 430, md: 450 },
          borderRadius: "20px",
          overflow: "hidden",
          cursor: "pointer",
          bgcolor: "#0B0E13",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: isHovered
            ? "0 28px 52px -10px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,200,150,0.28)"
            : "0 8px 24px -4px rgba(0,0,0,0.5)",
          transform: isHovered ? "translateY(-5px) scale(1.006)" : "translateY(0) scale(1)",
          transition: "transform 0.35s cubic-bezier(0.25,1,0.5,1), box-shadow 0.35s ease",
          outline: "none",
          "&:focus-visible": { boxShadow: "0 0 0 3px #00C896" },
        }}
      >
        {/* ── Full-bleed image background ───────────────────────── */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            background:
              "radial-gradient(ellipse at 50% 28%, #1C2230 0%, #0E1218 55%, #080A0D 100%)",
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
                objectPosition: "center 28%",
                display: "block",
                pt: "9%",
                pb: "38%",
                px: "6%",
                transition: "transform 0.45s ease",
                transform: isHovered ? "scale(1.045)" : "scale(1)",
                filter: "drop-shadow(0 18px 36px rgba(0,0,0,0.65))",
              }}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                pb: "38%",
                color: "rgba(255,255,255,0.14)",
              }}
            >
              <Typography sx={{ fontWeight: 900, fontSize: "3rem", letterSpacing: -1 }}>
                DM
              </Typography>
              <Typography
                sx={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase" }}
              >
                DressMe
              </Typography>
            </Box>
          )}

          {/* Deep vignette — top subtle + bottom strong into glass */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "linear-gradient(to bottom, rgba(8,10,13,0.3) 0%, transparent 18%, transparent 42%, rgba(8,10,13,0.65) 70%, rgba(8,10,13,0.95) 100%)",
            }}
          />
        </Box>

        {/* ── Top bar: badges (left) + counter + wishlist (right) ── */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ position: "relative", zIndex: 4, p: 1.5, pointerEvents: "none" }}
        >
          <Stack direction="column" spacing={0.5} sx={{ pointerEvents: "auto" }}>
            {isOutOfStock ? (
              <Chip
                label="Sold Out"
                size="small"
                sx={{
                  bgcolor: "rgba(180,20,20,0.82)",
                  color: "#FFF",
                  fontWeight: 800,
                  fontSize: "0.62rem",
                  letterSpacing: "0.07em",
                  height: 22,
                  px: 0.4,
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              />
            ) : (
              <>
                {discountPercent > 0 && (
                  <Chip
                    label={`-${discountPercent}%`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(220,38,38,0.86)",
                      color: "#FFF",
                      fontWeight: 800,
                      fontSize: "0.65rem",
                      height: 22,
                      px: 0.4,
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      boxShadow: "0 3px 10px rgba(220,38,38,0.4)",
                    }}
                  />
                )}
                {product.isNewArrival && (
                  <Chip
                    label="NEW"
                    size="small"
                    sx={{
                      bgcolor: "rgba(0,200,150,0.88)",
                      color: "#061410",
                      fontWeight: 800,
                      fontSize: "0.62rem",
                      letterSpacing: "0.09em",
                      height: 22,
                      px: 0.4,
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.28)",
                      boxShadow: "0 3px 10px rgba(0,200,150,0.4)",
                    }}
                  />
                )}
                {product.isTrending && (
                  <Chip
                    label="HOT"
                    size="small"
                    sx={{
                      bgcolor: "rgba(245,158,11,0.9)",
                      color: "#180E02",
                      fontWeight: 800,
                      fontSize: "0.62rem",
                      letterSpacing: "0.07em",
                      height: 22,
                      px: 0.4,
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.22)",
                    }}
                  />
                )}
                {product.featured && !product.isTrending && (
                  <Chip
                    label="FEATURED"
                    size="small"
                    sx={{
                      bgcolor: "rgba(20,30,50,0.82)",
                      color: "rgba(255,255,255,0.9)",
                      fontWeight: 700,
                      fontSize: "0.58rem",
                      letterSpacing: "0.07em",
                      height: 22,
                      px: 0.4,
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.13)",
                    }}
                  />
                )}
                {isLowStock && (
                  <Chip
                    label={`Only ${totalStock} left`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(234,88,12,0.84)",
                      color: "#FFF",
                      fontWeight: 700,
                      fontSize: "0.6rem",
                      height: 22,
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                  />
                )}
              </>
            )}
          </Stack>

          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ pointerEvents: "auto" }}>
            {images.length > 1 && (
              <Box
                sx={{
                  bgcolor: "rgba(10,14,20,0.68)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  px: 0.9,
                  py: 0.35,
                  borderRadius: "20px",
                  letterSpacing: "0.06em",
                }}
              >
                {currentImageIndex + 1}/{images.length}
              </Box>
            )}
            <IconButton
              onClick={handleToggleFavorite}
              disabled={addToFavorites.isPending || removeFromFavorites.isPending}
              aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
              size="small"
              sx={{
                bgcolor: "rgba(10,14,20,0.68)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: isFavorited ? "#00C896" : "rgba(255,255,255,0.82)",
                width: 34,
                height: 34,
                transition: "all 0.22s ease",
                "&:hover": {
                  bgcolor: isFavorited ? "rgba(0,200,150,0.22)" : "rgba(255,255,255,0.16)",
                  borderColor: isFavorited ? "#00C896" : "rgba(255,255,255,0.28)",
                  transform: "scale(1.1)",
                },
              }}
            >
              {isFavorited ? (
                <FavoriteIcon sx={{ fontSize: 16, color: "#00C896" }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Stack>
        </Stack>

        {/* ── Multi-image nav arrows ────────────────────────────── */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevImage}
              aria-label="Previous product image"
              size="small"
              sx={{
                position: "absolute",
                top: "34%",
                left: 8,
                zIndex: 5,
                bgcolor: "rgba(10,14,20,0.7)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.13)",
                color: "#FFF",
                width: 30,
                height: 30,
                opacity: { xs: 0.8, md: isHovered ? 1 : 0 },
                transform: isHovered ? "translateX(0)" : "translateX(-4px)",
                transition: "all 0.22s ease",
                "&:hover": { bgcolor: "#00C896", color: "#0B131E", borderColor: "#00C896" },
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
                top: "34%",
                right: 8,
                zIndex: 5,
                bgcolor: "rgba(10,14,20,0.7)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.13)",
                color: "#FFF",
                width: 30,
                height: 30,
                opacity: { xs: 0.8, md: isHovered ? 1 : 0 },
                transform: isHovered ? "translateX(0)" : "translateX(4px)",
                transition: "all 0.22s ease",
                "&:hover": { bgcolor: "#00C896", color: "#0B131E", borderColor: "#00C896" },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </>
        )}

        {/* ── Dot indicators — above glass panel ───────────────── */}
        {images.length > 1 && (
          <Stack
            direction="row"
            spacing={0.6}
            justifyContent="center"
            alignItems="center"
            sx={{
              position: "absolute",
              bottom: "37%",
              left: 0,
              right: 0,
              zIndex: 5,
              pointerEvents: "auto",
              opacity: isHovered ? 1 : 0.5,
              transition: "opacity 0.25s ease",
            }}
          >
            {images.map((img, idx) => (
              <Box
                key={img.id || idx}
                onClick={(e) => handleDotClick(idx, e)}
                sx={{
                  width: currentImageIndex === idx ? 18 : 5,
                  height: 5,
                  borderRadius: "3px",
                  bgcolor: currentImageIndex === idx ? "#00C896" : "rgba(255,255,255,0.38)",
                  boxShadow: currentImageIndex === idx ? "0 0 7px rgba(0,200,150,0.8)" : "none",
                  cursor: "pointer",
                  transition: "all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                  "&:hover": {
                    bgcolor: currentImageIndex === idx ? "#00C896" : "rgba(255,255,255,0.7)",
                  },
                }}
              />
            ))}
          </Stack>
        )}

        {/* ── Glassmorphism overlay — floats over image bottom ──── */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 6,
            borderRadius: "0 0 20px 20px",
            background:
              "linear-gradient(160deg, rgba(14,20,28,0.76) 0%, rgba(8,12,18,0.91) 100%)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            borderTop: isHovered
              ? "1px solid rgba(0,200,150,0.32)"
              : "1px solid rgba(255,255,255,0.13)",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
            px: { xs: 1.5, sm: 1.75 },
            pt: 1.25,
            pb: 1.5,
            display: "flex",
            flexDirection: "column",
            gap: 0.6,
            transition: "border-color 0.3s ease",
          }}
        >
          {/* Row 1: Brand + verified | Rating or Vendor */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={0.4}>
              <Typography
                sx={{
                  fontSize: "0.67rem",
                  fontWeight: 700,
                  color: "#00C896",
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                {product.brand?.name || "DressMe"}
              </Typography>
              {product.vendor?.isVerified && (
                <VerifiedIcon sx={{ fontSize: 11, color: "#00C896" }} />
              )}
            </Stack>

            {product.averageRating > 0 ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.3}
                sx={{
                  bgcolor: "rgba(255,255,255,0.07)",
                  px: 0.7,
                  py: 0.15,
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <StarIcon sx={{ fontSize: 11, color: "#FBBF24" }} />
                <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#FFF" }}>
                  {product.averageRating.toFixed(1)}
                </Typography>
                <Typography sx={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.45)" }}>
                  ({product.reviewCount})
                </Typography>
              </Stack>
            ) : product.vendor?.businessName ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.3}
                sx={{
                  bgcolor: "rgba(255,255,255,0.05)",
                  px: 0.65,
                  py: 0.15,
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <StorefrontIcon sx={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }} />
                <Typography
                  sx={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.56)", fontWeight: 500 }}
                >
                  {product.vendor.businessName}
                </Typography>
              </Stack>
            ) : null}
          </Stack>

          {/* Row 2: Product name */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "0.93rem", sm: "1.02rem" },
              lineHeight: 1.25,
              color: "#FFFFFF",
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

          {/* Row 3: Price + compare-at */}
          <Stack direction="row" alignItems="baseline" spacing={0.85}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.08rem",
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {formatCurrency(product.price)}
            </Typography>
            {hasSalePrice && (
              <Typography
                sx={{
                  fontSize: "0.77rem",
                  color: "rgba(255,255,255,0.33)",
                  textDecoration: "line-through",
                  fontWeight: 500,
                }}
              >
                {formatCurrency(product.compareAtPrice!)}
              </Typography>
            )}
          </Stack>

          {/* Row 4: Sizes · Colors · Add to Cart */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ pt: 0.5, borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            {visibleSizes.slice(0, 3).map(([label, { id, inStock }]) => (
              <Box
                key={label}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (inStock) setSelectedVariantId(id);
                }}
                sx={{
                  px: 0.65,
                  py: 0.15,
                  borderRadius: "4px",
                  bgcolor:
                    selectedVariantId === id
                      ? "rgba(0,200,150,0.2)"
                      : inStock
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.03)",
                  border: "1px solid",
                  borderColor:
                    selectedVariantId === id
                      ? "#00C896"
                      : inStock
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(255,255,255,0.04)",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  color:
                    selectedVariantId === id
                      ? "#00C896"
                      : inStock
                      ? "rgba(255,255,255,0.82)"
                      : "rgba(255,255,255,0.2)",
                  textDecoration: inStock ? "none" : "line-through",
                  cursor: inStock ? "pointer" : "default",
                  flexShrink: 0,
                  transition: "all 0.18s ease",
                }}
              >
                {label}
              </Box>
            ))}
            {sizeOverflow > 0 && (
              <Typography
                sx={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.32)", flexShrink: 0 }}
              >
                +{sizeOverflow}
              </Typography>
            )}

            {useSwatches &&
              visibleColors.slice(0, 3).map(([label, { inStock }]) => (
                <Box
                  key={label}
                  title={label}
                  sx={{
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    bgcolor: label.toLowerCase(),
                    border: "1.5px solid rgba(255,255,255,0.25)",
                    opacity: inStock ? 1 : 0.3,
                    flexShrink: 0,
                  }}
                />
              ))}

            <Box sx={{ flex: 1, minWidth: 0 }} />

            <Button
              variant="contained"
              size="small"
              startIcon={
                addToCart.isPending ? (
                  <CircularProgress size={11} color="inherit" />
                ) : (
                  <ShoppingBagOutlinedIcon sx={{ fontSize: "12px !important" }} />
                )
              }
              disabled={isOutOfStock || addToCart.isPending}
              onClick={handleAddToCart}
              sx={{
                py: 0.6,
                px: { xs: 1, sm: 1.25 },
                borderRadius: "9px",
                fontWeight: 700,
                fontSize: "0.67rem",
                letterSpacing: "0.02em",
                bgcolor: isOutOfStock ? "rgba(255,255,255,0.06)" : "#00C896",
                color: isOutOfStock ? "rgba(255,255,255,0.25)" : "#061410",
                border: "1px solid",
                borderColor: isOutOfStock ? "rgba(255,255,255,0.06)" : "#00C896",
                boxShadow: isOutOfStock ? "none" : "0 3px 12px rgba(0,200,150,0.35)",
                textTransform: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
                minWidth: "auto",
                transition: "all 0.22s ease",
                "&:hover": {
                  bgcolor: "#00DFA8",
                  borderColor: "#00DFA8",
                  color: "#050D09",
                  boxShadow: "0 5px 18px rgba(0,200,150,0.5)",
                  transform: "translateY(-1px)",
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.18)",
                  borderColor: "transparent",
                },
              }}
            >
              {isOutOfStock ? "Sold Out" : "Add to Cart"}
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* ── Feedback Snackbars ────────────────────────────────── */}
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
            boxShadow: "0 8px 24px rgba(0,200,150,0.4)",
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
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {favoriteMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
