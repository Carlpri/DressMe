import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Link,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { useSiteSettingsContext } from "../../contexts/SiteSettingsContext";
import { useFavorites } from "../../hooks/useFavorites";

const NAVIGATION_ITEMS = [
  { label: "Products", path: ROUTES.customerDashboard },
  { label: "Categories", path: ROUTES.categories },
  { label: "Brands", path: ROUTES.brands },
  { label: "AI Stylist", path: ROUTES.aiStylist },
];

export function WebHeader() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { settings } = useSiteSettingsContext();
  const { data: favorites } = useFavorites();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationContent = (
    <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 3 : 4} alignItems="center">
      {NAVIGATION_ITEMS.map((item) => (
        <Link
          key={item.path}
          component={RouterLink}
          to={item.path}
          underline="none"
          color={location.pathname === item.path ? "primary" : "text.primary"}
          sx={{
            fontWeight: location.pathname === item.path ? 600 : 500,
            fontSize: "0.95rem",
            transition: "color 0.2s",
            "&:hover": { color: "primary.main" },
          }}
        >
          {item.label}
        </Link>
      ))}
    </Stack>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        py: 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Link
              component={RouterLink}
              to={ROUTES.landing}
              underline="none"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {settings?.logoUrl ? (
                <Box
                  component="img"
                  src={settings.logoUrl}
                  alt={settings?.siteName || "DressMe"}
                  sx={{
                    height: { xs: 64, md: 96 },
                    maxWidth: { xs: 200, md: 300 },
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : (
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    fontSize: { xs: "1.5rem", md: "1.75rem" },
                  }}
                >
                  {settings?.siteName || "DressMe"}
                </Typography>
              )}
            </Link>
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              {navigationContent}
            </Box>
          )}

          <Stack direction="row" spacing={2} alignItems="center">
            {isAuthenticated ? (
              <>
                <IconButton
                  component={RouterLink}
                  to={ROUTES.wishlist}
                  size="small"
                  sx={{ color: "text.primary" }}
                >
                  <Badge badgeContent={favorites?.length || 0} color="error">
                    <FavoriteBorderIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  component={RouterLink}
                  to={ROUTES.customerCart}
                  size="small"
                  sx={{ color: "text.primary" }}
                >
                  <ShoppingCartIcon />
                </IconButton>
                <Button
                  component={RouterLink}
                  to={ROUTES.profile}
                  variant="outlined"
                  size="small"
                  startIcon={<PersonIcon />}
                >
                  {user?.name?.split(" ")[0] || "Account"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to={ROUTES.webLogin}
                  variant="text"
                  size="small"
                >
                  Sign In
                </Button>
                <Button
                  component={RouterLink}
                  to={ROUTES.webRegister}
                  variant="contained"
                  size="small"
                >
                  Sign Up
                </Button>
              </>
            )}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            )}
          </Stack>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280, pt: 2 },
        }}
      >
        <Box onClick={handleDrawerToggle} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            Menu
          </Typography>
          {navigationContent}
        </Box>
      </Drawer>
    </AppBar>
  );
}
