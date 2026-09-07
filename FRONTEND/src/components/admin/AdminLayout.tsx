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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useAuth } from "../../hooks/useAuth";
import { ScrollToTop } from "../shared/ScrollToTop";

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
  { label: "Products", path: "/admin/products", icon: <ShoppingBagIcon /> },
  { label: "AI Product Analysis", path: "/admin/ai-product-analysis", icon: <AutoAwesomeIcon /> },
  { label: "Media Library", path: "/admin/media", icon: <PermMediaIcon /> },
  { label: "Categories", path: "/admin/categories", icon: <CategoryIcon /> },
  { label: "Brands", path: "/admin/brands", icon: <LocalOfferIcon /> },
  { label: "Vendors", path: "/admin/vendors", icon: <StorefrontIcon /> },
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

  const handleLogout = () => {
    logout();
    navigate("/studio/login", { replace: true });
  };

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#0F172A",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Brand Header */}
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "1.15rem",
            color: "white",
            boxShadow: "0 2px 8px rgba(22, 101, 52, 0.4)",
          }}
        >
          D
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "white", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
            DressMe
          </Typography>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.08em" }}>
            Admin Control Panel
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

      {/* Scrollable Navigation List */}
      <List
        sx={{
          px: 1.5,
          py: 1.5,
          flex: "1 1 auto",
          overflowY: "auto",
          minHeight: 0,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(255,255,255,0.15)", borderRadius: 2 },
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.path === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.path);

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.3 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 0.9,
                  px: 1.5,
                  bgcolor: isActive ? "primary.main" : "transparent",
                  color: isActive ? "#FFFFFF" : "#CBD5E1",
                  boxShadow: isActive ? "0 2px 8px rgba(22, 101, 52, 0.35)" : "none",
                  transition: "all 0.18s ease",
                  "&:hover": {
                    bgcolor: isActive ? "primary.main" : "rgba(255, 255, 255, 0.08)",
                    color: "#FFFFFF",
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "#FFFFFF" : "#94A3B8", minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.86rem",
                    fontWeight: isActive ? 700 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

      {/* Pinned Bottom Quick Action Dock - Always Visible */}
      <Box
        sx={{
          p: 1.8,
          flexShrink: 0,
          bgcolor: "#090E17",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 0.8,
        }}
      >
        <Button
          component={RouterLink}
          to="/"
          fullWidth
          size="small"
          variant="contained"
          color="primary"
          startIcon={<StorefrontIcon sx={{ fontSize: 18 }} />}
          sx={{
            fontWeight: 700,
            fontSize: "0.82rem",
            py: 0.9,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(22, 101, 52, 0.4)",
          }}
        >
          View Storefront
        </Button>
        <Stack direction="row" spacing={1}>
          <Button
            component={RouterLink}
            to="/studio/vendor"
            fullWidth
            size="small"
            variant="outlined"
            sx={{
              color: "#E2E8F0",
              borderColor: "rgba(255,255,255,0.22)",
              fontSize: "0.75rem",
              fontWeight: 600,
              py: 0.7,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.04)",
              "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.1)", color: "#FFFFFF" },
            }}
          >
            Vendor Portal
          </Button>
          <Button
            component={RouterLink}
            to="/studio"
            fullWidth
            size="small"
            variant="outlined"
            sx={{
              color: "#E2E8F0",
              borderColor: "rgba(255,255,255,0.22)",
              fontSize: "0.75rem",
              fontWeight: 600,
              py: 0.7,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.04)",
              "&:hover": { borderColor: "#FFFFFF", bgcolor: "rgba(255,255,255,0.1)", color: "#FFFFFF" },
            }}
          >
            Studio
          </Button>
        </Stack>
        <Button
          onClick={handleLogout}
          fullWidth
          size="small"
          color="error"
          startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
          sx={{
            fontWeight: 600,
            fontSize: "0.78rem",
            py: 0.6,
            borderRadius: 2,
            color: "#F87171",
            "&:hover": { bgcolor: "rgba(239, 68, 68, 0.12)", color: "#EF4444" },
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <ScrollToTop />
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
