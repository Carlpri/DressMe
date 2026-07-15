import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { loginSchema, registerSchema, type RegisterFormValues } from "./auth.schemas";

interface AuthFormProps {
  mode: "login" | "register";
  isPending: boolean;
  onSubmit: (values: RegisterFormValues) => void;
}

export function AuthForm({ mode, isPending, onSubmit }: AuthFormProps) {
  const isRegister = mode === "register";
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema) as never,
  });

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ display: "grid", gap: 2 }}>
      {isRegister && (
        <TextField label="Name" autoComplete="name" autoFocus {...register("name")} error={Boolean(errors.name)} helperText={errors.name?.message} />
      )}
      <TextField label="Email" type="email" autoComplete="email" autoFocus={!isRegister} {...register("email")} error={Boolean(errors.email)} helperText={errors.email?.message} />
      <TextField label="Password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} {...register("password")} error={Boolean(errors.password)} helperText={errors.password?.message} />
      <Button type="submit" disabled={isPending} variant="contained" size="large">
        {isPending ? <CircularProgress size={22} color="inherit" /> : isRegister ? "Create account" : "Sign in"}
      </Button>
    </Box>
  );
}
