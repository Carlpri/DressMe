import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  CircularProgress,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CollectionsIcon from "@mui/icons-material/Collections";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { MediaPickerModal } from "../../components/admin/MediaPickerModal";
import { ImageUploader } from "../../components/admin/ImageUploader";
import { useFormatCurrency } from "../../utils/currency";

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const formatCurrency = useFormatCurrency();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"primary" | "gallery">("primary");
  const [uploadingCount, setUploadingCount] = useState(0);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successSnackbar, setSuccessSnackbar] = useState<{
    open: boolean;
    message: string;
  }>({ open: false, message: "" });

  const isUploading = uploadingCount > 0;

  const handleUploadingChange = (uploading: boolean) => {
    setUploadingCount((count) => (uploading ? count + 1 : Math.max(0, count - 1)));
  };

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(10);
  const [sku, setSku] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "UNISEX">("UNISEX");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [brandId, setBrandId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "DRAFT" | "ARCHIVED" | "HIDDEN">("ACTIVE");
  const [featured, setFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [primaryImageUrl, setPrimaryImageUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [variants, setVariants] = useState<any[]>([
    {
      sizeId: "",
      sizeValue: "",
      colorId: "",
      colorValue: "",
      price: 2500,
      compareAtPrice: 3000,
      stock: 10,
      isAvailable: true,
    },
  ]);

  const { data: products = [], isLoading: productsLoading } = useQuery<any[]>({
    queryKey: ["admin-products-list"],
    queryFn: async () => {
      const res = await apiClient.get("/products?limit=100");
      return res.data.data.items;
    },
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["categories-all"],
    queryFn: async () => {
      const res = await apiClient.get("/categories");
      return res.data.data;
    },
  });

  const { data: brands = [] } = useQuery<any[]>({
    queryKey: ["brands-all"],
    queryFn: async () => {
      const res = await apiClient.get("/brands");
      return res.data.data;
    },
  });

  const { data: vendors = [] } = useQuery<any[]>({
    queryKey: ["vendors-all"],
    queryFn: async () => {
      const res = await apiClient.get("/vendors");
      return res.data.data;
    },
  });

  const { data: sizes = [] } = useQuery<any[]>({
    queryKey: ["sizes-all"],
    queryFn: async () => {
      const res = await apiClient.get("/references/sizes");
      return res.data.data || res.data;
    },
  });

  const { data: colors = [] } = useQuery<any[]>({
    queryKey: ["colors-all"],
    queryFn: async () => {
      const res = await apiClient.get("/references/colors");
      return res.data.data || res.data;
    },
  });

  useEffect(() => {
    if (!editingProduct && !vendorId && vendors.length > 0) {
      setVendorId(vendors[0].id);
    }
  }, [editingProduct, vendorId, vendors]);

  const saveProductMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingProduct) {
        const res = await apiClient.patch(`/products/${editingProduct.id}`, payload);
        return res.data.data;
      }
      const res = await apiClient.post("/products", payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products-list"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSaveError(null);
      handleCloseDialog();
      
      if (!editingProduct && data?.slug) {
        setSuccessSnackbar({
          open: true,
          message: `Product "${data.slug}" created successfully`,
        });
      } else {
        setSuccessSnackbar({
          open: true,
          message: "Product updated successfully",
        });
      }
    },
    onError: (error: unknown) => {
      let message = "Failed to save product. Please check all fields and try again.";
      
      if (error && typeof error === "object" && "response" in error) {
        const response = (error as { response?: { data?: any } }).response?.data;
        
        if (response?.message) {
          message = response.message;
        }
        
        // Show specific field errors if available
        if (response?.errors && Array.isArray(response.errors)) {
          message = response.errors.map((e: any) => `${e.field || 'Field'}: ${e.message || e.details}`).join('; ');
        }
      }
      
      setSaveError(message);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products-list"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName("");
    setDescription("High quality fashion product designed for maximum comfort and style.");
    setPrice(2500);
    setCompareAtPrice(3000);
    setStock(15);
    setSku(`DM-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`);
    setGender("UNISEX");
    setCategoryIds(categories.length > 0 ? [categories[0].id] : []);
    setBrandId(brands[0]?.id || "");
    setVendorId(vendors[0]?.id || "");
    setStatus("ACTIVE");
    setFeatured(false);
    setIsTrending(false);
    setIsNewArrival(true);
    setIsBestSeller(false);
    setPrimaryImageUrl("");
    setGalleryUrls([]);
    setVariants([
      {
        sizeId: "",
        sizeValue: "",
        colorId: "",
        colorValue: "",
        price: 2500,
        compareAtPrice: 3000,
        stock: 10,
        isAvailable: true,
      },
    ]);
    setSaveError(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (prod: any) => {
    setEditingProduct(prod);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price);
    setCompareAtPrice(prod.compareAtPrice || undefined);
    setStock(prod.stock ?? 0);
    setSku(prod.sku || "");
    setGender(prod.gender);
    setCategoryIds((prod.categories ?? []).map((category: any) => category.id));
    setBrandId(prod.brandId || prod.brand?.id || "");
    setVendorId(prod.vendorId || prod.vendor?.id || "");
    setStatus(prod.status);
    setFeatured(prod.featured);
    setIsTrending(prod.isTrending || false);
    setIsNewArrival(prod.isNewArrival || false);
    setIsBestSeller(prod.isBestSeller || false);

    const primary = prod.images?.find((img: any) => img.isPrimary) || prod.images?.[0];
    setPrimaryImageUrl(primary?.imageUrl || "");
    setGalleryUrls(
      (prod.images ?? [])
        .filter((img: any) => !img.isPrimary)
        .map((img: any) => img.imageUrl)
    );

    // Restore existing variants so the edit form shows the current variant data
    if (prod.variants && prod.variants.length > 0) {
      setVariants(
        prod.variants.map((v: any) => ({
          id: v.id,
          sizeId: v.sizeId || "",
          sizeValue: v.sizeValue || "",
          colorId: v.colorId || "",
          colorValue: v.colorValue || "",
          price: v.price ?? prod.price,
          compareAtPrice: v.compareAtPrice ?? undefined,
          stock: v.stock ?? 0,
          sku: v.sku || "",
          isAvailable: v.isAvailable ?? true,
        }))
      );
    } else {
      setVariants([
        {
          sizeId: "",
          sizeValue: "",
          colorId: "",
          colorValue: "",
          price: prod.price,
          compareAtPrice: undefined,
          stock: 10,
          isAvailable: true,
        },
      ]);
    }

    setSaveError(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setSaveError(null);
    setUploadingCount(0);
    setVariants([
      {
        sizeId: "",
        sizeValue: "",
        colorId: "",
        colorValue: "",
        price: 2500,
        compareAtPrice: 3000,
        stock: 10,
        isAvailable: true,
      },
    ]);
  };

  const handleSelectMedia = (selectedUrl: string) => {
    if (mediaTarget === "primary") {
      setPrimaryImageUrl(selectedUrl);
    } else {
      setGalleryUrls((prev) => [...prev, selectedUrl]);
    }
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        sizeId: "",
        sizeValue: "",
        colorId: "",
        colorValue: "",
        price: 2500,
        compareAtPrice: 3000,
        stock: 10,
        isAvailable: true,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-derive sizeValue when sizeId changes
    if (field === "sizeId") {
      const selectedSize = sizes.find((s) => s.id === value);
      updated[index].sizeValue = selectedSize?.name || "";
    }
    
    // Auto-derive colorValue when colorId changes
    if (field === "colorId") {
      const selectedColor = colors.find((c) => c.id === value);
      updated[index].colorValue = selectedColor?.name || "";
    }
    
    setVariants(updated);
  };

  const handleSave = () => {
    if (!primaryImageUrl) {
      setSaveError("Please upload a primary product image before saving.");
      return;
    }

    if (variants.length === 0) {
      setSaveError("Add at least one product variant.");
      return;
    }

    // Validate variants
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];
      if (!variant.sizeId) {
        setSaveError(`Variant ${i + 1}: Select a size.`);
        return;
      }
      if (!variant.colorId) {
        setSaveError(`Variant ${i + 1}: Select a color.`);
        return;
      }
      if (!variant.price || variant.price <= 0) {
        setSaveError(`Variant ${i + 1}: Enter a valid price.`);
        return;
      }
      if (variant.stock < 0) {
        setSaveError(`Variant ${i + 1}: Stock cannot be negative.`);
        return;
      }
    }

    setSaveError(null);

    const imagesPayload: any[] = [];
    if (primaryImageUrl) {
      imagesPayload.push({ imageUrl: primaryImageUrl, isPrimary: true, displayOrder: 0 });
    }
    galleryUrls.forEach((gUrl, idx) => {
      imagesPayload.push({ imageUrl: gUrl, isPrimary: false, displayOrder: idx + 1 });
    });

    // Generate unique SKUs for variants that don't have one yet.
    // We use an index + random suffix to prevent timestamp collisions when
    // multiple variants are built inside the same millisecond.
    const baseTs = Date.now().toString(36).toUpperCase();
    const variantsPayload = variants.map((v, i) => ({
      ...(v.id ? { id: v.id } : {}), // preserve id for updates
      sizeId: v.sizeId || undefined,
      sizeValue: v.sizeValue,
      colorId: v.colorId || undefined,
      colorValue: v.colorValue,
      price: Number(v.price),
      compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
      stock: Number(v.stock),
      isAvailable: v.isAvailable ?? true,
      // If an existing variant already has a SKU keep it; otherwise generate a unique one.
      sku: v.sku && v.sku.length >= 2
        ? v.sku
        : `DM-V${i + 1}-${baseTs}-${Math.floor(Math.random() * 9000 + 1000)}`,
    }));

    const payload = {
      name,
      description,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      stock: Number(stock),
      sku: sku || `DM-${baseTs}-${Math.floor(Math.random() * 9000 + 1000)}`,
      gender,
      categoryIds,
      brandId,
      vendorId,
      status,
      featured,
      isTrending,
      isNewArrival,
      isBestSeller,
      images: imagesPayload,
      variants: variantsPayload,
    };

    saveProductMutation.mutate(payload);
  };

  return (
    <Stack spacing={4}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Products Management
          </Typography>
          <Typography color="text.secondary">
            Manage your fashion catalog, inventory, pricing, gallery images, and promotion flags.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Create Product
        </Button>
      </Box>

      {/* Products Table */}
      {productsLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Category / Brand</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Badges</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((prod) => {
                const primaryImage = prod.images?.find((i: any) => i.isPrimary) || prod.images?.[0];
                return (
                  <TableRow key={prod.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: "#F8FAFC",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          {primaryImage ? (
                            <Box
                              component="img"
                              src={primaryImage.imageUrl}
                              alt={prod.name}
                              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : null}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {prod.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {prod.gender}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                      {prod.sku || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{(prod.categories ?? []).map((category: any) => category.name).join(", ") || "Uncategorized"}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {prod.brand?.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
                        {formatCurrency(prod.price)}
                      </Typography>
                      {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                        <Typography variant="caption" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                          {formatCurrency(prod.compareAtPrice)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${prod.stock} units`}
                        size="small"
                        color={prod.stock === 0 ? "error" : prod.stock <= 5 ? "warning" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {prod.featured && <Chip label="Featured" size="small" color="primary" />}
                        {prod.isTrending && <Chip label="Trending" size="small" color="secondary" />}
                        {prod.isNewArrival && <Chip label="New" size="small" color="info" />}
                        {prod.isBestSeller && <Chip label="Best" size="small" color="warning" />}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={prod.status}
                        size="small"
                        color={prod.status === "ACTIVE" ? "success" : prod.status === "HIDDEN" ? "secondary" : "default"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenEdit(prod)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => deleteProductMutation.mutate(prod.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingProduct ? "Edit Product" : "Create New Product"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                label="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="SKU"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. DM-BLZ-001"
                fullWidth
                disabled
                helperText="Auto-generated"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Selling Price (KES)"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="Regular Compare Price (Optional)"
                type="number"
                value={compareAtPrice ?? ""}
                onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 3000"
                fullWidth
              />
            </Grid>


            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select value={gender} label="Gender" onChange={(e) => setGender(e.target.value as any)}>
                  <MenuItem value="UNISEX">Unisex</MenuItem>
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  multiple
                  value={categoryIds}
                  label="Categories"
                  onChange={(event) => setCategoryIds(typeof event.target.value === "string" ? [event.target.value] : event.target.value)}
                  renderValue={(selected) => categories.filter((category) => selected.includes(category.id)).map((category) => category.name).join(", ")}
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Brand</InputLabel>
                <Select value={brandId} label="Brand" onChange={(e) => setBrandId(e.target.value)}>
                  {brands.map((b) => (
                    <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Vendor</InputLabel>
                <Select value={vendorId} label="Vendor" onChange={(e) => setVendorId(e.target.value)}>
                  {vendors.length === 0 ? (
                    <MenuItem disabled value="">
                      No vendors are available yet.
                    </MenuItem>
                  ) : (
                    vendors.map((v) => (
                      <MenuItem key={v.id} value={v.id}>
                        {v.businessName || "Vendor"} ({v.user?.name || "Unknown User"})
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Images & Gallery Section */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Product Images & Gallery
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CollectionsIcon />}
                  onClick={() => {
                    setMediaTarget("primary");
                    setMediaPickerOpen(true);
                  }}
                >
                  Pick Primary from Media Library
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CollectionsIcon />}
                  onClick={() => {
                    setMediaTarget("gallery");
                    setMediaPickerOpen(true);
                  }}
                >
                  Pick Gallery from Media Library
                </Button>
              </Stack>

              <Box mb={3}>
                <ImageUploader
                  label="Primary Product Image"
                  value={primaryImageUrl}
                  onChange={setPrimaryImageUrl}
                  onUploadingChange={handleUploadingChange}
                  folder="products"
                  helperText="Upload directly to Cloudinary. The secure URL will be saved with the product."
                />
              </Box>

              {galleryUrls.length > 0 && (
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Gallery Images ({galleryUrls.length})
                </Typography>
              )}

              {galleryUrls.map((gUrl, idx) => (
                <Box key={idx} mb={2}>
                  <ImageUploader
                    label={`Gallery Image #${idx + 1}`}
                    value={gUrl}
                    onChange={(newUrl) => {
                      if (!newUrl) {
                        setGalleryUrls(galleryUrls.filter((_, i) => i !== idx));
                      } else {
                        const updated = [...galleryUrls];
                        updated[idx] = newUrl;
                        setGalleryUrls(updated);
                      }
                    }}
                    onUploadingChange={handleUploadingChange}
                    folder="products/gallery"
                    previewHeight={140}
                  />
                </Box>
              ))}

              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setGalleryUrls([...galleryUrls, ""])}
                sx={{ borderStyle: "dashed", width: "100%", py: 1 }}
              >
                Add Another Gallery Image
              </Button>
            </Grid>

            {/* Product Variants Section */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Product Variants
              </Typography>

              {variants.map((variant, index) => (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{ p: 2, mb: 2, border: "1px solid #e0e0e0" }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Variant {index + 1}
                    </Typography>
                    {variants.length > 1 && (
                      <IconButton size="small" color="error" onClick={() => removeVariant(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Size</InputLabel>
                        <Select
                          value={variant.sizeId}
                          label="Size"
                          onChange={(e) => updateVariant(index, "sizeId", e.target.value)}
                        >
                          <MenuItem value="">Select size</MenuItem>
                          {sizes.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                              {s.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Color</InputLabel>
                        <Select
                          value={variant.colorId}
                          label="Color"
                          onChange={(e) => updateVariant(index, "colorId", e.target.value)}
                        >
                          <MenuItem value="">Select color</MenuItem>
                          {colors.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                              {c.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField
                        label="Price (KES)"
                        type="number"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, "price", Number(e.target.value))}
                        fullWidth
                        size="small"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField
                        label="Compare Price"
                        type="number"
                        value={variant.compareAtPrice ?? ""}
                        onChange={(e) => updateVariant(index, "compareAtPrice", e.target.value ? Number(e.target.value) : undefined)}
                        fullWidth
                        size="small"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField
                        label="Stock"
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, "stock", Number(e.target.value))}
                        fullWidth
                        size="small"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={variant.isAvailable}
                            onChange={(e) => updateVariant(index, "isAvailable", e.target.checked)}
                          />
                        }
                        label="Available for sale"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={addVariant}
                sx={{ borderStyle: "dashed", width: "100%", py: 1 }}
              >
                Add Variant
              </Button>
            </Grid>

            {/* Promotion Flags & Status */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Promotional Badges & Status
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <FormControlLabel
                  control={<Checkbox checked={featured} onChange={(e) => setFeatured(e.target.checked)} />}
                  label="Featured Product"
                />
                <FormControlLabel
                  control={<Checkbox checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} />}
                  label="Trending Product"
                />
                <FormControlLabel
                  control={<Checkbox checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} />}
                  label="New Arrival"
                />
                <FormControlLabel
                  control={<Checkbox checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} />}
                  label="Best Seller"
                />
              </Stack>
              <Box mt={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Product Status</InputLabel>
                  <Select value={status} label="Product Status" onChange={(e) => setStatus(e.target.value as any)}>
                    <MenuItem value="ACTIVE">ACTIVE (Visible in Storefront)</MenuItem>
                    <MenuItem value="DRAFT">DRAFT</MenuItem>
                    <MenuItem value="HIDDEN">HIDDEN (Removed from Storefront)</MenuItem>
                    <MenuItem value="ARCHIVED">ARCHIVED</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>

          {saveError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {saveError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              !name ||
              !description ||
              !price ||
              categoryIds.length === 0 ||
              !brandId ||
              !vendorId ||
              !primaryImageUrl ||
              saveProductMutation.isPending ||
              isUploading
            }
          >
            {saveProductMutation.isPending ? (
              <CircularProgress size={22} color="inherit" />
            ) : editingProduct ? (
              "Save Changes"
            ) : (
              "Create Product"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Media Picker Modal Integration */}
      <MediaPickerModal
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleSelectMedia}
        title={mediaTarget === "primary" ? "Select Primary Product Image" : "Select Gallery Image"}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={successSnackbar.open}
        autoHideDuration={5000}
        onClose={() => setSuccessSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccessSnackbar({ open: false, message: "" })}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successSnackbar.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
