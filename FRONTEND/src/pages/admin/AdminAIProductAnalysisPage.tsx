import { useState, useRef } from "react";
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

import {
  aiProductAnalysisService,
  type AIProductAnalysisResult,
} from "../../services/ai-product-analysis.service";
import { uploadToCloudinary } from "../../services/cloudinary";

export function AdminAIProductAnalysisPage() {
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

  // Handlers
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
          // If Cloudinary preset is missing in local dev, convert to Data URL for instant analysis
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

    try {
      const result = await aiProductAnalysisService.analyzeProduct(imageUrls);
      setAnalysisResult(result);
      setSnackbar({ open: true, message: "Product catalog analysis complete!" });
    } catch (err: any) {
      setAnalysisError(err.message || "Failed to analyze product. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
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

---

## MANUAL PRODUCT INFORMATION
**Brand:** ${res.manualFields.brand}
**Vendor:** ${res.manualFields.vendor}
**SKU:** ${res.manualFields.sku}
**Price:** ${res.manualFields.price}
**Discount Price:** ${res.manualFields.discountPrice}
**Currency:** ${res.manualFields.currency}
**Available Sizes:** ${res.manualFields.availableSizes}
**Available Quantity:** ${res.manualFields.availableQuantity}
**Stock Status:** ${res.manualFields.stockStatus}
**Material Composition:** ${res.manualFields.materialComposition}
**Product Measurements:** ${res.manualFields.productMeasurements}
**Care Instructions:** ${res.manualFields.careInstructions}

---

## FINAL PRODUCT SUMMARY
**PRODUCT NAME:** ${res.summary.productName}
**CATEGORY:** ${res.summary.category}
**PRIMARY COLOR:** ${res.summary.primaryColor}
**STYLE:** ${res.summary.style}
**PRIMARY OCCASION:** ${res.summary.primaryOccasion}
**WEATHER SUITABILITY:** ${res.summary.weatherSuitability}
**TOP DRESSME TAGS:** ${res.summary.topDressMetags}
**ONE-LINE SELLING POINT:** ${res.summary.oneLineSellingPoint}
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
                  Analyze fashion product images and instantly extract structured, search-ready e-commerce records.
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

        {/* Right Column: Analysis Results or Empty State */}
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
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: "auto", mb: 3 }}>
                Upload photos of your product on the left and click <strong>Analyze Product with AI</strong>. The model will adhere to
                DressMe catalog standards and Kenyan fashion e-commerce guidelines.
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
                Extracting Product Intelligence...
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
                <Tab icon={<VerifiedUserIcon />} iconPosition="start" label="Verification" />
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
                        <Typography variant="caption" color="text.secondary">Brand</Typography>
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
                      Outfit Pairing Intelligence
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

              {/* Tab 6: Verification & Manual Entry */}
              {activeTab === 6 && (
                <Stack spacing={3}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                      AI Confidence Breakdown
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Rule enforced: <strong>Never invent unconfirmed information</strong>. The model flags uncertain and unverified
                      fields below.
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "success.main" }}>
                          High Confidence Attributes
                        </Typography>
                        <Stack spacing={0.5} sx={{ mt: 1 }}>
                          {analysisResult.confidence.highConfidenceAttributes.map((attr, idx) => (
                            <Typography key={idx} variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} /> {attr}
                            </Typography>
                          ))}
                        </Stack>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "warning.main" }}>
                          Uncertain / Inferred Attributes
                        </Typography>
                        <Stack spacing={0.5} sx={{ mt: 1 }}>
                          {analysisResult.confidence.uncertainAttributes.map((attr, idx) => (
                            <Typography key={idx} variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              • {attr}
                            </Typography>
                          ))}
                        </Stack>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "error.main" }}>
                      Human Verification Required Before Listing
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mt: 1 }}>
                      {analysisResult.confidence.humanVerificationRequired.map((req, idx) => (
                        <Chip key={idx} label={req} size="small" color="error" variant="outlined" />
                      ))}
                    </Stack>
                  </Paper>

                  {/* Manual Fields Form */}
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                      Manual Catalog Fields (Prepared for Entry)
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth size="small" label="Brand" defaultValue={analysisResult.manualFields.brand} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth size="small" label="Vendor" defaultValue={analysisResult.manualFields.vendor} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth size="small" label="SKU" defaultValue={analysisResult.manualFields.sku} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Currency & Price"
                          defaultValue={`${analysisResult.manualFields.currency} ${analysisResult.manualFields.price}`}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Available Sizes"
                          defaultValue={analysisResult.manualFields.availableSizes}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Available Quantity"
                          defaultValue={analysisResult.manualFields.availableQuantity}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Stock Status"
                          defaultValue={analysisResult.manualFields.stockStatus}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Material Composition"
                          defaultValue={analysisResult.manualFields.materialComposition}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Care Instructions"
                          defaultValue={analysisResult.manualFields.careInstructions}
                        />
                      </Grid>
                    </Grid>
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
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}

