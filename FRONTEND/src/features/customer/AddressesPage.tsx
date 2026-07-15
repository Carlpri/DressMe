import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Checkbox, FormControlLabel, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { apiClient } from "../../api/client";
import { PageFrame } from "../../pages/PageFrame";

type Address = { id: string; fullName: string; phone: string; county: string; city: string; area: string; street: string; label?: string; isDefault: boolean };
const initial = { fullName: "", phone: "", county: "", city: "", area: "", street: "", label: "Home", isDefault: false };
const errorText = (e: unknown) => axios.isAxiosError(e) ? e.response?.data?.errors?.[0]?.message ?? e.response?.data?.message ?? "Request failed" : "Request failed";
export function AddressesPage() {
 const qc = useQueryClient(); const [form, setForm] = useState(initial); const [error, setError] = useState<string | null>(null);
 const list = useQuery({ queryKey: ["addresses"], queryFn: async () => (await apiClient.get<{ data: Address[] }>("/addresses")).data.data });
 const create = useMutation({ mutationFn: () => apiClient.post("/addresses", form), onSuccess: () => { setForm(initial); qc.invalidateQueries({ queryKey: ["addresses"] }); }, onError: e => setError(errorText(e)) });
 const mutate = useMutation({ mutationFn: ({ action, id }: { action: "default" | "delete"; id: string }) => action === "default" ? apiClient.patch(`/addresses/${id}/default`) : apiClient.delete(`/addresses/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }), onError: e => setError(errorText(e)) });
 return <PageFrame><Stack spacing={3}><Typography component="h1" variant="h4">Addresses</Typography><Paper variant="outlined" sx={{ p: 2 }}><Stack spacing={2}>{(["fullName", "phone", "county", "city", "area", "street", "label"] as const).map(key => <TextField key={key} required={key !== "label"} label={key.replace(/([A-Z])/g, " $1")} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />)}<FormControlLabel control={<Checkbox checked={form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} />} label="Set as default"/><Button variant="contained" onClick={() => create.mutate()} disabled={create.isPending}>Save address</Button></Stack></Paper>{list.data?.map(a => <Paper key={a.id} variant="outlined" sx={{ p: 2 }}><Stack direction="row" justifyContent="space-between"><Typography>{a.label}: {a.fullName}, {a.street}, {a.area}, {a.city}, {a.county} {a.isDefault && "(Default)"}</Typography><Stack direction="row"><Button disabled={a.isDefault} onClick={() => mutate.mutate({ action: "default", id: a.id })}>Set default</Button><Button color="error" onClick={() => mutate.mutate({ action: "delete", id: a.id })}>Delete</Button></Stack></Stack></Paper>)}{error && <Alert severity="error">{error}</Alert>}</Stack></PageFrame>;
}
