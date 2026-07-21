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
import { useSiteSettings, useUpdateSiteSettings, type UpdateSiteSettingsData } from "../../hooks/useSiteSettings";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";

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

  const handleSave = async () => {
    if (!settings) return;

    try {
      await updateSettings.mutateAsync({ id: settings.id, data: formData });
      setSnackbarMessage("Settings saved successfully!");
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
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Site Settings
          </Typography>
          <Typography color="text.secondary">
            Manage your site configuration, branding, and policies
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tab label="General" />
              <Tab label="Branding" />
              <Tab label="Homepage" />
              <Tab label="Contact" />
              <Tab label="Social Media" />
              <Tab label="Shipping" />
              <Tab label="Policies" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Site Name"
                  value={formData.siteName ?? currentData.siteName}
                  onChange={handleInputChange("siteName")}
                  helperText="The name of your website"
                />
                <TextField
                  fullWidth
                  label="Tagline"
                  value={(formData.tagline ?? currentData.tagline) ?? ""}
                  onChange={handleInputChange("tagline")}
                  helperText="A short tagline for your brand"
                  multiline
                  rows={2}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.maintenanceMode ?? currentData.maintenanceMode}
                      onChange={handleSwitchChange("maintenanceMode")}
                    />
                  }
                  label="Maintenance Mode"
                />
                {currentData.maintenanceMode && (
                  <Alert severity="warning">
                    Maintenance mode is enabled. Only administrators can access the site.
                  </Alert>
                )}
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Logo URL"
                  value={(formData.logoUrl ?? currentData.logoUrl) ?? ""}
                  onChange={handleInputChange("logoUrl")}
                  helperText="URL for your logo image (light theme)"
                />
                <TextField
                  fullWidth
                  label="Dark Logo URL"
                  value={(formData.logoDarkUrl ?? currentData.logoDarkUrl) ?? ""}
                  onChange={handleInputChange("logoDarkUrl")}
                  helperText="URL for your logo image (dark theme)"
                />
                <TextField
                  fullWidth
                  label="Favicon URL"
                  value={(formData.faviconUrl ?? currentData.faviconUrl) ?? ""}
                  onChange={handleInputChange("faviconUrl")}
                  helperText="URL for your favicon"
                />
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Hero Banner URL"
                  value={(formData.heroBannerUrl ?? currentData.heroBannerUrl) ?? ""}
                  onChange={handleInputChange("heroBannerUrl")}
                  helperText="URL for your homepage hero banner image"
                />
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Support Email"
                  value={(formData.supportEmail ?? currentData.supportEmail) ?? ""}
                  onChange={handleInputChange("supportEmail")}
                  helperText="Customer support email address"
                />
                <TextField
                  fullWidth
                  label="Support Phone"
                  value={(formData.supportPhone ?? currentData.supportPhone) ?? ""}
                  onChange={handleInputChange("supportPhone")}
                  helperText="Customer support phone number"
                />
                <TextField
                  fullWidth
                  label="WhatsApp"
                  value={(formData.whatsapp ?? currentData.whatsapp) ?? ""}
                  onChange={handleInputChange("whatsapp")}
                  helperText="WhatsApp contact number"
                />
                <TextField
                  fullWidth
                  label="Physical Address"
                  value={(formData.physicalAddress ?? currentData.physicalAddress) ?? ""}
                  onChange={handleInputChange("physicalAddress")}
                  helperText="Your business physical address"
                  multiline
                  rows={3}
                />
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Facebook"
                  value={(formData.facebook ?? currentData.facebook) ?? ""}
                  onChange={handleInputChange("facebook")}
                  helperText="Facebook page URL"
                />
                <TextField
                  fullWidth
                  label="Instagram"
                  value={(formData.instagram ?? currentData.instagram) ?? ""}
                  onChange={handleInputChange("instagram")}
                  helperText="Instagram profile URL"
                />
                <TextField
                  fullWidth
                  label="TikTok"
                  value={(formData.tiktok ?? currentData.tiktok) ?? ""}
                  onChange={handleInputChange("tiktok")}
                  helperText="TikTok profile URL"
                />
                <TextField
                  fullWidth
                  label="X (Twitter)"
                  value={(formData.x ?? currentData.x) ?? ""}
                  onChange={handleInputChange("x")}
                  helperText="X (Twitter) profile URL"
                />
                <TextField
                  fullWidth
                  label="LinkedIn"
                  value={(formData.linkedin ?? currentData.linkedin) ?? ""}
                  onChange={handleInputChange("linkedin")}
                  helperText="LinkedIn company page URL"
                />
                <TextField
                  fullWidth
                  label="YouTube"
                  value={(formData.youtube ?? currentData.youtube) ?? ""}
                  onChange={handleInputChange("youtube")}
                  helperText="YouTube channel URL"
                />
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={5}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Currency"
                  value={formData.currency ?? currentData.currency}
                  onChange={handleInputChange("currency")}
                  helperText="3-letter currency code (e.g., KES, USD)"
                  inputProps={{ maxLength: 3 }}
                />
                <TextField
                  fullWidth
                  label="Default Shipping Fee"
                  value={formData.defaultShippingFee ?? currentData.defaultShippingFee}
                  onChange={handleNumberChange("defaultShippingFee")}
                  helperText="Default shipping fee amount"
                  type="number"
                  InputProps={{ startAdornment: currentData.currency }}
                />
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={6}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="About Us"
                  value={(formData.aboutUs ?? currentData.aboutUs) ?? ""}
                  onChange={handleInputChange("aboutUs")}
                  helperText="Company description and about section"
                  multiline
                  rows={6}
                />
                <TextField
                  fullWidth
                  label="Privacy Policy"
                  value={(formData.privacyPolicy ?? currentData.privacyPolicy) ?? ""}
                  onChange={handleInputChange("privacyPolicy")}
                  helperText="Your privacy policy content"
                  multiline
                  rows={8}
                />
                <TextField
                  fullWidth
                  label="Terms of Service"
                  value={(formData.termsOfService ?? currentData.termsOfService) ?? ""}
                  onChange={handleInputChange("termsOfService")}
                  helperText="Your terms of service content"
                  multiline
                  rows={8}
                />
                <TextField
                  fullWidth
                  label="Refund Policy"
                  value={(formData.refundPolicy ?? currentData.refundPolicy) ?? ""}
                  onChange={handleInputChange("refundPolicy")}
                  helperText="Your refund policy content"
                  multiline
                  rows={6}
                />
                <TextField
                  fullWidth
                  label="Shipping Policy"
                  value={(formData.shippingPolicy ?? currentData.shippingPolicy) ?? ""}
                  onChange={handleInputChange("shippingPolicy")}
                  helperText="Your shipping policy content"
                  multiline
                  rows={6}
                />
              </Stack>
            </TabPanel>

            <Divider />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={updateSettings.isPending}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={updateSettings.isPending}
                startIcon={updateSettings.isPending ? <CircularProgress size={20} /> : null}
              >
                {updateSettings.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
}
