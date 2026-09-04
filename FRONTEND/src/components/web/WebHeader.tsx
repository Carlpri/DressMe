import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import StyleRoundedIcon from "@mui/icons-material/StyleRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import { useSiteSettingsContext } from "../../contexts/SiteSettingsContext";
import { useFavorites } from "../../hooks/useFavorites";
import { useCart } from "../../hooks/useCart";

// ─── Desktop nav items ────────────────────────────────────────────────────────
const DESKTOP_NAV = [
  { label: "Products", path: ROUTES.customerDashboard },
  { label: "Categories", path: ROUTES.categories },
  { label: "Brands", path: ROUTES.brands },
  { label: "AI Stylist", path: ROUTES.aiStylist },
];

// ─── Mobile drawer menu sections ─────────────────────────────────────────────
const MENU_NAV = [
  { label: "Products", path: ROUTES.customerDashboard, Icon: GridViewRoundedIcon },
  { label: "Categories", path: ROUTES.categories, Icon: StyleRoundedIcon },
  { label: "Brands", path: ROUTES.brands, Icon: StorefrontRoundedIcon },
];

export function WebHeader() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { settings } = useSiteSettingsContext();
  const { data: favorites } = useFavorites();
  const { data: cart } = useCart();

  const favCount = favorites?.length || 0;
  const cartCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate(ROUTES.webLogin, { replace: true });
  };

  // ── Icon button shared styles ──────────────────────────────────────────────
  const iconBtnSx = {
    width: 36,
    height: 36,
    borderRadius: "10px",
    color: "#0D0D0D",
    bgcolor: "rgba(0,0,0,0.04)",
    border: "1px solid rgba(0,0,0,0.08)",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "rgba(0,0,0,0.08)",
      borderColor: "rgba(0,0,0,0.15)",
      color: "#00C896",
    },
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid",
          borderColor: "divider",
          py: { xs: 0.5, md: 1 },
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 1.5, md: 2 } }}>
          <Toolbar disableGutters sx={{ gap: { xs: 1, md: 2 }, minHeight: { xs: 56, md: 64 } }}>

            {/* ── LOGO (Extreme Left + Once-on-Refresh Animated Text Reveal) ── */}
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                minHeight: { xs: 42, sm: 48, md: 54 },
              }}
            >
              {/* Animated "DressMe" text that moves slowly from left to right while fading once on refresh */}
              <Typography
                component="div"
                aria-hidden="true"
                sx={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontWeight: 900,
                  fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
                  fontSize: { xs: "1.2rem", sm: "1.45rem", md: "1.8rem" },
                  letterSpacing: "-0.02em",
                  color: "#0D0D0D",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  zIndex: 2,
                  animation: "dressMeWordSlideFade 2.0s cubic-bezier(0.25, 0.1, 0.25, 1) 0.1s forwards",
                  "@keyframes dressMeWordSlideFade": {
                    "0%": {
                      opacity: 0,
                      transform: "translateY(-50%) translateX(0px)",
                    },
                    "15%": {
                      opacity: 1,
                      transform: "translateY(-50%) translateX(10px)",
                    },
                    "60%": {
                      opacity: 0.95,
                      transform: "translateY(-50%) translateX(40px)",
                    },
                    "90%": {
                      opacity: 0,
                      transform: "translateY(-50%) translateX(72px)",
                    },
                    "100%": {
                      opacity: 0,
                      transform: "translateY(-50%) translateX(82px)",
                      visibility: "hidden",
                    },
                  },
                }}
              >
                DressMe
              </Typography>

              {/* Logo: positioned on the extreme left, smoothly appears after the word finishes fading */}
              <Link
                component={RouterLink}
                to={ROUTES.landing}
                underline="none"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  opacity: 0,
                  animation: "dressMeLogoReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.9s forwards",
                  "@keyframes dressMeLogoReveal": {
                    "0%": {
                      opacity: 0,
                      transform: "scale(0.94)",
                    },
                    "100%": {
                      opacity: 1,
                      transform: "scale(1)",
                    },
                  },
                }}
              >
                {settings?.logoUrl ? (
                  <Box
                    component="img"
                    src={settings.logoUrl}
                    alt={settings?.siteName || "DressMe"}
                    sx={{
                      height: { xs: 38, sm: 44, md: 54 },
                      maxWidth: { xs: 120, sm: 160, md: 240 },
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                ) : (
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      color: "#00C896",
                      fontSize: { xs: "1.35rem", md: "1.75rem" },
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {settings?.siteName || "DressMe"}
                  </Typography>
                )}
              </Link>
            </Box>

            {/* ── DESKTOP NAV (md+) ────────────────────────────────────────── */}
            {!isMobile && (
              <Stack direction="row" spacing={4} alignItems="center">
                {DESKTOP_NAV.map((item) => (
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
            )}

            {/* ── DESKTOP RIGHT ICONS (md+) ────────────────────────────────── */}
            {!isMobile && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                {isAuthenticated ? (
                  <>
                    <IconButton
                      component={RouterLink}
                      to={ROUTES.wishlist}
                      size="small"
                      sx={{
                        ...iconBtnSx,
                        width: 38,
                        height: 38,
                      }}
                      aria-label="Wishlist"
                    >
                      <Badge badgeContent={favCount} color="error">
                        <FavoriteBorderRoundedIcon sx={{ fontSize: 20 }} />
                      </Badge>
                    </IconButton>
                    <IconButton
                      component={RouterLink}
                      to={ROUTES.customerCart}
                      size="small"
                      sx={{
                        ...iconBtnSx,
                        width: 38,
                        height: 38,
                      }}
                      aria-label="Cart"
                    >
                      <Badge badgeContent={cartCount} color="primary">
                        <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />
                      </Badge>
                    </IconButton>
                    <IconButton
                      component={RouterLink}
                      to={ROUTES.profile}
                      size="small"
                      sx={{
                        ...iconBtnSx,
                        width: 38,
                        height: 38,
                      }}
                      aria-label="Account"
                    >
                      <PersonRoundedIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    <IconButton
                      onClick={handleLogout}
                      size="small"
                      sx={{
                        ...iconBtnSx,
                        width: 38,
                        height: 38,
                      }}
                      aria-label="Logout"
                    >
                      <LogoutRoundedIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton
                      component={RouterLink}
                      to={ROUTES.customerCart}
                      size="small"
                      sx={{
                        ...iconBtnSx,
                        width: 38,
                        height: 38,
                      }}
                      aria-label="Cart"
                    >
                      <Badge badgeContent={cartCount} color="primary">
                        <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />
                      </Badge>
                    </IconButton>
                    <Link
                      component={RouterLink}
                      to={ROUTES.webLogin}
                      underline="none"
                      sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary", "&:hover": { color: "primary.main" } }}
                    >
                      Sign In
                    </Link>
                    <Box
                      component={RouterLink}
                      to={ROUTES.webRegister}
                      sx={{
                        px: 2, py: 0.7,
                        bgcolor: "#00C896",
                        color: "#07130F",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        borderRadius: "10px",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                        "&:hover": { bgcolor: "#00E0A7" },
                      }}
                    >
                      Sign Up
                    </Box>
                  </>
                )}
              </Stack>
            )}

            {/* ════════════════════════════════════════════════════════════════
                MOBILE RIGHT: Wishlist · Cart · AI Stylist pill · ☰ Menu
            ════════════════════════════════════════════════════════════════ */}
            {isMobile && (
              <Stack direction="row" spacing={0.75} alignItems="center">

                {/* Wishlist */}
                <IconButton
                  component={RouterLink}
                  to={ROUTES.wishlist}
                  aria-label="Wishlist"
                  size="small"
                  sx={iconBtnSx}
                >
                  <Badge
                    badgeContent={favCount}
                    sx={{
                      "& .MuiBadge-badge": {
                        bgcolor: "#EF4444",
                        color: "#fff",
                        fontSize: "0.55rem",
                        minWidth: 14,
                        height: 14,
                        top: 1,
                        right: 1,
                      },
                    }}
                  >
                    {favCount > 0 ? (
                      <FavoriteRoundedIcon sx={{ fontSize: 18, color: "#EF4444" }} />
                    ) : (
                      <FavoriteBorderRoundedIcon sx={{ fontSize: 18, color: "#0D0D0D" }} />
                    )}
                  </Badge>
                </IconButton>

                {/* Cart */}
                <IconButton
                  component={RouterLink}
                  to={ROUTES.customerCart}
                  aria-label="Cart"
                  size="small"
                  sx={iconBtnSx}
                >
                  <Badge
                    badgeContent={cartCount}
                    sx={{
                      "& .MuiBadge-badge": {
                        bgcolor: "#00C896",
                        color: "#07130F",
                        fontWeight: 800,
                        fontSize: "0.55rem",
                        minWidth: 14,
                        height: 14,
                        top: 1,
                        right: 1,
                      },
                    }}
                  >
                    <ShoppingBagOutlinedIcon sx={{ fontSize: 18, color: "#0D0D0D" }} />
                  </Badge>
                </IconButton>

                {/* AI Stylist pill */}
                <Box
                  component={RouterLink}
                  to={ROUTES.aiStylist}
                  aria-label="AI Stylist"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.4,
                    px: 1.2,
                    height: 32,
                    borderRadius: "20px",
                    bgcolor: "rgba(0,200,150,0.12)",
                    border: "1px solid rgba(0,200,150,0.3)",
                    color: "#00C896",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(0,200,150,0.22)",
                      borderColor: "#00C896",
                    },
                    "&:active": { transform: "scale(0.95)" },
                  }}
                >
                  <AutoAwesomeRoundedIcon sx={{ fontSize: 13 }} />
                  <Typography sx={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1 }}>
                    Stylist
                  </Typography>
                </Box>

                {/* Hamburger */}
                <IconButton
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                  size="small"
                  sx={{
                    ...iconBtnSx,
                    bgcolor: menuOpen ? "rgba(0,200,150,0.12)" : "rgba(0,0,0,0.04)",
                    borderColor: menuOpen ? "rgba(0,200,150,0.35)" : "rgba(0,0,0,0.08)",
                    color: menuOpen ? "#00C896" : "#0D0D0D",
                  }}
                >
                  <MenuRoundedIcon sx={{ fontSize: 18, color: menuOpen ? "#00C896" : "#0D0D0D" }} />
                </IconButton>
              </Stack>
            )}

          </Toolbar>
        </Container>
      </AppBar>

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE MENU DRAWER — slides up from bottom (Light theme)
      ══════════════════════════════════════════════════════════════════════ */}
      <Drawer
        anchor="bottom"
        open={menuOpen}
        onClose={closeMenu}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            borderRadius: "24px 24px 0 0",
            bgcolor: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.08)",
            borderBottom: "none",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 -20px 60px rgba(0,0,0,0.12)",
            maxHeight: "82vh",
            overflowY: "auto",
          },
        }}
      >
        {/* ── Drag handle + header ─────────────────────────────────────── */}
        <Box sx={{ px: 2.5, pt: 1.5, pb: 0 }}>
          {/* Drag pill */}
          <Box
            sx={{
              width: 36,
              height: 4,
              borderRadius: 2,
              bgcolor: "rgba(0,0,0,0.12)",
              mx: "auto",
              mb: 2,
            }}
          />

          {/* Header row */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography
              sx={{ fontWeight: 800, fontSize: "1.05rem", color: "#0D0D0D", letterSpacing: "-0.01em" }}
            >
              Menu
            </Typography>
            <IconButton
              onClick={closeMenu}
              size="small"
              sx={{
                color: "rgba(0,0,0,0.55)",
                bgcolor: "rgba(0,0,0,0.04)",
                borderRadius: "10px",
                width: 32,
                height: 32,
                "&:hover": { color: "#0D0D0D", bgcolor: "rgba(0,0,0,0.08)" },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
        </Box>

        <Box sx={{ px: 2.5, pb: 3 }}>

          {/* ── NAV LINKS ────────────────────────────────────────────────── */}
          <Stack spacing={0.5} sx={{ mb: 2 }}>
            {MENU_NAV.map(({ label, path, Icon }) => {
              const active = location.pathname.startsWith(path);
              return (
                <Box
                  key={path}
                  component={RouterLink}
                  to={path}
                  onClick={closeMenu}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1.5,
                    py: 1.3,
                    borderRadius: "14px",
                    bgcolor: active ? "rgba(0,200,150,0.09)" : "transparent",
                    border: "1px solid",
                    borderColor: active ? "rgba(0,200,150,0.3)" : "transparent",
                    textDecoration: "none",
                    transition: "all 0.18s ease",
                    "&:hover": {
                      bgcolor: "rgba(0,0,0,0.03)",
                      borderColor: "rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "10px",
                      bgcolor: active ? "rgba(0,200,150,0.15)" : "rgba(0,0,0,0.04)",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      sx={{ fontSize: 17, color: active ? "#00C896" : "rgba(0,0,0,0.55)" }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      flex: 1,
                      fontWeight: active ? 700 : 500,
                      fontSize: "0.95rem",
                      color: active ? "#00C896" : "#1A202C",
                    }}
                  >
                    {label}
                  </Typography>
                  <ChevronRightRoundedIcon
                    sx={{ fontSize: 16, color: active ? "#00C896" : "rgba(0,0,0,0.25)" }}
                  />
                </Box>
              );
            })}
          </Stack>

          <Divider sx={{ borderColor: "rgba(0,0,0,0.06)", mb: 2 }} />

          {/* ── USER SECTION ─────────────────────────────────────────────── */}
          {isAuthenticated ? (
            <Stack spacing={0.5}>
              {/* User info row */}
              <Box
                component={RouterLink}
                to={ROUTES.profile}
                onClick={closeMenu}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1.5,
                  py: 1.3,
                  borderRadius: "14px",
                  textDecoration: "none",
                  transition: "all 0.18s ease",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.03)" },
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "rgba(0,200,150,0.15)",
                    border: "1.5px solid rgba(0,200,150,0.35)",
                    color: "#00C896",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "#0D0D0D",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.name || "My Account"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.72rem",
                      color: "rgba(0,0,0,0.5)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.email || "View profile"}
                  </Typography>
                </Box>
                <ChevronRightRoundedIcon sx={{ fontSize: 16, color: "rgba(0,0,0,0.25)" }} />
              </Box>

              {/* Logout */}
              <Box
                onClick={handleLogout}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1.5,
                  py: 1.3,
                  borderRadius: "14px",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  "&:hover": {
                    bgcolor: "rgba(239,68,68,0.08)",
                    "& .logout-icon": { color: "#EF4444" },
                    "& .logout-text": { color: "#EF4444" },
                  },
                }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "10px",
                    bgcolor: "rgba(0,0,0,0.04)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <LogoutRoundedIcon
                    className="logout-icon"
                    sx={{ fontSize: 17, color: "rgba(0,0,0,0.5)", transition: "color 0.2s" }}
                  />
                </Box>
                <Typography
                  className="logout-text"
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    color: "rgba(0,0,0,0.6)",
                    transition: "color 0.2s",
                  }}
                >
                  Log out
                </Typography>
              </Box>
            </Stack>
          ) : (
            /* Not authenticated — Sign In / Sign Up */
            <Stack spacing={1}>
              <Box
                component={RouterLink}
                to={ROUTES.webLogin}
                onClick={closeMenu}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1.5,
                  py: 1.3,
                  borderRadius: "14px",
                  textDecoration: "none",
                  border: "1px solid rgba(0,0,0,0.1)",
                  transition: "all 0.18s ease",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "10px",
                    bgcolor: "rgba(0,0,0,0.04)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <LoginRoundedIcon sx={{ fontSize: 17, color: "rgba(0,0,0,0.6)" }} />
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "text.primary" }}>
                  Sign In
                </Typography>
              </Box>

              <Box
                component={RouterLink}
                to={ROUTES.webRegister}
                onClick={closeMenu}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  px: 1.5,
                  py: 1.3,
                  borderRadius: "14px",
                  textDecoration: "none",
                  bgcolor: "#00C896",
                  color: "#07130F",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: "#00E0A7" },
                }}
              >
                <PersonAddRoundedIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "inherit" }}>
                  Create Account
                </Typography>
              </Box>
            </Stack>
          )}
        </Box>
      </Drawer>
    </>
  );
}
