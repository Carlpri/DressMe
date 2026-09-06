import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  alpha,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import type { Product } from "../../types/product";
import { useAddToCart } from "../../hooks/useCart";
import {
  useFavorites,
  useAddToFavorites,
  useRemoveFromFavorites,
} from "../../hooks/useFavorites";
import { useFormatCurrency } from "../../utils/currency";

export interface ProductDiscoveryCardProps {
  product: Product;
  badge?: string;
  badgeColor?: "primary" | "secondary" | "success" | "error" | "warning" | "default";
  aspectRatio?: "3/4" | "4/5" | "1/1" | "auto";
  showVendor?: boolean;
}

const DEEP_EMERALD = "#166534";
const EMERALD = "#22C55E";
const CHARCOAL = "#111827";

export function ProductDiscoveryCard({
  product,
  badge,
  badgeColor = "success",
  aspectRatio = "4/5",
  showVendor = true,
}: ProductDiscoveryCardProps) {
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

  /* ── Touch Reveal & Auto-retract Engine ────────────────────────────────── */
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
    // Auto retract after 2.8 seconds of inactivity on touch
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
    // If clicked a button inside, ignore card level navigation
    if ((e.target as HTMLElement).closest("button")) return;

    // If user was scrolling, do not trigger reveal or navigate
    if (touchMoved.current) {
      touchMoved.current = false;
      return;
    }

    // On touch screens:
    // First tap -> reveals card (triggerTouchReveal)
    // Second tap while revealed OR desktop click -> navigates to product details
    if (touchStartedWhileRevealed.current || !("ontouchstart" in window)) {
      navigate(`/products/${product.slug}`);
    } else {
      triggerTouchReveal();
    }
  };

  const isFavorited = favorites
    ? favorites.some((f) => f.id === product.id)
    : false;

  const images =
    product.images && product.images.length > 0
      ? [...product.images].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      : [];
  const activeImage =
    images[currentImageIndex]?.imageUrl ||
    images[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80";

  const totalStock = (product.variants ?? []).reduce(
    (sum, v) => sum + (v.stock ?? 0),
    0
  );
  const isOutOfStock = totalStock === 0 || product.status === "HIDDEN";
  const hasSale = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const discountPercent = hasSale
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  /* ── Sizes ────────────────────────────────────────────────────────────── */
  const inStockSizesMap = new Map<string, string>();
  for (const v of (product.variants ?? []) as any[]) {
    const rawSize = v.sizeValue || v.size || (v.sizeObj && v.sizeObj.name);
    if (rawSize && typeof rawSize === "string") {
      const trimmed = rawSize.trim();
      const inStock = v.stock === undefined || v.stock === null ? true : Number(v.stock) > 0;
      if (inStock) inStockSizesMap.set(trimmed.toUpperCase(), trimmed);
    }
  }
  const inStockSizes = Array.from(inStockSizesMap.values());

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

  return (
    <Box
      ref={cardRef}
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: "relative",
        borderRadius: "20px",
        bgcolor: "#FFFFFF",
        overflow: "hidden",
        cursor: "pointer",
        transition:
          "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.32s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease",
        border: isHovered
          ? "1px solid rgba(22, 101, 52, 0.35)"
          : "1px solid rgba(17, 24, 39, 0.07)",
        boxShadow: isHovered
          ? "0 22px 45px -12px rgba(17, 24, 39, 0.14), 0 0 0 1px rgba(34, 197, 94, 0.3)"
          : "0 2px 10px rgba(0, 0, 0, 0.03)",
        transform: isHovered ? "translateY(-5px)" : "none",
        display: "flex",
        flexDirection: "column",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* ── Image Container ────────────────────────────────────────────── */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: aspectRatio,
          bgcolor: "#F8FAFC",
          overflow: "hidden",
        }}
      >
        {/* Product Image with smooth zoom & fade */}
        <Box
          component="img"
          src={activeImage}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition:
              "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
            transform: isHovered ? "scale(1.06)" : "scale(1)",
            opacity: imageLoaded ? 1 : 0.6,
          }}
        />

        {/* Dynamic Gradient Overlay (deepens on hover/reveal for high contrast) */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: isHovered
              ? "linear-gradient(to top, rgba(17, 24, 39, 0.72) 0%, rgba(17, 24, 39, 0.15) 45%, rgba(17, 24, 39, 0.25) 100%)"
              : "linear-gradient(to top, rgba(17, 24, 39, 0.25) 0%, transparent 40%)",
            transition: "all 0.3s ease",
            pointerEvents: "none",
          }}
        />

        {/* Top Badges */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            flexDirection: "column",
            gap: 0.75,
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          {badge && (
            <Chip
              label={badge}
              size="small"
              sx={{
                bgcolor: DEEP_EMERALD,
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "0.68rem",
                letterSpacing: "0.04em",
                height: 24,
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
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
                fontSize: "0.65rem",
                height: 22,
                boxShadow: "0 2px 6px rgba(220,38,38,0.3)",
              }}
            />
          )}
          {isOutOfStock && (
            <Chip
              label="Sold Out"
              size="small"
              sx={{
                bgcolor: "rgba(17, 24, 39, 0.85)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "0.65rem",
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
              aria-label="Wishlist"
            >
              {isFavorited ? (
                <FavoriteRoundedIcon sx={{ fontSize: 18 }} />
              ) : (
                <FavoriteBorderRoundedIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Image Counter (if multiple images) */}
        {images.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              top: 50,
              right: 12,
              zIndex: 3,
              bgcolor: "rgba(17, 24, 39, 0.75)",
              backdropFilter: "blur(8px)",
              color: "#FFFFFF",
              fontSize: "0.65rem",
              fontWeight: 700,
              borderRadius: "12px",
              px: 0.9,
              py: 0.2,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.25s ease",
              pointerEvents: "none",
            }}
          >
            {currentImageIndex + 1}/{images.length}
          </Box>
        )}

        {/* Carousel Prev / Next Buttons (revealed on hover/touch) */}
        {images.length > 1 && (
          <>
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
                bgcolor: "rgba(255, 255, 255, 0.9)",
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
                bgcolor: "rgba(255, 255, 255, 0.9)",
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

        {/* Size chips on rest (bottom-left) */}
        {inStockSizes.length > 0 && !isHovered && (
          <Stack
            direction="row"
            spacing={0.5}
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
                  px: 0.7,
                  py: 0.15,
                  borderRadius: "4px",
                  bgcolor: "rgba(17, 24, 39, 0.75)",
                  backdropFilter: "blur(4px)",
                  color: "#FFFFFF",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.02em",
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
                  bgcolor: "rgba(17, 24, 39, 0.75)",
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

        {/* ── TOUCH REVEAL ACTION BAR (Slides up smoothly) ────────────────── */}
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            right: 12,
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
              gap: 0.6,
              px: 1.6,
              py: 0.7,
              borderRadius: "20px",
              bgcolor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(12px)",
              color: CHARCOAL,
              fontSize: "0.76rem",
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
                aria-label="Add to cart"
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

      {/* ── Product Details ────────────────────────────────────────────── */}
      <Box
        sx={{
          p: 2,
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
            mb={0.5}
          >
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: DEEP_EMERALD,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {product.categories?.[0]?.name || product.brand?.name || "DressMe"}
            </Typography>

            {showVendor && product.vendor?.businessName && (
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: "#64748B",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 120,
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
              fontSize: "0.92rem",
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

        {/* Price Row */}
        <Stack direction="row" alignItems="baseline" spacing={1} mt={1.5}>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: "1.05rem",
              color: CHARCOAL,
              letterSpacing: "-0.02em",
            }}
          >
            {formatCurrency(product.price)}
          </Typography>

          {hasSale && (
            <Typography
              sx={{
                fontSize: "0.8rem",
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
  );
}
