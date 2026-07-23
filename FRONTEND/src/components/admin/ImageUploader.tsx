import { useState, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
  Alert,
  TextField,
  Chip,
  Tooltip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import { uploadToCloudinary } from "../../services/cloudinary";

export interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  label?: string;
  folder?: string;
  previewHeight?: number | string;
  disabled?: boolean;
  helperText?: string;
  errorText?: string;
}

export function ImageUploader({
  value,
  onChange,
  onUploadingChange,
  label = "Upload Image",
  folder = "products",
  previewHeight = 200,
  disabled = false,
  helperText,
  errorText,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(errorText || null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setUploadingStatus = (uploading: boolean) => {
    setIsUploading(uploading);
    if (onUploadingChange) {
      onUploadingChange(uploading);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    await startUpload(file);

    // Reset file input so the same file can be re-selected if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP, etc.).");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image file size exceeds 10MB limit.");
      return;
    }

    setError(null);
    setUploadingStatus(true);
    setUploadProgress(0);

    try {
      const result = await uploadToCloudinary(file, {
        folder,
        onProgress: (progress) => {
          setUploadProgress(progress);
        },
      });

      onChange(result.secure_url);
    } catch (err: any) {
      setError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadingStatus(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await startUpload(files[0]);
    }
  };

  const handleClear = () => {
    onChange("");
    setError(null);
  };

  const handleApplyManualUrl = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setManualUrl("");
      setShowUrlInput(false);
      setError(null);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {label && (
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}>
          {label}
        </Typography>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        disabled={disabled || isUploading}
      />

      {/* Image Preview Card */}
      {value ? (
        <Card
          variant="outlined"
          sx={{
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            bgcolor: "#F8FAFC",
            border: "1.5px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              height: previewHeight,
              width: "100%",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#0F172A",
            }}
          >
            <CardMedia
              component="img"
              image={value}
              alt={label}
              sx={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
              }}
            />

            {/* Overlays / Badges */}
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: "16px !important" }} />}
              label={value.includes("cloudinary") ? "Cloudinary Uploaded" : "Active Image"}
              color="success"
              size="small"
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
                fontWeight: 600,
                bgcolor: "rgba(16, 185, 129, 0.9)",
                color: "white",
                backdropFilter: "blur(4px)",
              }}
            />

            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
              }}
            >
              <Tooltip title="Replace image">
                <IconButton
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled || isUploading}
                  sx={{
                    bgcolor: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    "&:hover": { bgcolor: "#F1F5F9" },
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Remove image">
                <IconButton
                  size="small"
                  onClick={handleClear}
                  disabled={disabled || isUploading}
                  sx={{
                    bgcolor: "#FEE2E2",
                    color: "#DC2626",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    "&:hover": { bgcolor: "#FCA5A5" },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          <Box sx={{ p: 1.5, bgcolor: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>
              {value}
            </Typography>
            <Button
              size="small"
              variant="text"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
            >
              Change
            </Button>
          </Box>
        </Card>
      ) : (
        /* Upload Dropzone */
        <Box
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => {
            if (!disabled && !isUploading && !showUrlInput) {
              fileInputRef.current?.click();
            }
          }}
          sx={{
            p: 3,
            border: "2px dashed",
            borderColor: isUploading ? "primary.main" : error ? "error.main" : "divider",
            borderRadius: 3,
            bgcolor: isUploading ? "#F0F9FF" : "#F8FAFC",
            textAlign: "center",
            cursor: disabled || isUploading ? "default" : "pointer",
            transition: "all 0.2s ease-in-out",
            "&:hover": disabled || isUploading ? {} : {
              borderColor: "primary.main",
              bgcolor: "#F0F9FF",
            },
          }}
        >
          {isUploading ? (
            <Stack spacing={2} alignItems="center">
              <CircularProgress size={40} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>
                Uploading to Cloudinary... ({uploadProgress}%)
              </Typography>
              <Box sx={{ width: "80%", maxWidth: 300 }}>
                <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </Stack>
          ) : (
            <Stack spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  bgcolor: "#E0F2FE",
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 32 }} />
              </Box>

              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, color: "text.primary" }}>
                  Click or drag image to upload
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                  Supports PNG, JPG, WEBP, GIF up to 10MB
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} pt={1}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CloudUploadIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  disabled={disabled}
                >
                  Upload File
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LinkIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUrlInput(!showUrlInput);
                  }}
                  disabled={disabled}
                >
                  {showUrlInput ? "Cancel URL" : "Paste URL"}
                </Button>
              </Stack>
            </Stack>
          )}

          {/* Manual URL Input Option */}
          {showUrlInput && !isUploading && (
            <Box onClick={(e) => e.stopPropagation()} sx={{ mt: 2.5, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="https://res.cloudinary.com/... or image URL"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyManualUrl();
                    }
                  }}
                />
                <Button variant="contained" size="small" onClick={handleApplyManualUrl} disabled={!manualUrl.trim()}>
                  Apply
                </Button>
              </Stack>
            </Box>
          )}
        </Box>
      )}

      {/* Error display */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mt: 1.5 }}>
          {error}
        </Alert>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5, ml: 0.5 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
}
