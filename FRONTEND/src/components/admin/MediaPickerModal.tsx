import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import LinkIcon from "@mui/icons-material/Link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  altText?: string;
  folder?: string;
  mimeType?: string;
  size?: number;
  createdAt: string;
}

interface MediaPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  title?: string;
}

export function MediaPickerModal({
  open,
  onClose,
  onSelect,
  title = "Select Image from Media Library",
}: MediaPickerModalProps) {
  const queryClient = useQueryClient();
  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedUrl, setSelectedUrl] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [filename, setFilename] = useState("");

  const getAuthHeader = () => {
    const token = localStorage.getItem("dressme_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: mediaItems = [], isLoading } = useQuery<MediaItem[]>({
    queryKey: ["admin-media-picker", search],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/media`, {
        headers: getAuthHeader(),
        params: { search: search || undefined },
      });
      return response.data.data;
    },
    enabled: open,
  });

  const createMediaMutation = useMutation({
    mutationFn: async (payload: { filename: string; url: string }) => {
      const response = await axios.post(`${API_BASE_URL}/media`, payload, {
        headers: getAuthHeader(),
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-media-picker"] });
      onSelect(data.url);
      onClose();
    },
  });

  const handleConfirmSelection = () => {
    if (tabIndex === 0 && selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    } else if (tabIndex === 1 && customUrl) {
      const name = filename.trim() || `image_${Date.now()}`;
      createMediaMutation.mutate({ filename: name, url: customUrl });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)}>
            <Tab label="Media Gallery" icon={<AddPhotoAlternateIcon />} iconPosition="start" />
            <Tab label="Add External URL" icon={<LinkIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {tabIndex === 0 && (
          <Stack spacing={2}>
            <TextField
              size="small"
              placeholder="Search media by filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {isLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : mediaItems.length === 0 ? (
              <Box py={4} textAlign="center">
                <Typography color="text.secondary">No images in Media Library yet.</Typography>
              </Box>
            ) : (
              <Grid container spacing={2} sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}>
                {mediaItems.map((item) => {
                  const isSelected = selectedUrl === item.url;
                  return (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={item.id}>
                      <Box
                        onClick={() => setSelectedUrl(item.url)}
                        sx={{
                          position: "relative",
                          pt: "100%",
                          borderRadius: 2,
                          overflow: "hidden",
                          cursor: "pointer",
                          border: isSelected ? "3px solid" : "1px solid",
                          borderColor: isSelected ? "primary.main" : "divider",
                          bgcolor: "#F8FAFC",
                          "&:hover": { borderColor: "primary.main" },
                        }}
                      >
                        <Box
                          component="img"
                          src={item.url}
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
                        {isSelected && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 6,
                              right: 6,
                              bgcolor: "primary.main",
                              color: "white",
                              borderRadius: "50%",
                              display: "flex",
                            }}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </Box>
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{ display: "block", mt: 0.5, textAlign: "center" }}
                      >
                        {item.filename}
                      </Typography>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Stack>
        )}

        {tabIndex === 1 && (
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              label="Image Title / Filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="e.g. Hero Banner Red Blazer"
              fullWidth
            />
            <TextField
              label="Direct Image URL"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              fullWidth
            />
            {customUrl && (
              <Box
                sx={{
                  maxHeight: 200,
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "#F8FAFC",
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="img"
                  src={customUrl}
                  alt="Preview"
                  sx={{ maxHeight: 200, maxWidth: "100%", objectFit: "contain" }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleConfirmSelection}
          disabled={
            (tabIndex === 0 && !selectedUrl) ||
            (tabIndex === 1 && !customUrl) ||
            createMediaMutation.isPending
          }
        >
          Select Image
        </Button>
      </DialogActions>
    </Dialog>
  );
}
