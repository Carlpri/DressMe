import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Rating,
  IconButton,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const getAuthHeader = () => {
    const token = localStorage.getItem("dressme_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: products = [], isLoading } = useQuery<any[]>({
    queryKey: ["admin-products-with-reviews"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/products?limit=100`, { headers: getAuthHeader() });
      return res.data.data.items;
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`, { headers: getAuthHeader() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products-with-reviews"] });
      setSnackbarMessage("Review deleted successfully.");
    },
  });

  // Collect all reviews across products
  const allReviews: any[] = [];
  products.forEach((prod) => {
    if (prod.reviews) {
      prod.reviews.forEach((r: any) => {
        allReviews.push({ ...r, productName: prod.name });
      });
    }
  });

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Reviews Moderation
        </Typography>
        <Typography color="text.secondary">
          Monitor customer reviews and remove inappropriate comments.
        </Typography>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : allReviews.length === 0 ? (
        <Paper variant="outlined" sx={{ py: 8, textAlign: "center" }}>
          <Typography color="text.secondary">No product reviews submitted yet.</Typography>
        </Paper>
      ) : (
        <Paper variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allReviews.map((rev) => (
                <TableRow key={rev.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{rev.productName}</TableCell>
                  <TableCell>
                    <Rating value={rev.rating} precision={0.5} readOnly size="small" />
                  </TableCell>
                  <TableCell>{rev.comment || "No comment"}</TableCell>
                  <TableCell>{rev.user?.name || "Customer"}</TableCell>
                  <TableCell>{new Date(rev.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error" onClick={() => deleteReviewMutation.mutate(rev.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

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
