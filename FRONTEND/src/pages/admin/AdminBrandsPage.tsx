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
import axios from "axios";
import { MediaPickerModal } from "../../components/admin/MediaPickerModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function AdminBrandsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem("dressme_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: brands = [], isLoading } = useQuery<any[]>({
    queryKey: ["admin-brands-list"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/brands`);
      return res.data.data;
    },
  });

  const saveBrandMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingBrand) {
        const res = await axios.patch(`${API_BASE_URL}/brands/${editingBrand.id}`, payload, {
          headers: getAuthHeader(),
        });
        return res.data.data;
      } else {
        const res = await axios.post(`${API_BASE_URL}/brands`, payload, {
          headers: getAuthHeader(),
        });
        return res.data.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brands-list"] });
      handleCloseDialog();
    },
  });

  const deleteBrandMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_BASE_URL}/brands/${id}`, { headers: getAuthHeader() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-brands-list"] });
    },
  });

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setName("");
    setSlug("");
    setLogo("");
    setWebsite("");
    setDescription("");
    setDialogOpen(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingBrand(b);
    setName(b.name);
    setSlug(b.slug);
    setLogo(b.logo || "");
    setWebsite(b.website || "");
    setDescription(b.description || "");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBrand(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingBrand) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  return (
    <Stack spacing={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Brands Management
          </Typography>
          <Typography color="text.secondary">
            Manage fashion brand partners, logos, and descriptions.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Add Brand
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
                <TableCell>Brand</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Website</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {brands.map((b) => (
                <TableRow key={b.id} hover>
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
                        {b.logo ? (
                          <Box
                            component="img"
                            src={b.logo}
                            alt={b.name}
                            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        ) : null}
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {b.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontFamily: "monospace" }}>{b.slug}</TableCell>
                  <TableCell>{b.website || "N/A"}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenEdit(b)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteBrandMutation.mutate(b.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBrand ? "Edit Brand" : "Add Brand"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
              label="Brand Name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Website URL"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            <Box>
              <Button
                variant="outlined"
                startIcon={<CollectionsIcon />}
                onClick={() => setMediaPickerOpen(true)}
                sx={{ mb: 1 }}
              >
                Choose Brand Logo from Media Library
              </Button>
              <TextField
                label="Logo URL"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                fullWidth
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() =>
              saveBrandMutation.mutate({
                name,
                slug,
                logo: logo || undefined,
                website: website || undefined,
                description: description || undefined,
              })
            }
            disabled={!name || !slug || saveBrandMutation.isPending}
          >
            Save Brand
          </Button>
        </DialogActions>
      </Dialog>

      <MediaPickerModal
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setLogo(url)}
        title="Select Brand Logo"
      />
    </Stack>
  );
}
