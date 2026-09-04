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
}

// Standard apparel size sort order
const STANDARD_SIZE_ORDER = [
  "XXS", "XS", "S", "M", "L", "XL", "2XL", "XXL", "3XL", "XXXL", "4XL", "5XL", "ONE SIZE", "OS",
];

// How many px of the hover panel peek above the card bottom when NOT hovered.
// This is exactly what is always visible at all times: price row.
const PEEK_HEIGHT = 46; // px

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
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

  // Auto-retract timer ref for touch reveal (displays for a short while ~2.8s)
  const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartedWhileRevealed = useRef(false);
  const touchMoved = useRef(false);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current);
      }
    };
  }, []);

  // Close card when user clicks or touches outside
  useEffect(() => {
    if (!isHovered) return;

    const handleOutsideInteraction = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsHovered(false);
        if (autoCloseTimer.current) {
          clearTimeout(autoCloseTimer.current);
          autoCloseTimer.current = null;
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideInteraction);
    document.addEventListener("touchstart", handleOutsideInteraction);
    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    };
  }, [isHovered]);

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

  // ── Touch & Scroll reveal helper: immediate reveal for short whiles (~2.8s) ───
  const triggerTouchReveal = () => {
    setIsHovered(true);
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
    }
    autoCloseTimer.current = setTimeout(() => {
      setIsHovered(false);
      autoCloseTimer.current = null;
    }, 2800);
  };

  const handleMouseEnter = () => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
      autoCloseTimer.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
      autoCloseTimer.current = null;
    }
    setIsHovered(false);
  };

  // ── Touch: immediate reveal on contact, even during scrolling ───
  const handleTouchStart = () => {
    touchStartedWhileRevealed.current = isHovered;
    touchMoved.current = false;
    triggerTouchReveal();
  };

  const handleTouchMove = () => {
    touchMoved.current = true;
    // Keep revealed while scrolling; do not cancel the reveal
  };

  // ── Card click/tap navigation ───
  const handleCardClick = () => {
    if (touchMoved.current) {
      touchMoved.current = false;
      return;
    }
    // If clicked on desktop mouse or if tapped while already revealed: navigate
    if (touchStartedWhileRevealed.current || !("ontouchstart" in window)) {
      navigate(`/products/${product.slug}`);
    } else {
      // First tap reveals details for a short while
      triggerTouchReveal();
    }
  };

  // ── SIZES (displayed on top at rest) ───────────────────────────
  const inStockSizesMap = new Map<string, string>();
  const allSizesMap = new Map<string, string>();

  for (const v of (product.variants ?? []) as any[]) {
    const rawSize = v.sizeValue || v.size || (v.sizeObj && v.sizeObj.name);
    if (rawSize && typeof rawSize === "string") {
      const trimmed = rawSize.trim();
      const key = trimmed.toUpperCase();
      if (key) {
        allSizesMap.set(key, trimmed);
        const inStock = v.stock === undefined || v.stock === null ? true : Number(v.stock) > 0;
        if (inStock) {
          inStockSizesMap.set(key, trimmed);
        }
      }
    }
  }

  // Also check product.sizes or product.availableSizes if present
  if (Array.isArray((product as any).sizes)) {
    for (const s of (product as any).sizes) {
      if (typeof s === "string" && s.trim()) {
        const trimmed = s.trim();
        const key = trimmed.toUpperCase();
        allSizesMap.set(key, trimmed);
        inStockSizesMap.set(key, trimmed);
      }
    }
  }

  const effectiveSizesMap = inStockSizesMap.size > 0 ? inStockSizesMap : allSizesMap;

  const inStockSizes = Array.from(effectiveSizesMap.entries())
    .sort(([keyA], [keyB]) => {
      const idxA = STANDARD_SIZE_ORDER.indexOf(keyA);
      const idxB = STANDARD_SIZE_ORDER.indexOf(keyB);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return keyA.localeCompare(keyB);
    })
    .map(([, original]) => original);

  // ── COLOR VARIANTS (displayed below sizes at rest) ──────────────────────
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
  const colorVariants = Array.from(colorMap.entries());

  return (
    <>
      {/* ════════════════════ PINTEREST HOVER/TOUCH-REVEAL CARD ════════════════════ */}
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
          // Tall portrait ratio — Pinterest style
          aspectRatio: "3 / 4",
          borderRadius: { xs: "14px", sm: "18px" },
          overflow: "hidden",
          cursor: "pointer",
          bgcolor: "#0B0E14",
          border: "1px solid",
          borderColor: isHovered ? "rgba(0, 200, 150, 0.45)" : "rgba(255, 255, 255, 0.07)",
          boxShadow: isHovered
            ? "0 22px 44px -8px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,200,150,0.28)"
            : "0 4px 16px -2px rgba(0,0,0,0.5)",
          transform: isHovered ? "translateY(-5px) scale(1.015)" : "translateY(0) scale(1)",
          transition: "all 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
          outline: "none",
          breakInside: "avoid",
          WebkitTapHighlightColor: "transparent",
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

          {/* Subtle top shadow gradient — ensures top hollow sizes and color dots are crystal clear on all photos */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "22%",
              pointerEvents: "none",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
            }}
          />

          {/* Subtle bottom shadow gradient — delicate, allows full outfit view while making price legible */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "28%",
              pointerEvents: "none",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)",
            }}
          />
        </Box>

        {/* ── TOP SECTION AT REST: IN-STOCK SIZES ON TOP + COLOR VARIANT DOTS BELOW ──
            Disappear when hover / touch reveal is initiated
        */}
        <Stack
          direction="column"
          spacing={0.4}
          alignItems="flex-start"
          sx={{
            position: "absolute",
            top: { xs: 8, sm: 10 },
            left: { xs: 8, sm: 10 },
            right: { xs: 8, sm: 10 },
            zIndex: 5,
            opacity: isHovered ? 0 : 1,
            transform: isHovered ? "translateY(-8px)" : "translateY(0)",
            transition: "opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: isHovered ? "none" : "auto",
          }}
        >
          {/* Sizes on top (hollow outline with subtle shadow) */}
          {inStockSizes.length > 0 && (
            <Stack direction="row" spacing={0.3} flexWrap="wrap" useFlexGap sx={{ gap: 0.3 }}>
              {inStockSizes.slice(0, 5).map((size) => (
                <Box
                  key={size}
                  sx={{
                    px: { xs: 0.45, sm: 0.55 },
                    py: 0.1,
                    borderRadius: "3px",
                    bgcolor: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.8)",
                    fontSize: { xs: "0.56rem", sm: "0.62rem" },
                    fontWeight: 800,
                    color: "#FFFFFF",
                    letterSpacing: "0.03em",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.55)",
                    textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.8)",
                    lineHeight: 1.1,
                  }}
                >
                  {size}
                </Box>
              ))}
              {inStockSizes.length > 5 && (
                <Box
                  sx={{
                    px: 0.4,
                    py: 0.1,
                    borderRadius: "3px",
                    bgcolor: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.55)",
                    fontSize: "0.52rem",
                    fontWeight: 700,
                    color: "rgba(255, 255, 255, 0.9)",
                    textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                    lineHeight: 1.1,
                  }}
                >
                  +{inStockSizes.length - 5}
                </Box>
              )}
            </Stack>
          )}

          {/* Color variant dots below sizes */}
          {colorVariants.length > 1 && (
            <Stack direction="row" spacing={0.4} alignItems="center">
              {colorVariants.slice(0, 6).map(([colorName, { inStock }]) => (
                <Box
                  key={colorName}
                  title={colorName}
                  sx={{
                    width: { xs: 8, sm: 9 },
                    height: { xs: 8, sm: 9 },
                    borderRadius: "50%",
                    bgcolor: colorName.toLowerCase(),
                    border: "1.5px solid rgba(255, 255, 255, 0.85)",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.7)",
                    opacity: inStock ? 1 : 0.4,
                    flexShrink: 0,
                  }}
                />
              ))}
              {colorVariants.length > 6 && (
                <Typography
                  sx={{
                    fontSize: "0.52rem",
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: 800,
                    textShadow: "0 1px 3px rgba(0,0,0,0.9)",
                  }}
                >
                  +{colorVariants.length - 6}
                </Typography>
              )}
            </Stack>
          )}
        </Stack>

        {/* ── TOP-LEFT BADGES (hover / touch reveal) ─────────────────────── */}
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
            <Chip
              label="Sold Out"
              size="small"
              sx={{
                bgcolor: "rgba(220,38,38,0.9)",
                color: "#FFF",
                fontWeight: 800,
                fontSize: "0.58rem",
                height: 20,
                px: 0.3,
                backdropFilter: "blur(8px)",
              }}
            />
          )}
          {!isOutOfStock && discountPercent > 0 && (
            <Chip
              label={`-${discountPercent}%`}
              size="small"
              sx={{
                bgcolor: "rgba(220,38,38,0.9)",
                color: "#FFF",
                fontWeight: 800,
                fontSize: "0.58rem",
                height: 20,
                px: 0.3,
                backdropFilter: "blur(8px)",
              }}
            />
          )}
          {product.isNewArrival && (
            <Chip
              label="NEW"
              size="small"
              sx={{
                bgcolor: "rgba(0,200,150,0.92)",
                color: "#07130F",
                fontWeight: 800,
                fontSize: "0.58rem",
                height: 20,
                px: 0.3,
              }}
            />
          )}
          {product.isTrending && (
            <Chip
              label="HOT"
              size="small"
              sx={{
                bgcolor: "rgba(245,158,11,0.92)",
                color: "#180E02",
                fontWeight: 800,
                fontSize: "0.58rem",
                height: 20,
                px: 0.3,
              }}
            />
          )}
          {isLowStock && (
            <Chip
              label={`${totalStock} left`}
              size="small"
              sx={{
                bgcolor: "rgba(234,88,12,0.9)",
                color: "#FFF",
                fontWeight: 700,
                fontSize: "0.55rem",
                height: 20,
              }}
            />
          )}
        </Stack>

        {/* ── TOP-RIGHT: WISHLIST + IMAGE COUNTER (hover / touch reveal) ─── */}
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
              "&:hover": {
                bgcolor: isFavorited ? "rgba(0,200,150,0.35)" : "rgba(255,255,255,0.18)",
                transform: "scale(1.1)",
              },
            }}
          >
            {isFavorited ? (
              <FavoriteIcon sx={{ fontSize: { xs: 15, sm: 17 }, color: "#00C896" }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: { xs: 15, sm: 17 } }} />
            )}
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

        {/* ── PREV/NEXT ARROWS (hover / touch reveal) ────────────────────── */}
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
                  transform: isHovered
                    ? "translateY(-50%) translateX(0)"
                    : `translateY(-50%) translateX(${side === "left" ? "-5px" : "5px"})`,
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
              → ONLY the last PEEK_HEIGHT px show → PRICE + SIZE (ALWAYS VISIBLE)
            • On hover/touch: translateY(0) → full details revealed
        ══════════════════════════════════════════════════════════════════ */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
            // Slide: peek by default, full reveal on hover or touch
            transform: isHovered
              ? "translateY(0)"
              : `translateY(calc(100% - ${PEEK_HEIGHT}px))`,
            transition: "transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, border-color 0.3s ease",
            background: isHovered ? "rgba(8, 11, 18, 0.88)" : "transparent",
            backdropFilter: isHovered ? "blur(20px) saturate(180%)" : "none",
            WebkitBackdropFilter: isHovered ? "blur(20px) saturate(180%)" : "none",
            borderTop: isHovered ? "1px solid rgba(255,255,255,0.12)" : "none",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {/* ── HIDDEN SECTION (revealed on hover / touch) ── */}
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
                  <Typography
                    sx={{
                      fontSize: { xs: "0.6rem", sm: "0.65rem" },
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {product.averageRating.toFixed(1)}
                  </Typography>
                </Stack>
              ) : product.vendor?.businessName ? (
                <Stack direction="row" alignItems="center" spacing={0.2} sx={{ flexShrink: 0 }}>
                  <StorefrontIcon sx={{ fontSize: { xs: 9, sm: 10 }, color: "rgba(255,255,255,0.4)" }} />
                  <Typography
                    sx={{
                      fontSize: { xs: "0.55rem", sm: "0.6rem" },
                      color: "rgba(255,255,255,0.4)",
                      maxWidth: 60,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
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
                addToCart.isPending ? (
                  <CircularProgress size={10} color="inherit" />
                ) : (
                  <ShoppingBagOutlinedIcon sx={{ fontSize: "12px !important" }} />
                )
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
                "&:hover": {
                  bgcolor: "#00E0A7",
                  borderColor: "#00E0A7",
                  color: "#050E0B",
                  boxShadow: "0 5px 18px rgba(0,200,150,0.45)",
                  transform: "translateY(-1px)",
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.18)",
                },
              }}
            >
              {isOutOfStock ? "Sold Out" : "Add to Cart"}
            </Button>
          </Box>

          {/* ── ALWAYS-VISIBLE PEEK ROW: PRICE (ALWAYS VISIBLE AT ALL TIMES) ──── */}
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
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                }}
              >
                {formatCurrency(product.price)}
              </Typography>
              {hasSalePrice && (
                <Typography
                  sx={{
                    fontSize: { xs: "0.62rem", sm: "0.68rem" },
                    color: "rgba(255,255,255,0.55)",
                    textDecoration: "line-through",
                    fontWeight: 500,
                    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                  }}
                >
                  {formatCurrency(product.compareAtPrice!)}
                </Typography>
              )}
            </Stack>

            {/* Right indicator: Low stock / Sold out / Discount savings */}
            {isOutOfStock ? (
              <Chip
                label="Sold Out"
                size="small"
                sx={{
                  bgcolor: "rgba(220,38,38,0.85)",
                  color: "#FFF",
                  fontWeight: 800,
                  fontSize: "0.55rem",
                  height: 18,
                  px: 0.3,
                }}
              />
            ) : isLowStock ? (
              <Chip
                label={`Only ${totalStock} left`}
                size="small"
                sx={{
                  bgcolor: "rgba(234,88,12,0.85)",
                  color: "#FFF",
                  fontWeight: 800,
                  fontSize: "0.55rem",
                  height: 18,
                  px: 0.3,
                }}
              />
            ) : hasSalePrice && discountPercent > 0 ? (
              <Typography
                sx={{
                  fontSize: "0.62rem",
                  color: "#00C896",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                }}
              >
                SAVE {discountPercent}%
              </Typography>
            ) : null}
          </Stack>
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
            color: "#FFF",
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
