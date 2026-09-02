import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import { useFavorites, useRemoveFromFavorites } from "../../hooks/useFavorites";
import { WishlistItemCard } from "../../components/customer/WishlistItemCard";
import { ROUTES } from "../../constants/routes";

export function WishlistPage() {
  const { data: favorites, isLoading, error } = useFavorites();
  const removeFromFavorites = useRemoveFromFavorites();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [showRemoveSuccess, setShowRemoveSuccess] = useState(false);

  const handleRemove = (productId: string) => {
    setRemovingId(productId);
    window.setTimeout(() => {
      removeFromFavorites.mutate(productId, {
        onSuccess: () => {
          setShowRemoveSuccess(true);
          setRemovingId(null);
        },
        onError: () => setRemovingId(null),
      });
    }, 180);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#07090E", py: { xs: 4, sm: 6, md: 8 } }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          {/* Header */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "flex-end" }, gap: 2 }}>
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
                Saved Items
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#FFF", letterSpacing: "-0.02em" }}>
                Wishlist
              </Typography>
              {!isLoading && favorites && favorites.length > 0 && (
                <Typography sx={{ color: "rgba(255, 255, 255, 0.5)", mt: 0.5 }}>
                  {favorites.length} {favorites.length === 1 ? "item" : "items"} saved in your collection
                </Typography>
              )}
            </Box>

            {!isLoading && favorites && favorites.length > 0 && (
              <Button
                component={RouterLink}
                to={ROUTES.customerDashboard}
                variant="outlined"
                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "16px !important" }} />}
                sx={{
                  borderRadius: "12px",
                  py: 1,
                  px: 2.5,
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  textTransform: "none",
                  color: "#FFF",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  bgcolor: "rgba(255, 255, 255, 0.03)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.35)",
                  },
                }}
              >
                Continue Shopping
              </Button>
            )}
          </Box>

          {isLoading ? (
            <Grid container spacing={3}>
              {[...Array(4)].map((_, i) => (
                <Grid size={{ xs: 12, lg: 6 }} key={i}>
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    height={240}
                    sx={{ borderRadius: "22px", bgcolor: "rgba(255, 255, 255, 0.05)" }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : error ? (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              }
              sx={{ borderRadius: "14px", bgcolor: "rgba(239, 68, 68, 0.15)", color: "#FFF" }}
            >
              Failed to load wishlist
            </Alert>
          ) : !favorites || favorites.length === 0 ? (
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
                <FavoriteBorderRoundedIcon sx={{ fontSize: 38 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#FFF", mb: 1 }}>
                Your wishlist is empty
              </Typography>
              <Typography sx={{ color: "rgba(255, 255, 255, 0.5)", maxWidth: 380, mb: 4, fontSize: "0.95rem" }}>
                Explore the latest collections and save the looks and pieces you love.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: { xs: "100%", sm: "auto" } }}>
                <Button
                  component={RouterLink}
                  to={ROUTES.customerDashboard}
                  variant="contained"
                  sx={{
                    bgcolor: "#00C896",
                    color: "#07130F",
                    fontWeight: 800,
                    borderRadius: "12px",
                    px: 3,
                    py: 1.1,
                    textTransform: "none",
                    boxShadow: "0 4px 16px rgba(0, 200, 150, 0.35)",
                    "&:hover": {
                      bgcolor: "#00E0A7",
                      boxShadow: "0 6px 22px rgba(0, 200, 150, 0.5)",
                    },
                  }}
                >
                  Explore Catalog
                </Button>
                <Button
                  component={RouterLink}
                  to={ROUTES.categories}
                  variant="outlined"
                  startIcon={<GridViewRoundedIcon />}
                  sx={{
                    color: "#FFF",
                    borderColor: "rgba(255, 255, 255, 0.18)",
                    fontWeight: 700,
                    borderRadius: "12px",
                    px: 3,
                    py: 1.1,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.08)",
                      borderColor: "rgba(255, 255, 255, 0.35)",
                    },
                  }}
                >
                  Browse Categories
                </Button>
              </Stack>
            </Box>
          ) : (
            /* Items Grid */
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {favorites.map((product) => (
                <Grid size={{ xs: 12, lg: 6 }} key={product.id}>
                  <WishlistItemCard
                    product={product}
                    onRemove={handleRemove}
                    isRemoving={removingId === product.id}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>

      <Snackbar
        open={showRemoveSuccess}
        autoHideDuration={3000}
        onClose={() => setShowRemoveSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="info"
          onClose={() => setShowRemoveSuccess(false)}
          sx={{
            bgcolor: "#1E293B",
            color: "#FFFFFF",
            fontWeight: 700,
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          Item removed from wishlist.
        </Alert>
      </Snackbar>
    </Box>
  );
}
