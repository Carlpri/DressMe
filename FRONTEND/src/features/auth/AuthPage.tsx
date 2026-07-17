import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, Paper, Stack, Typography } from "@mui/material";
import { FeedbackSnackbar } from "../../components/FeedbackSnackbar";
import { STUDIO_ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";
import type { UserRole } from "../../types/auth";
import type { ApiErrorResponse } from "../../types/api";
import { PageFrame } from "../../pages/PageFrame";
import { AuthForm } from "./AuthForm";
import { authService } from "./auth.service";
import type { RegisterFormValues } from "./auth.schemas";

function dashboardFor(role: UserRole) {
  return role === "ADMIN" ? STUDIO_ROUTES.adminDashboard : role === "VENDOR" ? STUDIO_ROUTES.vendorDashboard : STUDIO_ROUTES.customerDashboard;
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    const issue = data?.errors?.[0]?.message;
    return issue ?? data?.message ?? "The request could not be completed.";
  }
  return "Something went wrong. Please try again.";
}

export function AuthPage({ mode }: { mode: "login" | "register" }) {
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
    <PageFrame>
      <Paper variant="outlined" sx={{ maxWidth: 480, mx: "auto", p: { xs: 3, sm: 4 } }}>
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography component="h1" variant="h4">{isRegister ? "Create a Studio account" : "Welcome to DressMe Studio"}</Typography>
            <Typography color="text.secondary">{isRegister ? "Register a platform account to test DressMe APIs." : "Sign in with a DressMe platform account."}</Typography>
          </Stack>
          <AuthForm mode={mode} isPending={mutation.isPending} onSubmit={submit} />
          <Typography variant="body2" color="text.secondary">
            {isRegister ? "Already have an account? " : "Need an account? "}
            <Link component={RouterLink} to={isRegister ? STUDIO_ROUTES.login : STUDIO_ROUTES.register}>
              {isRegister ? "Sign in" : "Register"}
            </Link>
          </Typography>
        </Stack>
      </Paper>
      <FeedbackSnackbar message={error} severity="error" onClose={() => setError(null)} />
      <FeedbackSnackbar message={success} severity="success" onClose={() => setSuccess(null)} />
    </PageFrame>
  );
}
