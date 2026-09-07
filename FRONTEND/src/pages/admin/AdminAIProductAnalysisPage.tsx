import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Stack,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardMedia,
  Divider,
  Tabs,
  Tab,
  TextField,
  Tooltip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckIcon from "@mui/icons-material/Check";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StyleIcon from "@mui/icons-material/Style";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import SearchIcon from "@mui/icons-material/Search";
import EditNoteIcon from "@mui/icons-material/EditNote";
import LinkIcon from "@mui/icons-material/Link";
import AddIcon from "@mui/icons-material/Add";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import {
  aiProductAnalysisService,
  type AIProductAnalysisResult,
} from "../../services/ai-product-analysis.service";
import { uploadToCloudinary } from "../../services/cloudinary";

interface ProductVariantRow {
  sizeValue: string;
  colorValue: string;
  stock: number;
  price: number;
  sku?: string;
  isAvailable?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const SECTION_STYLE = {
  p: 3,
  borderRadius: 2,
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
} as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      sx={{ fontSize: "0.65rem", letterSpacing: "0.12em", color: "text.disabled", display: "block", mb: 0.5 }}
    >
      {children}
    </Typography>
  );
}

function DataRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Box sx={{ mb: 1.5 }}>
      <SectionLabel>{label}</SectionLabel>
      <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
        {value}
      </Typography>
    </Box>
  );
}

function TagList({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.75, mt: 0.5 }}>
      {items.map((item, i) => (
        <Chip key={i} label={item} size="small" variant="outlined" sx={{ fontSize: "0.72rem" }} />
      ))}
    </Stack>
  );
}

function CopyableBlock({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Paper elevation={0} sx={{ ...SECTION_STYLE, mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "0.8rem" }}>{label}</Typography>
        <Tooltip title={copied ? "Copied" : "Copy"}>
          <IconButton size="small" onClick={copy} sx={{ opacity: 0.5, "&:hover": { opacity: 1 } }}>
            {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Stack>
      <Typography variant="body2" sx={{ p: 2, bgcolor: "action.hover", borderRadius: 1.5, whiteSpace: "pre-line", color: "text.secondary", fontSize: "0.82rem" }}>
        {text}
      </Typography>
    </Paper>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export function AdminAIProductAnalysisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [manualUrlInput, setManualUrlInput] = useState("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIProductAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: "" });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // ── Reference Data ─────────────────────────────────────────────────────────
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["categories-all"],
    queryFn: async () => {
      const res = await apiClient.get("/categories?limit=100");
      return res.data.data.items || res.data.data || [];
    },
  });

  const { data: brands = [] } = useQuery<any[]>({
    queryKey: ["brands-all"],
    queryFn: async () => {
      const res = await apiClient.get("/brands?limit=100");
      return res.data.data.items || res.data.data || [];
    },
  });

  const { data: vendors = [] } = useQuery<any[]>({
    queryKey: ["vendors-all"],
    queryFn: async () => {
      const res = await apiClient.get("/vendors");
      return res.data.data || [];
    },
  });

  // ── Listing form state ─────────────────────────────────────────────────────
  const [listingName, setListingName] = useState("");
  const [listingDescription, setListingDescription] = useState("");
  const [listingPrice, setListingPrice] = useState<number>(3500);
  const [listingCompareAtPrice, setListingCompareAtPrice] = useState<number | undefined>(4500);
  const [listingStock, setListingStock] = useState<number>(20);
  const [listingSku, setListingSku] = useState("");
  const [listingGender, setListingGender] = useState<"MALE" | "FEMALE" | "UNISEX">("FEMALE");
  const [listingBrandId, setListingBrandId] = useState("");
  const [listingCategoryIds, setListingCategoryIds] = useState<string[]>([]);
  const [listingVendorId, setListingVendorId] = useState("");
  const [listingStatus, setListingStatus] = useState<"ACTIVE" | "DRAFT">("ACTIVE");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [includeOutfitIntelligence, setIncludeOutfitIntelligence] = useState(true);

  const [variants, setVariants] = useState<ProductVariantRow[]>([
    { sizeValue: "S", colorValue: "Default", stock: 5, price: 3500, isAvailable: true },
    { sizeValue: "M", colorValue: "Default", stock: 8, price: 3500, isAvailable: true },
    { sizeValue: "L", colorValue: "Default", stock: 5, price: 3500, isAvailable: true },
    { sizeValue: "XL", colorValue: "Default", stock: 2, price: 3500, isAvailable: true },
  ]);

  const [createdProduct, setCreatedProduct] = useState<any | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Prefill from location state ────────────────────────────────────────────
  useEffect(() => {
    if (location.state?.imageUrl && imageUrls.length === 0) {
      setImageUrls([location.state.imageUrl]);
    } else if (location.state?.product) {
      const prod = location.state.product;
      const urls = (prod.images || []).map((img: any) => img.imageUrl);
      if (urls.length > 0) setImageUrls(urls);
      setListingName(prod.name || "");
      setListingPrice(prod.price || 3500);
      setListingCompareAtPrice(prod.compareAtPrice || undefined);
      setListingStock(prod.stock || 20);
      setListingSku(prod.sku || "");
      if (prod.brandId) setListingBrandId(prod.brandId);
      if (prod.categories?.length) setListingCategoryIds(prod.categories.map((c: any) => c.id));
      if (prod.vendorId) setListingVendorId(prod.vendorId);
    }
  }, [location.state]);

  useEffect(() => {
    if (user?.role === "ADMIN" && !listingVendorId && vendors.length > 0) {
      setListingVendorId(vendors[0].id);
    }
  }, [user?.role, listingVendorId, vendors]);

  // ── Builders ───────────────────────────────────────────────────────────────
  const buildCombinedDescription = (res: AIProductAnalysisResult): string => {
    const parts = [
      res.descriptions.fullDescription,
      "",
      "### DressMe Outfit & Styling Intelligence",
      `* **Dominant Style:** ${res.style.style} (${res.style.aesthetic})`,
      `* **Primary Occasion:** ${res.occasion.primaryOccasion}${res.occasion.suitableOccasions?.length ? ` (Also: ${res.occasion.suitableOccasions.join(", ")})` : ""}`,
      `* **Weather & Climate:** ${res.weather.weatherSuitability.join(", ")} | ${res.weather.season}`,
      `* **Matching Shoes:** ${res.outfitIntelligence.recommendedShoes.join(", ")}`,
      `* **Matching Outerwear:** ${res.outfitIntelligence.recommendedOuterwear.join(", ")}`,
      `* **Matching Tops/Bottoms:** ${res.outfitIntelligence.recommendedTops} / ${res.outfitIntelligence.recommendedBottoms}`,
      `* **Matching Accessories:** ${res.outfitIntelligence.recommendedAccessories.join(", ")}`,
      `* **Complementary Colors:** ${res.outfitIntelligence.complementaryColors.join(", ")}`,
      `* **Search Tags:** ${res.dressMeTags.join(", ")}`,
    ];
    return parts.join("\n");
  };

  const populateFieldsFromAnalysis = (res: AIProductAnalysisResult) => {
    setListingName(res.identity.productName);
    const fullDesc = includeOutfitIntelligence ? buildCombinedDescription(res) : res.descriptions.fullDescription;
    setListingDescription(fullDesc);

    const gUpper = (res.identity.gender || "").toUpperCase();
    if (gUpper.includes("MALE") && !gUpper.includes("FEMALE")) setListingGender("MALE");
    else if (gUpper.includes("FEMALE")) setListingGender("FEMALE");
    else setListingGender("UNISEX");

    setListingSku(`DM-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`);

    if (brands.length > 0) {
      const detectedBrand = (res.identity.brand || "").toLowerCase();
      const matchedBrand = brands.find((b: any) => b.name.toLowerCase() === detectedBrand);
      setListingBrandId(matchedBrand ? matchedBrand.id : brands[0].id);
    }

    if (categories.length > 0) {
      const detectedCat = (res.identity.category || "").toLowerCase();
      const detectedSub = (res.identity.subcategory || "").toLowerCase();
      const matchedCat = categories.find(
        (c: any) => c.name.toLowerCase().includes(detectedCat) || detectedSub.includes(c.name.toLowerCase())
      );
      setListingCategoryIds([matchedCat ? matchedCat.id : categories[0].id]);
    }

    const detectedColor =
      res.appearance.primaryColor && res.appearance.primaryColor !== "None"
        ? res.appearance.primaryColor
        : "Standard";
    setVariants([
      { sizeValue: "S",  colorValue: detectedColor, stock: 5, price: listingPrice, isAvailable: true },
      { sizeValue: "M",  colorValue: detectedColor, stock: 8, price: listingPrice, isAvailable: true },
      { sizeValue: "L",  colorValue: detectedColor, stock: 5, price: listingPrice, isAvailable: true },
      { sizeValue: "XL", colorValue: detectedColor, stock: 2, price: listingPrice, isAvailable: true },
    ]);
  };

  // ── Image Upload ───────────────────────────────────────────────────────────
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (imageUrls.length + files.length > 5) {
      setSnackbar({ open: true, message: "Maximum 5 images allowed." });
      return;
    }
    setIsUploading(true);
    setUploadProgress(10);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const res = await uploadToCloudinary(file, {
            folder: "products/ai-catalog",
            onProgress: (p) => setUploadProgress(Math.round(((i + p / 100) / files.length) * 100)),
          });
          uploadedUrls.push(res.secure_url);
        } catch {
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          uploadedUrls.push(dataUrl);
        }
      }
      setImageUrls((prev) => [...prev, ...uploadedUrls].slice(0, 5));
      setSnackbar({ open: true, message: `${files.length} image(s) uploaded.` });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Upload failed." });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddManualUrl = () => {
    const trimmed = manualUrlInput.trim();
    if (!trimmed || imageUrls.length >= 5) return;
    setImageUrls((prev) => [...prev, trimmed]);
    setManualUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Analysis ───────────────────────────────────────────────────────────────
  const handleRunAnalysis = async () => {
    if (imageUrls.length === 0) {
      setSnackbar({ open: true, message: "Add at least one image first." });
      return;
    }
    setIsAnalyzing(true);
    setAnalysisError(null);
    setSaveError(null);
    try {
      const result = await aiProductAnalysisService.analyzeProduct(imageUrls);
      setAnalysisResult(result);
      populateFieldsFromAnalysis(result);
      setSnackbar({ open: true, message: "Analysis complete." });
      setActiveTab(6);
    } catch (err: any) {
      setAnalysisError(err.message || "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── Variants ───────────────────────────────────────────────────────────────
  const handleAddVariantRow = () => {
    setVariants([...variants, { sizeValue: "M", colorValue: variants[0]?.colorValue || "Default", stock: 5, price: listingPrice, isAvailable: true }]);
  };
  const handleRemoveVariantRow = (index: number) => setVariants(variants.filter((_, i) => i !== index));
  const handleUpdateVariantRow = (index: number, field: keyof ProductVariantRow, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  // ── Save Mutation ──────────────────────────────────────────────────────────
  const createProductMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.post("/products", payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-products-list"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setCreatedProduct(data);
      setSaveError(null);
      setSnackbar({ open: true, message: `"${data.name}" published.` });
    },
    onError: (error: any) => {
      setSaveError(error.response?.data?.message || error.message || "Failed to save product.");
    },
  });

  const handleSaveProductToCatalog = () => {
    if (!listingName || listingName.trim().length < 2) { setSaveError("Product name is required."); return; }
    if (!listingBrandId) { setSaveError("Please select a brand."); return; }
    if (!listingCategoryIds || listingCategoryIds.length === 0) { setSaveError("Please select a category."); return; }
    if (user?.role === "ADMIN" && !listingVendorId) { setSaveError("Please select a vendor."); return; }
    if (!listingPrice || Number(listingPrice) <= 0) { setSaveError("Enter a valid price."); return; }
    if (imageUrls.length === 0) { setSaveError("At least one image is required."); return; }
    if (variants.length === 0) { setSaveError("Configure at least one variant."); return; }

    createProductMutation.mutate({
      name: listingName.trim(),
      description: listingDescription.trim(),
      price: Number(listingPrice),
      compareAtPrice: listingCompareAtPrice ? Number(listingCompareAtPrice) : null,
      stock: Number(listingStock),
      sku: listingSku.trim() || `DM-${Date.now()}`,
      gender: listingGender,
      categoryIds: listingCategoryIds,
      brandId: listingBrandId,
      vendorId: user?.role === "ADMIN" ? listingVendorId : undefined,
      featured: isFeatured,
      isTrending,
      isNewArrival,
      status: listingStatus,
      images: imageUrls.map((url, idx) => ({
        imageUrl: url,
        isPrimary: idx === 0,
        displayOrder: idx,
        altText: listingName,
      })),
      variants: variants.map((v) => ({
        sizeValue: v.sizeValue || undefined,
        colorValue: v.colorValue || undefined,
        stock: Number(v.stock),
        price: Number(v.price || listingPrice),
        compareAtPrice: listingCompareAtPrice ? Number(listingCompareAtPrice) : null,
        sku: v.sku || `${listingSku}-${(v.sizeValue || "STD")}-${(v.colorValue || "CLR")}`.toUpperCase(),
        isAvailable: v.isAvailable ?? true,
      })),
    });
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    setSnackbar({ open: true, message: "Copied." });
  };

  const getConfidenceSx = (conf: "High" | "Medium" | "Low") => {
    const map = { High: { color: "#166534", bgcolor: "#dcfce7" }, Medium: { color: "#92400e", bgcolor: "#fef3c7" }, Low: { color: "#991b1b", bgcolor: "#fee2e2" } };
    return map[conf];
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1300, mx: "auto" }}>

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <IconButton size="small" onClick={() => navigate(-1)} sx={{ color: "text.secondary" }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: "'Playfair Display', serif", letterSpacing: -0.5 }}>
            AI Product Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Upload product images · extract style intelligence · publish to catalog
          </Typography>
        </Box>
        {analysisResult && (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              startIcon={copiedKey === "json" ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              onClick={() => copyToClipboard(JSON.stringify(analysisResult, null, 2), "json")}
              sx={{ fontSize: "0.75rem" }}
            >
              {copiedKey === "json" ? "Copied" : "Export JSON"}
            </Button>
          </Stack>
        )}
      </Stack>

      {/* ── Success banner ───────────────────────────────────────────────────── */}
      {createdProduct && (
        <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 2, border: "1px solid", borderColor: "success.light", bgcolor: "#f0fdf4" }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <CheckCircleOutlineIcon sx={{ color: "success.main" }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "success.dark" }}>
                  Product published to catalog
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {createdProduct.name}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button size="small" component={RouterLink} to={`/products/${createdProduct.slug}`} target="_blank" endIcon={<OpenInNewIcon fontSize="small" />}>
                View Live
              </Button>
              <Button size="small" variant="outlined" component={RouterLink} to="/admin/products">
                Back to Products
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* ── Left: Image upload ─────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={0} sx={{ ...SECTION_STYLE, position: "sticky", top: 24 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
              <AddPhotoAlternateIcon fontSize="small" sx={{ color: "#166534" }} />
              Product Images
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
              Upload 1–5 clear images (front, back, detail shots)
            </Typography>

            <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple accept="image/*" style={{ display: "none" }} />

            {/* Drop zone */}
            <Box
              onClick={() => !isUploading && fileInputRef.current?.click()}
              sx={{
                border: "1.5px dashed",
                borderColor: isUploading ? "#166534" : "divider",
                borderRadius: 2,
                p: 3,
                textAlign: "center",
                cursor: isUploading ? "not-allowed" : "pointer",
                transition: "border-color 0.15s",
                "&:hover": { borderColor: "#166534" },
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 32, color: isUploading ? "#166534" : "text.disabled", mb: 0.75 }} />
              <Typography variant="caption" display="block" sx={{ fontWeight: 600, color: "text.secondary" }}>
                {isUploading ? "Uploading…" : "Click to browse or drag images"}
              </Typography>
              <Typography variant="caption" color="text.disabled">JPG, PNG, WEBP — max 5 images</Typography>
              {isUploading && <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 1.5, borderRadius: 1 }} />}
            </Box>

            {/* Manual URL */}
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Or paste image URL"
                value={manualUrlInput}
                onChange={(e) => setManualUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddManualUrl()}
                sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.8rem" } }}
              />
              <Button size="small" variant="outlined" onClick={handleAddManualUrl} disabled={!manualUrlInput.trim() || imageUrls.length >= 5} sx={{ minWidth: 56 }}>
                <LinkIcon fontSize="small" />
              </Button>
            </Stack>

            {/* Thumbnails */}
            {imageUrls.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 600 }}>
                  {imageUrls.length} / 5 images
                </Typography>
                <Grid container spacing={1} sx={{ mt: 0.5 }}>
                  {imageUrls.map((url, idx) => (
                    <Grid size={{ xs: 4 }} key={idx}>
                      <Card sx={{ position: "relative", borderRadius: 1.5, border: "1px solid", borderColor: idx === 0 ? "#166534" : "divider", overflow: "hidden" }}>
                        <CardMedia component="img" height="80" image={url} alt={`Image ${idx + 1}`} sx={{ objectFit: "cover" }} />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImage(idx)}
                          sx={{ position: "absolute", top: 2, right: 2, bgcolor: "rgba(0,0,0,0.55)", color: "white", p: 0.4, "&:hover": { bgcolor: "rgba(0,0,0,0.8)" } }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                        {idx === 0 && (
                          <Typography
                            sx={{
                              position: "absolute", bottom: 0, left: 0, right: 0,
                              fontSize: "0.6rem", fontWeight: 700, textAlign: "center",
                              bgcolor: "#166534", color: "white", py: 0.25, letterSpacing: "0.08em",
                            }}
                          >
                            PRIMARY
                          </Typography>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Analyze button */}
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || imageUrls.length === 0}
              startIcon={isAnalyzing ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: 700,
                bgcolor: "#111827",
                color: "white",
                borderRadius: 1.5,
                fontSize: "0.875rem",
                letterSpacing: "0.02em",
                "&:hover": { bgcolor: "#166534" },
                "&:disabled": { bgcolor: "action.disabledBackground" },
              }}
            >
              {isAnalyzing ? "Analyzing…" : "Analyze with AI"}
            </Button>
          </Paper>
        </Grid>

        {/* ── Right: Results ─────────────────────────────────────────────────── */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {analysisError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setAnalysisError(null)}>
              {analysisError}
            </Alert>
          )}

          {/* Empty state */}
          {!analysisResult && !isAnalyzing && (
            <Paper elevation={0} sx={{ ...SECTION_STYLE, p: 6, textAlign: "center", borderStyle: "dashed" }}>
              <AutoAwesomeIcon sx={{ fontSize: 36, color: "text.disabled", mb: 2 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                No analysis yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, mx: "auto" }}>
                Upload product images and click <strong>Analyze with AI</strong>. The engine will extract
                style, occasions, outfit pairings, SEO tags, and pre-fill your catalog form.
              </Typography>
            </Paper>
          )}

          {/* Loading state */}
          {isAnalyzing && (
            <Paper elevation={0} sx={{ ...SECTION_STYLE, p: 8, textAlign: "center" }}>
              <CircularProgress size={40} thickness={2.5} sx={{ color: "#166534", mb: 3 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.75 }}>
                Extracting intelligence…
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Analyzing silhouette, material, occasions, outfit pairings & SEO tags
              </Typography>
            </Paper>
          )}

          {/* Results */}
          {analysisResult && (
            <Box>
              {/* Summary strip */}
              <Paper elevation={0} sx={{ ...SECTION_STYLE, mb: 2 }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                      <Chip
                        label={analysisResult.confidence.overallConfidence}
                        size="small"
                        sx={{ ...getConfidenceSx(analysisResult.confidence.overallConfidence), fontWeight: 700, fontSize: "0.7rem", height: 22 }}
                      />
                      <Chip label={analysisResult.identity.gender} size="small" variant="outlined" sx={{ fontSize: "0.7rem", height: 22 }} />
                      <Chip label={analysisResult.identity.category} size="small" variant="outlined" sx={{ fontSize: "0.7rem", height: 22 }} />
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: -0.3 }}>
                      {analysisResult.identity.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: "0.8rem" }}>
                      {analysisResult.summary.oneLineSellingPoint}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setActiveTab(6)}
                    endIcon={<StorefrontOutlinedIcon fontSize="small" />}
                    sx={{ bgcolor: "#166534", whiteSpace: "nowrap", "&:hover": { bgcolor: "#14532d" }, fontWeight: 700, fontSize: "0.78rem" }}
                  >
                    Confirm & Publish
                  </Button>
                </Stack>
              </Paper>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  mb: 2,
                  "& .MuiTab-root": { fontSize: "0.75rem", fontWeight: 600, minHeight: 42, px: 2 },
                  "& .MuiTabs-indicator": { bgcolor: "#166534", height: 2 },
                  "& .Mui-selected": { color: "#166534 !important" },
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Tab icon={<ShoppingBagIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Identity" />
                <Tab icon={<StyleIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Style" />
                <Tab icon={<WbSunnyOutlinedIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Weather & Outfit" />
                <Tab icon={<EditNoteIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Descriptions" />
                <Tab icon={<SearchIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="SEO & Tags" />
                <Tab icon={<PsychologyOutlinedIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="AI Stylist" />
                <Tab
                  icon={<StorefrontOutlinedIcon sx={{ fontSize: 16 }} />}
                  iconPosition="start"
                  label="Confirm & Save"
                  sx={{ color: "#166534 !important", fontWeight: "700 !important" }}
                />
              </Tabs>

              {/* ── Tab 0: Identity ─────────────────────────────────────────── */}
              {activeTab === 0 && (
                <Stack spacing={2}>
                  <Paper elevation={0} sx={SECTION_STYLE}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Product Identity</Typography>
                    <Grid container spacing={2}>
                      {[
                        { label: "Type", value: analysisResult.identity.productType },
                        { label: "Category", value: analysisResult.identity.category },
                        { label: "Subcategory", value: analysisResult.identity.subcategory },
                        { label: "Product Group", value: analysisResult.identity.productGroup },
                        { label: "Detected Brand", value: analysisResult.identity.brand },
                        { label: "Gender", value: analysisResult.identity.gender },
                      ].map(({ label, value }) => (
                        <Grid size={{ xs: 6, sm: 4 }} key={label}>
                          <DataRow label={label} value={value} />
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>

                  <Paper elevation={0} sx={SECTION_STYLE}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Appearance & Materials</Typography>
                    <Grid container spacing={2}>
                      {[
                        { label: "Primary Color", value: analysisResult.appearance.primaryColor },
                        { label: "Color Family", value: analysisResult.appearance.colorFamily },
                        { label: "Secondary Colors", value: analysisResult.appearance.secondaryColors },
                        { label: "Pattern", value: analysisResult.appearance.pattern },
                        { label: "Texture", value: analysisResult.appearance.texture },
                        { label: "Material", value: analysisResult.appearance.material },
                        { label: "Finish", value: analysisResult.appearance.finish },
                        { label: "Print", value: analysisResult.appearance.print },
                        { label: "Logo / Branding", value: analysisResult.appearance.logoBranding },
                      ].map(({ label, value }) => (
                        <Grid size={{ xs: 6, sm: 4 }} key={label}>
                          <DataRow label={label} value={value} />
                        </Grid>
                      ))}
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <SectionLabel>Visible Details</SectionLabel>
                    <TagList items={analysisResult.appearance.visibleDetails} />
                  </Paper>
                </Stack>
              )}

              {/* ── Tab 1: Style ────────────────────────────────────────────── */}
              {activeTab === 1 && (
                <Stack spacing={2}>
                  <Paper elevation={0} sx={SECTION_STYLE}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Style & Fit</Typography>
                    <Grid container spacing={2}>
                      {[
                        { label: "Style", value: analysisResult.style.style },
                        { label: "Aesthetic", value: analysisResult.style.aesthetic },
                        { label: "Fit", value: analysisResult.style.fit },
                        { label: "Silhouette", value: analysisResult.style.silhouette },
                        { label: "Length", value: analysisResult.style.length },
                        { label: "Formality", value: analysisResult.style.formality },
                        { label: "Fashion Level", value: analysisResult.style.fashionLevel },
                      ].map(({ label, value }) => (
                        <Grid size={{ xs: 6, sm: 4 }} key={label}>
                          <DataRow label={label} value={value} />
                        </Grid>
                      ))}
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <SectionLabel>Style Keywords</SectionLabel>
                    <TagList items={analysisResult.style.styleKeywords} />
                  </Paper>

                  <Paper elevation={0} sx={SECTION_STYLE}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Occasion</Typography>
                    <DataRow label="Primary Occasion" value={analysisResult.occasion.primaryOccasion} />
                    <SectionLabel>Also Suitable For</SectionLabel>
                    <TagList items={analysisResult.occasion.suitableOccasions} />
                  </Paper>
                </Stack>
              )}

              {/* ── Tab 2: Weather & Outfit ─────────────────────────────────── */}
              {activeTab === 2 && (
                <Stack spacing={2}>
                  <Paper elevation={0} sx={SECTION_STYLE}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Weather & Climate</Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6, sm: 4 }}><DataRow label="Season" value={analysisResult.weather.season} /></Grid>
                      <Grid size={{ xs: 6, sm: 4 }}><DataRow label="Layering" value={analysisResult.weather.layeringSuitability} /></Grid>
                      <Grid size={{ xs: 12, sm: 4 }}><DataRow label="Climate" value={analysisResult.weather.climateSuitability} /></Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <SectionLabel>Weather Types</SectionLabel>
                    <TagList items={analysisResult.weather.weatherSuitability} />
                  </Paper>

                  <Paper elevation={0} sx={SECTION_STYLE}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Outfit Pairings</Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}><DataRow label="Tops" value={analysisResult.outfitIntelligence.recommendedTops} /></Grid>
                      <Grid size={{ xs: 12, sm: 6 }}><DataRow label="Bottoms" value={analysisResult.outfitIntelligence.recommendedBottoms} /></Grid>
                    </Grid>
                    <Divider sx={{ my: 1.5 }} />
                    <SectionLabel>Shoes</SectionLabel>
                    <TagList items={analysisResult.outfitIntelligence.recommendedShoes} />
                    <Box sx={{ mt: 1.5 }}>
                      <SectionLabel>Outerwear</SectionLabel>
                      <TagList items={analysisResult.outfitIntelligence.recommendedOuterwear} />
                    </Box>
                    <Box sx={{ mt: 1.5 }}>
                      <SectionLabel>Accessories</SectionLabel>
                      <TagList items={analysisResult.outfitIntelligence.recommendedAccessories} />
                    </Box>
                    <Box sx={{ mt: 1.5 }}>
                      <SectionLabel>Complementary Colors</SectionLabel>
                      <TagList items={analysisResult.outfitIntelligence.complementaryColors} />
                    </Box>
                  </Paper>
                </Stack>
              )}

              {/* ── Tab 3: Descriptions ─────────────────────────────────────── */}
              {activeTab === 3 && (
                <Stack spacing={0}>
                  <CopyableBlock label="Short Description" text={analysisResult.descriptions.shortDescription} />
                  <CopyableBlock label="Full E-Commerce Description" text={analysisResult.descriptions.fullDescription} />
                  <CopyableBlock label="Marketing Description" text={analysisResult.descriptions.marketingDescription} />
                </Stack>
              )}

              {/* ── Tab 4: SEO & Tags ───────────────────────────────────────── */}
              {activeTab === 4 && (
                <Stack spacing={2}>
                  <Paper elevation={0} sx={SECTION_STYLE}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>SEO</Typography>
                    <DataRow label="SEO Title" value={analysisResult.seo.seoTitle} />
                    <DataRow label={`Meta Description (${analysisResult.seo.metaDescription.length} chars)`} value={analysisResult.seo.metaDescription} />
                    <Box sx={{ mt: 1 }}>
                      <SectionLabel>URL Slug</SectionLabel>
                      <Typography variant="body2" sx={{ fontFamily: "monospace", color: "#166534", fontSize: "0.8rem" }}>
                        /{analysisResult.seo.urlSlug}
                      </Typography>
                    </Box>
                  </Paper>

                  <Paper elevation={0} sx={SECTION_STYLE}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>DressMe Tags</Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ display: "block", mb: 1.5 }}>
                      Uppercase, hyphenated — optimized for DressMe search & filter
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" sx={{ gap: 0.75 }}>
                      {analysisResult.dressMeTags.map((tag, i) => (
                        <Chip key={i} label={tag} size="small" sx={{ bgcolor: "#166834", color: "white", fontSize: "0.7rem", fontWeight: 700 }} />
                      ))}
                    </Stack>
                  </Paper>

                  <Paper elevation={0} sx={SECTION_STYLE}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Search Keywords</Typography>
                    <SectionLabel>Primary Keywords</SectionLabel>
                    <TagList items={analysisResult.seo.searchKeywords} />
                    <Box sx={{ mt: 1.5 }}>
                      <SectionLabel>Synonyms & Slang</SectionLabel>
                      <TagList items={analysisResult.seo.searchSynonyms} />
                    </Box>
                    <Box sx={{ mt: 1.5 }}>
                      <SectionLabel>Related Phrases</SectionLabel>
                      <TagList items={analysisResult.seo.relatedSearchTerms.map(t => `"${t}"`)} />
                    </Box>
                  </Paper>
                </Stack>
              )}

              {/* ── Tab 5: AI Stylist ───────────────────────────────────────── */}
              {activeTab === 5 && (
                <Stack spacing={2}>
                  <Paper elevation={0} sx={SECTION_STYLE}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Stylist Profile</Typography>
                    <DataRow label="Style Profile" value={analysisResult.aiStylist.styleProfile} />
                    <DataRow label="User Intent" value={analysisResult.aiStylist.recommendedUserIntent} />
                    <DataRow label="Styling Notes" value={analysisResult.aiStylist.stylingNotes} />
                    <Divider sx={{ my: 1.5 }} />
                    <SectionLabel>Best For</SectionLabel>
                    <TagList items={analysisResult.aiStylist.bestFor} />
                    <Box sx={{ mt: 1.5 }}>
                      <SectionLabel>Compatible Categories</SectionLabel>
                      <TagList items={analysisResult.aiStylist.compatibleProductCategories} />
                    </Box>
                  </Paper>

                  <Paper elevation={0} sx={SECTION_STYLE}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Outfit Ideas</Typography>
                    <Stack spacing={1}>
                      {analysisResult.aiStylist.outfitIdeas.map((idea, i) => (
                        <Typography key={i} variant="body2" sx={{ p: 1.5, bgcolor: "action.hover", borderRadius: 1.5, fontSize: "0.82rem" }}>
                          {idea}
                        </Typography>
                      ))}
                    </Stack>
                  </Paper>
                </Stack>
              )}

              {/* ── Tab 6: Confirm & Publish ─────────────────────────────────── */}
              {activeTab === 6 && (
                <Stack spacing={2}>
                  {saveError && (
                    <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setSaveError(null)}>
                      {saveError}
                    </Alert>
                  )}

                  {/* Product identity & pricing */}
                  <Paper elevation={0} sx={SECTION_STYLE}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Product Identity & Pricing</Typography>
                      <Chip label="Auto-filled from AI" size="small" variant="outlined" sx={{ fontSize: "0.68rem", color: "#166534", borderColor: "#166534" }} />
                    </Stack>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField fullWidth label="Product Name *" value={listingName} onChange={(e) => setListingName(e.target.value)} size="small" />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField fullWidth type="number" label="Price (KES) *" value={listingPrice} onChange={(e) => setListingPrice(Number(e.target.value))} size="small" />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField fullWidth type="number" label="Compare At (KES)" value={listingCompareAtPrice || ""} onChange={(e) => setListingCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)} size="small" />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField fullWidth type="number" label="Stock *" value={listingStock} onChange={(e) => setListingStock(Number(e.target.value))} size="small" />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <TextField fullWidth label="SKU *" value={listingSku} onChange={(e) => setListingSku(e.target.value)} size="small" />
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Gender *</InputLabel>
                          <Select value={listingGender} label="Gender *" onChange={(e) => setListingGender(e.target.value as any)}>
                            <MenuItem value="FEMALE">Female</MenuItem>
                            <MenuItem value="MALE">Male</MenuItem>
                            <MenuItem value="UNISEX">Unisex</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Brand *</InputLabel>
                          <Select value={listingBrandId} label="Brand *" onChange={(e) => setListingBrandId(e.target.value)}>
                            {brands.map((b: any) => <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Category *</InputLabel>
                          <Select
                            multiple
                            value={listingCategoryIds}
                            label="Category *"
                            onChange={(e) => setListingCategoryIds(typeof e.target.value === "string" ? [e.target.value] : e.target.value)}
                            renderValue={(sel) => categories.filter((c: any) => sel.includes(c.id)).map((c: any) => c.name).join(", ")}
                          >
                            {categories.map((c: any) => (
                              <MenuItem key={c.id} value={c.id}>
                                <Checkbox checked={listingCategoryIds.indexOf(c.id) > -1} size="small" />
                                {c.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      {user?.role === "ADMIN" && (
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Vendor *</InputLabel>
                            <Select value={listingVendorId} label="Vendor *" onChange={(e) => setListingVendorId(e.target.value)}>
                              {vendors.map((v: any) => <MenuItem key={v.id} value={v.id}>{v.businessName}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </Grid>
                      )}
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Status</InputLabel>
                          <Select value={listingStatus} label="Status" onChange={(e) => setListingStatus(e.target.value as any)}>
                            <MenuItem value="ACTIVE">Active</MenuItem>
                            <MenuItem value="DRAFT">Draft</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Stack direction="row" spacing={1}>
                          <FormControlLabel control={<Checkbox size="small" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />} label={<Typography variant="caption">Featured</Typography>} />
                          <FormControlLabel control={<Checkbox size="small" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} />} label={<Typography variant="caption">Trending</Typography>} />
                          <FormControlLabel control={<Checkbox size="small" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} />} label={<Typography variant="caption">New Arrival</Typography>} />
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Variants */}
                  <Paper elevation={0} sx={SECTION_STYLE}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Sizes & Variants</Typography>
                        <Typography variant="caption" color="text.secondary">Set sizes, colors, stock & prices</Typography>
                      </Box>
                      <Button size="small" startIcon={<AddIcon fontSize="small" />} onClick={handleAddVariantRow} sx={{ fontSize: "0.75rem" }}>Add</Button>
                    </Stack>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ "& th": { fontSize: "0.72rem", fontWeight: 700, color: "text.secondary", borderBottom: "1px solid", borderColor: "divider" } }}>
                          <TableCell>Size</TableCell>
                          <TableCell>Color</TableCell>
                          <TableCell>Stock</TableCell>
                          <TableCell>Price (KES)</TableCell>
                          <TableCell />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {variants.map((v, i) => (
                          <TableRow key={i} sx={{ "& td": { py: 0.75, borderBottom: "1px solid", borderColor: "divider" } }}>
                            <TableCell>
                              <TextField size="small" value={v.sizeValue} placeholder="e.g. M" onChange={(e) => handleUpdateVariantRow(i, "sizeValue", e.target.value)} sx={{ width: 80 }} inputProps={{ style: { fontSize: "0.8rem", padding: "6px 8px" } }} />
                            </TableCell>
                            <TableCell>
                              <TextField size="small" value={v.colorValue} placeholder="Color" onChange={(e) => handleUpdateVariantRow(i, "colorValue", e.target.value)} sx={{ width: 110 }} inputProps={{ style: { fontSize: "0.8rem", padding: "6px 8px" } }} />
                            </TableCell>
                            <TableCell>
                              <TextField size="small" type="number" value={v.stock} onChange={(e) => handleUpdateVariantRow(i, "stock", Number(e.target.value))} sx={{ width: 70 }} inputProps={{ style: { fontSize: "0.8rem", padding: "6px 8px" } }} />
                            </TableCell>
                            <TableCell>
                              <TextField size="small" type="number" value={v.price} onChange={(e) => handleUpdateVariantRow(i, "price", Number(e.target.value))} sx={{ width: 100 }} inputProps={{ style: { fontSize: "0.8rem", padding: "6px 8px" } }} />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small" color="error" onClick={() => handleRemoveVariantRow(i)} disabled={variants.length <= 1} sx={{ opacity: 0.6 }}>
                                <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>

                  {/* Description */}
                  <Paper elevation={0} sx={SECTION_STYLE}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Description & Outfit Intelligence</Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={includeOutfitIntelligence}
                            onChange={(e) => {
                              setIncludeOutfitIntelligence(e.target.checked);
                              if (analysisResult) {
                                setListingDescription(
                                  e.target.checked ? buildCombinedDescription(analysisResult) : analysisResult.descriptions.fullDescription
                                );
                              }
                            }}
                          />
                        }
                        label={<Typography variant="caption" sx={{ fontWeight: 600 }}>Include outfit intelligence</Typography>}
                      />
                    </Stack>
                    <Typography variant="caption" color="text.disabled" sx={{ display: "block", mb: 1.5 }}>
                      When enabled, outfit pairing data is embedded in the description so AI search finds matching pieces instantly.
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      size="small"
                      value={listingDescription}
                      onChange={(e) => setListingDescription(e.target.value)}
                      placeholder="Product description will appear here after analysis…"
                      sx={{ "& textarea": { fontSize: "0.8rem" } }}
                    />
                  </Paper>

                  {/* Publish bar */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "#166534",
                      bgcolor: "#f0fdf4",
                    }}
                  >
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#14532d" }}>
                          Ready to publish?
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {imageUrls.length} image{imageUrls.length !== 1 ? "s" : ""} · {variants.length} variant{variants.length !== 1 ? "s" : ""} · outfit intelligence {includeOutfitIntelligence ? "enabled" : "disabled"}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={handleSaveProductToCatalog}
                        disabled={createProductMutation.isPending}
                        startIcon={createProductMutation.isPending ? <CircularProgress size={16} color="inherit" /> : <StorefrontOutlinedIcon />}
                        sx={{
                          bgcolor: "#111827",
                          "&:hover": { bgcolor: "#166534" },
                          fontWeight: 700,
                          px: 3,
                          py: 1.2,
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {createProductMutation.isPending ? "Publishing…" : "Publish to Store"}
                      </Button>
                    </Stack>
                  </Paper>
                </Stack>
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}
