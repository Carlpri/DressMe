import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { apiClient } from "../../api/client";
import { ROUTES } from "../../constants/routes";
import { PageFrame } from "../../pages/PageFrame";
import { useAuth } from "../../hooks/useAuth";
import { backendModules, type BackendModuleDefinition, type EndpointDefinition, type ModuleStatus } from "./moduleRegistry";
import { executeEndpoint } from "./registry.service";

const tone: Record<ModuleStatus, "success" | "warning" | "error" | "default"> = { connected: "success", development: "warning", testing: "warning", error: "error", planned: "default" };
const label: Record<ModuleStatus, string> = { connected: "Connected", development: "In Development", testing: "Testing", error: "Error", planned: "Planned" };
function statusFor(module: BackendModuleDefinition, healthy: boolean | undefined): ModuleStatus {
  if (!module.endpoints.length) return "planned";
  if (healthy === false) return "error";
  return module.frontendPages.length ? "connected" : "development";
}

export function BackendRegistryPage() {
  const { token } = useAuth();
  const [selected, setSelected] = useState<{ module: BackendModuleDefinition; endpoint: EndpointDefinition } | null>(null);
  const [requestPath, setRequestPath] = useState("");
  const [payload, setPayload] = useState("{}");
  const [execution, setExecution] = useState<string | null>(null);
  const checks = useQueries({ queries: backendModules.map((module) => ({
    queryKey: ["module-health", module.id], enabled: Boolean(module.probe && token), retry: false,
    queryFn: async () => { const response = await apiClient.get(module.probe!, { validateStatus: (status) => status < 500 }); return response.status; },
  })) });
  const liveModules = backendModules.filter((module) => module.endpoints.length > 0);
  const healthFor = (index: number) => checks[index]?.isSuccess;
  const summary = useMemo(() => {
    const connected = liveModules.filter((module, index) => statusFor(module, healthFor(index)) === "connected").length;
    const passing = checks.filter((check) => check.isSuccess).length;
    return { connected, total: backendModules.length, endpoints: liveModules.reduce((total, module) => total + module.endpoints.length, 0), passing, models: 16 };
  }, [checks]);
  const openExplorer = (module: BackendModuleDefinition, endpoint: EndpointDefinition) => { setSelected({ module, endpoint }); setRequestPath(`${module.basePath}${endpoint.path}`); setPayload("{}"); setExecution(null); };
  const runEndpoint = async () => {
    if (!selected) return;
    try {
      const body = ["POST", "PUT", "PATCH"].includes(selected.endpoint.method) ? JSON.parse(payload) : undefined;
      const result = await executeEndpoint(selected.endpoint.method, requestPath, body);
      setExecution(JSON.stringify(result, null, 2));
    } catch (error) { setExecution(JSON.stringify({ error: error instanceof Error ? error.message : "Request failed" }, null, 2)); }
  };
  return <PageFrame><Stack spacing={3}>
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}><Box><Typography component="h1" variant="h4">Backend Capability Registry</Typography><Typography color="text.secondary">Live Express API inventory and module health.</Typography></Box><Button component={RouterLink} to={ROUTES.customerDashboard} variant="outlined">Back to workspace</Button></Stack>
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}><Chip label={`${summary.connected} modules connected`} color="success" /><Chip label={`${summary.endpoints} implemented endpoints`} /><Chip label={`${summary.passing} passing probes`} color={summary.passing ? "success" : "default"} /><Chip label={`${summary.models} database models`} /><Chip label={import.meta.env.MODE} variant="outlined" /></Stack>
    <Alert severity="info">Health checks use real API requests. Protected modules are checked using your current JWT; response data is available through the API Explorer.</Alert>
    <TableContainer component={Paper} variant="outlined"><Table size="small"><TableHead><TableRow><TableCell>Module</TableCell><TableCell>Status</TableCell><TableCell>Endpoints</TableCell><TableCell>Models</TableCell><TableCell>Frontend pages</TableCell><TableCell>Health</TableCell><TableCell>Actions</TableCell></TableRow></TableHead><TableBody>{backendModules.map((module, index) => { const state = statusFor(module, healthFor(index)); return <TableRow key={module.id}><TableCell><Typography fontWeight={600}>{module.name}</Typography><Typography variant="caption" color="text.secondary">{module.basePath ?? "No API route"}</Typography></TableCell><TableCell><Chip size="small" label={label[state]} color={tone[state]} /></TableCell><TableCell>{module.endpoints.length}</TableCell><TableCell>{module.models.join(", ") || "—"}</TableCell><TableCell>{module.frontendPages.join(", ") || "Not connected"}</TableCell><TableCell>{module.probe ? checks[index]?.isLoading ? "Checking…" : checks[index]?.isSuccess ? "Healthy" : "Failed" : "—"}</TableCell><TableCell><Stack direction="row" spacing={1} flexWrap="wrap">{module.endpoints.map((item) => <Button key={`${item.method}${item.path}`} size="small" onClick={() => openExplorer(module, item)}>{item.method} {item.path}</Button>)}</Stack></TableCell></TableRow>; })}</TableBody></Table></TableContainer>
    <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="md"><DialogTitle>API Explorer — {selected && `${selected.endpoint.method} ${requestPath}`}</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><Typography variant="body2">Authentication required: {selected?.endpoint.auth ? "Yes" : "No"}</Typography><TextField label="Request path" value={requestPath} onChange={(event) => setRequestPath(event.target.value)} helperText="Replace parameter placeholders such as :id before executing." />{selected && ["POST", "PUT", "PATCH"].includes(selected.endpoint.method) && <TextField label="JSON request payload" multiline minRows={7} value={payload} onChange={(event) => setPayload(event.target.value)} />}{execution && <TextField label="Live response" multiline minRows={12} value={execution} InputProps={{ readOnly: true }} />}</Stack></DialogContent><DialogActions><Button onClick={() => setSelected(null)}>Close</Button><Button variant="contained" onClick={runEndpoint}>Execute endpoint</Button></DialogActions></Dialog>
  </Stack></PageFrame>;
}
