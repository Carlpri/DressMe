import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Checkbox, FormControlLabel, Paper, Stack, TextField, Typography, Container } from "@mui/material";
import axios from "axios";
import { apiClient } from "../../api/client";

type Product = { id: string; name: string };
type Outfit = { id: string; title: string; style: string; description: string; items: Array<{ product: Product }> };

const errorText = (e: unknown) => axios.isAxiosError(e) ? e.response?.data?.message ?? "Request failed" : "Request failed";

export function OutfitsPage() {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("");
  const [ids, setIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const products = useQuery({
    queryKey: ["outfit-products"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { items: Product[] } }>("/products", {
        params: { status: "ACTIVE", limit: 100 },
      });
      return response.data.data.items;
    },
  });

  const mine = useQuery({
    queryKey: ["my-outfits"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Outfit[] }>("/outfits/my");
      return response.data.data;
    },
  });

  const create = useMutation({
    mutationFn: () => apiClient.post("/outfits", { title, description, style, productIds: ids }),
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setStyle("");
      setIds([]);
      qc.invalidateQueries({ queryKey: ["my-outfits"] });
    },
    onError: (e) => setError(errorText(e)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/outfits/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-outfits"] }),
  });

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={3}>
        <Typography component="h1" variant="h4">
          My Outfits
        </Typography>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextField label="Style" value={style} onChange={(e) => setStyle(e.target.value)} />
            <TextField
              label="Description"
              multiline
              minRows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Typography>Select one or more products:</Typography>
            {products.data?.map((product) => (
              <FormControlLabel
                key={product.id}
                control={
                  <Checkbox
                    checked={ids.includes(product.id)}
                    onChange={(e) =>
                      setIds((current) =>
                        e.target.checked
                          ? [...current, product.id]
                          : current.filter((id) => id !== product.id),
                      )
                    }
                  />
                }
                label={product.name}
              />
            ))}
            <Button
              variant="contained"
              disabled={!title || !style || description.length < 10 || !ids.length || create.isPending}
              onClick={() => create.mutate()}
            >
              Create outfit
            </Button>
          </Stack>
        </Paper>

        {mine.data?.map((outfit) => (
          <Paper variant="outlined" key={outfit.id} sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography>
                {outfit.title} · {outfit.style} — {outfit.items.map((item) => item.product.name).join(", ")}
              </Typography>
              <Button color="error" onClick={() => remove.mutate(outfit.id)}>
                Delete
              </Button>
            </Stack>
          </Paper>
        ))}

        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </Container>
  );
}
