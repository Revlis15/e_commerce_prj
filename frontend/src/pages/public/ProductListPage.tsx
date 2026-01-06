import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  Button,
  IconButton,
  Slider,
  FormControlLabel,
  Checkbox,
  Divider,
  useMediaQuery,
  useTheme,
  InputAdornment,
} from '@mui/material';
import { Search, FilterList, Close } from '@mui/icons-material';
import { productsAPI, categoriesAPI, cartAPI } from '../../services/api';
import { Product, Category } from '../../types';
import ProductCard from '../../components/product/ProductCard';
import { ProductGridSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { showSuccessToast, showErrorToast } from '../../components/common/ToastProvider';
import { useAuthStore } from '../../store/useAuthStore';
import { PRODUCT_SORT_OPTIONS } from '../../constants';

const ProductListPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProducts();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [search, selectedCategories, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const categoryParam = selectedCategories.length > 0 ? selectedCategories[0] : undefined;
      const response = await productsAPI.getAll(search, categoryParam);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
      showErrorToast('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated()) {
      showErrorToast('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await cartAPI.add(productId, 1);
      showSuccessToast('Product added to cart!');
    } catch (error) {
      showErrorToast('Failed to add product to cart');
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [categoryId] // Single selection for now
    );
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setInStockOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by price range
    filtered = filtered.filter(
      (p) => p.gia >= priceRange[0] && p.gia <= priceRange[1]
    );

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.soLuong > 0);
    }

    // Sort products
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.gia - b.gia);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.gia - a.gia);
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.ten.localeCompare(b.ten));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.ten.localeCompare(a.ten));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [products, priceRange, inStockOnly, sortBy]);

  // Filter sidebar component
  const FilterSidebar = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filters
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Categories */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Categories
        </Typography>
        {categoriesLoading ? (
          <Typography variant="body2" color="text.secondary">Loading...</Typography>
        ) : (
          categories.map((category) => (
            <FormControlLabel
              key={category.id}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                />
              }
              label={category.ten}
            />
          ))
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2">${priceRange[0]}</Typography>
          <Typography variant="body2">${priceRange[1]}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Stock Status */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
          }
          label="In Stock Only"
        />
      </Box>

      {/* Clear Filters */}
      <Button
        variant="outlined"
        fullWidth
        onClick={handleClearFilters}
        sx={{ mt: 2 }}
      >
        Clear All Filters
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse our collection of quality products
        </Typography>
      </Box>

      {/* Search and Sort Bar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, minWidth: 250 }}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            {PRODUCT_SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {isMobile && (
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFilterDrawerOpen(true)}
          >
            Filters
          </Button>
        )}
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Filter Sidebar - Desktop */}
        {!isMobile && (
          <Grid item md={3}>
            <Box
              sx={{
                position: 'sticky',
                top: 80,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <FilterSidebar />
            </Box>
          </Grid>
        )}

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          {/* Results Count */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </Typography>
          </Box>

          {/* Products */}
          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              icon={<Search />}
              title="No products found"
              description="Try adjusting your search or filters to find what you're looking for."
              action={{
                label: 'Clear Filters',
                onClick: handleClearFilters,
              }}
            />
          ) : (
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} lg={4} key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    showQuickAdd
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      >
        <Box sx={{ width: 300 }}>
          <FilterSidebar />
        </Box>
      </Drawer>
    </Container>
  );
};

export default ProductListPage;
