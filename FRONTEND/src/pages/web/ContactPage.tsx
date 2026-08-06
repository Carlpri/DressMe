import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { PageFrame } from "../PageFrame";
import { useSiteSettingsContext } from "../../contexts/SiteSettingsContext";

export function ContactPage() {
  const theme = useTheme();
  const { settings } = useSiteSettingsContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <PageFrame>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Stack spacing={6}>
          <Box textAlign="center">
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              Contact Us
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
              Have questions, feedback, or need help? We'd love to hear from you. Fill out the form below or reach out to us directly.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            <Box sx={{ flex: 1 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                  Send us a Message
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <TextField
                      name="name"
                      label="Your Name"
                      fullWidth
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <TextField
                      name="email"
                      label="Email Address"
                      type="email"
                      fullWidth
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <TextField
                      name="phone"
                      label="Phone Number"
                      fullWidth
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <TextField
                      name="message"
                      label="Your Message"
                      multiline
                      rows={4}
                      fullWidth
                      required
                      value={formData.message}
                      onChange={handleChange}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Send Message
                    </Button>
                  </Stack>
                </form>
              </Paper>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Other Ways to Reach Us
                  </Typography>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Email
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {settings?.supportEmail || "support@dressme.co.ke"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        WhatsApp
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {settings?.whatsappNumber || "+254 700 000 000"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Phone
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {settings?.whatsappNumber || "+254 700 000 000"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Address
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Nairobi, Kenya
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Follow Us
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    {settings?.facebook && (
                      <Button
                        variant="outlined"
                        href={settings.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </Button>
                    )}
                    {settings?.instagram && (
                      <Button
                        variant="outlined"
                        href={settings.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Instagram
                      </Button>
                    )}
                    {settings?.x && (
                      <Button
                        variant="outlined"
                        href={settings.x}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        X (Twitter)
                      </Button>
                    )}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                    Business Hours
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Monday - Friday: 8:00 AM - 6:00 PM
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Saturday: 9:00 AM - 4:00 PM
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sunday: Closed
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </PageFrame>
  );
}
