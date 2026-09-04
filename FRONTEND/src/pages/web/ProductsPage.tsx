import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Typography,
  Select,
  MenuItem,
  Pagination,
  Chip,
  Alert,
  Button,
  InputBase,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";
import { ProductCard } from "../../components/shared/ProductCard";
import { MasonryGrid } from "../../components/shared/MasonryGrid";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import type { ProductFilters } from "../../types/product";

const GENDER_OPTIONS = [
  { value: "", label: "All" },
  { value: "FEMALE", label: "Women" },
  { value: "MALE", label: "Men" },
  { value: "UNISEX", label: "Unisex" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "oldest", label: "Oldest" },
];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const gender = (searchParams.get("gender") as ProductFilters["gender"]) || undefined;
  const sort = (searchParams.get("sort") as ProductFilters["sort"]) || "newest";
  const featured = searchParams.get("featured") === "true";

  const [searchInput, setSearchInput] = useState(search);

  const { data: products, isLoading, error, refetch } = useProducts({
    page,
    limit: 28,
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
    newParams.delete("page"); // Reset to page 1
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    updateFilter("search", "");
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    updateFilter("page", value.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams("");
  };

  const activeFilterCount = [search, category, brand, gender, featured].filter(Boolean).length;

  return (
    <Box sx={{ bgcolor: "#FFFFFF", minHeight: "100vh", color: "#0D0D0D" }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2.5, md: 4 }, py: { xs: 2, sm: 3, md: 4 } }}>
        <Stack spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {/* ══════════════════════════════════════════════════════════════════
              HEADER & ACTIVE COUNTS (Minimalist)
          ══════════════════════════════════════════════════════════════════ */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
            flexWrap="wrap"
            sx={{ px: 0.5 }}
          >
            <Stack direction="row" alignItems="baseline" spacing={1.5}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.2rem" },
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                {category
                  ? categories?.find((c) => c.slug === category)?.name || "Category"
                  : featured
                  ? "Featured Looks"
                  : "Explore All"}
              </Typography>
              <Typography
                sx={{
                  color: "#71717A",
                  fontSize: { xs: "0.78rem", sm: "0.85rem" },
                  fontWeight: 500,
                }}
              >
                {products?.total || 0} styles
              </Typography>
            </Stack>

            {/* Active Filters indicator */}
            {activeFilterCount > 0 && (
              <Button
                size="small"
                onClick={clearFilters}
                sx={{
                  textTransform: "none",
                  color: "#E11D48",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  p: 0,
                  "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                }}
              >
                Reset filters ({activeFilterCount})
              </Button>
            )}
          </Stack>

          {/* ══════════════════════════════════════════════════════════════════
              PINTEREST TOP FILTER BAR: CATEGORY PILLS (Horizontal Scroll)
          ══════════════════════════════════════════════════════════════════ */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              overflowX: "auto",
              pb: 0.5,
              pt: 0.2,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* "All" Pill */}
            <Chip
              label="All Styles"
              clickable
              onClick={() => updateFilter("category", "")}
              sx={{
                borderRadius: "9999px",
                fontWeight: 700,
                fontSize: { xs: "0.78rem", sm: "0.82rem" },
                height: { xs: 34, sm: 38 },
                px: { xs: 0.5, sm: 1 },
                bgcolor: !category ? "#0D0D0D" : "#F4F4F5",
                color: !category ? "#FFFFFF" : "#27272A",
                border: "1px solid",
                borderColor: !category ? "#0D0D0D" : "rgba(0,0,0,0.06)",
                boxShadow: !category ? "0 2px 8px rgba(0,0,0,0.18)" : "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: !category ? "#262626" : "#E4E4E7",
                },
              }}
            />

            {/* Category Pills */}
            {categories?.map((cat) => {
              const isActive = category === cat.slug;
              return (
                <Chip
                  key={cat.id}
                  label={cat.name}
                  clickable
                  onClick={() => updateFilter("category", isActive ? "" : cat.slug)}
                  sx={{
                    borderRadius: "9999px",
                    fontWeight: 700,
                    fontSize: { xs: "0.78rem", sm: "0.82rem" },
                    height: { xs: 34, sm: 38 },
                    px: { xs: 0.5, sm: 1 },
                    bgcolor: isActive ? "#0D0D0D" : "#F4F4F5",
                    color: isActive ? "#FFFFFF" : "#27272A",
                    border: "1px solid",
                    borderColor: isActive ? "#0D0D0D" : "rgba(0,0,0,0.06)",
                    boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.18)" : "none",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: isActive ? "#262626" : "#E4E4E7",
                    },
                  }}
                />
              );
            })}
          </Box>

          {/* ══════════════════════════════════════════════════════════════════
              PINTEREST SECONDARY CONTROLS (Search, Gender, Sort, Brand)
          ══════════════════════════════════════════════════════════════════ */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 1.5 },
              overflowX: "auto",
              pb: 0.5,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              WebkitOverflowScrolling: "touch",
              flexWrap: { xs: "nowrap", md: "wrap" },
            }}
          >
            {/* Search Pill Input */}
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#F4F4F5",
                borderRadius: "9999px",
                height: { xs: 34, sm: 38 },
                px: 1.5,
                border: "1px solid rgba(0,0,0,0.06)",
                flexShrink: 0,
                width: { xs: 160, sm: 220, md: 240 },
                transition: "all 0.2s ease",
                "&:focus-within": {
                  bgcolor: "#FFFFFF",
                  borderColor: "#0D0D0D",
                  boxShadow: "0 0 0 2px rgba(13,13,13,0.1)",
                },
              }}
            >
              <SearchIcon sx={{ color: "#71717A", fontSize: 18, mr: 0.75 }} />
              <InputBase
                placeholder="Search looks…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                sx={{
                  fontSize: { xs: "0.78rem", sm: "0.82rem" },
                  fontWeight: 500,
                  color: "#0D0D0D",
                  width: "100%",
                }}
              />
              {searchInput && (
                <IconButton size="small" onClick={clearSearch} sx={{ p: 0.25, color: "#71717A" }}>
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              )}
            </Box>

            {/* Gender Toggle Pills */}
            <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
              {GENDER_OPTIONS.map((g) => {
                const isSelected = (gender || "") === g.value;
                return (
                  <Chip
                    key={g.value}
                    label={g.label}
                    size="small"
                    clickable
                    onClick={() => updateFilter("gender", g.value)}
                    sx={{
                      borderRadius: "9999px",
                      height: { xs: 34, sm: 38 },
                      px: { xs: 0.3, sm: 0.8 },
                      fontWeight: 700,
                      fontSize: { xs: "0.75rem", sm: "0.8rem" },
                      bgcolor: isSelected ? "#0D0D0D" : "#F4F4F5",
                      color: isSelected ? "#FFFFFF" : "#3F3F46",
                      border: "1px solid",
                      borderColor: isSelected ? "#0D0D0D" : "rgba(0,0,0,0.06)",
                      "&:hover": { bgcolor: isSelected ? "#262626" : "#E4E4E7" },
                    }}
                  />
                );
              })}
            </Stack>

            {/* Sort Select Pill */}
            <Box sx={{ flexShrink: 0 }}>
              <Select
                value={sort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                size="small"
                sx={{
                  borderRadius: "9999px",
                  height: { xs: 34, sm: 38 },
                  bgcolor: "#F4F4F5",
                  border: "1px solid rgba(0,0,0,0.06)",
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  fontWeight: 700,
                  color: "#27272A",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "& .MuiSelect-select": { py: 0.6, pl: 1.5, pr: "28px !important" },
                }}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value} sx={{ fontSize: "0.82rem" }}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Brand Dropdown Pill */}
            {brands && brands.length > 0 && (
              <Box sx={{ flexShrink: 0 }}>
                <Select
                  value={brand}
                  displayEmpty
                  onChange={(e) => updateFilter("brand", e.target.value)}
                  size="small"
                  sx={{
                    borderRadius: "9999px",
                    height: { xs: 34, sm: 38 },
                    bgcolor: brand ? "#0D0D0D" : "#F4F4F5",
                    border: "1px solid",
                    borderColor: brand ? "#0D0D0D" : "rgba(0,0,0,0.06)",
                    fontSize: { xs: "0.75rem", sm: "0.8rem" },
                    fontWeight: 700,
                    color: brand ? "#FFFFFF" : "#27272A",
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "& .MuiSelect-select": { py: 0.6, pl: 1.5, pr: "28px !important" },
                    "& .MuiSelect-icon": { color: brand ? "#FFFFFF" : "#71717A" },
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: "0.82rem" }}>
                    All Brands
                  </MenuItem>
                  {brands.map((b) => (
                    <MenuItem key={b.id} value={b.slug} sx={{ fontSize: "0.82rem" }}>
                      {b.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            )}

            {/* Featured Quick Toggle */}
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: "14px !important", color: featured ? "#C9A96E" : "#71717A" }} />}
              label="Featured"
              clickable
              onClick={() => updateFilter("featured", featured ? "" : "true")}
              sx={{
                borderRadius: "9999px",
                height: { xs: 34, sm: 38 },
                px: { xs: 0.5, sm: 1 },
                fontWeight: 700,
                fontSize: { xs: "0.75rem", sm: "0.8rem" },
                bgcolor: featured ? "#0D0D0D" : "#F4F4F5",
                color: featured ? "#FFFFFF" : "#3F3F46",
                border: "1px solid",
                borderColor: featured ? "#0D0D0D" : "rgba(0,0,0,0.06)",
                flexShrink: 0,
                "&:hover": { bgcolor: featured ? "#262626" : "#E4E4E7" },
              }}
            />
          </Box>

          {/* ══════════════════════════════════════════════════════════════════
              FULL-WIDTH PINTEREST MASONRY GRID (Minimalist & High Information)
          ══════════════════════════════════════════════════════════════════ */}
          <Box sx={{ width: "100%", pt: 1 }}>
            {isLoading ? (
              <MasonryGrid
                columns={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }}
                gap={{ xs: "8px", sm: "10px", md: "14px" }}
              >
                {[...Array(10)].map((_, i) => (
                  <LoadingSkeleton key={i} height={340} />
                ))}
              </MasonryGrid>
            ) : error ? (
              <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>}>
                Failed to load products. Please check your connection.
              </Alert>
            ) : products?.items.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#0D0D0D" }}>
                  No styles found
                </Typography>
                <Typography sx={{ color: "#71717A", mt: 1, fontSize: "0.95rem" }}>
                  Try adjusting your filters or search keywords to see more looks.
                </Typography>
                <Button
                  variant="contained"
                  onClick={clearFilters}
                  sx={{
                    mt: 3,
                    bgcolor: "#0D0D0D",
                    color: "#FFF",
                    borderRadius: "9999px",
                    px: 3,
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#262626" },
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
            ) : (
              <>
                <MasonryGrid
                  columns={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }}
                  gap={{ xs: "8px", sm: "10px", md: "14px" }}
                >
                  {products?.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </MasonryGrid>

                {/* Minimalist Pagination */}
                {products && products.totalPages > 1 && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 6, mb: 4 }}>
                    <Pagination
                      count={products.totalPages}
                      page={page}
                      onChange={handlePageChange}
                      shape="rounded"
                      color="primary"
                      size="medium"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          fontWeight: 700,
                          borderRadius: "8px",
                          "&.Mui-selected": {
                            bgcolor: "#0D0D0D",
                            color: "#FFFFFF",
                            "&:hover": { bgcolor: "#262626" },
                          },
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
