import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import { useOutfits, useCreateOutfit, useDeleteOutfit } from "../../hooks/useOutfits";
import { useProducts } from "../../hooks/useProducts";
import { ProductCard } from "../../components/shared/ProductCard";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import type { Outfit } from "../../hooks/useOutfits";

const STYLE_OPTIONS = [
  "Casual",
  "Formal",
  "Streetwear",
  "Bohemian",
  "Minimalist",
  "Vintage",
  "Athleisure",
  "Business",
];

const OCCASION_OPTIONS = [
  "Everyday",
  "Work",
  "Party",
  "Date Night",
  "Weekend",
  "Special Event",
  "Travel",
];

const SEASON_OPTIONS = [
  "Spring",
  "Summer",
  "Fall",
  "Winter",
  "All Season",
];

export function OutfitBuilderPage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    style: "",
    occasion: "",
    season: "",
  });

  const { data: outfits, isLoading, refetch } = useOutfits();
  const createOutfit = useCreateOutfit();
  const deleteOutfit = useDeleteOutfit();
  const { data: allProducts } = useProducts({ limit: 100 });

  const handleToggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleOpenDialog = () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product for your outfit");
      return;
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({ title: "", description: "", style: "", occasion: "", season: "" });
  };

  const handleSaveOutfit = () => {
    createOutfit.mutate(
      {
        ...formData,
        productIds: selectedProducts,
      },
      {
        onSuccess: () => {
          handleCloseDialog();
          setSelectedProducts([]);
          refetch();
        },
      }
    );
  };

  const handleDeleteOutfit = (id: string) => {
    if (confirm("Are you sure you want to delete this outfit?")) {
      deleteOutfit.mutate(id, {
        onSuccess: () => refetch(),
      });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={6}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h3" sx={{ fontWeight: 700 }}>Outfit Builder</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            disabled={selectedProducts.length === 0}
          >
            Save Outfit ({selectedProducts.length})
          </Button>
        </Stack>

        <Grid container spacing={4}>
          {/* Product Selection */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={3}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Select Products
                    </Typography>
                    <Chip label={`${selectedProducts.length} selected`} size="small" />
                  </Stack>

                  {allProducts ? (
                    <Grid container spacing={2}>
                      {allProducts.items.map((product) => {
                    const isSelected = selectedProducts.includes(product.id);
                    return (
                      <Grid size={{ xs: 6, sm: 4, md: 3 }} key={product.id}>
                        <Box sx={{ position: "relative" }}>
                          <ProductCard product={product} />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 8,
                              left: 8,
                              bgcolor: isSelected ? "primary.main" : "white",
                              borderRadius: "50%",
                              width: 32,
                              height: 32,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                              zIndex: 1,
                            }}
                            onClick={() => handleToggleProduct(product.id)}
                          >
                            {isSelected && (
                              <Typography sx={{ color: "white", fontWeight: 700 }}>
                                ✓
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                    </Grid>
                  ) : (
                    <LoadingSkeleton height={400} />
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Selected Items Preview */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={3}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Selected Items
                  </Typography>

                  {selectedProducts.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No products selected yet. Click on products to add them to your outfit.
                    </Typography>
                  ) : (
                    <Stack spacing={2}>
                      {selectedProducts.map((productId) => {
                        const product = allProducts?.items.find((p) => p.id === productId);
                        if (!product) return null;
                        const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
                        return (
                          <Box key={productId}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 1,
                                  overflow: "hidden",
                                  bgcolor: "#F8FAFC",
                                }}
                              >
                                {primaryImage && (
                                  <Box
                                    component="img"
                                    src={primaryImage.imageUrl}
                                    alt={product.name}
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                )}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {product.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  KES {product.price.toLocaleString()}
                                </Typography>
                              </Box>
                              <IconButton
                                size="small"
                                onClick={() => handleToggleProduct(productId)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Box>
                        );
                      })}
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider />

        {/* Saved Outfits */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            My Saved Outfits
          </Typography>

          {isLoading ? (
            <Grid container spacing={3}>
              {[...Array(3)].map((_, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <LoadingSkeleton height={250} />
                </Grid>
              ))}
            </Grid>
          ) : !outfits || outfits.length === 0 ? (
            <Alert severity="info">No outfits saved yet. Create your first outfit!</Alert>
          ) : (
            <Grid container spacing={3}>
              {outfits.map((outfit) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={outfit.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CheckroomIcon color="primary" fontSize="small" />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {outfit.title}
                            </Typography>
                          </Stack>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteOutfit(outfit.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>

                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Chip label={outfit.style} size="small" />
                          {outfit.occasion && (
                            <Chip label={outfit.occasion} size="small" variant="outlined" />
                          )}
                        </Stack>

                        {outfit.description && (
                          <Typography variant="body2" color="text.secondary">
                            {outfit.description}
                          </Typography>
                        )}

                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {outfit.items.length} items
                          </Typography>
                        </Box>

                        <Grid container spacing={1}>
                          {outfit.items.slice(0, 4).map((item) => (
                            <Grid size={3} key={item.id}>
                              <Box
                                sx={{
                                  width: "100%",
                                  aspectRatio: 1,
                                  borderRadius: 1,
                                  overflow: "hidden",
                                  bgcolor: "#F8FAFC",
                                }}
                              >
                                {item.product.images[0] && (
                                  <Box
                                    component="img"
                                    src={item.product.images[0].imageUrl}
                                    alt={item.product.name}
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                )}
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Stack>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Save Outfit</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Outfit Name"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Style</InputLabel>
              <Select
                value={formData.style}
                label="Style"
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                required
              >
                {STYLE_OPTIONS.map((style) => (
                  <MenuItem key={style} value={style}>
                    {style}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Occasion</InputLabel>
              <Select
                value={formData.occasion}
                label="Occasion"
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
              >
                <MenuItem value="">Select occasion</MenuItem>
                {OCCASION_OPTIONS.map((occasion) => (
                  <MenuItem key={occasion} value={occasion}>
                    {occasion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Season</InputLabel>
              <Select
                value={formData.season}
                label="Season"
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              >
                <MenuItem value="">Select season</MenuItem>
                {SEASON_OPTIONS.map((season) => (
                  <MenuItem key={season} value={season}>
                    {season}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveOutfit}
            disabled={!formData.title || !formData.style || createOutfit.isPending}
          >
            Save Outfit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
