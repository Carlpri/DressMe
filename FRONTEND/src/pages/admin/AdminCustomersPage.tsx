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
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function AdminCustomersPage() {
  const getAuthHeader = () => {
    const token = localStorage.getItem("dressme_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: users = [], isLoading } = useQuery<any[]>({
    queryKey: ["admin-users-list"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/users`, { headers: getAuthHeader() });
      return res.data.data;
    },
  });

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Customers & Users Management
        </Typography>
        <Typography color="text.secondary">
          View registered customer accounts, roles, orders count, and account status.
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Stack>
  );
}
