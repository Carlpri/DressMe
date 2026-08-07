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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CollectionsIcon from "@mui/icons-material/Collections";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { MediaPickerModal } from "../../components/admin/MediaPickerModal";
import { ImageUploader } from "../../components/admin/ImageUploader";

export function AdminVendorsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"logo" | "cover">("logo");

  const { data: vendors = [], isLoading } = useQuery<any[]>({
    queryKey: ["admin-vendors-list"],
    queryFn: async () => {
      const res = await apiClient.get("/vendors");
      return res.data.data;
    },
  });

  const saveVendorMutation = useMutation({
    mutationFn: async (payload: any) => {
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
  });

  const handleOpenCreate = () => {
    setEditingVendor(null);
    setBusinessName("");
    setBusinessEmail("");
    setWhatsappNumber("");
    setAddress("");
    setLocation("");
    setWebsite("");
    setDescription("");
    setLogo("");
    setCoverImage("");
    setDialogOpen(true);
  };

  const handleOpenEdit = (vendor: any) => {
    setEditingVendor(vendor);
    setBusinessName(vendor.businessName || "");
    setBusinessEmail(vendor.businessEmail || "");
    setWhatsappNumber(vendor.whatsappNumber || "");
    setAddress(vendor.address || "");
    setLocation(vendor.location || "");
    setWebsite(vendor.website || "");
    setDescription(vendor.description || "");
    setLogo(vendor.logo || "");
    setCoverImage(vendor.coverImage || "");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingVendor(null);
  };

  const handleSave = () => {
    const payload: Record<string, string> = {
      businessName,
      address,
    };

    if (whatsappNumber) payload.whatsappNumber = whatsappNumber;
    if (location) payload.location = location;
    if (logo) payload.logo = logo;
    if (coverImage) payload.coverImage = coverImage;
    if (website) payload.website = website;
    if (description) payload.description = description;
    if (businessEmail) payload.businessEmail = businessEmail;

    saveVendorMutation.mutate(payload);
  };

  return (
    <Stack spacing={4}>
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

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vendor</TableCell>
                <TableCell>Contact</TableCell>
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
                          bgcolor: "#F8FAFC",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        {vendor.logo ? (
                          <Box component="img" src={vendor.logo} alt={vendor.businessName} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : null}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {vendor.businessName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {vendor.user?.name || "Vendor"}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{vendor.businessEmail || "N/A"}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {vendor.whatsappNumber || "No phone"}
                    </Typography>
                  </TableCell>
                  <TableCell>{vendor.website || "N/A"}</TableCell>
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingVendor ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField label="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} fullWidth required />
            <TextField label="Business Email" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} fullWidth />
            <TextField label="WhatsApp Number" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} fullWidth />
            <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth multiline rows={2} />
            <TextField label="Location" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth />
            <TextField label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} fullWidth />
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={3} />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Vendor Branding
              </Typography>
              <Stack spacing={2}>
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
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!businessName || saveVendorMutation.isPending}>
            Save Vendor
          </Button>
        </DialogActions>
      </Dialog>

      <MediaPickerModal
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          if (mediaTarget === "logo") {
            setLogo(url);
          } else {
            setCoverImage(url);
          }
        }}
        title={mediaTarget === "logo" ? "Select Vendor Logo" : "Select Vendor Cover"}
      />
    </Stack>
  );
}
