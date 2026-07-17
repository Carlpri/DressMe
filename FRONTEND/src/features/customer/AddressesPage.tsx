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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "../../hooks/useAddresses";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import type { Address, AddressInput } from "../../hooks/useAddresses";

const emptyForm: AddressInput = {
  fullName: "",
  phone: "",
  county: "",
  city: "",
  area: "",
  street: "",
  building: "",
  postalCode: "",
  landmark: "",
  label: "Home",
  isDefault: false,
};

function formatAddress(address: Address) {
  const parts = [
    address.fullName,
    address.street,
    address.area,
    address.city,
    address.county,
    address.phone,
  ].filter(Boolean);
  return parts.join(" · ");
}

export function AddressesPage() {
  const { data: addresses, isLoading, error, refetch } = useAddresses();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressInput>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenDialog = (address?: Address) => {
    setFormError(null);
    if (address) {
      setEditingAddress(address);
      setFormData({
        fullName: address.fullName,
        phone: address.phone,
        county: address.county,
        city: address.city,
        area: address.area,
        street: address.street,
        building: address.building || "",
        postalCode: address.postalCode || "",
        landmark: address.landmark || "",
        label: address.label || "Home",
        isDefault: address.isDefault,
      });
    } else {
      setEditingAddress(null);
      setFormData(emptyForm);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAddress(null);
    setFormError(null);
  };

  const handleSubmit = () => {
    setFormError(null);
    const onError = () => setFormError("Failed to save address. Check all required fields and phone format (+254...).");

    if (editingAddress) {
      updateAddress.mutate(
        { id: editingAddress.id, address: formData },
        {
          onSuccess: () => {
            handleCloseDialog();
            refetch();
          },
          onError,
        }
      );
    } else {
      addAddress.mutate(formData, {
        onSuccess: () => {
          handleCloseDialog();
          refetch();
        },
        onError,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      deleteAddress.mutate(id, { onSuccess: () => refetch() });
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress.mutate(id, { onSuccess: () => refetch() });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={6}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h3" sx={{ fontWeight: 700 }}>My Addresses</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Add Address
          </Button>
        </Stack>

        {isLoading ? (
          <Grid container spacing={3}>
            {[...Array(3)].map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <LoadingSkeleton height={200} />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
            Failed to load addresses
          </Alert>
        ) : !addresses || addresses.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              No addresses saved yet
            </Typography>
            <Button variant="contained" onClick={() => handleOpenDialog()}>
              Add Your First Address
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {addresses.map((address) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={address.id}>
                <Card
                  variant={address.isDefault ? "outlined" : "elevation"}
                  sx={{
                    height: "100%",
                    borderColor: address.isDefault ? "primary.main" : undefined,
                    borderWidth: address.isDefault ? 2 : 1,
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Chip
                          label={address.label || "Address"}
                          size="small"
                          color={address.isDefault ? "primary" : "default"}
                        />
                        {address.isDefault && (
                          <Chip
                            label="Default"
                            size="small"
                            color="primary"
                            icon={<StarIcon fontSize="small" />}
                          />
                        )}
                      </Stack>

                      <Typography variant="body2" color="text.secondary">
                        {formatAddress(address)}
                      </Typography>

                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => handleOpenDialog(address)}
                          fullWidth
                        >
                          Edit
                        </Button>
                        {!address.isDefault && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleSetDefault(address.id)}
                            disabled={setDefaultAddress.isPending}
                          >
                            Default
                          </Button>
                        )}
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(address.id)}
                          disabled={deleteAddress.isPending}
                          aria-label="Delete address"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField
              fullWidth
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0712345678 or +254712345678"
              required
            />
            <TextField
              fullWidth
              label="County"
              value={formData.county}
              onChange={(e) => setFormData({ ...formData, county: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Area / Estate"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Street Address"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Building / Apartment (optional)"
              value={formData.building}
              onChange={(e) => setFormData({ ...formData, building: e.target.value })}
            />
            <TextField
              fullWidth
              label="Landmark (optional)"
              value={formData.landmark}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
            />
            <TextField
              fullWidth
              label="Postal Code (optional)"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            />
            <TextField
              fullWidth
              label="Label (e.g., Home, Work)"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={addAddress.isPending || updateAddress.isPending}
          >
            {editingAddress ? "Update" : "Add"} Address
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
