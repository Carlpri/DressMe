import { useState } from "react";
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  CircularProgress,
  Tooltip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CollectionsIcon from "@mui/icons-material/Collections";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { MediaPickerModal } from "../../components/admin/MediaPickerModal";
import { ImageUploader } from "../../components/admin/ImageUploader";
import { KENYA_COUNTY_NAMES, getTownsForCounty } from "../../constants/kenya";

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Move focus away from whatever triggered the dialog open/close so that MUI's
 *  aria-hidden management on #root never conflicts with a focused descendant. */
function blurActive() {
  (document.activeElement as HTMLElement | null)?.blur();
}

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const res = (err as any).response?.data;
    const first = res?.errors?.[0]?.message;
    return first ?? res?.message ?? "Something went wrong.";
  }
  return "Something went wrong.";
}

// ─── component ───────────────────────────────────────────────────────────────

export function AdminVendorsPage() {
  const queryClient = useQueryClient();

  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any | null>(null);

  // form fields
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [address, setAddress] = useState("");
  const [county, setCounty] = useState("");
  const [town, setTown] = useState("");
  const [location, setLocation] = useState(""); // kept for edit pre-fill when county/town unknown
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [coverImage, setCoverImage] = useState("");

  // local validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // error banner inside dialog
  const [saveError, setSaveError] = useState<string | null>(null);

  // media picker
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"logo" | "cover">("logo");

  // ── queries ──────────────────────────────────────────────────────────────

  const { data: vendors = [], isLoading } = useQuery<any[]>({
    queryKey: ["admin-vendors-list"],
    queryFn: async () => {
      const res = await apiClient.get("/vendors");
      return res.data.data;
    },
  });

  // ── mutation ─────────────────────────────────────────────────────────────

  const saveVendorMutation = useMutation({
    mutationFn: async (payload: Record<string, string>) => {
      if (editingVendor) {
        const res = await apiClient.patch(`/vendors/${editingVendor.id}`, payload);
        return res.data.data;
      }
      const res = await apiClient.post("/vendors", payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendors-list"] });
      handleCloseDialog();
    },
    onError: (err) => {
      setSaveError(getErrorMessage(err));
    },
  });

  // ── form helpers ─────────────────────────────────────────────────────────

  const resetForm = () => {
    setBusinessName("");
    setBusinessEmail("");
    setWhatsappNumber("");
    setAddress("");
    setCounty("");
    setTown("");
    setLocation("");
    setWebsite("");
    setDescription("");
    setLogo("");
    setCoverImage("");
    setFieldErrors({});
    setSaveError(null);
  };

  /** Validate required backend fields locally before firing the mutation. */
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!businessName.trim() || businessName.trim().length < 3)
      errs.businessName = "Business name must be at least 3 characters.";
    if (!whatsappNumber.trim() || whatsappNumber.trim().length < 10)
      errs.whatsappNumber = "WhatsApp number must be at least 10 digits.";
    if (!address.trim() || address.trim().length < 5)
      errs.address = "Address must be at least 5 characters.";
    if (!county)
      errs.county = "Please select a county.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── handlers ─────────────────────────────────────────────────────────────

  /** Blur the trigger BEFORE the dialog opens so #root never becomes aria-hidden
   *  while a button inside it still holds focus. */
  const handleOpenCreate = () => {
    blurActive();
    setEditingVendor(null);
    resetForm();
    setDialogOpen(true);
  };

  const handleOpenEdit = (vendor: any) => {
    blurActive();
    setEditingVendor(vendor);
    setBusinessName(vendor.businessName || "");
    setBusinessEmail(vendor.businessEmail || "");
    setWhatsappNumber(vendor.whatsappNumber || "");
    setAddress(vendor.address || "");
    setCounty(vendor.county || "");
    setTown(vendor.town || "");
    setLocation(vendor.location || ""); // fallback for legacy vendors
    setWebsite(vendor.website || "");
    setDescription(vendor.description || "");
    setLogo(vendor.logo || "");
    setCoverImage(vendor.coverImage || "");
    setFieldErrors({});
    setSaveError(null);
    setDialogOpen(true);
  };

  /** Blur the focused element inside the dialog BEFORE it closes to avoid the
   *  same aria-hidden warning on the dialog-portal side. */
  const handleCloseDialog = () => {
    blurActive();
    setDialogOpen(false);
    setEditingVendor(null);
  };

  const handleSave = () => {
    setSaveError(null);
    if (!validate()) return;

    // Build location string from county + town selects
    const resolvedLocation = [town, county].filter(Boolean).join(", ") || location.trim();

    const payload: Record<string, string> = {
      businessName: businessName.trim(),
      whatsappNumber: whatsappNumber.trim(),
      address: address.trim(),
      location: resolvedLocation,
    };

    if (county) payload.county = county;
    if (town) payload.town = town;
    if (logo) payload.logo = logo;
    if (coverImage) payload.coverImage = coverImage;
    if (website) payload.website = website.trim();
    if (description) payload.description = description.trim();
    if (businessEmail) payload.businessEmail = businessEmail.trim();

    saveVendorMutation.mutate(payload);
  };

  const openMediaPicker = (target: "logo" | "cover") => {
    setMediaTarget(target);
    setMediaPickerOpen(true);
  };

  const handleMediaSelect = (url: string) => {
    if (mediaTarget === "logo") setLogo(url);
    else setCoverImage(url);
    setMediaPickerOpen(false);
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <Stack spacing={4}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Vendors Management
          </Typography>
          <Typography color="text.secondary">
            Review vendor profiles, branding, and storefront media.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Add Vendor
        </Button>
      </Box>

      {/* Table */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : vendors.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: "center" }}>
          <Typography color="text.secondary">No vendors yet. Click "Add Vendor" to create one.</Typography>
        </Paper>
      ) : (
        <Paper variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Website</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: "action.hover",
                          overflow: "hidden",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {vendor.logo ? (
                          <Box
                            component="img"
                            src={vendor.logo}
                            alt={vendor.businessName}
                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.disabled">
                            {(vendor.businessName ?? "V")[0].toUpperCase()}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {vendor.businessName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {vendor.user?.name || "—"}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{vendor.user?.name || "—"}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {vendor.user?.email || "No email"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{vendor.businessEmail || "—"}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {vendor.whatsappNumber || "No phone"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{vendor.location || "—"}</Typography>
                  </TableCell>
                  <TableCell>{vendor.website || "—"}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenEdit(vendor)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ── Add / Edit Dialog ─────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingVendor ? "Edit Vendor" : "Add Vendor"}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {/* API error banner */}
            {saveError && (
              <Alert severity="error" onClose={() => setSaveError(null)}>
                {saveError}
              </Alert>
            )}

            {/* ── Required fields ── */}
            <TextField
              label="Business Name *"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              fullWidth
              autoFocus
              error={Boolean(fieldErrors.businessName)}
              helperText={fieldErrors.businessName}
            />
            <TextField
              label="WhatsApp Number *"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              fullWidth
              error={Boolean(fieldErrors.whatsappNumber)}
              helperText={fieldErrors.whatsappNumber || "Min 10 digits — used as primary contact"}
            />
            <TextField
              label="Address *"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              multiline
              rows={2}
              error={Boolean(fieldErrors.address)}
              helperText={fieldErrors.address}
            />
            <FormControl fullWidth required error={Boolean(fieldErrors.county)}>
              <InputLabel id="vendor-county-label">County *</InputLabel>
              <Select
                labelId="vendor-county-label"
                label="County *"
                value={county}
                onChange={(e) => { setCounty(e.target.value); setTown(""); }}
              >
                {KENYA_COUNTY_NAMES.map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
              {fieldErrors.county && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {fieldErrors.county}
                </Typography>
              )}
            </FormControl>
            <FormControl fullWidth disabled={!county}>
              <InputLabel id="vendor-town-label">Town / Area</InputLabel>
              <Select
                labelId="vendor-town-label"
                label="Town / Area"
                value={town}
                onChange={(e) => setTown(e.target.value)}
              >
                {getTownsForCounty(county).map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* ── Optional fields ── */}
            <TextField
              label="Business Email"
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />

            {/* ── Branding media ── */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Vendor Branding
              </Typography>
              <Stack spacing={3}>
                {/* Logo */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">Logo</Typography>
                    <Tooltip title="Pick from Media Library">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<CollectionsIcon />}
                        onClick={() => openMediaPicker("logo")}
                      >
                        Media Library
                      </Button>
                    </Tooltip>
                  </Stack>
                  <ImageUploader
                    label="Vendor Logo"
                    value={logo}
                    onChange={setLogo}
                    folder="vendors/logos"
                    previewHeight={140}
                    persistToMediaLibrary
                    mediaLibraryFolder="vendors"
                    mediaFilename={businessName || "vendor-logo"}
                  />
                </Box>

                {/* Cover image */}
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">Cover Image</Typography>
                    <Tooltip title="Pick from Media Library">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<CollectionsIcon />}
                        onClick={() => openMediaPicker("cover")}
                      >
                        Media Library
                      </Button>
                    </Tooltip>
                  </Stack>
                  <ImageUploader
                    label="Vendor Cover Image"
                    value={coverImage}
                    onChange={setCoverImage}
                    folder="vendors/covers"
                    previewHeight={180}
                    persistToMediaLibrary
                    mediaLibraryFolder="vendors"
                    mediaFilename={businessName ? `${businessName}-cover` : "vendor-cover"}
                  />
                </Box>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={saveVendorMutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saveVendorMutation.isPending}
          >
            {saveVendorMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : editingVendor ? (
              "Save Changes"
            ) : (
              "Add Vendor"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Media Picker (shared) ─────────────────────────────────────────── */}
      <MediaPickerModal
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        title={mediaTarget === "logo" ? "Select Vendor Logo" : "Select Vendor Cover Image"}
      />
    </Stack>
  );
}
