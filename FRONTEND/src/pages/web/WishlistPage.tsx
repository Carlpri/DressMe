import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFavorites, useRemoveFromFavorites } from "../../hooks/useFavorites";
import { ProductCard } from "../../components/shared/ProductCard";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { ROUTES } from "../../constants/routes";
import { Link as RouterLink } from "react-router-dom";

export function WishlistPage() {
  const { data: favorites, isLoading, error } = useFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const handleRemove = (productId: string) => {
    removeFromFavorites.mutate(productId);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={6}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            My Wishlist
          </Typography>
          <Typography color="text.secondary">
            {favorites?.length || 0} items saved
          </Typography>
        </Box>

        {isLoading ? (
          <Grid container spacing={3}>
            {[...Array(4)].map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                <LoadingSkeleton height={400} />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Alert severity="error" action={<Button onClick={() => window.location.reload()}>Retry</Button>}>
            Failed to load wishlist
          </Alert>
        ) : !favorites || favorites.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Your wishlist is empty
            </Typography>
            <Button
              component={RouterLink}
              to={ROUTES.customerDashboard}
              variant="contained"
            >
              Start Shopping
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {favorites.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                <Box sx={{ position: "relative" }}>
                  <ProductCard product={product} />
                  <IconButton
                    onClick={() => handleRemove(product.id)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      bgcolor: "white",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      "&:hover": {
                        bgcolor: "#FFE5E5",
                      },
                      zIndex: 1,
                    }}
                    disabled={removeFromFavorites.isPending}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </Container>
  );
}
