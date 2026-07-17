import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  Avatar,
  TextField,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import { Link as RouterLink } from "react-router-dom";

export function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleSave = () => {
    // TODO: Wire to PATCH /users/me when profile editing is implemented in Phase 1.
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={6}>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>My Profile</Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={3} alignItems="center">
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: "primary.main",
                      fontSize: "2.5rem",
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Stack spacing={1} textAlign="center">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {user?.name}
                    </Typography>
                    <Chip
                      label={user?.role}
                      size="small"
                      color={user?.role === "ADMIN" ? "error" : user?.role === "VENDOR" ? "warning" : "primary"}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2} width="100%">
                    <Button
                      component={RouterLink}
                      to={ROUTES.customerAddresses}
                      variant="outlined"
                      size="small"
                      fullWidth
                      startIcon={<LocationOnIcon />}
                    >
                      Addresses
                    </Button>
                    <Button
                      component={RouterLink}
                      to={ROUTES.customerOrders}
                      variant="outlined"
                      size="small"
                      fullWidth
                    >
                      Orders
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={4}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Account Details
                    </Typography>
                    {!isEditing && (
                      <IconButton onClick={() => setIsEditing(true)} aria-label="Edit profile">
                        <EditIcon />
                      </IconButton>
                    )}
                  </Stack>

                  {isEditing ? (
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        InputProps={{
                          startAdornment: <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />,
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Email"
                        value={formData.email}
                        disabled
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />,
                        }}
                      />
                      <Stack direction="row" spacing={2}>
                        <Button variant="contained" onClick={handleSave}>
                          Save Changes
                        </Button>
                        <Button variant="outlined" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </Stack>
                    </Stack>
                  ) : (
                    <Stack spacing={3}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <PersonIcon color="action" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Full Name
                          </Typography>
                          <Typography sx={{ fontWeight: 500 }}>{user?.name}</Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <EmailIcon color="action" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Email
                          </Typography>
                          <Typography sx={{ fontWeight: 500 }}>{user?.email}</Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              component={RouterLink}
              to={ROUTES.customerOrders}
              sx={{
                textDecoration: "none",
                cursor: "pointer",
                transition: "box-shadow 0.3s",
                "&:hover": { boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>My Orders</Typography>
                  <Typography variant="body2" color="text.secondary">
                    View order history and tracking
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              component={RouterLink}
              to={ROUTES.wishlist}
              sx={{
                textDecoration: "none",
                cursor: "pointer",
                transition: "box-shadow 0.3s",
                "&:hover": { boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Wishlist</Typography>
                  <Typography variant="body2" color="text.secondary">
                    View saved favorite items
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              component={RouterLink}
              to={ROUTES.customerAddresses}
              sx={{
                textDecoration: "none",
                cursor: "pointer",
                transition: "box-shadow 0.3s",
                "&:hover": { boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Addresses</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage shipping addresses
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              component={RouterLink}
              to={ROUTES.customerOutfits}
              sx={{
                textDecoration: "none",
                cursor: "pointer",
                transition: "box-shadow 0.3s",
                "&:hover": { boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Saved Outfits</Typography>
                  <Typography variant="body2" color="text.secondary">
                    View your saved outfit combinations
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
