import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function AdminMediaPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [filename, setFilename] = useState("");
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const getAuthHeader = () => {
    const token = localStorage.getItem("dressme_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: mediaItems = [], isLoading } = useQuery<any[]>({
    queryKey: ["admin-media", search],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/media`, {
        headers: getAuthHeader(),
        params: { search: search || undefined },
      });
      return res.data.data;
    },
  });

  const createMediaMutation = useMutation({
    mutationFn: async (payload: { filename: string; url: string; altText?: string }) => {
      const res = await axios.post(`${API_BASE_URL}/media`, payload, {
        headers: getAuthHeader(),
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      setAddDialogOpen(false);
      setFilename("");
      setUrl("");
      setAltText("");
      setSnackbarMessage("Media added successfully!");
    },
  });

  const deleteMediaMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_BASE_URL}/media/${id}`, {
        headers: getAuthHeader(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      setSnackbarMessage("Media deleted successfully!");
    },
  });

  const handleCopyUrl = (itemUrl: string) => {
    navigator.clipboard.writeText(itemUrl);
    setSnackbarMessage("Image URL copied to clipboard!");
  };

  const handleCreateMedia = () => {
    if (filename && url) {
      createMediaMutation.mutate({ filename, url, altText: altText || undefined });
    }
  };

  return (
    <Stack spacing={4}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Media Library
          </Typography>
          <Typography color="text.secondary">
            Manage all product images, brand logos, hero banners, and media assets in one central library.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Media Asset
        </Button>
      </Box>

      {/* Search Toolbar */}
      <TextField
        placeholder="Search media by title or URL..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {/* Media Grid */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : mediaItems.length === 0 ? (
        <Card variant="outlined" sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No media assets found.
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Add images or image URLs to use across Products, Categories, Brands, and AppSettings.
          </Typography>
          <Button variant="contained" onClick={() => setAddDialogOpen(true)}>
            Add First Asset
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {mediaItems.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
              <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Box
                  sx={{
                    position: "relative",
                    pt: "75%",
                    bgcolor: "#F8FAFC",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.url}
                    alt={item.filename}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                    {item.filename}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ wordBreak: "break-all", display: "block", mt: 0.5 }}>
                    {item.url}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: "space-between" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => handleCopyUrl(item.url)}
                  >
                    Copy URL
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deleteMediaMutation.mutate(item.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Media Modal */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Media Asset</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
              label="Title / Filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="e.g. Slim Blazer Front View"
              fullWidth
              required
            />
            <TextField
              label="Direct Image URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              fullWidth
              required
            />
            <TextField
              label="Alt Text (Optional)"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descriptive text for accessibility"
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateMedia}
            disabled={!filename || !url || createMediaMutation.isPending}
          >
            Add Asset
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackbarMessage("")}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
