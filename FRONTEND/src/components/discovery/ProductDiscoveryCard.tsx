import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  alpha,
  Tooltip,
} from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
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
  const { data: favorites } = useFavorites();
  const addToCart = useAddToCart();
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isFavorited = favorites
    ? favorites.some((f) => f.id === product.id)
    : false;

  const images = (product.images && product.images.length > 0)
    ? [...product.images].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    : [];
  const primaryImage = images[0]?.imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80";

  const totalStock = (product.variants ?? []).reduce(
    (sum, v) => sum + (v.stock ?? 0),
    0
  );
  const isOutOfStock = totalStock === 0 || product.status === "HIDDEN";
  const hasSale = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const discountPercent = hasSale
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleCardClick = () => {
    navigate(`/products/${product.slug}`);
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
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: "relative",
        borderRadius: "20px",
        bgcolor: "#FFFFFF",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.32s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease",
        border: "1px solid rgba(17, 24, 39, 0.07)",
        boxShadow: isHovered
          ? "0 20px 40px -15px rgba(17, 24, 39, 0.12), 0 0 0 1px rgba(34, 197, 94, 0.3)"
          : "0 2px 10px rgba(0, 0, 0, 0.03)",
        transform: isHovered ? "translateY(-5px)" : "none",
        display: "flex",
        flexDirection: "column",
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
        {/* Product Image with smooth fade-in */}
        <Box
          component="img"
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
            transform: isHovered ? "scale(1.06)" : "scale(1)",
            opacity: imageLoaded ? 1 : 0.6,
          }}
        />

        {/* Subtle Dark Bottom Gradient for Text Legibility */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: isHovered
              ? "linear-gradient(to top, rgba(17, 24, 39, 0.45) 0%, rgba(17, 24, 39, 0.05) 40%, transparent 70%)"
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
            zIndex: 3,
          }}
        >
          <Tooltip title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}>
            <IconButton
              onClick={handleFavoriteToggle}
              size="small"
              sx={{
                width: 36,
                height: 36,
                bgcolor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(12px)",
                color: isFavorited ? "#EF4444" : CHARCOAL,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#FFFFFF",
                  transform: "scale(1.1)",
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

        {/* Hover Action Bar (Bottom of image) */}
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            right: 12,
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: { xs: 1, md: isHovered ? 1 : 0 },
            transform: { xs: "none", md: isHovered ? "translateY(0)" : "translateY(8px)" },
            transition: "all 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1.5,
              py: 0.6,
              borderRadius: "20px",
              bgcolor: "rgba(17, 24, 39, 0.8)",
              backdropFilter: "blur(8px)",
              color: "#FFFFFF",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            <span>View Look</span>
            <NorthEastRoundedIcon sx={{ fontSize: 13 }} />
          </Box>

          {!isOutOfStock && (
            <Tooltip title="Quick Add to Cart">
              <IconButton
                onClick={handleQuickAdd}
                disabled={addToCart.isPending}
                size="small"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: EMERALD,
                  color: "#07130F",
                  boxShadow: "0 4px 14px rgba(34, 197, 94, 0.4)",
                  "&:hover": {
                    bgcolor: "#16A34A",
                    color: "#FFFFFF",
                    transform: "scale(1.08)",
                  },
                  transition: "all 0.2s ease",
                }}
                aria-label="Add to cart"
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* ── Product Details ────────────────────────────────────────────── */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <Box>
          {/* Category & Brand / Vendor */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} mb={0.5}>
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
