import { useState } from "react";
import { Link as RouterLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Button,
  Chip,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";
import SettingsIcon from "@mui/icons-material/Settings";
import CodeIcon from "@mui/icons-material/Code";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../hooks/useAuth";

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
  { label: "Products", path: "/admin/products", icon: <ShoppingBagIcon /> },
  { label: "Media Library", path: "/admin/media", icon: <PermMediaIcon /> },
  { label: "Categories", path: "/admin/categories", icon: <CategoryIcon /> },
  { label: "Brands", path: "/admin/brands", icon: <LocalOfferIcon /> },
  { label: "Orders", path: "/admin/orders", icon: <ShoppingCartIcon /> },
  { label: "Customers", path: "/admin/customers", icon: <PeopleIcon /> },
  { label: "Reviews", path: "/admin/reviews", icon: <StarIcon /> },
  { label: "AppSettings", path: "/admin/settings", icon: <SettingsIcon /> },
];

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#0F172A", color: "white" }}>
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "1.2rem",
            color: "white",
          }}
        >
          D
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "white", lineHeight: 1.2 }}>
            DressMe
          </Typography>
          <Typography variant="caption" sx={{ color: "slate.400", opacity: 0.7 }}>
            Admin Control Panel
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <List sx={{ px: 2, py: 2, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.path === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.path);

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? "primary.main" : "transparent",
                  color: isActive ? "white" : "#94A3B8",
                  "&:hover": {
                    bgcolor: isActive ? "primary.main" : "rgba(255, 255, 255, 0.05)",
                    color: "white",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <Box sx={{ p: 2 }}>
        <Button
          component={RouterLink}
          to="/studio"
          fullWidth
          variant="outlined"
          startIcon={<CodeIcon />}
          sx={{
            color: "#94A3B8",
            borderColor: "rgba(255,255,255,0.2)",
            mb: 1,
            "&:hover": { borderColor: "white", color: "white" },
          }}
        >
          Developer Studio
        </Button>
        <Button
          component={RouterLink}
          to="/"
          fullWidth
          variant="contained"
          color="secondary"
          startIcon={<StorefrontIcon />}
          sx={{ mb: 1 }}
        >
          View Storefront
        </Button>
        <Button
          onClick={logout}
          fullWidth
          color="error"
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      {/* Top Mobile Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            DressMe Admin CMS
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={user?.name || "Admin"} color="primary" variant="outlined" size="small" />
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content View */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
