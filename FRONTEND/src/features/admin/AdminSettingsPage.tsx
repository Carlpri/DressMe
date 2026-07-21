import { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Divider,
  Snackbar,
} from "@mui/material";
import CollectionsIcon from "@mui/icons-material/Collections";
import { useSiteSettings, useUpdateSiteSettings, type UpdateSiteSettingsData } from "../../hooks/useSiteSettings";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { MediaPickerModal } from "../../components/admin/MediaPickerModal";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export function AdminSettingsPage() {
  const { data: settings, isLoading, error, refetch } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeMediaField, setActiveMediaField] = useState<string>("");

  const [formData, setFormData] = useState<UpdateSiteSettingsData>({});

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (field: keyof UpdateSiteSettingsData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSwitchChange = (field: keyof UpdateSiteSettingsData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const handleNumberChange = (field: keyof UpdateSiteSettingsData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: parseFloat(e.target.value) || 0 }));
  };

  const openMediaPicker = (fieldKey: string) => {
    setActiveMediaField(fieldKey);
    setMediaPickerOpen(true);
  };

  const handleSelectMedia = (url: string) => {
    if (activeMediaField) {
      setFormData((prev) => ({ ...prev, [activeMediaField as keyof UpdateSiteSettingsData]: url }));
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      await updateSettings.mutateAsync({ id: settings.id, data: formData });
      setSnackbarMessage("AppSettings saved successfully!");
      setSnackbarOpen(true);
      refetch();
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  const handleReset = () => {
    if (settings) {
      setFormData({});
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <LoadingSkeleton height={400} />
      </Container>
    );
  }

  if (error || !settings) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
          Failed to load settings
        </Alert>
      </Container>
    );
  }

  const currentData = { ...settings, ...formData };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              AppSettings CMS
            </Typography>
            <Typography color="text.secondary">
              Configure site branding, contact information, social links, homepage CMS controls, and policies.
            </Typography>
          </Box>
        </Box>

        <Card variant="outlined">
          <CardContent>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="General" />
              <Tab label="Branding" />
              <Tab label="Homepage" />
              <Tab label="Contact" />
              <Tab label="Social Media" />
              <Tab label="SEO & Meta" />
              <Tab label="Policies" />
              <Tab label="Controls" />
            </Tabs>

            {/* General */}
            <TabPanel value={tabValue} index={0}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Site Name"
                  value={formData.siteName ?? currentData.siteName}
                  onChange={handleInputChange("siteName")}
                  helperText="The public brand name of your store"
                />
                <TextField
                  fullWidth
                  label="Tagline"
                  value={(formData.tagline ?? currentData.tagline) ?? ""}
                  onChange={handleInputChange("tagline")}
                  helperText="Short slogan shown in header and footer"
                  multiline
                  rows={2}
                />
                <TextField
                  fullWidth
                  label="Country"
                  value={(formData.country ?? currentData.country) ?? "Kenya"}
                  onChange={handleInputChange("country")}
                />
                <TextField
                  fullWidth
                  label="Language"
                  value={(formData.language ?? currentData.language) ?? "en"}
                  onChange={handleInputChange("language")}
                />
              </Stack>
            </TabPanel>

            {/* Branding */}
            <TabPanel value={tabValue} index={1}>
              <Stack spacing={3}>
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<CollectionsIcon />}
                    onClick={() => openMediaPicker("logoUrl")}
                    sx={{ mb: 1 }}
                  >
                    Choose Light Logo from Media Library
                  </Button>
                  <TextField
                    fullWidth
                    label="Logo URL (Light Theme)"
                    value={(formData.logoUrl ?? currentData.logoUrl) ?? ""}
                    onChange={handleInputChange("logoUrl")}
                  />
                </Box>

                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<CollectionsIcon />}
                    onClick={() => openMediaPicker("logoDarkUrl")}
                    sx={{ mb: 1 }}
                  >
                    Choose Dark Logo from Media Library
                  </Button>
                  <TextField
                    fullWidth
                    label="Dark Logo URL"
                    value={(formData.logoDarkUrl ?? currentData.logoDarkUrl) ?? ""}
                    onChange={handleInputChange("logoDarkUrl")}
                  />
                </Box>

                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<CollectionsIcon />}
                    onClick={() => openMediaPicker("faviconUrl")}
                    sx={{ mb: 1 }}
                  >
                    Choose Favicon from Media Library
                  </Button>
                  <TextField
                    fullWidth
                    label="Favicon URL"
                    value={(formData.faviconUrl ?? currentData.faviconUrl) ?? ""}
                    onChange={handleInputChange("faviconUrl")}
                  />
                </Box>
              </Stack>
            </TabPanel>

            {/* Homepage */}
            <TabPanel value={tabValue} index={2}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Hero Title"
                  value={(formData.heroTitle ?? (currentData as any).heroTitle) ?? ""}
                  onChange={handleInputChange("heroTitle" as any)}
                  placeholder="e.g. Elevate Your Everyday Fashion"
                />
                <TextField
                  fullWidth
                  label="Hero Subtitle"
                  value={(formData.heroSubtitle ?? (currentData as any).heroSubtitle) ?? ""}
                  onChange={handleInputChange("heroSubtitle" as any)}
                  multiline
                  rows={2}
                  placeholder="e.g. Discover premium fashion collections curated for comfort and confidence."
                />
                <TextField
                  fullWidth
                  label="Hero CTA Button Text"
                  value={(formData.heroCtaText ?? (currentData as any).heroCtaText) ?? ""}
                  onChange={handleInputChange("heroCtaText" as any)}
                  placeholder="e.g. Shop Collection"
                />
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<CollectionsIcon />}
                    onClick={() => openMediaPicker("heroBannerUrl")}
                    sx={{ mb: 1 }}
                  >
                    Choose Hero Banner from Media Library
                  </Button>
                  <TextField
                    fullWidth
                    label="Hero Banner Image URL"
                    value={(formData.heroBannerUrl ?? currentData.heroBannerUrl) ?? ""}
                    onChange={handleInputChange("heroBannerUrl")}
                  />
                </Box>
              </Stack>
            </TabPanel>

            {/* Contact */}
            <TabPanel value={tabValue} index={3}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Support Email"
                  value={(formData.supportEmail ?? currentData.supportEmail) ?? ""}
                  onChange={handleInputChange("supportEmail")}
                />
                <TextField
                  fullWidth
                  label="Support Phone"
                  value={(formData.supportPhone ?? currentData.supportPhone) ?? ""}
                  onChange={handleInputChange("supportPhone")}
                />
                <TextField
                  fullWidth
                  label="WhatsApp Phone Number"
                  value={(formData.whatsappNumber ?? (currentData as any).whatsappNumber ?? (currentData as any).whatsapp) ?? ""}
                  onChange={handleInputChange("whatsappNumber" as any)}
                  helperText="Format e.g. 254712345678 (Used for direct WhatsApp order messaging)"
                />
                <TextField
                  fullWidth
                  label="Physical Business Address"
                  value={(formData.physicalAddress ?? currentData.physicalAddress) ?? ""}
                  onChange={handleInputChange("physicalAddress")}
                  multiline
                  rows={2}
                />
                <TextField
                  fullWidth
                  label="Business Hours"
                  value={(formData.businessHours ?? (currentData as any).businessHours) ?? ""}
                  onChange={handleInputChange("businessHours" as any)}
                  placeholder="Mon - Sat: 8:00 AM - 6:00 PM"
                />
              </Stack>
            </TabPanel>

            {/* Social Media */}
            <TabPanel value={tabValue} index={4}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Facebook URL"
                  value={(formData.facebook ?? currentData.facebook) ?? ""}
                  onChange={handleInputChange("facebook")}
                />
                <TextField
                  fullWidth
                  label="Instagram URL"
                  value={(formData.instagram ?? currentData.instagram) ?? ""}
                  onChange={handleInputChange("instagram")}
                />
                <TextField
                  fullWidth
                  label="TikTok URL"
                  value={(formData.tiktok ?? currentData.tiktok) ?? ""}
                  onChange={handleInputChange("tiktok")}
                />
                <TextField
                  fullWidth
                  label="X (Twitter) URL"
                  value={(formData.x ?? currentData.x) ?? ""}
                  onChange={handleInputChange("x")}
                />
                <TextField
                  fullWidth
                  label="LinkedIn URL"
                  value={(formData.linkedin ?? currentData.linkedin) ?? ""}
                  onChange={handleInputChange("linkedin")}
                />
                <TextField
                  fullWidth
                  label="YouTube URL"
                  value={(formData.youtube ?? currentData.youtube) ?? ""}
                  onChange={handleInputChange("youtube")}
                />
              </Stack>
            </TabPanel>

            {/* SEO & Meta */}
            <TabPanel value={tabValue} index={5}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="SEO Site Title"
                  value={(formData.siteTitle ?? (currentData as any).siteTitle) ?? ""}
                  onChange={handleInputChange("siteTitle" as any)}
                  placeholder="DressMe | Premier Fashion Store"
                />
                <TextField
                  fullWidth
                  label="Meta Description"
                  value={(formData.metaDescription ?? (currentData as any).metaDescription) ?? ""}
                  onChange={handleInputChange("metaDescription" as any)}
                  multiline
                  rows={3}
                />
                <TextField
                  fullWidth
                  label="Meta Keywords"
                  value={(formData.metaKeywords ?? (currentData as any).metaKeywords) ?? ""}
                  onChange={handleInputChange("metaKeywords" as any)}
                  placeholder="fashion, clothing, shoes, Kenya, online shopping"
                />
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<CollectionsIcon />}
                    onClick={() => openMediaPicker("ogImageUrl")}
                    sx={{ mb: 1 }}
                  >
                    Choose Open Graph (OG) Image
                  </Button>
                  <TextField
                    fullWidth
                    label="OG Image URL"
                    value={(formData.ogImageUrl ?? (currentData as any).ogImageUrl) ?? ""}
                    onChange={handleInputChange("ogImageUrl" as any)}
                  />
                </Box>
              </Stack>
            </TabPanel>

            {/* Policies */}
            <TabPanel value={tabValue} index={6}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="About Us"
                  value={(formData.aboutUs ?? currentData.aboutUs) ?? ""}
                  onChange={handleInputChange("aboutUs")}
                  multiline
                  rows={4}
                />
                <TextField
                  fullWidth
                  label="Privacy Policy"
                  value={(formData.privacyPolicy ?? currentData.privacyPolicy) ?? ""}
                  onChange={handleInputChange("privacyPolicy")}
                  multiline
                  rows={4}
                />
                <TextField
                  fullWidth
                  label="Terms of Service"
                  value={(formData.termsOfService ?? currentData.termsOfService) ?? ""}
                  onChange={handleInputChange("termsOfService")}
                  multiline
                  rows={4}
                />
                <TextField
                  fullWidth
                  label="Shipping Policy"
                  value={(formData.shippingPolicy ?? currentData.shippingPolicy) ?? ""}
                  onChange={handleInputChange("shippingPolicy")}
                  multiline
                  rows={4}
                />
              </Stack>
            </TabPanel>

            {/* Controls */}
            <TabPanel value={tabValue} index={7}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Currency Code"
                  value={formData.currency ?? currentData.currency}
                  onChange={handleInputChange("currency")}
                  inputProps={{ maxLength: 3 }}
                />
                <TextField
                  fullWidth
                  label="Default Shipping Fee (KES)"
                  type="number"
                  value={formData.defaultShippingFee ?? currentData.defaultShippingFee}
                  onChange={handleNumberChange("defaultShippingFee")}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.maintenanceMode ?? currentData.maintenanceMode}
                      onChange={handleSwitchChange("maintenanceMode")}
                    />
                  }
                  label="Enable Maintenance Mode"
                />
              </Stack>
            </TabPanel>

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleReset} disabled={updateSettings.isPending}>
                Reset
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={updateSettings.isPending}
                startIcon={updateSettings.isPending ? <CircularProgress size={20} /> : null}
              >
                {updateSettings.isPending ? "Saving..." : "Save AppSettings"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <MediaPickerModal
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleSelectMedia}
        title="Select Media Image"
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
}
