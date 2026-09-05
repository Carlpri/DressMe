import React, { useState, useRef, useEffect } from "react";
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
  variant?: "default" | "trending" | "featured" | "compact";
  size?: "small" | "medium" | "large";
}

// Standard apparel size sort order
const STANDARD_SIZE_ORDER = [
  "XXS", "XS", "S", "M", "L", "XL", "2XL", "XXL", "3XL", "XXXL", "4XL", "5XL", "ONE SIZE", "OS",
];

/* ── Palette ─────────────────────────────────────────────────────────────── */
const EMERALD      = "#10B981";
const EMERALD_DARK = "#0D5E4B";
const EMERALD_GLOW = "rgba(16,185,129,0.35)";

export function ProductCard({ product, variant = "default", size }: ProductCardProps) {
  const isLarge    = size === "large" || variant === "trending";
  const navigate   = useNavigate();
  const cardRef    = useRef<HTMLDivElement>(null);
  const { data: favorites } = useFavorites();
  const isFavorited = favorites ? favorites.some((f) => f.id === product.id) : false;

  const [currentImageIndex, setCurrentImageIndex]   = useState(0);
  const [showCartSuccess, setShowCartSuccess]         = useState(false);
  const [showFavoriteSuccess, setShowFavoriteSuccess] = useState(false);
  const [favoriteMessage, setFavoriteMessage]         = useState("Added to wishlist!");
  const [isHovered, setIsHovered]                     = useState(false);

  const formatCurrency      = useFormatCurrency();
  const addToCart           = useAddToCart();
  const addToFavorites      = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  /* ── Touch auto-retract ─────────────────────────────────────────────────── */
  const autoCloseTimer            = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartedWhileRevealed = useRef(false);
  const touchMoved                = useRef(false);

  useEffect(() => {
    return () => { if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current); };
  }, []);

  // Dismiss on outside interaction
  useEffect(() => {
    if (!isHovered) return;
    const dismiss = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsHovered(false);
        if (autoCloseTimer.current) { clearTimeout(autoCloseTimer.current); autoCloseTimer.current = null; }
      }
    };
    document.addEventListener("mousedown", dismiss);
    document.addEventListener("touchstart", dismiss);
    return () => {
      document.removeEventListener("mousedown", dismiss);
      document.removeEventListener("touchstart", dismiss);
    };
  }, [isHovered]);

  /* ── Derived data ───────────────────────────────────────────────────────── */
  const images = product.images && product.images.length > 0
    ? [...product.images].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    : [];
  const activeImage = images[currentImageIndex] || images[0];

  const totalStock      = (product.variants ?? []).reduce((sum, v) => sum + (v.stock ?? 0), 0);
  const isOutOfStock    = totalStock === 0 || product.status === "HIDDEN";
  const isLowStock      = totalStock > 0 && totalStock <= 3 && product.status !== "HIDDEN";
  const hasSalePrice    = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const savings         = hasSalePrice ? product.compareAtPrice! - product.price : 0;
  const discountPercent = hasSalePrice ? Math.round((savings / product.compareAtPrice!) * 100) : 0;

  /* ── Size / colour maps ─────────────────────────────────────────────────── */
  const inStockSizesMap = new Map<string, string>();
  const allSizesMap     = new Map<string, string>();
  for (const v of (product.variants ?? []) as any[]) {
    const rawSize = v.sizeValue || v.size || (v.sizeObj && v.sizeObj.name);
    if (rawSize && typeof rawSize === "string") {
      const trimmed = rawSize.trim();
      const key     = trimmed.toUpperCase();
      if (key) {
        allSizesMap.set(key, trimmed);
        const inStock = v.stock === undefined || v.stock === null ? true : Number(v.stock) > 0;
        if (inStock) inStockSizesMap.set(key, trimmed);
      }
    }
  }
  if (Array.isArray((product as any).sizes)) {
    for (const s of (product as any).sizes) {
      if (typeof s === "string" && s.trim()) {
        const trimmed = s.trim();
        allSizesMap.set(trimmed.toUpperCase(), trimmed);
        inStockSizesMap.set(trimmed.toUpperCase(), trimmed);
      }
    }
  }
  const effectiveSizesMap = inStockSizesMap.size > 0 ? inStockSizesMap : allSizesMap;
  const inStockSizes = Array.from(effectiveSizesMap.entries())
    .sort(([kA], [kB]) => {
      const iA = STANDARD_SIZE_ORDER.indexOf(kA);
      const iB = STANDARD_SIZE_ORDER.indexOf(kB);
      if (iA !== -1 && iB !== -1) return iA - iB;
      if (iA !== -1) return -1;
      if (iB !== -1) return 1;
      return kA.localeCompare(kB);
    })
    .map(([, orig]) => orig);

  const colorMap = new Map<string, { id: string; inStock: boolean }>();
  for (const v of product.variants ?? []) {
    if (v.colorValue) {
      const key = v.colorValue.trim();
      if (!colorMap.has(key)) colorMap.set(key, { id: v.id, inStock: (v.stock ?? 0) > 0 });
      else if ((v.stock ?? 0) > 0) colorMap.set(key, { id: v.id, inStock: true });
    }
  }
  const colorVariants = Array.from(colorMap.entries());

  /* ── Event handlers ─────────────────────────────────────────────────────── */
  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentImageIndex((p) => (p > 0 ? p - 1 : images.length - 1));
  };
  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentImageIndex((p) => (p < images.length - 1 ? p + 1 : 0));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (isOutOfStock || addToCart.isPending) return;
    const variantId =
      (product.variants?.find((v) => (v.stock ?? 0) > 0) || product.variants?.[0])?.id;
    addToCart.mutate(
      { productId: product.id, variantId, quantity: 1, product },
      { onSuccess: () => setShowCartSuccess(true) }
    );
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
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

  const handleMouseEnter = () => {
    if (autoCloseTimer.current) { clearTimeout(autoCloseTimer.current); autoCloseTimer.current = null; }
    setIsHovered(true);
  };
  const handleMouseLeave = () => setIsHovered(false);

  const triggerTouchReveal = () => {
    setIsHovered(true);
    if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    autoCloseTimer.current = setTimeout(() => { setIsHovered(false); autoCloseTimer.current = null; }, 2800);
  };

  const handleTouchStart = () => {
    touchMoved.current = false;
    touchStartedWhileRevealed.current = isHovered;
  };
  const handleTouchMove = () => { touchMoved.current = true; };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if (touchMoved.current) { touchMoved.current = false; return; }
    if (touchStartedWhileRevealed.current || !("ontouchstart" in window)) {
      navigate(`/products/${product.slug}`);
    } else {
      triggerTouchReveal();
    }
  };

  /* ══════════════════════════════════════════════════════════════════════════
      RENDER
  ══════════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <Box
        ref={cardRef}
        onClick={handleCardClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="article"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate(`/products/${product.slug}`);
          }
        }}
        sx={{
          position: "relative",
          width: "100%",
          cursor: "pointer",
          bgcolor: isLarge ? "#FFFFFF" : "transparent",
          borderRadius: isLarge ? "14px" : "6px",
          border: isLarge ? "1px solid rgba(0,0,0,0.06)" : "none",
          boxShadow: isLarge
            ? (isHovered ? "0 16px 36px rgba(0,0,0,0.09)" : "0 4px 18px rgba(0,0,0,0.03)")
            : "none",
          p: isLarge ? { xs: 1, sm: 1.25 } : 0,
          outline: "none",
          breakInside: "avoid",
          WebkitTapHighlightColor: "transparent",
          "&:focus-visible": { outline: `2px solid ${EMERALD}`, outlineOffset: 2 },
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.32s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* ─────────────────────────────────────────────────────────────────
            IMAGE ZONE — position: relative so all overlays anchor inside it.
            The img itself is width:100% / height:auto — natural dimensions
            drive the card height for true variable-height masonry.
        ───────────────────────────────────────────────────────────────── */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            borderRadius: isLarge ? "10px" : "4px",
            bgcolor: "#0E131C",
          }}
        >
          {/* Product image — natural aspect ratio */}
          {activeImage ? (
            <Box
              component="img"
              src={activeImage.imageUrl}
              alt={activeImage.altText || product.name}
              loading="lazy"
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
                minHeight: isLarge ? { xs: 210, sm: 270, md: 330 } : 140,
                objectFit: "cover",
                transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                aspectRatio: isLarge ? "3 / 4.2" : "3 / 4",
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

          {/* Permanent badge for trending cards */}
          {(variant === "trending" || product.isTrending) && (
            <Box
              sx={{
                position: "absolute",
                top: { xs: 8, sm: 10 },
                right: { xs: 8, sm: 10 },
                zIndex: 5,
                bgcolor: "rgba(13,94,75,0.85)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: { xs: "0.55rem", sm: "0.62rem" },
                letterSpacing: "0.03em",
                borderRadius: "6px",
                px: 0.8,
                py: 0.3,
                border: "1px solid rgba(16,185,129,0.35)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                pointerEvents: "none",
                opacity: isHovered ? 0 : 1,
                transition: "opacity 0.22s ease",
              }}
            >
              🔥 2026 Trend
            </Box>
          )}

          {/* Top gradient — makes size chips legible over any photo */}
          <Box
            sx={{
              position: "absolute", top: 0, left: 0, right: 0, height: "30%",
              pointerEvents: "none",
              background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)",
            }}
          />

          {/* Bottom gradient — softens into cart button */}
          <Box
            sx={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "36%",
              pointerEvents: "none",
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
            }}
          />

          {/* ── SIZE CHIPS — top-left, visible at rest, fade on hover ──── */}
          {inStockSizes.length > 0 && (
            <Stack
              direction="row"
              flexWrap="wrap"
              useFlexGap
              spacing={0.3}
              sx={{
                position: "absolute",
                top: { xs: 7, sm: 9 },
                left: { xs: 7, sm: 9 },
                gap: 0.3,
                opacity: isHovered ? 0 : 1,
                transition: "opacity 0.22s ease",
                pointerEvents: "none",
              }}
            >
              {inStockSizes.slice(0, 5).map((size) => (
                <Box
                  key={size}
                  sx={{
                    px: { xs: 0.4, sm: 0.5 }, py: 0.1,
                    borderRadius: "3px",
                    border: "1px solid rgba(255,255,255,0.75)",
                    fontSize: { xs: "0.55rem", sm: "0.6rem" },
                    fontWeight: 800, color: "#FFF",
                    letterSpacing: "0.03em",
                    textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                    lineHeight: 1.1,
                  }}
                >
                  {size}
                </Box>
              ))}
              {inStockSizes.length > 5 && (
                <Box sx={{ px: 0.4, py: 0.1, borderRadius: "3px", border: "1px solid rgba(255,255,255,0.5)", fontSize: "0.52rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", textShadow: "0 1px 3px rgba(0,0,0,0.9)", lineHeight: 1.1 }}>
                  +{inStockSizes.length - 5}
                </Box>
              )}
            </Stack>
          )}

          {/* ── COLOR DOTS — below sizes, at rest ──────────────────────── */}
          {colorVariants.length > 1 && (
            <Stack
              direction="row"
              spacing={0.4}
              alignItems="center"
              sx={{
                position: "absolute",
                top: inStockSizes.length > 0 ? { xs: 26, sm: 30 } : { xs: 7, sm: 9 },
                left: { xs: 7, sm: 9 },
                opacity: isHovered ? 0 : 1,
                transition: "opacity 0.22s ease",
                pointerEvents: "none",
              }}
            >
              {colorVariants.slice(0, 6).map(([colorName, { inStock }]) => (
                <Box
                  key={colorName}
                  title={colorName}
                  sx={{
                    width: { xs: 7, sm: 8 }, height: { xs: 7, sm: 8 },
                    borderRadius: "50%",
                    bgcolor: colorName.toLowerCase(),
                    border: "1.5px solid rgba(255,255,255,0.8)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.7)",
                    opacity: inStock ? 1 : 0.4,
                    flexShrink: 0,
                  }}
                />
              ))}
              {colorVariants.length > 6 && (
                <Typography sx={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.9)", fontWeight: 800, textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}>
                  +{colorVariants.length - 6}
                </Typography>
              )}
            </Stack>
          )}

          {/* ── BADGE CHIPS — top-left, revealed on hover ─────────────── */}
          <Stack
            direction="column"
            spacing={0.4}
            sx={{
              position: "absolute",
              top: { xs: 7, sm: 9 },
              left: { xs: 7, sm: 9 },
              zIndex: 6,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "translateY(0)" : "translateY(-6px)",
              transition: "all 0.28s ease",
              pointerEvents: "none",
            }}
          >
            {isOutOfStock && <Chip label="Sold Out" size="small" sx={{ bgcolor: "rgba(220,38,38,0.9)", color: "#FFF", fontWeight: 800, fontSize: "0.56rem", height: 18, px: 0.3 }} />}
            {!isOutOfStock && discountPercent > 0 && <Chip label={`-${discountPercent}%`} size="small" sx={{ bgcolor: "rgba(220,38,38,0.9)", color: "#FFF", fontWeight: 800, fontSize: "0.56rem", height: 18, px: 0.3 }} />}
            {product.isNewArrival && <Chip label="NEW" size="small" sx={{ bgcolor: `${EMERALD}ee`, color: "#07130F", fontWeight: 800, fontSize: "0.56rem", height: 18, px: 0.3 }} />}
            {product.isTrending && <Chip label="HOT" size="small" sx={{ bgcolor: "rgba(245,158,11,0.92)", color: "#180E02", fontWeight: 800, fontSize: "0.56rem", height: 18, px: 0.3 }} />}
            {isLowStock && <Chip label={`${totalStock} left`} size="small" sx={{ bgcolor: "rgba(234,88,12,0.9)", color: "#FFF", fontWeight: 700, fontSize: "0.52rem", height: 18 }} />}
          </Stack>

          {/* ── WISHLIST BUTTON — top-right, revealed on hover ──────────── */}
          <IconButton
            onClick={handleToggleFavorite}
            disabled={addToFavorites.isPending || removeFromFavorites.isPending}
            aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
            size="small"
            sx={{
              position: "absolute",
              top: { xs: 7, sm: 9 },
              right: { xs: 7, sm: 9 },
              zIndex: 6,
              bgcolor: isFavorited ? `${EMERALD}30` : "rgba(10,15,26,0.7)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid",
              borderColor: isFavorited ? `${EMERALD}70` : "rgba(255,255,255,0.15)",
              color: isFavorited ? EMERALD : "rgba(255,255,255,0.9)",
              width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 },
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "translateY(0)" : "translateY(-6px)",
              transition: "all 0.28s ease",
              pointerEvents: isHovered ? "auto" : "none",
              "&:hover": { bgcolor: isFavorited ? `${EMERALD}50` : "rgba(255,255,255,0.18)", transform: "translateY(0) scale(1.1)" },
            }}
          >
            {isFavorited
              ? <FavoriteIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: EMERALD }} />
              : <FavoriteBorderIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
            }
          </IconButton>

          {/* Image counter */}
          {images.length > 1 && (
            <Box
              sx={{
                position: "absolute", top: { xs: 42, sm: 48 }, right: { xs: 7, sm: 9 }, zIndex: 6,
                bgcolor: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", borderRadius: "8px",
                px: 0.6, py: 0.15, fontSize: "0.52rem", fontWeight: 700, color: "rgba(255,255,255,0.8)",
                opacity: isHovered ? 1 : 0, transition: "opacity 0.28s ease",
              }}
            >
              {currentImageIndex + 1}/{images.length}
            </Box>
          )}

          {/* ── PREV / NEXT ARROWS ──────────────────────────────────────── */}
          {images.length > 1 && (
            <>
              {[
                { handler: handlePrevImage, Icon: ChevronLeftIcon, side: "left" as const, label: "Previous image" },
                { handler: handleNextImage, Icon: ChevronRightIcon, side: "right" as const, label: "Next image" },
              ].map(({ handler, Icon, side, label }) => (
                <IconButton
                  key={side}
                  onClick={handler}
                  aria-label={label}
                  size="small"
                  sx={{
                    position: "absolute", top: "42%", [side]: { xs: 4, sm: 5 }, zIndex: 6,
                    bgcolor: "rgba(10,15,26,0.65)", backdropFilter: "blur(10px)", color: "#FFF",
                    width: { xs: 24, sm: 28 }, height: { xs: 24, sm: 28 },
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered
                      ? "translateY(-50%) translateX(0)"
                      : `translateY(-50%) translateX(${side === "left" ? "-5px" : "5px"})`,
                    transition: "all 0.26s ease",
                    "&:hover": { bgcolor: EMERALD_DARK, color: "#FFF" },
                  }}
                >
                  <Icon sx={{ fontSize: { xs: 13, sm: 15 } }} />
                </IconButton>
              ))}
            </>
          )}

          {/* ── ADD TO CART — bottom overlay, revealed on hover ─────────── */}
          <Box
            sx={{
              position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 5,
              px: { xs: 0.75, sm: 1 }, pb: { xs: 0.75, sm: 1 },
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "translateY(0)" : "translateY(6px)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              pointerEvents: isHovered ? "auto" : "none",
            }}
          >
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
                py: { xs: 0.55, sm: 0.65 }, borderRadius: "6px",
                fontWeight: 700, fontSize: { xs: "0.65rem", sm: "0.7rem" },
                letterSpacing: "0.02em", textTransform: "none",
                bgcolor: isOutOfStock ? "rgba(255,255,255,0.08)" : EMERALD,
                color: isOutOfStock ? "rgba(255,255,255,0.3)" : "#fff",
                boxShadow: isOutOfStock ? "none" : `0 3px 12px ${EMERALD_GLOW}`,
                backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                transition: "all 0.2s ease",
                "&:hover": { bgcolor: "#0D9B6A", boxShadow: `0 5px 20px ${EMERALD_GLOW}`, transform: "translateY(-1px)" },
                "&.Mui-disabled": { bgcolor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.18)" },
              }}
            >
              {isOutOfStock ? "Sold Out" : "Add to Cart"}
            </Button>
          </Box>
        </Box>
        {/* END IMAGE ZONE */}

        {/* ─────────────────────────────────────────────────────────────────
            CAPTION — always visible below the image
        ───────────────────────────────────────────────────────────────── */}
        <Box sx={{ px: isLarge ? { xs: 0.75, sm: 1 } : { xs: 0.5, sm: 0.75 }, pt: isLarge ? { xs: 0.8, sm: 1 } : { xs: 0.6, sm: 0.75 }, pb: isLarge ? { xs: 0.85, sm: 1.1 } : { xs: 0.75, sm: 1 } }}>
          {/* Product name */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: isLarge ? { xs: "0.85rem", sm: "0.95rem" } : { xs: "0.78rem", sm: "0.85rem" },
              color: "#1C1C1C",
              lineHeight: 1.35,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              letterSpacing: "-0.01em",
              mb: 0.35,
            }}
          >
            {product.name}
          </Typography>

          {/* Brand / vendor + price */}
          <Stack direction="row" alignItems="baseline" justifyContent="space-between" spacing={0.5}>
            <Typography
              sx={{
                fontSize: isLarge ? { xs: "0.66rem", sm: "0.7rem" } : { xs: "0.62rem", sm: "0.65rem" },
                fontWeight: 600,
                color: EMERALD_DARK,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flexShrink: 1,
                minWidth: 0,
              }}
            >
              {product.brand?.name || product.vendor?.businessName || "DressMe"}
            </Typography>

            <Stack direction="row" alignItems="baseline" spacing={0.4} sx={{ flexShrink: 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: isLarge ? { xs: "0.92rem", sm: "1.02rem" } : { xs: "0.82rem", sm: "0.9rem" }, color: "#1C1C1C", letterSpacing: "-0.02em", lineHeight: 1 }}>
                {formatCurrency(product.price)}
              </Typography>
              {hasSalePrice && (
                <Typography sx={{ fontSize: isLarge ? { xs: "0.65rem", sm: "0.7rem" } : { xs: "0.6rem", sm: "0.65rem" }, color: "#9CA3AF", textDecoration: "line-through", fontWeight: 500 }}>
                  {formatCurrency(product.compareAtPrice!)}
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* Rating row */}
          {product.averageRating > 0 && (
            <Stack direction="row" alignItems="center" spacing={0.3} sx={{ mt: 0.35 }}>
              <StarIcon sx={{ fontSize: 10, color: "#FBBF24" }} />
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#6B7280" }}>
                {product.averageRating.toFixed(1)}
              </Typography>
              {product.vendor?.businessName && (
                <>
                  <StorefrontIcon sx={{ fontSize: 9, color: "#D1D5DB", ml: 0.3 }} />
                  <Typography sx={{ fontSize: "0.58rem", color: "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 70 }}>
                    {product.vendor.businessName}
                  </Typography>
                </>
              )}
            </Stack>
          )}
        </Box>
        {/* END CAPTION */}
      </Box>

      {/* Feedback snackbars */}
      <Snackbar open={showCartSuccess} autoHideDuration={3000} onClose={() => setShowCartSuccess(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" onClose={() => setShowCartSuccess(false)} sx={{ bgcolor: EMERALD, color: "#07130F", fontWeight: 700, boxShadow: `0 8px 24px ${EMERALD_GLOW}`, "& .MuiAlert-icon": { color: "#07130F" } }}>
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
