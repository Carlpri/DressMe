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
import {
  loginSchema,
  registerSchema,
  type LoginFormValues,
  type RegisterFormValues,
} from "./auth.schemas";

interface AuthFormProps {
  mode: "login" | "register";
  isPending: boolean;
  onSubmit: (values: RegisterFormValues) => void;
}

export function AuthForm({ mode, isPending, onSubmit }: AuthFormProps) {
  const isRegister = mode === "register";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Use the wider RegisterFormValues type for the form so that both modes share
  // the same form instance. For login mode we cast the narrower schema to the
  // resolver — the extra register-only fields simply won't exist in the DOM.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(isRegister ? registerSchema : (loginSchema as never)),
  });

  // Convenience: typed access to errors that only exist in register mode
  const registerErrors = errors as Partial<Record<keyof RegisterFormValues, { message?: string }>>;

  const EyeAdornment = ({
    visible,
    onToggle,
  }: {
    visible: boolean;
    onToggle: () => void;
  }) => (
    <InputAdornment position="end">
      <IconButton
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={onToggle}
        onMouseDown={(e) => e.preventDefault()} // prevent field blur on click
        edge="end"
        size="small"
      >
        {visible ? (
          <VisibilityOffIcon fontSize="small" />
        ) : (
          <VisibilityIcon fontSize="small" />
        )}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ display: "grid", gap: 2 }}>
      {/* Name — register only */}
      {isRegister && (
        <TextField
          label="Name"
          autoComplete="name"
          autoFocus
          {...register("name")}
          error={Boolean(registerErrors.name)}
          helperText={registerErrors.name?.message}
        />
      )}

      {/* Email */}
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        autoFocus={!isRegister}
        {...register("email")}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
      />

      {/* Password */}
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete={isRegister ? "new-password" : "current-password"}
        {...register("password")}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        slotProps={{
          input: {
            endAdornment: (
              <EyeAdornment
                visible={showPassword}
                onToggle={() => setShowPassword((v) => !v)}
              />
            ),
          },
        }}
      />

      {/* Confirm Password — register only */}
      {isRegister && (
        <TextField
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={Boolean(registerErrors.confirmPassword)}
          helperText={registerErrors.confirmPassword?.message}
          slotProps={{
            input: {
              endAdornment: (
                <EyeAdornment
                  visible={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                />
              ),
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
