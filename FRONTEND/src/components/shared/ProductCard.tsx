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
import type { Product } from "../../types/product";
import { useAddToCart } from "../../hooks/useCart";
import { useFavorites, useAddToFavorites, useRemoveFromFavorites } from "../../hooks/useFavorites";
import { useFormatCurrency } from "../../utils/currency";

interface ProductCardProps {
  product: Product;
}

// How many px of the hover panel peek above the card bottom when NOT hovered.
// This is exactly what is always visible: price + size row.
const PEEK_HEIGHT = 48; // px  (price row ~28px + 20px padding)

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || addToCart.isPending) return;
    const variantId =
      selectedVariantId ||
      (product.variants?.find((v) => (v.stock ?? 0) > 0) || product.variants?.[0])?.id;
    addToCart.mutate(
      { productId: product.id, variantId, quantity: 1, product },
      { onSuccess: () => setShowCartSuccess(true) }
    );
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleCardClick = () => navigate(`/products/${product.slug}`);

  // Sizes
  const sizeMap = new Map<string, { id: string; inStock: boolean }>();
  for (const v of product.variants ?? []) {
    if (v.sizeValue) {
      const key = v.sizeValue.trim().toUpperCase();
      if (!sizeMap.has(key)) sizeMap.set(key, { id: v.id, inStock: (v.stock ?? 0) > 0 });
      else if ((v.stock ?? 0) > 0) sizeMap.set(key, { id: v.id, inStock: true });
    }
  }
  const sizes = [...sizeMap.entries()];
  const visibleSizes = sizes.slice(0, 3);

  // Colors
  const colorMap = new Map<string, { id: string; inStock: boolean }>();
  for (const v of product.variants ?? []) {
    if (v.colorValue) {
      const key = v.colorValue.trim();
      if (!colorMap.has(key)) colorMap.set(key, { id: v.id, inStock: (v.stock ?? 0) > 0 });
      else if ((v.stock ?? 0) > 0) colorMap.set(key, { id: v.id, inStock: true });
    }
  }
  const visibleColors = [...colorMap.entries()].slice(0, 4);
  const isValidCssColor = (c: string) => { const s = new Option().style; s.color = c.toLowerCase(); return s.color !== ""; };
  const useSwatches = visibleColors.length > 0 && visibleColors.every(([label]) => isValidCssColor(label));

  return (
    <>
      {/* ════════════════════ PINTEREST HOVER-REVEAL CARD ════════════════════ */}
      <Box
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="article"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick(); }
        }}
        sx={{
          position: "relative",
          width: "100%",
          // Tall portrait ratio — Pinterest style
          aspectRatio: "3 / 4",
          borderRadius: { xs: "14px", sm: "18px" },
          overflow: "hidden",
          cursor: "pointer",
          bgcolor: "#0B0E14",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          boxShadow: isHovered
            ? "0 22px 44px -8px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,200,150,0.28)"
            : "0 4px 16px -2px rgba(0,0,0,0.5)",
          transform: isHovered ? "translateY(-5px) scale(1.015)" : "translateY(0) scale(1)",
          transition: "all 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
          outline: "none",
          breakInside: "avoid",
          "&:focus-visible": { boxShadow: "0 0 0 3px #00C896" },
        }}
      >
        {/* ── IMAGE (fills entire card) ───────────────────────────────────── */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            bgcolor: "#0E131C",
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
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
                transition: "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: isHovered ? "scale(1.06)" : "scale(1)",
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
                background: "radial-gradient(circle at 50% 40%, #1A212D 0%, #0B0E14 100%)",
                color: "rgba(255,255,255,0.1)",
              }}
            >
              <Typography sx={{ fontWeight: 900, fontSize: "2rem" }}>DM</Typography>
            </Box>
          )}

          {/* Permanent bottom gradient — makes the peek area legible */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "55%",
              pointerEvents: "none",
              background:
                "linear-gradient(to top, rgba(6,8,12,0.96) 0%, rgba(6,8,12,0.7) 35%, transparent 100%)",
            }}
          />
        </Box>

        {/* ── TOP-LEFT BADGES (hover reveal) ─────────────────────────────── */}
        <Stack
          direction="column"
          spacing={0.4}
          sx={{
            position: "absolute",
            top: { xs: 8, sm: 10 },
            left: { xs: 8, sm: 10 },
            zIndex: 6,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(-6px)",
            transition: "all 0.3s ease",
            pointerEvents: isHovered ? "auto" : "none",
          }}
        >
          {isOutOfStock && (
            <Chip label="Sold Out" size="small" sx={{ bgcolor: "rgba(220,38,38,0.9)", color: "#FFF", fontWeight: 800, fontSize: "0.58rem", height: 20, px: 0.3, backdropFilter: "blur(8px)" }} />
          )}
          {!isOutOfStock && discountPercent > 0 && (
            <Chip label={`-${discountPercent}%`} size="small" sx={{ bgcolor: "rgba(220,38,38,0.9)", color: "#FFF", fontWeight: 800, fontSize: "0.58rem", height: 20, px: 0.3, backdropFilter: "blur(8px)" }} />
          )}
          {product.isNewArrival && (
            <Chip label="NEW" size="small" sx={{ bgcolor: "rgba(0,200,150,0.92)", color: "#07130F", fontWeight: 800, fontSize: "0.58rem", height: 20, px: 0.3 }} />
          )}
          {product.isTrending && (
            <Chip label="HOT" size="small" sx={{ bgcolor: "rgba(245,158,11,0.92)", color: "#180E02", fontWeight: 800, fontSize: "0.58rem", height: 20, px: 0.3 }} />
          )}
          {isLowStock && (
            <Chip label={`${totalStock} left`} size="small" sx={{ bgcolor: "rgba(234,88,12,0.9)", color: "#FFF", fontWeight: 700, fontSize: "0.55rem", height: 20 }} />
          )}
        </Stack>

        {/* ── TOP-RIGHT: WISHLIST + IMAGE COUNTER (hover reveal) ─────────── */}
        <Stack
          direction="column"
          spacing={0.6}
          alignItems="flex-end"
          sx={{
            position: "absolute",
            top: { xs: 8, sm: 10 },
            right: { xs: 8, sm: 10 },
            zIndex: 6,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(-6px)",
            transition: "all 0.3s ease",
            pointerEvents: isHovered ? "auto" : "none",
          }}
        >
          <IconButton
            onClick={handleToggleFavorite}
            disabled={addToFavorites.isPending || removeFromFavorites.isPending}
            aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
            size="small"
            sx={{
              bgcolor: isFavorited ? "rgba(0,200,150,0.22)" : "rgba(10,15,26,0.7)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid",
              borderColor: isFavorited ? "rgba(0,200,150,0.5)" : "rgba(255,255,255,0.15)",
              color: isFavorited ? "#00C896" : "rgba(255,255,255,0.9)",
              width: { xs: 30, sm: 34 },
              height: { xs: 30, sm: 34 },
              transition: "all 0.2s ease",
              "&:hover": { bgcolor: isFavorited ? "rgba(0,200,150,0.35)" : "rgba(255,255,255,0.18)", transform: "scale(1.1)" },
            }}
          >
            {isFavorited
              ? <FavoriteIcon sx={{ fontSize: { xs: 15, sm: 17 }, color: "#00C896" }} />
              : <FavoriteBorderIcon sx={{ fontSize: { xs: 15, sm: 17 } }} />}
          </IconButton>

          {images.length > 1 && (
            <Box
              sx={{
                bgcolor: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                px: 0.7,
                py: 0.2,
                fontSize: "0.55rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.8)",
              }}
            >
              {currentImageIndex + 1}/{images.length}
            </Box>
          )}
        </Stack>

        {/* ── PREV/NEXT ARROWS (hover reveal) ────────────────────────────── */}
        {images.length > 1 && (
          <>
            {[
              { handler: handlePrevImage, Icon: ChevronLeftIcon, side: "left", label: "Previous image" },
              { handler: handleNextImage, Icon: ChevronRightIcon, side: "right", label: "Next image" },
            ].map(({ handler, Icon, side, label }) => (
              <IconButton
                key={side}
                onClick={handler}
                aria-label={label}
                size="small"
                sx={{
                  position: "absolute",
                  top: "38%",
                  [side]: { xs: 4, sm: 6 },
                  zIndex: 6,
                  bgcolor: "rgba(10,15,26,0.65)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#FFF",
                  width: { xs: 26, sm: 30 },
                  height: { xs: 26, sm: 30 },
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "translateY(-50%) translateX(0)" : `translateY(-50%) translateX(${side === "left" ? "-5px" : "5px"})`,
                  transition: "all 0.28s ease",
                  "&:hover": { bgcolor: "#00C896", color: "#0B131E" },
                }}
              >
                <Icon sx={{ fontSize: { xs: 14, sm: 16 } }} />
              </IconButton>
            ))}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            SLIDING PANEL — bottom of card
            • At rest:  translateY(calc(100% - PEEK_HEIGHT))
              → only the last PEEK_HEIGHT px show → price + sizes
            • On hover: translateY(0) → full panel revealed
        ══════════════════════════════════════════════════════════════════ */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
            // Slide: peek by default, full reveal on hover
            transform: isHovered
              ? "translateY(0)"
              : `translateY(calc(100% - ${PEEK_HEIGHT}px))`,
            transition: "transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
            background: "rgba(8, 11, 18, 0.75)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderTop: "1px solid rgba(255,255,255,0.09)",
            // Inner layout
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {/* ── HIDDEN SECTION (revealed on hover) ── */}
          <Box
            sx={{
              px: { xs: 1.25, sm: 1.5 },
              pt: { xs: 1, sm: 1.25 },
              pb: 0.5,
              display: "flex",
              flexDirection: "column",
              gap: { xs: 0.55, sm: 0.7 },
              // Fade in when panel is open
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.22s ease",
              transitionDelay: isHovered ? "0.12s" : "0s",
            }}
          >
            {/* Brand & Rating */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0.5}>
              <Typography
                sx={{
                  fontSize: { xs: "0.6rem", sm: "0.65rem" },
                  fontWeight: 700,
                  color: "#00C896",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {product.brand?.name || "DressMe"}
              </Typography>

              {product.averageRating > 0 ? (
                <Stack direction="row" alignItems="center" spacing={0.25} sx={{ flexShrink: 0 }}>
                  <StarIcon sx={{ fontSize: { xs: 10, sm: 11 }, color: "#FBBF24" }} />
                  <Typography sx={{ fontSize: { xs: "0.6rem", sm: "0.65rem" }, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
                    {product.averageRating.toFixed(1)}
                  </Typography>
                </Stack>
              ) : product.vendor?.businessName ? (
                <Stack direction="row" alignItems="center" spacing={0.2} sx={{ flexShrink: 0 }}>
                  <StorefrontIcon sx={{ fontSize: { xs: 9, sm: 10 }, color: "rgba(255,255,255,0.4)" }} />
                  <Typography sx={{ fontSize: { xs: "0.55rem", sm: "0.6rem" }, color: "rgba(255,255,255,0.4)", maxWidth: 60, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {product.vendor.businessName}
                  </Typography>
                </Stack>
              ) : null}
            </Stack>

            {/* Product name */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "0.83rem", sm: "0.92rem" },
                lineHeight: 1.3,
                color: "#FFF",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                letterSpacing: "-0.01em",
              }}
            >
              {product.name}
            </Typography>

            {/* Add to Cart */}
            <Button
              variant="contained"
              fullWidth
              size="small"
              startIcon={
                addToCart.isPending
                  ? <CircularProgress size={10} color="inherit" />
                  : <ShoppingBagOutlinedIcon sx={{ fontSize: "12px !important" }} />
              }
              disabled={isOutOfStock || addToCart.isPending}
              onClick={handleAddToCart}
              sx={{
                py: { xs: 0.5, sm: 0.6 },
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: { xs: "0.65rem", sm: "0.7rem" },
                letterSpacing: "0.02em",
                bgcolor: isOutOfStock ? "rgba(255,255,255,0.06)" : "#00C896",
                color: isOutOfStock ? "rgba(255,255,255,0.25)" : "#07130F",
                border: "1px solid",
                borderColor: isOutOfStock ? "transparent" : "#00C896",
                boxShadow: isOutOfStock ? "none" : "0 3px 12px rgba(0,200,150,0.3)",
                textTransform: "none",
                transition: "all 0.22s ease",
                "&:hover": { bgcolor: "#00E0A7", borderColor: "#00E0A7", color: "#050E0B", boxShadow: "0 5px 18px rgba(0,200,150,0.45)", transform: "translateY(-1px)" },
                "&.Mui-disabled": { bgcolor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.18)" },
              }}
            >
              {isOutOfStock ? "Sold Out" : "Add to Cart"}
            </Button>
          </Box>

          {/* ── ALWAYS-VISIBLE PEEK ROW: price + sizes ──────────────────── */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={0.5}
            sx={{
              px: { xs: 1.25, sm: 1.5 },
              height: `${PEEK_HEIGHT}px`,
              flexShrink: 0,
            }}
          >
            {/* Price */}
            <Stack direction="row" alignItems="baseline" spacing={0.5}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "0.92rem", sm: "1rem" },
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
                    fontSize: { xs: "0.62rem", sm: "0.68rem" },
                    color: "rgba(255,255,255,0.38)",
                    textDecoration: "line-through",
                    fontWeight: 500,
                  }}
                >
                  {formatCurrency(product.compareAtPrice!)}
                </Typography>
              )}
            </Stack>

            {/* Sizes or color swatches */}
            <Stack direction="row" alignItems="center" spacing={0.3} sx={{ flexShrink: 0 }}>
              {useSwatches
                ? visibleColors.slice(0, 4).map(([label, { inStock }]) => (
                    <Box
                      key={label}
                      title={label}
                      sx={{
                        width: { xs: 9, sm: 10 },
                        height: { xs: 9, sm: 10 },
                        borderRadius: "50%",
                        bgcolor: label.toLowerCase(),
                        border: "1.5px solid rgba(255,255,255,0.3)",
                        opacity: inStock ? 1 : 0.3,
                        flexShrink: 0,
                      }}
                    />
                  ))
                : visibleSizes.map(([label, { id, inStock }]) => (
                    <Box
                      key={label}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (inStock) setSelectedVariantId(id); }}
                      sx={{
                        px: 0.45,
                        py: 0.15,
                        borderRadius: "3px",
                        bgcolor: selectedVariantId === id ? "rgba(0,200,150,0.2)" : inStock ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                        border: "1px solid",
                        borderColor: selectedVariantId === id ? "#00C896" : inStock ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                        fontSize: "0.55rem",
                        fontWeight: 700,
                        color: selectedVariantId === id ? "#00C896" : inStock ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.2)",
                        textDecoration: inStock ? "none" : "line-through",
                        cursor: inStock ? "pointer" : "default",
                        flexShrink: 0,
                      }}
                    >
                      {label}
                    </Box>
                  ))}
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Feedback Snackbars */}
      <Snackbar open={showCartSuccess} autoHideDuration={3000} onClose={() => setShowCartSuccess(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" onClose={() => setShowCartSuccess(false)} sx={{ bgcolor: "#00C896", color: "#07130F", fontWeight: 700, boxShadow: "0 8px 24px rgba(0,200,150,0.4)", "& .MuiAlert-icon": { color: "#07130F" } }}>
          {product.name} added to cart!
        </Alert>
      </Snackbar>

      <Snackbar open={showFavoriteSuccess} autoHideDuration={3000} onClose={() => setShowFavoriteSuccess(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="info" onClose={() => setShowFavoriteSuccess(false)} sx={{ bgcolor: "#1E293B", color: "#FFF", fontWeight: 600, border: "1px solid rgba(255,255,255,0.12)" }}>
          {favoriteMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
