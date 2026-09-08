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
  Card,
  CardContent,
  Divider,
  Avatar,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  TableContainer,
  Pagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CollectionsIcon from "@mui/icons-material/Collections";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LogoutIcon from "@mui/icons-material/Logout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { apiClient } from "../../api/client";
import { MediaPickerModal } from "../../components/admin/MediaPickerModal";
import { ImageUploader } from "../../components/admin/ImageUploader";
import { useFormatCurrency } from "../../utils/currency";
import { useAuth } from "../../hooks/useAuth";

// ─── constants ────────────────────────────────────────────────────────────────

const DRAWER_WIDTH = 240;

type ActiveTab = "dashboard" | "products";

// ─── helpers ──────────────────────────────────────────────────────────────────

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: any } }).response?.data;
    if (response?.message) return response.message;
    if (response?.errors && Array.isArray(response.errors)) {
      return response.errors
        .map((e: any) => {
          const fieldName = Array.isArray(e.path)
            ? e.path.join(".")
            : typeof e.path === "string"
            ? e.path
            : "Field";
          return `${fieldName}: ${e.message || e.details}`;
        })
        .join(" | ");
    }
  }
  return "Failed to save product. Please check all fields and try again.";
}

// ─── sidebar nav ─────────────────────────────────────────────────────────────

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  vendorName: string;
  vendorLogo?: string;
  onLogout: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function VendorSidebar({
  activeTab,
  onTabChange,
  vendorName,
  vendorLogo,
  onLogout,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const navItems: { label: string; tab: ActiveTab; icon: React.ReactNode }[] = [
    { label: "Dashboard", tab: "dashboard", icon: <DashboardIcon /> },
    { label: "Products", tab: "products", icon: <ShoppingBagIcon /> },
  ];

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#0F172A",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Brand */}
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
        <Avatar
          src={vendorLogo}
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: "primary.main",
            fontSize: "1.1rem",
            fontWeight: 800,
            boxShadow: "0 2px 8px rgba(22, 101, 52, 0.4)",
          }}
        >
          {vendorName?.[0]?.toUpperCase() ?? "V"}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              color: "white",
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {vendorName || "My Store"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600, fontSize: { xs: "0.76rem", sm: "0.68rem" }, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Vendor Portal
          </Typography>
        </Box>
      </Box>

      {/* Quick Add Product Button in Sidebar */}
      <Box sx={{ px: 2, pb: 1, flexShrink: 0 }}>
        <Button
          component={RouterLink}
          to="/studio/vendor/products"
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            onMobileClose();
          }}
          sx={{
            py: 1,
            borderRadius: 2,
            fontWeight: 700,
            fontSize: { xs: "0.92rem", sm: "0.82rem" },
            boxShadow: "0 2px 8px rgba(22, 101, 52, 0.4)",
          }}
        >
          + Add Product
        </Button>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

      <List
        sx={{
          px: 1.5,
          py: 1.5,
          flex: "1 1 auto",
          overflowY: "auto",
          minHeight: 0,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(255,255,255,0.15)", borderRadius: 2 },
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <ListItem key={item.tab} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to={item.tab === "products" ? "/studio/vendor/products" : "/studio/vendor"}
                onClick={onMobileClose}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 1.5,
                  bgcolor: isActive ? "primary.main" : "transparent",
                  color: isActive ? "white" : "#CBD5E1",
                  boxShadow: isActive ? "0 2px 8px rgba(22, 101, 52, 0.35)" : "none",
                  transition: "all 0.18s ease",
                  "&:hover": {
                    bgcolor: isActive ? "primary.main" : "rgba(255,255,255,0.08)",
                    color: "white",
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "white" : "#94A3B8", minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: { xs: "0.98rem", sm: "0.88rem" },
                    color: isActive ? "#FFFFFF" : "#CBD5E1",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

      {/* Pinned Bottom Actions */}
      <Box
        sx={{
          p: 2,
          flexShrink: 0,
          bgcolor: "#090E17",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Button
          component={RouterLink}
          to="/"
          fullWidth
          size="small"
          variant="outlined"
          startIcon={<StorefrontIcon sx={{ fontSize: 18 }} />}
          sx={{
            color: "#E2E8F0",
            borderColor: "rgba(255,255,255,0.25)",
            fontWeight: 600,
            fontSize: { xs: "0.86rem", sm: "0.8rem" },
            py: 0.8,
            borderRadius: 2,
            bgcolor: "rgba(255,255,255,0.04)",
            "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.1)", color: "#FFFFFF" },
          }}
        >
          View Storefront
        </Button>
        <Button
          onClick={onLogout}
          fullWidth
          size="small"
          color="error"
          startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
          sx={{
            fontWeight: 600,
            fontSize: { xs: "0.84rem", sm: "0.78rem" },
            py: 0.6,
            borderRadius: 2,
            color: "#F87171",
            "&:hover": { bgcolor: "rgba(239, 68, 68, 0.12)", color: "#EF4444" },
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

// ─── dashboard overview tab ───────────────────────────────────────────────────

function VendorOverviewTab({
  products,
  outfitCount,
  reviewCount,
  savedCount,
  formatCurrency,
  onCreateProduct,
}: {
  products: any[];
  outfitCount: number;
  reviewCount: number;
  savedCount: number;
  formatCurrency: (n: number) => string;
  onCreateProduct: () => void;
}) {
  const activeProducts = products.filter((p) => p.status === "ACTIVE").length;
  const draftProducts = products.filter((p) => p.status === "DRAFT").length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock ?? 0), 0);
  const lowStock = products.filter((p) => (p.stock ?? 0) <= 5 && p.status === "ACTIVE").length;

  const stats = [
    { label: "Total Products", value: products.length, color: "#6366F1" },
    { label: "Active Listings", value: activeProducts, color: "#10B981" },
    { label: "Drafts", value: draftProducts, color: "#F59E0B" },
    { label: "Low / Out of Stock", value: lowStock, color: "#EF4444" },
  ];

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={2} flexDirection={{ xs: "column", sm: "row" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: "1.9rem", sm: "2.125rem" }, lineHeight: 1.15 }}>
            Vendor Dashboard
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: { xs: "0.95rem", sm: "1rem" }, lineHeight: 1.5 }}>
            Manage your product listings, inventory, and store performance.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateProduct} fullWidth sx={{ minHeight: 44 }}>
          New Product
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "none",
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: "0.9rem", sm: "0.875rem" } }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {[
          { label: "My Outfits", value: outfitCount, color: "#0EA5E9" },
          { label: "My Reviews", value: reviewCount, color: "#F97316" },
          { label: "Saved Items", value: savedCount, color: "#DB2777" },
        ].map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
            <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: "0.9rem", sm: "0.875rem" } }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent products */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Recent Products
        </Typography>
        {products.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{ p: 6, textAlign: "center", borderRadius: 3, borderStyle: "dashed" }}
          >
            <ShoppingBagIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography variant="h6" color="text.secondary">
              No products yet
            </Typography>
            <Typography variant="body2" color="text.disabled" mb={3}>
              Create your first product to start selling on DressMe.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateProduct}>
              Create First Product
            </Button>
          </Paper>
        ) : (
          <Paper variant="outlined" sx={{ overflow: "hidden", borderRadius: 3 }}>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 520, "& .MuiTableCell-root": { fontSize: { xs: "0.86rem", sm: "0.875rem" }, px: { xs: 1.25, sm: 2 } } }}>
              <TableHead sx={{ bgcolor: "#F8FAFC" }}>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.slice(0, 5).map((prod) => {
                  const img = prod.images?.find((i: any) => i.isPrimary) || prod.images?.[0];
                  return (
                    <TableRow key={prod.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 1.5,
                              bgcolor: "#F1F5F9",
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            {img && (
                              <Box
                                component="img"
                                src={img.imageUrl}
                                alt={prod.name}
                                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            )}
                          </Box>
                          <Typography variant="body2" fontWeight={600}>
                            {prod.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="primary">
                          {formatCurrency(prod.price)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${prod.stock ?? 0} units`}
                          size="small"
                          color={
                            !prod.stock
                              ? "error"
                              : prod.stock <= 5
                              ? "warning"
                              : "default"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={prod.status}
                          size="small"
                          color={
                            prod.status === "ACTIVE"
                              ? "success"
                              : prod.status === "DRAFT"
                              ? "warning"
                              : "default"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Stack>
  );
}

// ─── products management tab ──────────────────────────────────────────────────

function VendorProductsTab({
  user,
  vendorId,
}: {
  user: any;
  vendorId: string | null;
}) {
  const queryClient = useQueryClient();
  const formatCurrency = useFormatCurrency();
  const isMobile = useMediaQuery("(max-width:899px)");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"primary" | "gallery">("primary");
  const [uploadingCount, setUploadingCount] = useState(0);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successSnackbar, setSuccessSnackbar] = useState({ open: false, message: "" });
  const [deletingProduct, setDeletingProduct] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);

  const isUploading = uploadingCount > 0;
  const handleUploadingChange = (uploading: boolean) => {
    setUploadingCount((c) => (uploading ? c + 1 : Math.max(0, c - 1)));
  };

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(10);
  const [sku, setSku] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "UNISEX">("UNISEX");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [brandId, setBrandId] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "DRAFT" | "ARCHIVED" | "HIDDEN">("ACTIVE");
  const [featured, setFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [primaryImageUrl, setPrimaryImageUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [variants, setVariants] = useState<any[]>([
    { sizeValue: "M", colorValue: "", price: 0, compareAtPrice: undefined, stock: 10, isAvailable: true },
  ]);

  // Data queries
  const { data: productResult, isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useQuery<any>({
    queryKey: ["vendor-products", vendorId, user?.role, search, statusFilter, categoryFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: "20", sort: "newest" });
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter) params.set("category", categoryFilter);
      const url = user?.role === "VENDOR"
        ? `/products?${params.toString()}&vendorId=${encodeURIComponent(vendorId || "")}`
        : `/products?${params.toString()}${vendorId ? `&vendorId=${encodeURIComponent(vendorId)}` : ""}`;
      const res = await apiClient.get(url);
      return res.data?.data || { items: [], total: 0, totalPages: 0, summary: {} };
    },
    enabled: !!user && (user.role === "ADMIN" || !!vendorId),
  });
  const products = productResult?.items ?? [];
  const summary = productResult?.summary ?? {
    total: productResult?.total ?? 0,
    active: products.filter((p: any) => p.status === "ACTIVE").length,
    drafts: products.filter((p: any) => p.status === "DRAFT").length,
    outOfStock: products.filter((p: any) => (p.stock ?? 0) <= 0).length,
  };

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

  // Admin-only: vendor selector data
  const { data: vendors = [] } = useQuery<any[]>({
    queryKey: ["vendors-all"],
    queryFn: async () => {
      const res = await apiClient.get("/vendors");
      return res.data.data;
    },
    enabled: user?.role === "ADMIN",
  });

  const [selectedVendorId, setSelectedVendorId] = useState("");
  useEffect(() => {
    if (user?.role === "ADMIN" && !selectedVendorId && vendors.length > 0) {
      setSelectedVendorId(vendors[0].id);
    }
  }, [user?.role, selectedVendorId, vendors]);

  // Mutations
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
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSaveError(null);
      handleCloseDialog();
      setSuccessSnackbar({
        open: true,
        message: editingProduct
          ? "Product updated successfully"
          : `Product "${data?.name ?? ""}" created successfully!`,
      });
    },
    onError: (error: unknown) => {
      setSaveError(getErrorMessage(error));
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSuccessSnackbar({ open: true, message: "Product archived successfully." });
    },
  });

  // Handlers
  const resetForm = () => {
    setName("");
    setDescription("High quality fashion product designed for maximum comfort and style.");
    setPrice(0);
    setCompareAtPrice(undefined);
    setStock(10);
    setSku(`DM-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`);
    setGender("UNISEX");
    setCategoryIds(categories.length > 0 ? [categories[0].id] : []);
    setBrandId(brands[0]?.id || "");
    setStatus("ACTIVE");
    setFeatured(false);
    setIsTrending(false);
    setIsNewArrival(true);
    setIsBestSeller(false);
    setPrimaryImageUrl("");
    setGalleryUrls([]);
    setVariants([
      { sizeValue: "M", colorValue: "", price: 0, compareAtPrice: undefined, stock: 10, isAvailable: true },
    ]);
    setSaveError(null);
    setUploadingCount(0);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    resetForm();
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
    setCategoryIds((prod.categories ?? []).map((c: any) => c.id));
    setBrandId(prod.brandId || prod.brand?.id || "");
    setStatus(prod.status);
    setFeatured(prod.featured);
    setIsTrending(prod.isTrending || false);
    setIsNewArrival(prod.isNewArrival || false);
    setIsBestSeller(prod.isBestSeller || false);

    const primary = prod.images?.find((img: any) => img.isPrimary) || prod.images?.[0];
    setPrimaryImageUrl(primary?.imageUrl || "");
    setGalleryUrls((prod.images ?? []).filter((img: any) => !img.isPrimary).map((img: any) => img.imageUrl));

    if (prod.variants?.length > 0) {
      setVariants(
        prod.variants.map((v: any) => ({
          id: v.id,
          sizeValue: v.sizeValue || "",
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
          sizeValue: "",
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
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleSave = () => {
    if (!name || name.trim().length < 2) { setSaveError("Product name must be at least 2 characters."); return; }
    if (!description || description.trim().length < 5) { setSaveError("Description must be at least 5 characters."); return; }
    if (!price || Number(price) <= 0) { setSaveError("Enter a valid selling price greater than 0."); return; }
    if (!brandId) { setSaveError("Please select a brand."); return; }
    if (!categoryIds || categoryIds.length === 0) { setSaveError("Please select at least one category."); return; }
    if (!primaryImageUrl) { setSaveError("Upload a primary product image before saving."); return; }
    if (variants.length === 0) { setSaveError("Add at least one product variant."); return; }

    if (user?.role === "ADMIN" && !selectedVendorId) {
      setSaveError("Please select a vendor.");
      return;
    }

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.sizeValue && !v.colorValue) { setSaveError(`Variant ${i + 1}: Enter at least a size or color.`); return; }
      if (!v.price || Number(v.price) <= 0) { setSaveError(`Variant ${i + 1}: Enter a valid price.`); return; }
    }

    setSaveError(null);

    const imagesPayload: any[] = [
      { imageUrl: primaryImageUrl, isPrimary: true, displayOrder: 0 },
      ...galleryUrls
        .filter((u) => u?.trim())
        .map((u, idx) => ({ imageUrl: u, isPrimary: false, displayOrder: idx + 1 })),
    ];

    const baseTs = Date.now().toString(36).toUpperCase();
    const variantsPayload = variants.map((v, i) => ({
      ...(v.id ? { id: v.id } : {}),
      sizeValue: v.sizeValue,
      colorValue: v.colorValue,
      price: Number(v.price),
      compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : null,
      stock: Number(v.stock),
      isAvailable: v.isAvailable ?? true,
      sku:
        v.sku && v.sku.length >= 2
          ? v.sku
          : `DM-V${i + 1}-${baseTs}-${Math.floor(Math.random() * 9000 + 1000)}`,
    }));

    const payload: any = {
      name,
      description,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      stock: Number(stock),
      sku: sku || `DM-${baseTs}-${Math.floor(Math.random() * 9000 + 1000)}`,
      gender,
      categoryIds,
      brandId,
      status,
      featured,
      isTrending,
      isNewArrival,
      isBestSeller,
      images: imagesPayload,
      variants: variantsPayload,
    };

    // Admin explicitly picks which vendor the product belongs to
    if (user?.role === "ADMIN" && selectedVendorId) {
      payload.vendorId = selectedVendorId;
    }

    saveProductMutation.mutate(payload);
  };

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={2} flexDirection={{ xs: "column", sm: "row" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: "1.7rem", sm: "2.125rem" } }}>
            My Products
          </Typography>
          <Typography color="text.secondary">
            Manage the products you have listed on DressMe.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate} fullWidth sx={{ minHeight: 44 }}>
          Create Product
        </Button>
      </Box>

      <Grid container spacing={2}>
        {[
          ["Total Products", summary.total, "#166534"],
          ["Active Products", summary.active, "#16A34A"],
          ["Inactive / Draft", summary.drafts, "#D97706"],
          ["Out of Stock", summary.outOfStock, "#DC2626"],
        ].map(([label, value, color]) => (
          <Grid key={label as string} size={{ xs: 6, md: 3 }}>
            <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: "none" }}>
              <CardContent sx={{ py: { xs: 2, sm: 2 }, px: { xs: 1.5, sm: 2 } }}>
                <Typography variant="h5" fontWeight={800} sx={{ color, fontSize: { xs: "1.65rem", sm: "1.5rem" } }}>{value}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.88rem", sm: "0.875rem" }, lineHeight: 1.3 }}>{label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <TextField fullWidth size="small" label="Search products..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
        <FormControl size="small" sx={{ minWidth: { md: 180 }, width: { xs: "100%", md: "auto" } }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}>
            <MenuItem value="">All statuses</MenuItem><MenuItem value="ACTIVE">Active</MenuItem><MenuItem value="DRAFT">Draft</MenuItem><MenuItem value="HIDDEN">Hidden</MenuItem><MenuItem value="ARCHIVED">Archived</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: { md: 180 }, width: { xs: "100%", md: "auto" } }}>
          <InputLabel>Category</InputLabel>
          <Select value={categoryFilter} label="Category" onChange={(event) => { setCategoryFilter(event.target.value); setPage(1); }}>
            <MenuItem value="">All categories</MenuItem>
            {categories.map((category: any) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>

      {/* Products table */}
      {productsLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : productsError ? (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => refetchProducts()}>Retry</Button>}>
          We couldn't load your products. Please try again.
        </Alert>
      ) : products.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{ p: 6, textAlign: "center", borderRadius: 3, borderStyle: "dashed" }}
        >
          <ShoppingBagIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
          <Typography variant="h6" color="text.secondary">
            No products yet
          </Typography>
          <Typography variant="body2" color="text.disabled" mb={3}>
            Click "Create Product" to add your first listing.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Create First Product
          </Button>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ overflow: "hidden", borderRadius: 3 }}>
          <TableContainer>
          <Table sx={{ minWidth: isMobile ? 760 : undefined, "& .MuiTableCell-root": { fontSize: { xs: "0.86rem", sm: "0.875rem" }, px: { xs: 1.25, sm: 2 } } }}>
            <TableHead sx={{ bgcolor: "#F8FAFC" }}>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Category / Brand</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category / Brand</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((prod: any) => {
                const img = prod.images?.find((i: any) => i.isPrimary) || prod.images?.[0];
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
                          {img && (
                            <Box
                              component="img"
                              src={img.imageUrl}
                              alt={prod.name}
                              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          )}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700}>
                            {prod.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {prod.gender}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                      {prod.sku || "—"}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {(prod.categories ?? []).map((c: any) => c.name).join(", ") || "—"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {prod.brand?.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700} color="primary">
                        {formatCurrency(prod.price)}
                      </Typography>
                      {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          {formatCurrency(prod.compareAtPrice)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${prod.stock ?? 0} units`}
                        size="small"
                        color={
                          !prod.stock ? "error" : prod.stock <= 5 ? "warning" : "default"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={prod.status}
                        size="small"
                        color={
                          prod.status === "ACTIVE"
                            ? "success"
                            : prod.status === "HIDDEN"
                            ? "secondary"
                            : "default"
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenEdit(prod)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeletingProduct(prod)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </TableContainer>
          {(productResult?.totalPages ?? 0) > 1 && (
            <Stack alignItems="center" p={2}>
              <Pagination count={productResult.totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
            </Stack>
          )}
        </Paper>
      )}

      <Dialog open={!!deletingProduct} onClose={() => setDeletingProduct(null)}>
        <DialogTitle>Delete Product?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove {deletingProduct?.name}? This action may affect how the product appears on DressMe.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingProduct(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => { if (deletingProduct) deleteProductMutation.mutate(deletingProduct.id); setDeletingProduct(null); }} disabled={deleteProductMutation.isPending}>Delete Product</Button>
        </DialogActions>
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingProduct ? "Edit Product" : "Create New Product"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Name */}
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                label="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />
            </Grid>

            {/* SKU (auto) */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                label="SKU"
                value={sku}
                disabled
                fullWidth
                helperText="Auto-generated"
              />
            </Grid>

            {/* Description */}
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

            {/* Prices */}
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
                label="Compare Price (Optional)"
                type="number"
                value={compareAtPrice ?? ""}
                onChange={(e) =>
                  setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)
                }
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={gender}
                  label="Gender"
                  onChange={(e) => setGender(e.target.value as any)}
                >
                  <MenuItem value="UNISEX">Unisex</MenuItem>
                  <MenuItem value="MALE">Male</MenuItem>
                  <MenuItem value="FEMALE">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Category */}
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  multiple
                  value={categoryIds}
                  label="Category"
                  onChange={(e) =>
                    setCategoryIds(
                      typeof e.target.value === "string" ? [e.target.value] : e.target.value
                    )
                  }
                  renderValue={(sel) =>
                    categories
                      .filter((c) => sel.includes(c.id))
                      .map((c) => c.name)
                      .join(", ")
                  }
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Brand */}
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Brand</InputLabel>
                <Select
                  value={brandId}
                  label="Brand"
                  onChange={(e) => setBrandId(e.target.value)}
                >
                  {brands.map((b) => (
                    <MenuItem key={b.id} value={b.id}>
                      {b.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Vendor selector — ADMIN only */}
            {user?.role === "ADMIN" && (
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Vendor</InputLabel>
                  <Select
                    value={selectedVendorId}
                    label="Vendor"
                    onChange={(e) => setSelectedVendorId(e.target.value)}
                  >
                    {vendors.map((v) => (
                      <MenuItem key={v.id} value={v.id}>
                        {v.businessName} ({v.user?.name || "—"})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Images */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={1}>
                Product Images
              </Typography>
              <Stack direction="row" spacing={2} mb={2}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CollectionsIcon />}
                  onClick={() => { setMediaTarget("primary"); setMediaPickerOpen(true); }}
                >
                  Pick Primary from Library
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CollectionsIcon />}
                  onClick={() => { setMediaTarget("gallery"); setMediaPickerOpen(true); }}
                >
                  Pick Gallery from Library
                </Button>
              </Stack>
              <Box mb={3}>
                <ImageUploader
                  label="Primary Product Image"
                  value={primaryImageUrl}
                  onChange={setPrimaryImageUrl}
                  onUploadingChange={handleUploadingChange}
                  folder="products"
                  helperText="Required. This is the main image shown in listings."
                />
              </Box>
              {galleryUrls.map((url, idx) => (
                <Box key={idx} mb={2}>
                  <ImageUploader
                    label={`Gallery Image #${idx + 1}`}
                    value={url}
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
                Add Gallery Image
              </Button>
            </Grid>

            {/* Variants */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>
                Variants
              </Typography>
              {variants.map((variant, index) => (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{ p: 2, mb: 2, borderRadius: 2 }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Variant {index + 1}
                    </Typography>
                    {variants.length > 1 && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setVariants(variants.filter((_, i) => i !== index))}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Size (e.g. M, L, 42)"
                        value={variant.sizeValue || ""}
                        onChange={(e) => updateVariant(index, "sizeValue", e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Color (e.g. Red, Black)"
                        value={variant.colorValue || ""}
                        onChange={(e) => updateVariant(index, "colorValue", e.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Price (KES)"
                        type="number"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, "price", Number(e.target.value))}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Compare Price"
                        type="number"
                        value={variant.compareAtPrice ?? ""}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "compareAtPrice",
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Stock"
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, "stock", Number(e.target.value))}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={variant.isAvailable}
                            onChange={(e) =>
                              updateVariant(index, "isAvailable", e.target.checked)
                            }
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
                onClick={() =>
                  setVariants([
                    ...variants,
                    {
                      sizeValue: "",
                      colorValue: "",
                      price: price || 0,
                      compareAtPrice: undefined,
                      stock: 10,
                      isAvailable: true,
                    },
                  ])
                }
                sx={{ borderStyle: "dashed", width: "100%", py: 1 }}
              >
                Add Variant
              </Button>
            </Grid>

            {/* Flags & Status — ADMIN ONLY */}
            <Grid size={{ xs: 12 }}>
              {user?.role === "ADMIN" ? (
                <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: 2, border: "1px solid #E2E8F0" }}>
                  <Typography variant="subtitle2" fontWeight={800} color="primary.main" mb={1}>
                    Admin Controls: Promotional Badges & Status
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <FormControlLabel
                      control={<Checkbox checked={featured} onChange={(e) => setFeatured(e.target.checked)} />}
                      label="Featured"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} />}
                      label="Trending"
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
                  <Box mt={1.5}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Product Status</InputLabel>
                      <Select
                        value={status}
                        label="Product Status"
                        onChange={(e) => setStatus(e.target.value as any)}
                      >
                        <MenuItem value="ACTIVE">ACTIVE (Visible in Storefront)</MenuItem>
                        <MenuItem value="DRAFT">DRAFT (Hidden / Pending Review)</MenuItem>
                        <MenuItem value="HIDDEN">HIDDEN</MenuItem>
                        <MenuItem value="ARCHIVED">ARCHIVED</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "rgba(22, 101, 52, 0.03)",
                    borderColor: "rgba(22, 101, 52, 0.15)",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                        Listing Status & Promotion
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Promotional badges (Featured, Trending, Best Seller, New Arrival) and storefront activation status are curated exclusively by the DressMe Admin team.
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={0.8} alignItems="center">
                      <Chip
                        label={editingProduct ? editingProduct.status : "DRAFT (Pending Review)"}
                        size="small"
                        color={editingProduct?.status === "ACTIVE" ? "success" : "warning"}
                        sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                      />
                      {editingProduct?.featured && <Chip label="Featured" size="small" color="primary" />}
                      {editingProduct?.isTrending && <Chip label="Trending" size="small" color="secondary" />}
                      {editingProduct?.isBestSeller && <Chip label="Best Seller" size="small" color="warning" />}
                    </Stack>
                  </Stack>
                </Paper>
              )}
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
              (user?.role === "ADMIN" && !selectedVendorId) ||
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

      {/* Media Picker */}
      <MediaPickerModal
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          if (mediaTarget === "primary") setPrimaryImageUrl(url);
          else setGalleryUrls((prev) => [...prev, url]);
          setMediaPickerOpen(false);
        }}
        title={
          mediaTarget === "primary" ? "Select Primary Image" : "Select Gallery Image"
        }
      />

      {/* Success snackbar */}
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

// ─── main page ────────────────────────────────────────────────────────────────

export function VendorDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    location.pathname.endsWith("/products") ? "products" : "dashboard"
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const formatCurrency = useFormatCurrency();

  // Fetch vendor profile (only relevant for VENDOR role)
  const { data: vendorProfile } = useQuery<any>({
    queryKey: ["my-vendor-profile", user?.id],
    queryFn: async () => {
      const res = await apiClient.get("/vendors");
      const all: any[] = res.data.data;
      return all.find((v) => v.userId === user?.id) ?? null;
    },
    enabled: !!user,
  });

  // All products for overview
  const { data: allProducts = [] } = useQuery<any[]>({
    queryKey: ["vendor-products", vendorProfile?.id],
    queryFn: async () => {
      const url = vendorProfile?.id
        ? `/products?limit=200&vendorId=${encodeURIComponent(vendorProfile.id)}`
        : "/products?limit=200";
      const res = await apiClient.get(url);
      const items: any[] = res.data?.data?.items || [];
      return items;
    },
    enabled: !!user && (user.role === "ADMIN" || !!vendorProfile?.id),
  });

  const { data: vendorSummary } = useQuery<any>({
    queryKey: ["vendor-dashboard-summary", user?.id],
    queryFn: async () => (await apiClient.get("/vendors/me/dashboard")).data.data,
    enabled: user?.role === "VENDOR",
    refetchInterval: 30_000,
  });

  const { data: myOutfits = [] } = useQuery<any[]>({
    queryKey: ["vendor-dashboard-my-outfits", user?.id],
    queryFn: async () => (await apiClient.get("/outfits/my")).data.data,
    enabled: !!user,
  });

  const { data: myReviews = [] } = useQuery<any[]>({
    queryKey: ["vendor-dashboard-my-reviews", user?.id],
    queryFn: async () => (await apiClient.get("/reviews/my")).data.data,
    enabled: !!user,
  });

  const { data: savedItems = [] } = useQuery<any[]>({
    queryKey: ["vendor-dashboard-saved-items", user?.id],
    queryFn: async () => (await apiClient.get("/favourites")).data.data,
    enabled: !!user,
  });

  const dashboardSummary = vendorSummary ?? {
    outfits: myOutfits.length,
    reviews: myReviews.length,
    savedItems: savedItems.length,
  };

  const handleLogout = () => {
    logout();
    navigate("/studio/login", { replace: true });
  };

  const vendorName =
    user?.role === "ADMIN"
      ? "Admin (Vendor View)"
      : vendorProfile?.businessName || user?.name || "My Store";

  const vendorLogo = vendorProfile?.logo;

  useEffect(() => {
    setActiveTab(location.pathname.endsWith("/products") ? "products" : "dashboard");
  }, [location.pathname]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      {/* Top bar (mobile) */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: { xs: 1, sm: 2 }, display: { sm: "none" }, minWidth: 44, minHeight: 44 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, fontSize: { xs: "1.05rem", sm: "1.25rem" }, lineHeight: 1.2 }}>
            DressMe — Vendor Portal
          </Typography>
          <Chip
            label={user?.name || "Vendor"}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ maxWidth: { xs: 125, sm: 180 }, minHeight: 32, "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis", fontSize: { xs: "0.82rem", sm: "0.8125rem" } } }}
          />
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <VendorSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        vendorName={vendorName}
        vendorLogo={vendorLogo}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
        }}
      >
        <Container maxWidth="xl">
          {activeTab === "dashboard" && (
            <VendorOverviewTab
              products={allProducts}
              outfitCount={dashboardSummary.outfits}
              reviewCount={dashboardSummary.reviews}
              savedCount={dashboardSummary.savedItems}
              formatCurrency={formatCurrency}
              onCreateProduct={() => navigate("/studio/vendor/products")}
            />
          )}
          {activeTab === "products" && (
            <VendorProductsTab
              user={user}
              vendorId={vendorProfile?.id ?? null}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
}
