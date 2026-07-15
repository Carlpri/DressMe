import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Alert, Box, Button, Card, CardActions, CardContent, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Stack, TextField, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { apiClient } from "../../api/client";
import { PageFrame } from "../../pages/PageFrame";
import { Link as RouterLink } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

interface Product { id: string; name: string; slug: string; description: string; price: number; stock: number; status: string; brand: { name: string }; category: { name: string }; vendor: { shopName: string }; variants: Array<{ id: string; size: string; color: string; stock: number; price?: number | null }>; }
interface ProductResult { items: Product[]; page: number; totalPages: number; total: number; }
const message = (error: unknown) => axios.isAxiosError(error) ? error.response?.data?.message ?? "Request failed" : "Request failed";

export function CustomerWorkspace() {
  const client = useQueryClient(); const [search, setSearch] = useState(""); const [selected, setSelected] = useState<Product | null>(null); const [review, setReview] = useState({ rating: "5", comment: "" });
  const products = useQuery({ queryKey: ["products", search], queryFn: async () => (await apiClient.get<{ data: ProductResult }>("/products", { params: { ...(search.trim() ? { search: search.trim() } : {}), limit: 24, status: "ACTIVE" } })).data.data });
  const cart = useMutation({ mutationFn: ({ productId, variantId }: { productId: string; variantId?: string }) => apiClient.post("/cart/items", { productId, variantId, quantity: 1 }), onSuccess: () => client.invalidateQueries({ queryKey: ["cart"] }) });
  const favourite = useMutation({ mutationFn: (productId: string) => apiClient.post("/favourites", { productId }), onSuccess: () => client.invalidateQueries({ queryKey: ["favourites"] }) });
  const addReview = useMutation({ mutationFn: () => apiClient.post("/reviews", { productId: selected!.id, rating: Number(review.rating), comment: review.comment || undefined }), onSuccess: () => { setSelected(null); setReview({ rating: "5", comment: "" }); client.invalidateQueries({ queryKey: ["reviews"] }); } });
  return <PageFrame><Stack spacing={3}><Box><Typography component="h1" variant="h4">Customer commerce workspace</Typography><Typography color="text.secondary">Live catalogue, cart, favourites, and review operations.</Typography><Button component={RouterLink} to={ROUTES.customerCart} sx={{ mt: 1 }}>View my cart</Button></Box><TextField label="Search products" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name or description" />
    {products.isLoading && <CircularProgress />}{products.isError && <Alert severity="error" action={<Button onClick={() => products.refetch()}>Retry</Button>}>{message(products.error)}</Alert>}
    <Grid container spacing={2}>{products.data?.items.map((product) => <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}><Card variant="outlined"><CardContent><Stack spacing={1}><Typography variant="h6">{product.name}</Typography><Typography variant="body2" color="text.secondary">{product.brand.name} · {product.category.name} · {product.vendor.shopName}</Typography><Typography>{product.description}</Typography><Typography fontWeight={700}>KES {product.price.toLocaleString()}</Typography><Chip size="small" label={`${product.stock} in stock · ${product.status}`} sx={{ alignSelf: "start" }} /></Stack></CardContent><CardActions><Button disabled={cart.isPending} onClick={() => cart.mutate({ productId: product.id, variantId: product.variants[0]?.id })}>Add to cart</Button><IconButton disabled={favourite.isPending} onClick={() => favourite.mutate(product.id)} aria-label="Add favourite"><FavoriteBorderIcon /></IconButton><Button onClick={() => setSelected(product)}>Review</Button></CardActions></Card></Grid>)}</Grid>
    {products.data && !products.data.items.length && <Alert severity="info">No products match this search.</Alert>}
    {(cart.error || favourite.error || addReview.error) && <Alert severity="error">{message(cart.error ?? favourite.error ?? addReview.error)}</Alert>}
    <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="sm"><DialogTitle>Review {selected?.name}</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><TextField select label="Rating" value={review.rating} onChange={(event) => setReview((value) => ({ ...value, rating: event.target.value }))}>{[1, 2, 3, 4, 5].map((rating) => <MenuItem value={rating} key={rating}>{rating} star{rating > 1 ? "s" : ""}</MenuItem>)}</TextField><TextField label="Comment" multiline minRows={4} value={review.comment} onChange={(event) => setReview((value) => ({ ...value, comment: event.target.value }))} /></Stack></DialogContent><DialogActions><Button onClick={() => setSelected(null)}>Cancel</Button><Button variant="contained" disabled={addReview.isPending} onClick={() => addReview.mutate()}>Submit review</Button></DialogActions></Dialog>
  </Stack></PageFrame>;
}
