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
import { ImageUploader } from "../../components/admin/ImageUploader";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem("dressme_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: categories = [], isLoading } = useQuery<any[]>({
    queryKey: ["admin-categories-list"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      return res.data.data;
    },
  });

  const saveCategoryMutation = useMutation({
    mutationFn: async (payload: { name: string; slug: string; image?: string }) => {
      if (editingCategory) {
        const res = await axios.patch(`${API_BASE_URL}/categories/${editingCategory.id}`, payload, {
          headers: getAuthHeader(),
        });
        return res.data.data;
      } else {
        const res = await axios.post(`${API_BASE_URL}/categories`, payload, {
          headers: getAuthHeader(),
        });
        return res.data.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories-list"] });
      handleCloseDialog();
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_BASE_URL}/categories/${id}`, { headers: getAuthHeader() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories-list"] });
    },
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setImageUrl("");
    setDialogOpen(true);
  };

  const handleOpenEdit = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setImageUrl(cat.image || "");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  return (
    <Stack spacing={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Categories Management
          </Typography>
          <Typography color="text.secondary">
            Organize fashion catalog categories and associated media banners.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Add Category
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
                <TableCell>Category</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id} hover>
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
                        {cat.image ? (
                          <Box
                            component="img"
                            src={cat.image}
                            alt={cat.name}
                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : null}
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {cat.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontFamily: "monospace" }}>{cat.slug}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenEdit(cat)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteCategoryMutation.mutate(cat.id)}>
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
        <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
              label="Category Name"
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
            <Box>
              <ImageUploader
                label="Category Image (Cloudinary Direct Upload)"
                value={imageUrl}
                onChange={setImageUrl}
                folder="categories"
                previewHeight={160}
              />
              <Button
                variant="text"
                size="small"
                startIcon={<CollectionsIcon />}
                onClick={() => setMediaPickerOpen(true)}
                sx={{ mt: 1 }}
              >
                Or choose from Media Library
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => saveCategoryMutation.mutate({ name, slug, image: imageUrl || undefined })}
            disabled={!name || !slug || saveCategoryMutation.isPending}
          >
            Save Category
          </Button>
        </DialogActions>
      </Dialog>

      <MediaPickerModal
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => setImageUrl(url)}
        title="Select Category Image"
      />
    </Stack>
  );
}
