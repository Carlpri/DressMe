import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ROUTES } from "../../constants/routes";
import type { Product } from "../../types/product";
import { useAddToCart } from "../../hooks/useCart";
import { useFormatCurrency } from "../../utils/currency";

interface WishlistItemCardProps {
  product: Product;
  onRemove: (productId: string) => void;
  isRemoving?: boolean;
}

export function WishlistItemCard({ product, onRemove, isRemoving }: WishlistItemCardProps) {
  const [showCartSuccess, setShowCartSuccess] = useState(false);
  const addToCart = useAddToCart();
  const formatCurrency = useFormatCurrency();

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart.mutate(
        { productId: product.id, quantity: 1 },
        {
          onSuccess: () => {
            setShowCartSuccess(true);
          },
        }
      );
    }
  };

  const handleRemove = () => {
    onRemove(product.id);
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 0.3s",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            pt: "100%",
            overflow: "hidden",
            bgcolor: "#F8FAFC",
          }}
        >
          <Box
            component={RouterLink}
            to={`${ROUTES.customerDashboard}/${product.slug}`}
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {primaryImage ? (
              <CardMedia
                component="img"
                image={primaryImage.imageUrl}
                alt={primaryImage.altText || product.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s",
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
                  bgcolor: "#E2E8F0",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "text.secondary",
                    textAlign: "center",
                    p: 2,
                  }}
                >
                  {product.name}
                </Typography>
              </Box>
            )}
          </Box>

          <IconButton
            onClick={handleRemove}
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
            disabled={isRemoving}
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Stack spacing={1.5}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {product.brand.name}
            </Typography>
            <Box
              component={RouterLink}
              to={`${ROUTES.customerDashboard}/${product.slug}`}
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "none" },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  color: "text.primary",
                  lineHeight: 1.3,
                }}
              >
                {product.name}
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              {formatCurrency(product.price)}
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                size="small"
                startIcon={<ShoppingCartIcon />}
                disabled={product.stock === 0 || addToCart.isPending}
                onClick={handleAddToCart}
                sx={{ flex: 1 }}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={showCartSuccess}
        autoHideDuration={3000}
        onClose={() => setShowCartSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setShowCartSuccess(false)}>
          Added to cart!
        </Alert>
      </Snackbar>
    </>
  );
}
