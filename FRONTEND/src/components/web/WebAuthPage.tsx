import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { FeedbackSnackbar } from "../FeedbackSnackbar";
import { ROUTES, STUDIO_ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import type { UserRole } from "../../types/auth";
import type { ApiErrorResponse } from "../../types/api";
import { authService } from "../../features/auth/auth.service";
import type { RegisterFormValues } from "../../features/auth/auth.schemas";
import { AuthForm } from "../../features/auth/AuthForm";

function dashboardFor(role: UserRole) {
  return role === "ADMIN" ? STUDIO_ROUTES.adminDashboard : role === "VENDOR" ? STUDIO_ROUTES.vendorDashboard : ROUTES.customerDashboard;
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    const issue = data?.errors?.[0]?.message;
    return issue ?? data?.message ?? "The request could not be completed.";
  }
  return "Something went wrong. Please try again.";
}

export function WebAuthPage({ mode }: { mode: "login" | "register" }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: mode === "login" ? authService.login : authService.register,
    onSuccess: (session) => {
      login(session);
      setSuccess(mode === "login" ? "Signed in successfully." : "Account created successfully.");
      navigate(dashboardFor(session.user.role), { replace: true });
    },
    onError: (requestError) => setError(getErrorMessage(requestError)),
  });

  const submit = (values: RegisterFormValues) => mutation.mutate(values as never);
  const isRegister = mode === "register";

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        bgcolor: "#F8FAFC",
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
          }}
        >
          <Stack spacing={4} alignItems="center">
            <Stack spacing={1} textAlign="center">
              <Typography
                component="h1"
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                }}
              >
                {isRegister ? "Join DressMe" : "Welcome Back"}
              </Typography>
              <Typography color="text.secondary" variant="body1">
                {isRegister
                  ? "Create your account and start your style journey."
                  : "Sign in to continue your fashion journey."}
              </Typography>
            </Stack>

            <AuthForm mode={mode} isPending={mutation.isPending} onSubmit={submit} />

            <Typography variant="body2" color="text.secondary">
              {isRegister ? "Already have an account? " : "New to DressMe? "}
              <Link
                component={RouterLink}
                to={isRegister ? ROUTES.webLogin : ROUTES.webRegister}
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  "&:hover": { color: "primary.dark" },
                }}
              >
                {isRegister ? "Sign in" : "Create account"}
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>

      <FeedbackSnackbar message={error} severity="error" onClose={() => setError(null)} />
      <FeedbackSnackbar message={success} severity="success" onClose={() => setSuccess(null)} />
    </Box>
  );
}
