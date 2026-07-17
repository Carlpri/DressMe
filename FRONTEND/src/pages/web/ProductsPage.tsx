import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";
import { ProductCard } from "../../components/shared/ProductCard";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import type { ProductFilters } from "../../types/product";

const GENDER_OPTIONS = [
  { value: "", label: "All Genders" },
  { value: "MALE", label: "Men" },
  { value: "FEMALE", label: "Women" },
  { value: "UNISEX", label: "Unisex" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export function ProductsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Get filter values from URL or defaults
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const gender = (searchParams.get("gender") as ProductFilters["gender"]) || undefined;
  const sort = (searchParams.get("sort") as ProductFilters["sort"]) || "newest";
  const featured = searchParams.get("featured") === "true";

  const { data: products, isLoading, error, refetch } = useProducts({
    page,
    limit: 24,
    search: search || undefined,
    category: category || undefined,
    brand: brand || undefined,
    gender,
    sort,
    featured: featured || undefined,
  });

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete("page"); // Reset to page 1 when filters change
    setSearchParams(newParams);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    updateFilter("page", value.toString());
  };

  const clearFilters = () => {
    setSearchParams("");
  };

  const activeFilterCount = [search, category, brand, gender, featured].filter(Boolean).length;

  const filterContent = (
    <Stack spacing={3}>
      <TextField
        fullWidth
        label="Search"
        value={search}
        onChange={(e) => updateFilter("search", e.target.value)}
        placeholder="Search products..."
      />

      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={(e) => updateFilter("category", e.target.value)}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories?.map((cat) => (
            <MenuItem key={cat.id} value={cat.slug}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Brand</InputLabel>
        <Select
          value={brand}
          label="Brand"
          onChange={(e) => updateFilter("brand", e.target.value)}
        >
          <MenuItem value="">All Brands</MenuItem>
          {brands?.map((brand) => (
            <MenuItem key={brand.id} value={brand.slug}>
              {brand.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Gender</InputLabel>
        <Select
          value={gender || ""}
          label="Gender"
          onChange={(e) => updateFilter("gender", e.target.value)}
        >
          {GENDER_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sort}
          label="Sort By"
          onChange={(e) => updateFilter("sort", e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        onClick={clearFilters}
        disabled={activeFilterCount === 0}
        fullWidth
      >
        Clear Filters
      </Button>
    </Stack>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={4}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {featured ? "Featured Products" : "All Products"}
            </Typography>
            <Typography color="text.secondary">
              {products?.total || 0} products found
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            {activeFilterCount > 0 && (
              <Chip
                label={`${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active`}
                color="primary"
                size="small"
                onDelete={clearFilters}
              />
            )}
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterDrawerOpen(true)}
            >
              Filters
            </Button>
          </Stack>
        </Stack>

        {/* Desktop Filters */}
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ width: 250, flexShrink: 0 }}>{filterContent}</Box>
            <Box sx={{ flex: 1 }}>
              {isLoading ? (
                <Grid container spacing={3}>
                  {[...Array(8)].map((_, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                      <LoadingSkeleton height={400} />
                    </Grid>
                  ))}
                </Grid>
              ) : error ? (
                <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
                  Failed to load products
                </Alert>
              ) : products?.items.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No products found matching your filters
                  </Typography>
                  <Button onClick={clearFilters} sx={{ mt: 2 }}>
                    Clear Filters
                  </Button>
                </Box>
              ) : (
                <>
                  <Grid container spacing={3}>
                    {products?.items.map((product) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                        <ProductCard product={product} />
                      </Grid>
                    ))}
                  </Grid>

                  {products && products.totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                      <Pagination
                        count={products.totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <>
            <Box>
              {isLoading ? (
                <Grid container spacing={2}>
                  {[...Array(4)].map((_, i) => (
                    <Grid size={6} key={i}>
                      <LoadingSkeleton height={300} />
                    </Grid>
                  ))}
                </Grid>
              ) : error ? (
                <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
                  Failed to load products
                </Alert>
              ) : products?.items.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No products found
                  </Typography>
                  <Button onClick={clearFilters} sx={{ mt: 2 }}>
                    Clear Filters
                  </Button>
                </Box>
              ) : (
                <>
                  <Grid container spacing={2}>
                    {products?.items.map((product) => (
                      <Grid size={6} key={product.id}>
                        <ProductCard product={product} />
                      </Grid>
                    ))}
                  </Grid>

                  {products && products.totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                      <Pagination
                        count={products.totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>

            <Drawer
              anchor="bottom"
              open={filterDrawerOpen}
              onClose={() => setFilterDrawerOpen(false)}
              sx={{
                "& .MuiDrawer-paper": {
                  height: "auto",
                  maxHeight: "80vh",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                },
              }}
            >
              <Box sx={{ p: 3 }}>{filterContent}</Box>
            </Drawer>
          </>
        )}
      </Stack>
    </Container>
  );
}
