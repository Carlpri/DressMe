import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Alert, Button, CircularProgress, IconButton, Paper, Stack, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { apiClient } from "../../api/client";
import { PageFrame } from "../../pages/PageFrame";

type CartItem = { id: string; quantity: number; product: { name: string; price: number }; variant?: { size: string; color: string; price?: number | null } | null };
type Cart = { items: CartItem[] };
const errorMessage = (error: unknown) => axios.isAxiosError(error) ? error.response?.data?.message ?? "Request failed" : "Request failed";

export function CartPage() {
  const client = useQueryClient();
  const cart = useQuery({ queryKey: ["cart"], queryFn: async () => (await apiClient.get<{ data: Cart }>("/cart")).data.data });
  const update = useMutation({ mutationFn: ({ id, quantity }: { id: string; quantity: number }) => apiClient.patch(`/cart/items/${id}`, { quantity }), onSuccess: () => client.invalidateQueries({ queryKey: ["cart"] }) });
  const remove = useMutation({ mutationFn: (id: string) => apiClient.delete(`/cart/items/${id}`), onSuccess: () => client.invalidateQueries({ queryKey: ["cart"] }) });
  const clear = useMutation({ mutationFn: () => apiClient.delete("/cart"), onSuccess: () => client.invalidateQueries({ queryKey: ["cart"] }) });
  const items = cart.data?.items ?? [];
  return <PageFrame><Stack spacing={3}><Stack direction="row" justifyContent="space-between"><Typography component="h1" variant="h4">My cart</Typography><Button color="error" disabled={!items.length || clear.isPending} onClick={() => clear.mutate()}>Clear cart</Button></Stack>{cart.isLoading && <CircularProgress />}{cart.isError && <Alert severity="error" action={<Button onClick={() => cart.refetch()}>Retry</Button>}>{errorMessage(cart.error)}</Alert>}{!cart.isLoading && !items.length && <Alert severity="info">Your cart is empty.</Alert>}{items.map((item) => <Paper variant="outlined" key={item.id} sx={{ p: 2 }}><Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}><Stack><Typography fontWeight={600}>{item.product.name}</Typography><Typography color="text.secondary">KES {Number(item.variant?.price ?? item.product.price).toLocaleString()} {item.variant ? `· ${item.variant.size}, ${item.variant.color}` : ""}</Typography></Stack><Stack direction="row" alignItems="center"><Button disabled={item.quantity <= 1 || update.isPending} onClick={() => update.mutate({ id: item.id, quantity: item.quantity - 1 })}>−</Button><Typography>{item.quantity}</Typography><Button disabled={update.isPending} onClick={() => update.mutate({ id: item.id, quantity: item.quantity + 1 })}>+</Button><IconButton color="error" disabled={remove.isPending} onClick={() => remove.mutate(item.id)}><DeleteOutlineIcon /></IconButton></Stack></Stack></Paper>)}{(update.error || remove.error || clear.error) && <Alert severity="error">{errorMessage(update.error ?? remove.error ?? clear.error)}</Alert>}</Stack></PageFrame>;
}
