import { Box, Container, Link, Stack, Typography, useTheme, Avatar, Chip } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PersonIcon from "@mui/icons-material/Person";
import { Link as RouterLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useSiteSettingsContext } from "../../contexts/SiteSettingsContext";
import { useAuth } from "../../hooks/useAuth";

const FOOTER_LINKS = {
  Company: [
    { label: "About Us", path: ROUTES.about },
    { label: "Vision", path: ROUTES.vision },
    { label: "Mission", path: ROUTES.mission },
    { label: "Careers", path: ROUTES.careers },
  ],
  Support: [
    { label: "Help Center", path: ROUTES.help },
    { label: "Contact Us", path: ROUTES.contact },
    { label: "Shipping Info", path: ROUTES.shipping },
    { label: "Returns", path: ROUTES.returns },
  ],
  Legal: [
    { label: "Privacy Policy", path: ROUTES.privacy },
    { label: "Terms of Service", path: ROUTES.terms },
    { label: "Cookie Policy", path: "#" },
  ],
  Partners: [
    { label: "Become a Vendor", path: ROUTES.contact },
    { label: "Partner Program", path: "#" },
    { label: "API Access", path: "#" },
  ],
};

export function WebFooter() {
  const theme = useTheme();
  const { settings } = useSiteSettingsContext();
  const { user, isAuthenticated } = useAuth();

  const logoSrc = settings?.logoDarkUrl ?? settings?.logoUrl ?? undefined;

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#111827",
        color: "white",
        py: { xs: 6, md: 10 },
        mt: "auto",
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={6}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={4}
          >
            <Box sx={{ maxWidth: { xs: "100%", md: 300 } }}>
              {logoSrc ? (
                <Box
                  component="img"
                  src={logoSrc}
                  alt={settings?.siteName || "DressMe"}
                  sx={{
                    height: 44,
                    maxWidth: 160,
                    objectFit: "contain",
                    display: "block",
                    mb: 2,
                    filter: settings?.logoDarkUrl ? "none" : "brightness(0) invert(1)",
                  }}
                />
              ) : (
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: "#00C896",
                  }}
                >
                  {settings?.siteName || "DressMe"}
                </Typography>
              )}
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.6 }}
              >
                {settings?.tagline || "Your Style. Powered by AI. Inspired by You."}
              </Typography>

              {isAuthenticated && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: 2,
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ width: 40, height: 40, bgcolor: "#00C896" }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "white" }}>
                        {user?.name}
                      </Typography>
                      <Chip
                        label={user?.role}
                        size="small"
                        sx={{
                          bgcolor: "rgba(0, 200, 150, 0.2)",
                          color: "#00C896",
                          fontSize: "0.7rem",
                          height: 20,
                        }}
                      />
                    </Box>
                  </Stack>
                </Box>
              )}
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 4, md: 6 }}
              flexWrap="wrap"
            >
              {Object.entries(FOOTER_LINKS).map(([category, links]) => (
                <Box key={category}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      fontSize: "1rem",
                    }}
                  >
                    {category}
                  </Typography>
                  <Stack spacing={1.5}>
                    {links.map((link) => (
                      <Link
                        key={link.label}
                        component={RouterLink}
                        to={link.path}
                        underline="none"
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontSize: "0.875rem",
                          transition: "color 0.2s",
                          "&:hover": { color: "#00C896" },
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={3}
            sx={{
              pt: 4,
              borderTop: "1px solid",
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.5)" }}
            >
              © 2026 {settings?.siteName || "DressMe"}. All rights reserved.
            </Typography>

            <Stack direction="row" spacing={2}>
              {settings?.facebook && (
                <Link
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    transition: "color 0.2s",
                    "&:hover": { color: "#00C896" },
                  }}
                >
                  <FacebookIcon />
                </Link>
              )}
              {settings?.instagram && (
                <Link
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    transition: "color 0.2s",
                    "&:hover": { color: "#00C896" },
                  }}
                >
                  <InstagramIcon />
                </Link>
              )}
              {settings?.x && (
                <Link
                  href={settings.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    transition: "color 0.2s",
                    "&:hover": { color: "#00C896" },
                  }}
                >
                  <TwitterIcon />
                </Link>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
