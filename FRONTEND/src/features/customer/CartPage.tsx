import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Button,
  IconButton,
  Alert,
  Divider,
  TextField,
  Chip,
  Skeleton,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "../../hooks/useCart";
import { ROUTES } from "../../constants/routes";
import { useSiteSettingsContext } from "../../contexts/SiteSettingsContext";
import { useFormatCurrency } from "../../utils/currency";

export function CartPage() {
  const { data: cart, isLoading, error, refetch } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();
  const { settings } = useSiteSettingsContext();
  const formatCurrency = useFormatCurrency();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity,
    0
  );
  const defaultShippingFee = settings?.defaultShippingFee || 500;
  const isFreeShipping = subtotal > 5000;
  const shipping = isFreeShipping ? 0 : defaultShippingFee;
  const total = subtotal + shipping;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateItem.mutate({ itemId, quantity: newQuantity });
    }
  };

  const handleRemove = (itemId: string) => {
    removeItem.mutate(itemId);
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim()) {
      setPromoApplied(true);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#07090E", py: { xs: 4, sm: 6, md: 8 } }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Skeleton variant="text" width={240} height={48} sx={{ bgcolor: "rgba(255, 255, 255, 0.05)" }} />
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={2.5}>
                  {[...Array(3)].map((_, i) => (
                    <Skeleton
                      key={i}
                      variant="rounded"
                      height={160}
                      sx={{ borderRadius: "20px", bgcolor: "rgba(255, 255, 255, 0.05)" }}
                    />
                  ))}
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Skeleton
                  variant="rounded"
                  height={380}
                  sx={{ borderRadius: "24px", bgcolor: "rgba(255, 255, 255, 0.05)" }}
                />
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#07090E", py: 8 }}>
        <Container maxWidth="xl">
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
            sx={{ borderRadius: "14px", bgcolor: "rgba(239, 68, 68, 0.15)", color: "#FFF" }}
          >
            Failed to load your cart. Please try again.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#07090E", py: { xs: 4, sm: 6, md: 8 } }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          {/* Header */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: "#00C896",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontSize: "0.75rem",
              }}
            >
              Review & Checkout
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#FFF", letterSpacing: "-0.02em" }}>
              Shopping Bag
            </Typography>
            {items.length > 0 && (
              <Typography sx={{ color: "rgba(255, 255, 255, 0.5)", mt: 0.5 }}>
                {items.length} {items.length === 1 ? "item" : "items"} ready for order
              </Typography>
            )}
          </Box>

          {/* Main Content */}
          {items.length === 0 ? (
            /* Empty State */
            <Box
              sx={{
                textAlign: "center",
                py: { xs: 8, md: 12 },
                px: 3,
                borderRadius: "24px",
                bgcolor: "#0B0E14",
                border: "1px dashed rgba(255, 255, 255, 0.12)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: 640,
                mx: "auto",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 80,
                  height: 80,
                  borderRadius: "20px",
                  bgcolor: "rgba(0, 200, 150, 0.1)",
                  color: "#00C896",
                  border: "1px solid rgba(0, 200, 150, 0.2)",
                  mb: 2.5,
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 38 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#FFF", mb: 1 }}>
                Your shopping bag is empty
              </Typography>
              <Typography sx={{ color: "rgba(255, 255, 255, 0.5)", maxWidth: 380, mb: 4, fontSize: "0.95rem" }}>
                Looks like you haven't added any items to your bag yet. Explore our curated catalog.
              </Typography>
              <Button
                component={RouterLink}
                to={ROUTES.customerDashboard}
                variant="contained"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  bgcolor: "#00C896",
                  color: "#07130F",
                  fontWeight: 800,
                  borderRadius: "12px",
                  px: 4,
                  py: 1.2,
                  fontSize: "0.88rem",
                  textTransform: "none",
                  boxShadow: "0 4px 16px rgba(0, 200, 150, 0.35)",
                  "&:hover": {
                    bgcolor: "#00E0A7",
                    boxShadow: "0 6px 22px rgba(0, 200, 150, 0.5)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Start Shopping
              </Button>
            </Box>
          ) : (
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {/* Left Column: Cart Items */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={2.5}>
                  {items.map((item) => {
                    const primaryImage =
                      (item.product.images ?? []).find((img) => img.isPrimary) ||
                      item.product.images?.[0];
                    const price = item.variant?.price || item.product.price;
                    const itemTotal = price * item.quantity;
                    const productUrl = `${ROUTES.customerDashboard}/${item.product.slug}`;

                    return (
                      <Box
                        key={item.id}
                        sx={{
                          p: { xs: 2, sm: 2.5 },
                          bgcolor: "#0B0E14",
                          borderRadius: { xs: "18px", sm: "22px" },
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "stretch", sm: "center" },
                          gap: { xs: 2, sm: 2.5 },
                          transition: "all 0.25s ease",
                          "&:hover": {
                            borderColor: "rgba(0, 200, 150, 0.3)",
                            boxShadow: "0 12px 30px -8px rgba(0, 0, 0, 0.6)",
                          },
                        }}
                      >
                        {/* Image */}
                        <Box
                          component={RouterLink}
                          to={productUrl}
                          sx={{
                            position: "relative",
                            width: { xs: "100%", sm: 130, md: 140 },
                            height: { xs: 160, sm: 140 },
                            flexShrink: 0,
                            bgcolor: "#0E131C",
                            borderRadius: "14px",
                            overflow: "hidden",
                            display: "block",
                            border: "1px solid rgba(255, 255, 255, 0.05)",
                          }}
                        >
                          {primaryImage ? (
                            <Box
                              component="img"
                              src={primaryImage.imageUrl}
                              alt={item.product.name}
                              loading="lazy"
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center top",
                                display: "block",
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
                                color: "rgba(255, 255, 255, 0.2)",
                              }}
                            >
                              <Typography variant="caption">No image</Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Product info & variants */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              color: "#00C896",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              mb: 0.3,
                            }}
                          >
                            {item.product.vendor?.businessName || "DressMe"}
                          </Typography>

                          <Typography
                            component={RouterLink}
                            to={productUrl}
                            sx={{
                              color: "#FFF",
                              textDecoration: "none",
                              fontWeight: 700,
                              fontSize: { xs: "0.98rem", sm: "1.05rem" },
                              lineHeight: 1.3,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              letterSpacing: "-0.01em",
                              transition: "color 0.2s ease",
                              "&:hover": { color: "#00C896" },
                              mb: 0.8,
                            }}
                          >
                            {item.product.name}
                          </Typography>

                          {/* Variant chips */}
                          <Stack direction="row" spacing={0.8} flexWrap="wrap" sx={{ mb: 1 }}>
                            {item.variant?.sizeValue && (
                              <Chip
                                label={`Size: ${item.variant.sizeValue}`}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(255, 255, 255, 0.06)",
                                  color: "rgba(255, 255, 255, 0.8)",
                                  border: "1px solid rgba(255, 255, 255, 0.08)",
                                  fontWeight: 600,
                                  fontSize: "0.68rem",
                                  height: 22,
                                }}
                              />
                            )}
                            {item.variant?.colorValue && (
                              <Chip
                                label={`Color: ${item.variant.colorValue}`}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(255, 255, 255, 0.06)",
                                  color: "rgba(255, 255, 255, 0.8)",
                                  border: "1px solid rgba(255, 255, 255, 0.08)",
                                  fontWeight: 600,
                                  fontSize: "0.68rem",
                                  height: 22,
                                }}
                              />
                            )}
                          </Stack>

                          {/* Unit price */}
                          <Typography sx={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "0.82rem" }}>
                            Unit: {formatCurrency(price)}
                          </Typography>
                        </Box>

                        {/* Right side controls: Stepper + Total + Delete */}
                        <Stack
                          direction={{ xs: "row", sm: "column" }}
                          alignItems={{ xs: "center", sm: "flex-end" }}
                          justifyContent={{ xs: "space-between", sm: "center" }}
                          spacing={1.5}
                          sx={{ flexShrink: 0, pt: { xs: 1, sm: 0 }, borderTop: { xs: "1px solid rgba(255, 255, 255, 0.06)", sm: "none" } }}
                        >
                          {/* Item total price */}
                          <Typography
                            sx={{
                              fontWeight: 800,
                              fontSize: { xs: "1.1rem", sm: "1.2rem" },
                              color: "#FFF",
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {formatCurrency(itemTotal)}
                          </Typography>

                          {/* Stepper + Delete button */}
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {/* Edgy Glass Stepper */}
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                bgcolor: "rgba(255, 255, 255, 0.04)",
                                border: "1px solid rgba(255, 255, 255, 0.12)",
                                borderRadius: "10px",
                                p: 0.3,
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updateItem.isPending}
                                sx={{
                                  color: "#FFF",
                                  p: 0.4,
                                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                                  "&.Mui-disabled": { color: "rgba(255, 255, 255, 0.2)" },
                                }}
                              >
                                <RemoveRoundedIcon sx={{ fontSize: 15 }} />
                              </IconButton>

                              <Typography
                                sx={{
                                  minWidth: 28,
                                  textAlign: "center",
                                  fontWeight: 800,
                                  fontSize: "0.85rem",
                                  color: "#FFF",
                                }}
                              >
                                {item.quantity}
                              </Typography>

                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={updateItem.isPending}
                                sx={{
                                  color: "#FFF",
                                  p: 0.4,
                                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                                  "&.Mui-disabled": { color: "rgba(255, 255, 255, 0.2)" },
                                }}
                              >
                                <AddRoundedIcon sx={{ fontSize: 15 }} />
                              </IconButton>
                            </Box>

                            {/* Delete button */}
                            <IconButton
                              size="small"
                              onClick={() => handleRemove(item.id)}
                              disabled={removeItem.isPending}
                              aria-label="Remove item"
                              sx={{
                                color: "rgba(255, 255, 255, 0.35)",
                                bgcolor: "rgba(255, 255, 255, 0.03)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                borderRadius: "10px",
                                p: 0.7,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  color: "#EF4444",
                                  bgcolor: "rgba(239, 68, 68, 0.12)",
                                  borderColor: "rgba(239, 68, 68, 0.3)",
                                  transform: "scale(1.06)",
                                },
                              }}
                            >
                              <DeleteOutlineRoundedIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              </Grid>

              {/* Right Column: Order Summary (Edgy Glass Deck) */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    p: { xs: 2.5, sm: 3.5 },
                    bgcolor: "#0B0E14",
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 16px 40px -10px rgba(0, 0, 0, 0.7)",
                    position: { md: "sticky" },
                    top: { md: 100 },
                  }}
                >
                  <Stack spacing={3}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#FFF", letterSpacing: "-0.01em" }}>
                      Order Summary
                    </Typography>

                    {/* Cost Breakdown */}
                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.92rem" }}>
                          Subtotal
                        </Typography>
                        <Typography sx={{ color: "#FFF", fontWeight: 700, fontSize: "0.95rem" }}>
                          {formatCurrency(subtotal)}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.92rem" }}>
                          Estimated Shipping
                        </Typography>
                        <Typography
                          sx={{
                            color: isFreeShipping ? "#00C896" : "#FFF",
                            fontWeight: 700,
                            fontSize: "0.95rem",
                          }}
                        >
                          {isFreeShipping ? "FREE" : formatCurrency(shipping)}
                        </Typography>
                      </Stack>

                      {promoApplied && (
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ color: "#00C896", fontSize: "0.92rem" }}>
                            Promo Discount
                          </Typography>
                          <Typography sx={{ color: "#00C896", fontWeight: 700 }}>
                            Applied
                          </Typography>
                        </Stack>
                      )}

                      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 1 }} />

                      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                        <Typography sx={{ color: "#FFF", fontWeight: 800, fontSize: "1.1rem" }}>
                          Total
                        </Typography>
                        <Typography
                          sx={{
                            color: "#00C896",
                            fontWeight: 900,
                            fontSize: "1.5rem",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {formatCurrency(total)}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Promo Code Input */}
                    <Box component="form" onSubmit={handleApplyPromo}>
                      <Stack direction="row" spacing={1}>
                        <TextField
                          fullWidth
                          placeholder="Promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          size="small"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              bgcolor: "rgba(255, 255, 255, 0.04)",
                              borderRadius: "12px",
                              color: "#FFF",
                              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.12)" },
                              "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.25)" },
                              "&.Mui-focused fieldset": { borderColor: "#00C896" },
                            },
                            "& .MuiInputBase-input": { fontSize: "0.85rem", py: 1.1 },
                          }}
                        />
                        <Button
                          type="submit"
                          variant="outlined"
                          disabled={!promoCode.trim()}
                          sx={{
                            borderRadius: "12px",
                            px: 2.5,
                            fontWeight: 700,
                            fontSize: "0.78rem",
                            textTransform: "none",
                            color: "#FFF",
                            borderColor: "rgba(255, 255, 255, 0.18)",
                            bgcolor: "rgba(255, 255, 255, 0.04)",
                            "&:hover": {
                              bgcolor: "rgba(255, 255, 255, 0.1)",
                              borderColor: "rgba(255, 255, 255, 0.35)",
                            },
                          }}
                        >
                          Apply
                        </Button>
                      </Stack>
                    </Box>

                    {/* Primary Checkout Button (Edgy, bold luxury button) */}
                    <Stack spacing={1.5}>
                      <Button
                        component={RouterLink}
                        to={ROUTES.checkout}
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowForwardRoundedIcon />}
                        sx={{
                          borderRadius: "14px",
                          py: 1.4,
                          fontWeight: 900,
                          fontSize: "0.95rem",
                          letterSpacing: "0.03em",
                          textTransform: "none",
                          bgcolor: "#00C896",
                          color: "#07130F",
                          boxShadow: "0 6px 24px rgba(0, 200, 150, 0.4)",
                          transition: "all 0.25s ease",
                          "&:hover": {
                            bgcolor: "#00E0A7",
                            boxShadow: "0 8px 30px rgba(0, 200, 150, 0.6)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        Proceed to Checkout
                      </Button>

                      <Button
                        component={RouterLink}
                        to={ROUTES.customerDashboard}
                        variant="text"
                        fullWidth
                        sx={{
                          color: "rgba(255, 255, 255, 0.6)",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          textTransform: "none",
                          borderRadius: "12px",
                          py: 1,
                          "&:hover": {
                            color: "#FFF",
                            bgcolor: "rgba(255, 255, 255, 0.05)",
                          },
                        }}
                      >
                        Continue Shopping
                      </Button>
                    </Stack>

                    {/* Trust / Security Highlights */}
                    <Stack spacing={1.2} sx={{ pt: 1, borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                      <Stack direction="row" alignItems="center" spacing={1.2}>
                        <ShieldOutlinedIcon sx={{ color: "#00C896", fontSize: 18 }} />
                        <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.78rem" }}>
                          Encrypted 256-bit secure checkout
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1.2}>
                        <VerifiedOutlinedIcon sx={{ color: "#00C896", fontSize: 18 }} />
                        <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.78rem" }}>
                          100% authentic curated designs
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1.2}>
                        <LocalShippingOutlinedIcon sx={{ color: "#00C896", fontSize: 18 }} />
                        <Typography sx={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.78rem" }}>
                          Fast delivery across Kenya & East Africa
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
