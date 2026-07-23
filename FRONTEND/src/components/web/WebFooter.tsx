import { Box, Container, Link, Stack, Typography, useTheme } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Link as RouterLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useSiteSettingsContext } from "../../contexts/SiteSettingsContext";

const FOOTER_LINKS = {
  Company: [
    { label: "About Us", path: "#" },
    { label: "Careers", path: "#" },
    { label: "Press", path: "#" },
    { label: "Blog", path: "#" },
  ],
  Support: [
    { label: "Help Center", path: "#" },
    { label: "Contact Us", path: "#" },
    { label: "Shipping Info", path: "#" },
    { label: "Returns", path: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", path: "#" },
    { label: "Terms of Service", path: "#" },
    { label: "Cookie Policy", path: "#" },
  ],
  Partners: [
    { label: "Become a Vendor", path: "#" },
    { label: "Partner Program", path: "#" },
    { label: "API Access", path: "#" },
  ],
};

export function WebFooter() {
  const theme = useTheme();
  const { settings } = useSiteSettingsContext();

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
                        href={link.path}
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
