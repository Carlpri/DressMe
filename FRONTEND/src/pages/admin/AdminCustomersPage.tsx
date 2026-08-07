import {
  Box,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { useState } from "react";

import { KENYA_COUNTY_NAMES, getTownsForCounty } from "../../constants/kenya";

export function AdminCustomersPage() {
  const { data: users = [], isLoading } = useQuery<any[]>({
    queryKey: ["admin-users-list"],
    queryFn: async () => {
      const res = await apiClient.get("/users");
      return res.data.data;
    },
  });

  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [vendorData, setVendorData] = useState({
    businessName: "",
    countryCode: "+254",
    whatsappNumber: "",
    county: "",
    city: "",
    address: "",
    description: "",
  });

  const queryClient = useQueryClient();
  const promoteMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post("/users/promote-to-vendor", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users-list"] });
      setPromoteDialogOpen(false);
      setSelectedUser(null);
      setVendorData({
        businessName: "",
        countryCode: "+254",
        whatsappNumber: "",
        county: "",
        city: "",
        address: "",
        description: "",
      });
    },
  });

  const handlePromoteToVendor = (user: any) => {
    setSelectedUser(user);
    setPromoteDialogOpen(true);
  };

  const handlePromoteSubmit = () => {
    if (!selectedUser) return;
    const fullPhoneNumber = `${vendorData.countryCode}${vendorData.whatsappNumber}`;
    const location = [vendorData.city, vendorData.county].filter(Boolean).join(", ");
    promoteMutation.mutate({
      userId: selectedUser.id,
      businessName: vendorData.businessName,
      whatsappNumber: fullPhoneNumber,
      address: vendorData.address,
      location,
      description: vendorData.description,
    });
  };

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Customers & Users Management
        </Typography>
        <Typography color="text.secondary">
          View registered customer accounts, roles, orders count, and account status. Promote users to vendor role.
        </Typography>
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
                <TableCell>Customer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Orders Placed</TableCell>
                <TableCell>Addresses Saved</TableCell>
                <TableCell>Account Status</TableCell>
                <TableCell>Joined Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.role}
                      size="small"
                      color={u.role === "ADMIN" ? "primary" : u.role === "VENDOR" ? "secondary" : "default"}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{u._count?.orders ?? 0}</TableCell>
                  <TableCell>{u._count?.addresses ?? 0}</TableCell>
                  <TableCell>
                    <Chip label={u.status} size="small" color={u.status === "ACTIVE" ? "success" : "error"} />
                  </TableCell>
                  <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {u.role !== "VENDOR" && u.role !== "ADMIN" && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handlePromoteToVendor(u)}
                      >
                        Promote to Vendor
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={promoteDialogOpen} onClose={() => setPromoteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Promote {selectedUser?.name} to Vendor</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Business Name"
              fullWidth
              value={vendorData.businessName}
              onChange={(e) => setVendorData({ ...vendorData, businessName: e.target.value })}
              required
            />
            <FormControl fullWidth required>
              <InputLabel>County</InputLabel>
              <Select
                label="County"
                value={vendorData.county}
                onChange={(e) => setVendorData({ ...vendorData, county: e.target.value, city: "" })}
              >
                {KENYA_COUNTY_NAMES.map((county) => (
                  <MenuItem key={county} value={county}>{county}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required disabled={!vendorData.county}>
              <InputLabel>City / Town</InputLabel>
              <Select
                label="City / Town"
                value={vendorData.city}
                onChange={(e) => setVendorData({ ...vendorData, city: e.target.value })}
              >
                {getTownsForCounty(vendorData.county).map((city) => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={1}>
              <TextField
                label="Country Code"
                value={vendorData.countryCode}
                disabled
                sx={{ width: 100 }}
              />
              <TextField
                label="WhatsApp Number"
                fullWidth
                value={vendorData.whatsappNumber}
                onChange={(e) => setVendorData({ ...vendorData, whatsappNumber: e.target.value })}
                placeholder="7XX XXX XXX"
                required
              />
            </Stack>
            <TextField
              label="Street Address"
              fullWidth
              value={vendorData.address}
              onChange={(e) => setVendorData({ ...vendorData, address: e.target.value })}
              placeholder="Building name, street, estate"
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={vendorData.description}
              onChange={(e) => setVendorData({ ...vendorData, description: e.target.value })}
              placeholder="Tell us about your business..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPromoteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handlePromoteSubmit}
            disabled={promoteMutation.isPending}
          >
            {promoteMutation.isPending ? "Promoting..." : "Promote"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
