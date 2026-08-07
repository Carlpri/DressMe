import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { loginSchema, registerSchema, type RegisterFormValues } from "./auth.schemas";

interface AuthFormProps {
  mode: "login" | "register";
  isPending: boolean;
  onSubmit: (values: RegisterFormValues) => void;
}

export function AuthForm({ mode, isPending, onSubmit }: AuthFormProps) {
  const isRegister = mode === "register";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema) as never,
  });

  const passwordEndAdornment = (visible: boolean, toggle: () => void) => (
    <InputAdornment position="end">
      <IconButton
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={toggle}
        edge="end"
        size="small"
      >
        {visible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ display: "grid", gap: 2 }}>
      {isRegister && (
        <TextField
          label="Name"
          autoComplete="name"
          autoFocus
          {...register("name")}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
      )}

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        autoFocus={!isRegister}
        {...register("email")}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
      />

      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete={isRegister ? "new-password" : "current-password"}
        {...register("password")}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        slotProps={{
          input: {
            endAdornment: passwordEndAdornment(showPassword, () => setShowPassword((v) => !v)),
          },
        }}
      />

      {isRegister && (
        <TextField
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={Boolean((errors as any).confirmPassword)}
          helperText={(errors as any).confirmPassword?.message}
          slotProps={{
            input: {
              endAdornment: passwordEndAdornment(showConfirm, () => setShowConfirm((v) => !v)),
            },
          }}
        />
      )}

      <Button type="submit" disabled={isPending} variant="contained" size="large">
        {isPending ? (
          <CircularProgress size={22} color="inherit" />
        ) : isRegister ? (
          "Create account"
        ) : (
          "Sign in"
        )}
      </Button>
    </Box>
  );
}
