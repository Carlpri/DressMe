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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/Check";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StyleIcon from "@mui/icons-material/Style";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import EditNoteIcon from "@mui/icons-material/EditNote";
import LinkIcon from "@mui/icons-material/Link";
import AddIcon from "@mui/icons-material/Add";
import StorefrontIcon from "@mui/icons-material/Storefront";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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

export function AdminAIProductAnalysisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Uploaded product images state
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [manualUrlInput, setManualUrlInput] = useState("");

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIProductAnalysisResult | null>(null);

  // Tab state for reviewing output
  const [activeTab, setActiveTab] = useState(0);

  // Notifications
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // ── Database Reference Data ────────────────────────────────────────────────
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

  // ── Final Catalog Fields to Save with Outfit Intelligence ──────────────────
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

  // Variant Rows
  const [variants, setVariants] = useState<ProductVariantRow[]>([
    { sizeValue: "S", colorValue: "Default", stock: 5, price: 3500, isAvailable: true },
    { sizeValue: "M", colorValue: "Default", stock: 8, price: 3500, isAvailable: true },
    { sizeValue: "L", colorValue: "Default", stock: 5, price: 3500, isAvailable: true },
    { sizeValue: "XL", colorValue: "Default", stock: 2, price: 3500, isAvailable: true },
  ]);

  // Outfit Intelligence in Description Toggle
  const [includeOutfitIntelligence, setIncludeOutfitIntelligence] = useState(true);

  // Create Product Result
  const [createdProduct, setCreatedProduct] = useState<any | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Handle passed location state from AdminProductsPage or other links
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

  // Set default vendor if admin
  useEffect(() => {
    if (user?.role === "ADMIN" && !listingVendorId && vendors.length > 0) {
      setListingVendorId(vendors[0].id);
    }
  }, [user?.role, listingVendorId, vendors]);

  // Build the complete combined description with human-readable & AI-searchable outfit intelligence
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

  // Populate form fields whenever an analysis succeeds
  const populateFieldsFromAnalysis = (res: AIProductAnalysisResult) => {
    setListingName(res.identity.productName);

    // Build enriched description
    const fullDesc = includeOutfitIntelligence ? buildCombinedDescription(res) : res.descriptions.fullDescription;
    setListingDescription(fullDesc);

    // Map Gender
    const gUpper = (res.identity.gender || "").toUpperCase();
    if (gUpper.includes("MALE") && !gUpper.includes("FEMALE")) {
      setListingGender("MALE");
    } else if (gUpper.includes("FEMALE")) {
      setListingGender("FEMALE");
    } else {
      setListingGender("UNISEX");
    }

    // Auto-generate SKU
    setListingSku(`DM-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`);

    // Match Brand if possible
    if (brands.length > 0) {
      const detectedBrand = (res.identity.brand || "").toLowerCase();
      const matchedBrand = brands.find((b: any) => b.name.toLowerCase() === detectedBrand);
      setListingBrandId(matchedBrand ? matchedBrand.id : brands[0].id);
    }

    // Match Categories if possible
    if (categories.length > 0) {
      const detectedCat = (res.identity.category || "").toLowerCase();
      const detectedSub = (res.identity.subcategory || "").toLowerCase();
      const matchedCat = categories.find(
        (c: any) => c.name.toLowerCase().includes(detectedCat) || detectedSub.includes(c.name.toLowerCase())
      );
      setListingCategoryIds([matchedCat ? matchedCat.id : categories[0].id]);
    }

    // Update variants with detected color
    const detectedColor = res.appearance.primaryColor && res.appearance.primaryColor !== "None"
      ? res.appearance.primaryColor
      : "Standard";
    setVariants([
      { sizeValue: "S", colorValue: detectedColor, stock: 5, price: listingPrice, isAvailable: true },
      { sizeValue: "M", colorValue: detectedColor, stock: 8, price: listingPrice, isAvailable: true },
      { sizeValue: "L", colorValue: detectedColor, stock: 5, price: listingPrice, isAvailable: true },
      { sizeValue: "XL", colorValue: detectedColor, stock: 2, price: listingPrice, isAvailable: true },
    ]);
  };

  // Image Upload handler
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (imageUrls.length + files.length > 5) {
      setSnackbar({ open: true, message: "You can upload a maximum of 5 images per product." });
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
      setSnackbar({ open: true, message: `${files.length} image(s) uploaded successfully.` });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Failed to upload image." });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddManualUrl = () => {
    const trimmed = manualUrlInput.trim();
    if (!trimmed) return;
    if (imageUrls.length >= 5) {
      setSnackbar({ open: true, message: "Maximum 5 images allowed." });
      return;
    }
    setImageUrls((prev) => [...prev, trimmed]);
    setManualUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRunAnalysis = async () => {
    if (imageUrls.length === 0) {
      setSnackbar({ open: true, message: "Please upload at least one image before analyzing." });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setSaveError(null);

    try {
      const result = await aiProductAnalysisService.analyzeProduct(imageUrls);
      setAnalysisResult(result);
      populateFieldsFromAnalysis(result);
      setSnackbar({ open: true, message: "Product catalog analysis complete! Ready to confirm details." });
      // Switch automatically to the Publish / Confirmation tab so admin can review and save
      setActiveTab(6);
    } catch (err: any) {
      setAnalysisError(err.message || "Failed to analyze product. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Variant operations
  const handleAddVariantRow = () => {
    setVariants([
      ...variants,
      { sizeValue: "M", colorValue: variants[0]?.colorValue || "Default", stock: 5, price: listingPrice, isAvailable: true },
    ]);
  };

  const handleRemoveVariantRow = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleUpdateVariantRow = (index: number, field: keyof ProductVariantRow, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  // ── Save to Database Mutation ──────────────────────────────────────────────
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
      setSnackbar({ open: true, message: `Product "${data.name}" saved to catalog with complete outfit intelligence!` });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || error.message || "Failed to save product to catalog.";
      setSaveError(msg);
    },
  });

  const handleSaveProductToCatalog = () => {
    if (!listingName || listingName.trim().length < 2) {
      setSaveError("Product name must be at least 2 characters.");
      return;
    }

    if (!listingBrandId) {
      setSaveError("Please select a brand.");
      return;
    }

    if (!listingCategoryIds || listingCategoryIds.length === 0) {
      setSaveError("Please select at least one category.");
      return;
    }

    if (user?.role === "ADMIN" && !listingVendorId) {
      setSaveError("Please select a vendor.");
      return;
    }

    if (!listingPrice || Number(listingPrice) <= 0) {
      setSaveError("Please enter a valid selling price greater than 0.");
      return;
    }

    if (imageUrls.length === 0) {
      setSaveError("At least one product image is required.");
      return;
    }

    if (variants.length === 0) {
      setSaveError("Please configure at least one size variant.");
      return;
    }

    const payload = {
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
      isTrending: isTrending,
      isNewArrival: isNewArrival,
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
    };

    createProductMutation.mutate(payload);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    setSnackbar({ open: true, message: "Copied to clipboard!" });
  };

  const generateMarkdownReport = (res: AIProductAnalysisResult): string => {
    return `# DRESSME PRODUCT ANALYSIS REPORT

## PRODUCT IDENTITY
**Product Name:** ${res.identity.productName}
**Product Type:** ${res.identity.productType}
**Category:** ${res.identity.category}
**Subcategory:** ${res.identity.subcategory}
**Gender:** ${res.identity.gender}
**Brand:** ${res.identity.brand}
**Product Group:** ${res.identity.productGroup}

---

## APPEARANCE
**Primary Color:** ${res.appearance.primaryColor}
**Secondary Colors:** ${res.appearance.secondaryColors}
**Color Family:** ${res.appearance.colorFamily}
**Pattern:** ${res.appearance.pattern}
**Print:** ${res.appearance.print}
**Texture:** ${res.appearance.texture}
**Material:** ${res.appearance.material}
**Finish:** ${res.appearance.finish}
**Visible Details:**
${res.appearance.visibleDetails.map((d) => `* ${d}`).join("\n")}
**Logo/Branding:** ${res.appearance.logoBranding}

---

## STYLE
**Style:** ${res.style.style}
**Aesthetic:** ${res.style.aesthetic}
**Fit:** ${res.style.fit}
**Silhouette:** ${res.style.silhouette}
**Length:** ${res.style.length}
**Formality:** ${res.style.formality}
**Fashion Level:** ${res.style.fashionLevel}
**Style Keywords:** ${res.style.styleKeywords.join(", ")}

---

## OCCASION
**Primary Occasion:** ${res.occasion.primaryOccasion}
**Suitable Occasions:** ${res.occasion.suitableOccasions.join(", ")}

---

## WEATHER & SEASON
**Weather Suitability:** ${res.weather.weatherSuitability.join(", ")}
**Climate Suitability:** ${res.weather.climateSuitability}
**Season:** ${res.weather.season}
**Layering Suitability:** ${res.weather.layeringSuitability}

---

## OUTFIT INTELLIGENCE
**Recommended Tops:** ${res.outfitIntelligence.recommendedTops}
**Recommended Bottoms:** ${res.outfitIntelligence.recommendedBottoms}
**Recommended Shoes:** ${res.outfitIntelligence.recommendedShoes.join(", ")}
**Recommended Outerwear:** ${res.outfitIntelligence.recommendedOuterwear.join(", ")}
**Recommended Accessories:** ${res.outfitIntelligence.recommendedAccessories.join(", ")}
**Complementary Colors:** ${res.outfitIntelligence.complementaryColors.join(", ")}

---

## DESCRIPTIONS
### Short Description
${res.descriptions.shortDescription}

### Full Description
${res.descriptions.fullDescription}

### Marketing Description
${res.descriptions.marketingDescription}

---

## SEO & DISCOVERY
**SEO Title:** ${res.seo.seoTitle}
**Meta Description:** ${res.seo.metaDescription}
**URL Slug:** ${res.seo.urlSlug}
**Search Keywords:** ${res.seo.searchKeywords.join(", ")}
**Search Synonyms:** ${res.seo.searchSynonyms.join(", ")}
**Related Search Terms:** ${res.seo.relatedSearchTerms.join(", ")}

---

## DRESSME TAGS
${res.dressMeTags.join(", ")}

---

## AI STYLIST
**Best For:** ${res.aiStylist.bestFor.join(", ")}
**Style Profile:** ${res.aiStylist.styleProfile}
**Recommended User Intent:** ${res.aiStylist.recommendedUserIntent}
**Compatible Product Categories:** ${res.aiStylist.compatibleProductCategories.join(", ")}
**Compatible Colors:** ${res.aiStylist.compatibleColors.join(", ")}
**Outfit Ideas:**
${res.aiStylist.outfitIdeas.map((idea) => `* ${idea}`).join("\n")}
**Styling Notes:** ${res.aiStylist.stylingNotes}

---

## CONFIDENCE & VERIFICATION
**Overall Confidence:** ${res.confidence.overallConfidence}
**High Confidence Attributes:** ${res.confidence.highConfidenceAttributes.join(", ")}
**Uncertain Attributes:** ${res.confidence.uncertainAttributes.join(", ")}
**Human Verification Required:** ${res.confidence.humanVerificationRequired.join(", ")}
`;
  };

  const getConfidenceColor = (conf: "High" | "Medium" | "Low") => {
    switch (conf) {
      case "High":
        return "success";
      case "Medium":
        return "warning";
      case "Low":
        return "error";
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
      {/* Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                }}
              >
                <AutoAwesomeIcon sx={{ color: "white", fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                  AI Product Catalog Assistant
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Analyze images, generate complete outfit intelligence, confirm pricing & sizes, and publish directly to the DressMe catalog.
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1.5}>
            {analysisResult && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={copiedKey === "md" ? <CheckIcon /> : <ContentCopyIcon />}
                  onClick={() => copyToClipboard(generateMarkdownReport(analysisResult), "md")}
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.2)" }}
                >
                  {copiedKey === "md" ? "Report Copied" : "Copy Markdown"}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={copiedKey === "json" ? <CheckIcon /> : <ContentCopyIcon />}
                  onClick={() => copyToClipboard(JSON.stringify(analysisResult, null, 2), "json")}
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.2)" }}
                >
                  {copiedKey === "json" ? "JSON Copied" : "Copy JSON"}
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Success Banner when product has been created */}
      {createdProduct && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            bgcolor: "success.light",
            color: "success.contrastText",
            border: "1px solid",
            borderColor: "success.main",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircleIcon /> Product Published to Store Catalog!
              </Typography>
              <Typography variant="body2">
                "{createdProduct.name}" has been saved with full outfit intelligence, sizes, and pricing.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                size="small"
                component={RouterLink}
                to={`/products/${createdProduct.slug}`}
                target="_blank"
                endIcon={<OpenInNewIcon />}
                sx={{ bgcolor: "white", color: "success.dark", fontWeight: 700, "&:hover": { bgcolor: "#f0fdf4" } }}
              >
                View Live in Store
              </Button>
              <Button
                variant="outlined"
                size="small"
                component={RouterLink}
                to="/admin/products"
                sx={{ color: "white", borderColor: "white", fontWeight: 700 }}
              >
                Admin Catalog
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Left Column: Image Management */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              position: "sticky",
              top: 24,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <AddPhotoAlternateIcon color="primary" /> Product Imagery
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload 1 to 5 clear images of the garment (front, back, texture details).
            </Typography>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*"
              style={{ display: "none" }}
            />

            {/* Drop / Pick Zone */}
            <Box
              onClick={() => !isUploading && fileInputRef.current?.click()}
              sx={{
                border: "2px dashed",
                borderColor: isUploading ? "primary.main" : "divider",
                borderRadius: 2.5,
                p: 3,
                textAlign: "center",
                bgcolor: "action.hover",
                cursor: isUploading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.selected",
                },
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 42, color: "primary.main", mb: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {isUploading ? "Uploading to Cloudinary..." : "Click to browse device images"}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Supports JPG, PNG, WEBP (Max 5 images)
              </Typography>
              {isUploading && <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 2, borderRadius: 1 }} />}
            </Box>

            {/* Manual URL input fallback */}
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Or paste image URL"
                value={manualUrlInput}
                onChange={(e) => setManualUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddManualUrl()}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddManualUrl}
                disabled={!manualUrlInput.trim() || imageUrls.length >= 5}
                startIcon={<LinkIcon />}
              >
                Add
              </Button>
            </Stack>

            {/* Uploaded Thumbnails Preview */}
            {imageUrls.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", color: "text.secondary" }}>
                  Uploaded Images ({imageUrls.length}/5)
                </Typography>
                <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                  {imageUrls.map((url, idx) => (
                    <Grid size={{ xs: 4 }} key={idx}>
                      <Card
                        sx={{
                          position: "relative",
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          overflow: "hidden",
                        }}
                      >
                        <CardMedia component="img" height="90" image={url} alt={`Upload ${idx + 1}`} sx={{ objectFit: "cover" }} />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImage(idx)}
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            bgcolor: "rgba(0,0,0,0.6)",
                            color: "white",
                            p: 0.5,
                            "&:hover": { bgcolor: "error.main" },
                          }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        {idx === 0 && (
                          <Chip
                            label="Primary"
                            size="small"
                            color="primary"
                            sx={{
                              position: "absolute",
                              bottom: 4,
                              left: 4,
                              fontSize: "0.65rem",
                              height: 18,
                            }}
                          />
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Action Button */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || imageUrls.length === 0}
              startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
              }}
            >
              {isAnalyzing ? "Analyzing Imagery..." : "Analyze Product with AI"}
            </Button>
          </Paper>
        </Grid>

        {/* Right Column: Analysis Results & Publishing Form */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {analysisError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setAnalysisError(null)}>
              {analysisError}
            </Alert>
          )}

          {!analysisResult && !isAnalyzing && (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: 3,
                border: "1px dashed",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  mx: "auto",
                  mb: 2,
                  borderRadius: "50%",
                  bgcolor: "action.hover",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingBagIcon sx={{ fontSize: 32, color: "text.secondary" }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                No Product Analyzed Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, mx: "auto", mb: 3 }}>
                Upload photos of your product on the left and click <strong>Analyze Product with AI</strong>. The assistant will extract
                silhouettes, textures, style, occasions, matching shoes/tops, and let you set price, size, and brand to publish all outfit
                information together into the database.
              </Typography>
            </Paper>
          )}

          {isAnalyzing && (
            <Paper
              elevation={0}
              sx={{
                p: 8,
                textAlign: "center",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <CircularProgress size={56} sx={{ mb: 3 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Extracting Product & Outfit Intelligence...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: "auto" }}>
                Analyzing silhouettes, patterns, materials, styling occasions, climate suitability, and SEO tags via the AI Gateway.
              </Typography>
            </Paper>
          )}

          {analysisResult && (
            <Box>
              {/* Highlight summary card */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="flex-start" spacing={2}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <Chip
                        label={analysisResult.identity.gender}
                        size="small"
                        color="secondary"
                        sx={{ fontWeight: 700 }}
                      />
                      <Chip
                        label={analysisResult.identity.category}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip
                        label={`Confidence: ${analysisResult.confidence.overallConfidence}`}
                        size="small"
                        color={getConfidenceColor(analysisResult.confidence.overallConfidence)}
                        sx={{ fontWeight: 700 }}
                      />
                    </Stack>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {analysisResult.identity.productName}
                    </Typography>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600, mt: 0.5 }}>
                      "{analysisResult.summary.oneLineSellingPoint}"
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    color="success"
                    size="medium"
                    onClick={() => setActiveTab(6)}
                    startIcon={<StorefrontIcon />}
                    sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
                  >
                    Confirm & Publish Product
                  </Button>
                </Stack>
              </Paper>

              {/* Navigation Tabs for detailed sections */}
              <Tabs
                value={activeTab}
                onChange={(_, val) => setActiveTab(val)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  mb: 3,
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTab-root": { fontWeight: 700 },
                }}
              >
                <Tab icon={<ShoppingBagIcon />} iconPosition="start" label="Identity & Specs" />
                <Tab icon={<StyleIcon />} iconPosition="start" label="Style & Occasion" />
                <Tab icon={<WbSunnyIcon />} iconPosition="start" label="Weather & Outfits" />
                <Tab icon={<EditNoteIcon />} iconPosition="start" label="Descriptions" />
                <Tab icon={<SearchIcon />} iconPosition="start" label="SEO & Tags" />
                <Tab icon={<PsychologyIcon />} iconPosition="start" label="AI Stylist" />
                <Tab
                  icon={<StorefrontIcon color="primary" />}
                  iconPosition="start"
                  label="Confirm, Price & Save"
                  sx={{ color: "primary.main", fontWeight: 800 }}
                />
              </Tabs>

              {/* Tab 0: Identity & Appearance */}
              {activeTab === 0 && (
                <Stack spacing={3}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      Product Identity
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Product Type</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.identity.productType}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Subcategory</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.identity.subcategory}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Product Group</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.identity.productGroup}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Detected Brand</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.identity.brand}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      Appearance & Materials
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Primary Color</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.appearance.primaryColor}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Color Family</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.appearance.colorFamily}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Secondary Colors</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.appearance.secondaryColors}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Pattern</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.appearance.pattern}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Texture</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.appearance.texture}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Visible Material</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.appearance.material}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Finish</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.appearance.finish}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Prints</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.appearance.print}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Logo / Branding</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.appearance.logoBranding}</Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" color="text.secondary">Visible Details</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mt: 0.5 }}>
                      {analysisResult.appearance.visibleDetails.map((detail, idx) => (
                        <Chip key={idx} label={detail} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Paper>
                </Stack>
              )}

              {/* Tab 1: Style & Occasion */}
              {activeTab === 1 && (
                <Stack spacing={3}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      Style & Fit Profile
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Dominant Style</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.style.style}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Aesthetic</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.style.aesthetic}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Fit</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.style.fit}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Silhouette</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.style.silhouette}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Length</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.style.length}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Formality</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.style.formality}</Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" color="text.secondary">Style Keywords</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mt: 0.5 }}>
                      {analysisResult.style.styleKeywords.map((kw, idx) => (
                        <Chip key={idx} label={kw} size="small" color="primary" variant="outlined" />
                      ))}
                    </Stack>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      Occasion Compatibility
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Primary Occasion</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}>
                      {analysisResult.occasion.primaryOccasion}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Suitable Occasions</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mt: 0.5 }}>
                      {analysisResult.occasion.suitableOccasions.map((occ, idx) => (
                        <Chip key={idx} label={occ} size="small" />
                      ))}
                    </Stack>
                  </Paper>
                </Stack>
              )}

              {/* Tab 2: Weather & Outfits */}
              {activeTab === 2 && (
                <Stack spacing={3}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      Weather & Climate Suitability
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Season</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.weather.season}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Layering Suitability</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.weather.layeringSuitability}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Typography variant="caption" color="text.secondary">Climate Conditions</Typography>
                        <Typography variant="body2">{analysisResult.weather.climateSuitability}</Typography>
                      </Grid>
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" color="text.secondary">Weather Types</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mt: 0.5 }}>
                      {analysisResult.weather.weatherSuitability.map((w, idx) => (
                        <Chip key={idx} label={w} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      Outfit Pairing Intelligence (Stored with Product)
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Recommended Tops</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{analysisResult.outfitIntelligence.recommendedTops}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Recommended Bottoms</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{analysisResult.outfitIntelligence.recommendedBottoms}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Recommended Shoes</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{analysisResult.outfitIntelligence.recommendedShoes.join(", ")}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Recommended Outerwear</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{analysisResult.outfitIntelligence.recommendedOuterwear.join(", ")}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Recommended Accessories</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{analysisResult.outfitIntelligence.recommendedAccessories.join(", ")}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Complementary Colors</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5, mt: 0.5 }}>
                          {analysisResult.outfitIntelligence.complementaryColors.map((color, idx) => (
                            <Chip key={idx} label={color} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>
                </Stack>
              )}

              {/* Tab 3: Descriptions */}
              {activeTab === 3 && (
                <Stack spacing={3}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Short Description (Card View)
                      </Typography>
                      <Tooltip title="Copy text">
                        <IconButton size="small" onClick={() => copyToClipboard(analysisResult.descriptions.shortDescription, "shortDesc")}>
                          {copiedKey === "shortDesc" ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 1, p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                      {analysisResult.descriptions.shortDescription}
                    </Typography>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Full E-Commerce Description
                      </Typography>
                      <Tooltip title="Copy text">
                        <IconButton size="small" onClick={() => copyToClipboard(analysisResult.descriptions.fullDescription, "fullDesc")}>
                          {copiedKey === "fullDesc" ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 1, p: 2, bgcolor: "action.hover", borderRadius: 2, whiteSpace: "pre-line" }}>
                      {analysisResult.descriptions.fullDescription}
                    </Typography>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Marketing / Promotional Description
                      </Typography>
                      <Tooltip title="Copy text">
                        <IconButton size="small" onClick={() => copyToClipboard(analysisResult.descriptions.marketingDescription, "mktgDesc")}>
                          {copiedKey === "mktgDesc" ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 1, p: 2, bgcolor: "action.hover", borderRadius: 2, fontStyle: "italic" }}>
                      "{analysisResult.descriptions.marketingDescription}"
                    </Typography>
                  </Paper>
                </Stack>
              )}

              {/* Tab 4: SEO & Discovery */}
              {activeTab === 4 && (
                <Stack spacing={3}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      SEO Meta & Slug
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary">SEO Title</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.seo.seoTitle}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary">
                          Meta Description ({analysisResult.seo.metaDescription.length} chars)
                        </Typography>
                        <Typography variant="body2">{analysisResult.seo.metaDescription}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary">URL Slug</Typography>
                        <Typography variant="body2" sx={{ fontFamily: "monospace", color: "primary.main" }}>
                          /{analysisResult.seo.urlSlug}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      DressMe Standardized Search Tags
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                      UPPERCASE, hyphens for multi-words, optimized for the DressMe filter bar & AI search.
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                      {analysisResult.dressMeTags.map((tag, idx) => (
                        <Chip key={idx} label={tag} size="small" color="primary" sx={{ fontWeight: 700 }} />
                      ))}
                    </Stack>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      Search Keywords & Synonyms
                    </Typography>
                    <Typography variant="caption" color="text.secondary">Primary Search Keywords</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5, mt: 0.5, mb: 2 }}>
                      {analysisResult.seo.searchKeywords.map((kw, idx) => (
                        <Chip key={idx} label={kw} size="small" variant="outlined" />
                      ))}
                    </Stack>

                    <Typography variant="caption" color="text.secondary">Search Synonyms & Slang</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5, mt: 0.5, mb: 2 }}>
                      {analysisResult.seo.searchSynonyms.map((syn, idx) => (
                        <Chip key={idx} label={syn} size="small" />
                      ))}
                    </Stack>

                    <Typography variant="caption" color="text.secondary">Related Search Phrases</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5, mt: 0.5 }}>
                      {analysisResult.seo.relatedSearchTerms.map((phrase, idx) => (
                        <Chip key={idx} label={`"${phrase}"`} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Paper>
                </Stack>
              )}

              {/* Tab 5: AI Stylist Intelligence */}
              {activeTab === 5 && (
                <Stack spacing={3}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      AI Stylist Profile
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Style Profile</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{analysisResult.aiStylist.styleProfile}</Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" color="text.secondary">Recommended User Intent</Typography>
                        <Typography variant="body2">{analysisResult.aiStylist.recommendedUserIntent}</Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" color="text.secondary">Best For</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mt: 0.5, mb: 2 }}>
                      {analysisResult.aiStylist.bestFor.map((bf, idx) => (
                        <Chip key={idx} label={bf} size="small" color="secondary" />
                      ))}
                    </Stack>

                    <Typography variant="caption" color="text.secondary">Compatible Product Categories</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mt: 0.5 }}>
                      {analysisResult.aiStylist.compatibleProductCategories.map((cat, idx) => (
                        <Chip key={idx} label={cat} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      AI Outfit Combinations
                    </Typography>
                    <Stack spacing={1.5}>
                      {analysisResult.aiStylist.outfitIdeas.map((idea, idx) => (
                        <Paper key={idx} elevation={0} sx={{ p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {idea}
                          </Typography>
                        </Paper>
                      ))}
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                      Styling Guidance
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: "italic", mt: 0.5 }}>
                      {analysisResult.aiStylist.stylingNotes}
                    </Typography>
                  </Paper>
                </Stack>
              )}

              {/* Tab 6: Complete Listing & Save to Catalog */}
              {activeTab === 6 && (
                <Stack spacing={3}>
                  {saveError && (
                    <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setSaveError(null)}>
                      {saveError}
                    </Alert>
                  )}

                  {/* Section 1: Catalog Details */}
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        1. Product Identity & Pricing
                      </Typography>
                      <Chip label="Auto-filled from AI Analysis" size="small" color="primary" variant="outlined" />
                    </Stack>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Product Name *"
                          value={listingName}
                          onChange={(e) => setListingName(e.target.value)}
                          helperText="Customer-facing name shown in marketplace"
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Selling Price (KES) *"
                          value={listingPrice}
                          onChange={(e) => setListingPrice(Number(e.target.value))}
                          InputProps={{ startAdornment: <Typography sx={{ mr: 1, color: "text.secondary" }}>KES</Typography> }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Compare At Price (KES)"
                          value={listingCompareAtPrice || ""}
                          onChange={(e) => setListingCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
                          helperText="Original price before discount"
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Total Available Stock *"
                          value={listingStock}
                          onChange={(e) => setListingStock(Number(e.target.value))}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                          fullWidth
                          label="Product SKU *"
                          value={listingSku}
                          onChange={(e) => setListingSku(e.target.value)}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <FormControl fullWidth>
                          <InputLabel>Brand *</InputLabel>
                          <Select
                            value={listingBrandId}
                            label="Brand *"
                            onChange={(e) => setListingBrandId(e.target.value)}
                          >
                            {brands.map((b: any) => (
                              <MenuItem key={b.id} value={b.id}>
                                {b.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <FormControl fullWidth>
                          <InputLabel>Category *</InputLabel>
                          <Select
                            multiple
                            value={listingCategoryIds}
                            label="Category *"
                            onChange={(e) => setListingCategoryIds(typeof e.target.value === "string" ? [e.target.value] : e.target.value)}
                            renderValue={(selected) =>
                              categories
                                .filter((c: any) => selected.includes(c.id))
                                .map((c: any) => c.name)
                                .join(", ")
                            }
                          >
                            {categories.map((c: any) => (
                              <MenuItem key={c.id} value={c.id}>
                                <Checkbox checked={listingCategoryIds.indexOf(c.id) > -1} />
                                {c.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {user?.role === "ADMIN" && (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                          <FormControl fullWidth>
                            <InputLabel>Vendor *</InputLabel>
                            <Select
                              value={listingVendorId}
                              label="Vendor *"
                              onChange={(e) => setListingVendorId(e.target.value)}
                            >
                              {vendors.map((v: any) => (
                                <MenuItem key={v.id} value={v.id}>
                                  {v.businessName}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      )}

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <FormControl fullWidth>
                          <InputLabel>Gender *</InputLabel>
                          <Select
                            value={listingGender}
                            label="Gender *"
                            onChange={(e) => setListingGender(e.target.value as any)}
                          >
                            <MenuItem value="FEMALE">Female</MenuItem>
                            <MenuItem value="MALE">Male</MenuItem>
                            <MenuItem value="UNISEX">Unisex</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Paper>

                  {/* Section 2: Sizes & Variants */}
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          2. Sizes & Color Variants
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Confirm available sizes, inventory stock per size, and specific colors.
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddVariantRow}
                      >
                        Add Variant
                      </Button>
                    </Stack>

                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Size (e.g. S, M, L, 42)</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Color</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Stock Qty</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Price (KES)</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {variants.map((v, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <TextField
                                size="small"
                                value={v.sizeValue}
                                placeholder="Size"
                                onChange={(e) => handleUpdateVariantRow(index, "sizeValue", e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                value={v.colorValue}
                                placeholder="Color"
                                onChange={(e) => handleUpdateVariantRow(index, "colorValue", e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                type="number"
                                value={v.stock}
                                onChange={(e) => handleUpdateVariantRow(index, "stock", Number(e.target.value))}
                                sx={{ width: 90 }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                size="small"
                                type="number"
                                value={v.price}
                                onChange={(e) => handleUpdateVariantRow(index, "price", Number(e.target.value))}
                                sx={{ width: 110 }}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveVariantRow(index)}
                                disabled={variants.length <= 1}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>

                  {/* Section 3: Description & Outfit Intelligence Stored Together */}
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        3. Outfit Intelligence & Search Indexing
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeOutfitIntelligence}
                            onChange={(e) => {
                              setIncludeOutfitIntelligence(e.target.checked);
                              if (analysisResult) {
                                setListingDescription(
                                  e.target.checked
                                    ? buildCombinedDescription(analysisResult)
                                    : analysisResult.descriptions.fullDescription
                                );
                              }
                            }}
                          />
                        }
                        label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Store Outfit Intelligence in Description</Typography>}
                      />
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                      When stored together, searches for matching shoes, outerwear, complementary colors, and occasions will immediately index and find this product!
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      label="Complete Product Description & Outfit Pairing Data *"
                      value={listingDescription}
                      onChange={(e) => setListingDescription(e.target.value)}
                    />
                  </Paper>

                  {/* Save Action Bar */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: "background.paper",
                      border: "2px solid",
                      borderColor: "primary.main",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                    }}
                  >
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          Ready to Publish Product?
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          This will save the product into PostgreSQL with all {imageUrls.length} images, {variants.length} size variants, and full outfit pairing intelligence.
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSaveProductToCatalog}
                        disabled={createProductMutation.isPending}
                        startIcon={createProductMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <StorefrontIcon />}
                        sx={{
                          py: 1.5,
                          px: 4,
                          fontWeight: 800,
                          fontSize: "1rem",
                          borderRadius: 2,
                          boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                        }}
                      >
                        {createProductMutation.isPending ? "Saving to Catalog..." : "Publish Product to Store"}
                      </Button>
                    </Stack>
                  </Paper>
                </Stack>
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}

