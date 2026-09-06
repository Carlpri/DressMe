import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import type { Product } from "../../types/product";
import { useAddToCart } from "../../hooks/useCart";
import {
  useFavorites,
  useAddToFavorites,
  useRemoveFromFavorites,
} from "../../hooks/useFavorites";
import { useFormatCurrency } from "../../utils/currency";

export interface ProductCardProps {
  product: Product;
  variant?: "default" | "trending" | "featured" | "compact";
  size?: "small" | "medium" | "large" | "auto";
  badge?: string;
  badgeColor?: "primary" | "secondary" | "success" | "error" | "warning" | "default";
  aspectRatio?: "3/4.6" | "3/4" | "4/5" | "1/1" | "auto";
  showVendor?: boolean;
}

const DEEP_EMERALD = "#166534";
const EMERALD = "#22C55E";
const CHARCOAL = "#111827";

// Standard apparel size sort order
const STANDARD_SIZE_ORDER = [
  "XXS", "XS", "S", "M", "L", "XL", "2XL", "XXL", "3XL", "XXXL", "4XL", "5XL", "ONE SIZE", "OS",
];

export interface ProductProminence {
  tier: "spotlight" | "featured" | "standard" | "compact";
  aspectRatio: "3/4.6" | "3/4" | "4/5" | "1/1";
  minHeight: { xs: number; sm: number; md: number };
  badgeText?: string;
  badgeBg?: string;
  isLarge: boolean;
}

/**
 * Evaluates how "good" a product is to dynamically vary the Pinterest card
 * height, aspect ratio, and visual prominence.
 */
export function getProductProminence(
  product: Product,
  forcedVariant?: string,
  forcedSize?: string
): ProductProminence {
  // If explicitly requested size/variant
  if (forcedSize === "large" || forcedVariant === "trending") {
    return {
      tier: "spotlight",
      aspectRatio: "3/4.6",
      minHeight: { xs: 270, sm: 330, md: 390 },
      badgeText: "🔥 2026 Trend",
      badgeBg: "linear-gradient(135deg, #0D5E4B 0%, #00C896 100%)",
      isLarge: true,
    };
  }

  if (forcedSize === "small" || forcedVariant === "compact") {
    return {
      tier: "compact",
      aspectRatio: "1/1",
      minHeight: { xs: 170, sm: 210, md: 250 },
      badgeText: undefined,
      isLarge: false,
    };
  }

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  // 1. SPOTLIGHT TIER: Outstanding / Top-tier products
  // Qualified by: isTrending, isBestSeller, featured, high rating (>= 4.5), high sales, or big discount (>= 25%)
  const isTopRated = product.averageRating != null && product.averageRating >= 4.5 && (product.reviewCount ?? 0) >= 2;
  const isHighSale = (product.sales ?? 0) >= 15;
  const isBigDiscount = discountPercent >= 25;

  if (product.isTrending || product.isBestSeller || product.featured || isTopRated || isHighSale || isBigDiscount) {
    let badgeText = "🔥 Top Trend";
    let badgeBg = "linear-gradient(135deg, #0D5E4B 0%, #00C896 100%)";

    if (product.isBestSeller || isHighSale) {
      badgeText = "⭐ Best Seller";
      badgeBg = "linear-gradient(135deg, #B45309 0%, #F59E0B 100%)";
    } else if (isTopRated) {
      badgeText = `★ ${product.averageRating.toFixed(1)} Rated`;
      badgeBg = "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)";
    } else if (isBigDiscount) {
      badgeText = `⚡ ${discountPercent}% OFF`;
      badgeBg = "linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)";
    } else if (product.featured) {
      badgeText = "Editorial Pick";
      badgeBg = "linear-gradient(135deg, #0F3822 0%, #166534 100%)";
    }

    return {
      tier: "spotlight",
      aspectRatio: "3/4.6",
      minHeight: { xs: 270, sm: 330, md: 390 },
      badgeText,
      badgeBg,
      isLarge: true,
    };
  }

  // 2. FEATURED / HIGH-INTEREST TIER: New arrivals or solid ratings
  if (product.isNewArrival || (product.averageRating != null && product.averageRating >= 4.0) || discountPercent >= 15) {
    return {
      tier: "featured",
      aspectRatio: "3/4",
      minHeight: { xs: 220, sm: 270, md: 320 },
      badgeText: product.isNewArrival ? "NEW" : undefined,
      badgeBg: DEEP_EMERALD,
      isLarge: false,
    };
  }

  // 3. COMPACT TIER: Accessories, caps, jewelry, sunglasses
  const isAccessory = product.categories?.some((c) =>
    ["accessories", "sunglasses", "caps", "jewellery", "jewelry", "watches", "perfumes"].some((term) =>
      c.name.toLowerCase().includes(term)
    )
  );

  if (isAccessory) {
    return {
      tier: "compact",
      aspectRatio: "1/1",
      minHeight: { xs: 170, sm: 210, md: 250 },
      badgeText: undefined,
      isLarge: false,
    };
  }

  // 4. STANDARD TIER: Everyday apparel staples
  return {
    tier: "standard",
    aspectRatio: "4/5",
    minHeight: { xs: 200, sm: 250, md: 290 },
    badgeText: undefined,
    isLarge: false,
  };
}

export function ProductCard({
  product,
  variant = "default",
  size = "auto",
  badge,
  badgeColor = "success",
  aspectRatio: forcedAspectRatio,
  showVendor = true,
}: ProductCardProps) {
  const navigate = useNavigate();
  const formatCurrency = useFormatCurrency();
  const cardRef = useRef<HTMLDivElement>(null);

  const { data: favorites } = useFavorites();
  const addToCart = useAddToCart();
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  /* ── Dynamic Pinterest Prominence & Aspect Ratio ──────────────────────── */
  const prominence = useMemo(
    () => getProductProminence(product, variant, size),
    [product, variant, size]
  );

  const effectiveAspectRatio =
    forcedAspectRatio && forcedAspectRatio !== "auto"
      ? forcedAspectRatio
      : prominence.aspectRatio;

  /* ── Touch Reveal & Auto-Retract Engine ───────────────────────────────── */
  const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartedWhileRevealed = useRef(false);
  const touchMoved = useRef(false);

  useEffect(() => {
    return () => {
      if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    };
  }, []);

  // Dismiss on outside interaction
  useEffect(() => {
    if (!isHovered) return;
    const dismiss = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsHovered(false);
        if (autoCloseTimer.current) {
          clearTimeout(autoCloseTimer.current);
          autoCloseTimer.current = null;
        }
      }
    };
    document.addEventListener("mousedown", dismiss);
    document.addEventListener("touchstart", dismiss);
    return () => {
      document.removeEventListener("mousedown", dismiss);
      document.removeEventListener("touchstart", dismiss);
    };
  }, [isHovered]);

  const triggerTouchReveal = () => {
    setIsHovered(true);
    if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current);
    // Auto-retract drawer after 2.8s of inactivity on touch
    autoCloseTimer.current = setTimeout(() => {
      setIsHovered(false);
      autoCloseTimer.current = null;
    }, 2800);
  };

  const handleTouchStart = () => {
    touchMoved.current = false;
    touchStartedWhileRevealed.current = isHovered;
  };

  const handleTouchMove = () => {
    touchMoved.current = true;
  };

  const handleMouseEnter = () => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current);
      autoCloseTimer.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicked a button inside, ignore card-level navigation
    if ((e.target as HTMLElement).closest("button")) return;

    // If user was scrolling/dragging, ignore
    if (touchMoved.current) {
      touchMoved.current = false;
      return;
    }

    // On touch devices: First tap triggers reveal; second tap navigates
    // On non-touch (desktop mouse): Click directly navigates
    if (touchStartedWhileRevealed.current || !("ontouchstart" in window)) {
      navigate(`/products/${product.slug}`);
    } else {
      triggerTouchReveal();
    }
  };

  /* ── Images ───────────────────────────────────────────────────────────── */
  const images =
    product.images && product.images.length > 0
      ? [...product.images].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      : [];
  const activeImage =
    images[currentImageIndex]?.imageUrl ||
    images[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80";

  const isFavorited = favorites
    ? favorites.some((f) => f.id === product.id)
    : false;

  const totalStock = (product.variants ?? []).reduce(
    (sum, v) => sum + (v.stock ?? 0),
    0
  );
  const isOutOfStock = totalStock === 0 || product.status === "HIDDEN";
  const hasSale = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const discountPercent = hasSale
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  /* ── In-Stock Sizes Map ────────────────────────────────────────────────── */
  const inStockSizesMap = new Map<string, string>();
  for (const v of (product.variants ?? []) as any[]) {
    const rawSize = v.sizeValue || v.size || (v.sizeObj && v.sizeObj.name);
    if (rawSize && typeof rawSize === "string") {
      const trimmed = rawSize.trim();
      const inStock = v.stock === undefined || v.stock === null ? true : Number(v.stock) > 0;
      if (inStock) inStockSizesMap.set(trimmed.toUpperCase(), trimmed);
    }
  }
  const inStockSizes = Array.from(inStockSizesMap.entries())
    .sort(([kA], [kB]) => {
      const iA = STANDARD_SIZE_ORDER.indexOf(kA);
      const iB = STANDARD_SIZE_ORDER.indexOf(kB);
      if (iA !== -1 && iB !== -1) return iA - iB;
      if (iA !== -1) return -1;
      if (iB !== -1) return 1;
      return kA.localeCompare(kB);
    })
    .map(([, orig]) => orig);

  /* ── Handlers ─────────────────────────────────────────────────────────── */
  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentImageIndex((p) => (p > 0 ? p - 1 : images.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentImageIndex((p) => (p < images.length - 1 ? p + 1 : 0));
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorited) {
      removeFromFavorites.mutate(product.id);
    } else {
      addToFavorites.mutate(product.id);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || addToCart.isPending) return;
    const availableVariant = (product.variants ?? []).find(
      (v) => (v.stock ?? 0) > 0
    );
    addToCart.mutate({
      productId: product.id,
      variantId: availableVariant?.id,
      quantity: 1,
    });
  };

  const displayBadge = badge || prominence.badgeText;

  return (
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
        borderRadius: "20px",
        bgcolor: "#FFFFFF",
        overflow: "hidden",
        cursor: "pointer",
        transition:
          "transform 260ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 260ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms ease",
        border: isHovered
          ? "1px solid rgba(22, 101, 52, 0.38)"
          : prominence.tier === "spotlight"
          ? "1px solid rgba(22, 101, 52, 0.2)"
          : "1px solid rgba(17, 24, 39, 0.08)",
        boxShadow: isHovered
          ? "0 20px 40px -10px rgba(17, 24, 39, 0.14), 0 0 0 1px rgba(34, 197, 94, 0.3)"
          : prominence.tier === "spotlight"
          ? "0 4px 16px rgba(22, 101, 52, 0.06)"
          : "0 2px 10px rgba(0, 0, 0, 0.03)",
        transform: isHovered ? "scale(1.02)" : "scale(1)",
        willChange: "transform, box-shadow",
        display: "flex",
        flexDirection: "column",
        breakInside: "avoid",
        WebkitTapHighlightColor: "transparent",
        "&:focus-visible": { outline: `2px solid ${EMERALD}`, outlineOffset: 2 },
      }}
    >
      {/* ── Image Zone with Dynamic Pinterest Aspect Ratio ──────────────── */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: effectiveAspectRatio,
          minHeight: prominence.minHeight,
          bgcolor: "#F8FAFC",
          overflow: "hidden",
        }}
      >
        {/* Product Image */}
        <Box
          component="img"
          src={activeImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition:
              "transform 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 260ms ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            opacity: imageLoaded ? 1 : 0.6,
            willChange: "transform",
          }}
        />

        {/* Dynamic Dark Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: isHovered
              ? "linear-gradient(to top, rgba(17, 24, 39, 0.74) 0%, rgba(17, 24, 39, 0.15) 45%, rgba(17, 24, 39, 0.28) 100%)"
              : "linear-gradient(to top, rgba(17, 24, 39, 0.3) 0%, transparent 40%)",
            transition: "all 0.3s ease",
            pointerEvents: "none",
          }}
        />

        {/* Top Badges Stack (Left) */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            display: "flex",
            flexDirection: "column",
            gap: 0.6,
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          {displayBadge && (
            <Chip
              label={displayBadge}
              size="small"
              sx={{
                bgcolor: prominence.badgeBg || DEEP_EMERALD,
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "0.68rem",
                letterSpacing: "0.03em",
                height: 24,
                boxShadow: "0 2px 8px rgba(0,0,0,0.22)",
                backdropFilter: "blur(8px)",
              }}
            />
          )}
          {hasSale && (
            <Chip
              label={`-${discountPercent}%`}
              size="small"
              sx={{
                bgcolor: "#DC2626",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "0.64rem",
                height: 22,
                boxShadow: "0 2px 6px rgba(220,38,38,0.35)",
              }}
            />
          )}
          {isOutOfStock && (
            <Chip
              label="Sold Out"
              size="small"
              sx={{
                bgcolor: "rgba(17, 24, 39, 0.88)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.64rem",
                height: 22,
              }}
            />
          )}
        </Box>

        {/* Top Right: Wishlist Icon Button */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 4,
          }}
        >
          <Tooltip title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}>
            <IconButton
              onClick={handleFavoriteToggle}
              size="small"
              aria-label="Wishlist"
              sx={{
                width: 36,
                height: 36,
                bgcolor: isFavorited ? "#FFFFFF" : "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(12px)",
                color: isFavorited ? "#EF4444" : CHARCOAL,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
                transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
                "&:hover": {
                  bgcolor: "#FFFFFF",
                  transform: "scale(1.12)",
                  color: "#EF4444",
                },
              }}
            >
              {isFavorited ? (
                <FavoriteRoundedIcon sx={{ fontSize: 18 }} />
              ) : (
                <FavoriteBorderRoundedIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Multi-Image Carousel Controls */}
        {images.length > 1 && (
          <>
            <Box
              sx={{
                position: "absolute",
                top: 50,
                right: 10,
                zIndex: 3,
                bgcolor: "rgba(17, 24, 39, 0.75)",
                backdropFilter: "blur(8px)",
                color: "#FFFFFF",
                fontSize: "0.64rem",
                fontWeight: 700,
                borderRadius: "12px",
                px: 0.8,
                py: 0.15,
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.25s ease",
                pointerEvents: "none",
              }}
            >
              {currentImageIndex + 1}/{images.length}
            </Box>

            <IconButton
              onClick={handlePrevImage}
              size="small"
              aria-label="Previous image"
              sx={{
                position: "absolute",
                top: "50%",
                left: 8,
                transform: isHovered
                  ? "translateY(-50%) translateX(0)"
                  : "translateY(-50%) translateX(-8px)",
                opacity: isHovered ? 1 : 0,
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                zIndex: 3,
                bgcolor: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(8px)",
                color: CHARCOAL,
                width: 30,
                height: 30,
                "&:hover": { bgcolor: "#FFFFFF" },
              }}
            >
              <ChevronLeftRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>

            <IconButton
              onClick={handleNextImage}
              size="small"
              aria-label="Next image"
              sx={{
                position: "absolute",
                top: "50%",
                right: 8,
                transform: isHovered
                  ? "translateY(-50%) translateX(0)"
                  : "translateY(-50%) translateX(8px)",
                opacity: isHovered ? 1 : 0,
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                zIndex: 3,
                bgcolor: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(8px)",
                color: CHARCOAL,
                width: 30,
                height: 30,
                "&:hover": { bgcolor: "#FFFFFF" },
              }}
            >
              <ChevronRightRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </>
        )}

        {/* Resting Size Chips (Bottom-Left) */}
        {inStockSizes.length > 0 && !isHovered && (
          <Stack
            direction="row"
            spacing={0.4}
            sx={{
              position: "absolute",
              bottom: 10,
              left: 10,
              zIndex: 2,
              pointerEvents: "none",
              transition: "opacity 0.2s ease",
            }}
          >
            {inStockSizes.slice(0, 4).map((s) => (
              <Box
                key={s}
                sx={{
                  px: 0.65,
                  py: 0.15,
                  borderRadius: "4px",
                  bgcolor: "rgba(17, 24, 39, 0.78)",
                  backdropFilter: "blur(4px)",
                  color: "#FFFFFF",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                }}
              >
                {s}
              </Box>
            ))}
            {inStockSizes.length > 4 && (
              <Box
                sx={{
                  px: 0.6,
                  py: 0.15,
                  borderRadius: "4px",
                  bgcolor: "rgba(17, 24, 39, 0.78)",
                  backdropFilter: "blur(4px)",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                }}
              >
                +{inStockSizes.length - 4}
              </Box>
            )}
          </Stack>
        )}

        {/* ── Sliding Touch Reveal Action Drawer ────────────────────────── */}
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            left: 10,
            right: 10,
            zIndex: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(10px)",
            pointerEvents: isHovered ? "auto" : "none",
            transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Box
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product.slug}`);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1.6,
              py: 0.65,
              borderRadius: "20px",
              bgcolor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(12px)",
              color: CHARCOAL,
              fontSize: "0.75rem",
              fontWeight: 700,
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#FFFFFF",
                transform: "translateY(-1px)",
                color: DEEP_EMERALD,
              },
            }}
          >
            <span>View Look</span>
            <NorthEastRoundedIcon sx={{ fontSize: 13 }} />
          </Box>

          {!isOutOfStock && (
            <Tooltip title="Quick Add to Bag">
              <IconButton
                onClick={handleQuickAdd}
                disabled={addToCart.isPending}
                size="small"
                aria-label="Add to cart"
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  bgcolor: EMERALD,
                  color: "#07130F",
                  boxShadow: "0 4px 14px rgba(34, 197, 94, 0.5)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "#16A34A",
                    color: "#FFFFFF",
                    transform: "scale(1.1)",
                  },
                }}
              >
                {addToCart.isPending ? (
                  <CircularProgress size={16} sx={{ color: "#07130F" }} />
                ) : (
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* ── Product Details (Consistent everywhere) ────────────────────── */}
      <Box
        sx={{
          p: 1.8,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <Box>
          {/* Category & Brand / Vendor */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            mb={0.4}
          >
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 800,
                color: DEEP_EMERALD,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {product.categories?.[0]?.name || product.brand?.name || "DressMe"}
            </Typography>

            {showVendor && product.vendor?.businessName && (
              <Typography
                sx={{
                  fontSize: "0.68rem",
                  fontWeight: 500,
                  color: "#64748B",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 110,
                }}
              >
                {product.vendor.businessName}
              </Typography>
            )}
          </Stack>

          {/* Product Name */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: prominence.isLarge ? "0.96rem" : "0.9rem",
              lineHeight: 1.35,
              color: CHARCOAL,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              transition: "color 0.2s ease",
              "&:hover": { color: DEEP_EMERALD },
            }}
          >
            {product.name}
          </Typography>
        </Box>

        {/* Rating & Price Row */}
        <Box sx={{ mt: 1.2 }}>
          {product.averageRating != null && product.averageRating > 0 && (
            <Stack direction="row" alignItems="center" spacing={0.4} mb={0.4}>
              <StarRoundedIcon sx={{ fontSize: 14, color: "#F59E0B" }} />
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: CHARCOAL }}>
                {product.averageRating.toFixed(1)}
              </Typography>
              {product.reviewCount != null && product.reviewCount > 0 && (
                <Typography sx={{ fontSize: "0.68rem", color: "#94A3B8" }}>
                  ({product.reviewCount})
                </Typography>
              )}
            </Stack>
          )}

          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: prominence.isLarge ? "1.1rem" : "1.02rem",
                color: CHARCOAL,
                letterSpacing: "-0.02em",
              }}
            >
              {formatCurrency(product.price)}
            </Typography>

            {hasSale && (
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  color: "#94A3B8",
                  textDecoration: "line-through",
                  fontWeight: 500,
                }}
              >
                {formatCurrency(product.compareAtPrice!)}
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
