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
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { useFavorites, useRemoveFromFavorites } from "../../hooks/useFavorites";
import { WishlistItemCard } from "../../components/customer/WishlistItemCard";
import { ROUTES } from "../../constants/routes";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";

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
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
            Wishlist ({favorites?.length ?? 0} {favorites?.length === 1 ? "item" : "items"})
          </Typography>
          {!isLoading && favorites && favorites.length > 0 && (
            <Typography color="text.secondary">Move your favourites into your cart whenever you're ready.</Typography>
          )}
        </Box>

        {isLoading ? (
          <Grid container spacing={3}>
            {[...Array(4)].map((_, i) => (
              <Grid size={{ xs: 12, md: 6 }} key={i}>
                <Skeleton variant="rounded" animation="wave" height={250} />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Alert severity="error" action={<Button onClick={() => window.location.reload()}>Retry</Button>}>
            Failed to load wishlist
          </Alert>
        ) : !favorites || favorites.length === 0 ? (
          <Stack alignItems="center" textAlign="center" spacing={2} sx={{ py: { xs: 8, md: 12 }, px: 2 }}>
            <Box sx={{ display: "grid", placeItems: "center", width: 88, height: 88, borderRadius: "50%", bgcolor: "primary.light", color: "primary.main" }}>
              <FavoriteBorderRoundedIcon sx={{ fontSize: 42 }} aria-hidden="true" />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>❤️ Wishlist is empty</Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
              Save products you love so you can find them later.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: { xs: "100%", sm: "auto" }, pt: 1 }}>
              <Button component={RouterLink} to={ROUTES.customerDashboard} variant="contained" fullWidth>Continue shopping</Button>
              <Button component={RouterLink} to={ROUTES.categories} variant="outlined" startIcon={<CategoryOutlinedIcon />} fullWidth>Browse categories</Button>
            </Stack>
          </Stack>
        ) : (
          <Grid container spacing={3}>
            {favorites.map((product) => (
              <Grid size={{ xs: 12, md: 6 }} key={product.id}>
                <WishlistItemCard product={product} onRemove={handleRemove} isRemoving={removingId === product.id} />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
      <Snackbar open={showRemoveSuccess} autoHideDuration={3000} onClose={() => setShowRemoveSuccess(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" variant="filled" onClose={() => setShowRemoveSuccess(false)}>Removed from your wishlist.</Alert>
      </Snackbar>
    </Container>
  );
}
