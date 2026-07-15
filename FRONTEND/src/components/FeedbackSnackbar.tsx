import { Alert, Snackbar } from "@mui/material";

interface FeedbackSnackbarProps {
  message: string | null;
  severity: "success" | "error";
  onClose: () => void;
}

export function FeedbackSnackbar({ message, severity, onClose }: FeedbackSnackbarProps) {
  return (
    <Snackbar open={Boolean(message)} autoHideDuration={5000} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <Alert severity={severity} variant="filled" onClose={onClose}>{message}</Alert>
    </Snackbar>
  );
}
