import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckroomRoundedIcon from "@mui/icons-material/CheckroomRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import type { Outfit } from "../../hooks/useOutfits";

interface OutfitCardProps {
  outfit: Outfit;
  onDelete?: (id: string) => void;
}

export function OutfitCard({ outfit, onDelete }: OutfitCardProps) {
  const navigate = useNavigate();
  const coverImage = outfit.coverImage || outfit.items[0]?.product.images?.[0]?.imageUrl;
  const previewItems = outfit.items.slice(0, 4);

  return (
    <Card
      sx={{
        height: "100%",
        overflow: "hidden",
        borderRadius: 3,
        border: "1px solid rgba(15, 23, 42, 0.1)",
        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
        transition: "transform 280ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 280ms ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 44px rgba(15, 23, 42, 0.15)",
        },
      }}
    >
      <Box sx={{ position: "relative", bgcolor: "#F1F5F9" }}>
        <Box
          sx={{
            height: { xs: 230, sm: 270 },
            background: coverImage
              ? `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(15,23,42,0.18)), url(${coverImage}) center/cover`
              : "linear-gradient(135deg, #E2E8F0, #F8FAFC)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            left: 14,
            right: 14,
            bottom: 14,
            display: "flex",
            gap: 0.75,
          }}
        >
          {previewItems.map((item) => {
            const image = item.product.images?.find((entry) => entry.isPrimary) || item.product.images?.[0];
            return (
              <Box
                key={item.id}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1.5,
                  overflow: "hidden",
                  bgcolor: "rgba(255,255,255,0.92)",
                  border: "2px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.2)",
                }}
              >
                {image && (
                  <Box component="img" src={image.imageUrl} alt={item.product.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </Box>
            );
          })}
        </Box>
        <Chip
          icon={<CheckroomRoundedIcon sx={{ fontSize: "15px !important" }} />}
          label={`${outfit.items.length} pieces`}
          size="small"
          sx={{
            position: "absolute",
            top: 14,
            left: 14,
            bgcolor: "rgba(15,23,42,0.78)",
            color: "#FFFFFF",
            backdropFilter: "blur(8px)",
            fontWeight: 700,
          }}
        />
      </Box>

      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.15 }} noWrap>
              {outfit.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.65, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {outfit.description || `A ${outfit.style.toLowerCase()} look built from DressMe pieces.`}
            </Typography>
          </Box>
          {onDelete ? (
            <IconButton size="small" aria-label={`Delete ${outfit.title}`} onClick={() => onDelete(outfit.id)}>
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton size="small" aria-label={`View ${outfit.title}`} onClick={() => navigate(`/outfit-builder?outfit=${outfit.id}`)}>
              <ArrowForwardRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 1.75 }}>
          <Chip label={outfit.style} size="small" color="primary" variant="outlined" />
          {outfit.occasion && <Chip label={outfit.occasion} size="small" variant="outlined" />}
        </Stack>
      </CardContent>
    </Card>
  );
}
