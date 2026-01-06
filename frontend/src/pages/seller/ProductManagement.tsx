import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Inventory,
  Category as CategoryIcon,
  CheckCircle,
  Warning,
  Search,
} from '@mui/icons-material';
import { productsAPI, categoriesAPI } from '../../services/api';
import { Product, Category } from '../../types';
import { ListSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { showSuccessToast, showErrorToast } from '../../components/common/ToastProvider';
import { formatCurrency } from '../../utils/formatters';
import { PLACEHOLDER_IMAGE } from '../../constants';

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    ten: '',
    moTa: '',
    gia: 0,
    soLuong: 0,
    danhMucId: '',
    hinhAnh: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadProducts(), loadCategories()]);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getMyProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
      showErrorToast('Failed to load products');
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      showErrorToast('Failed to load categories');
    }
  };

  const handleOpen = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ten: product.ten,
        moTa: product.moTa || '',
        gia: product.gia,
        soLuong: product.soLuong,
        danhMucId: product.danhMucId,
        hinhAnh: product.hinhAnh || [],
      });
      setImagePreview(product.hinhAnh || []);
    } else {
      setEditingProduct(null);
      setFormData({
        ten: '',
        moTa: '',
        gia: 0,
        soLuong: 0,
        danhMucId: '',
        hinhAnh: [],
      });
      setImagePreview([]);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
    setImagePreview([]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 5) {
      showErrorToast('You can upload maximum 5 images');
      return;
    }

    setUploadingImages(true);
    try {
      const response = await productsAPI.uploadImages(files);
      const uploadedUrls = response.data.urls;

      // Convert relative URLs to absolute URLs using backend URL
      const backendUrl = 'http://localhost:3000';
      const absoluteUrls = uploadedUrls.map(url => `${backendUrl}${url}`);

      setFormData(prev => ({
        ...prev,
        hinhAnh: [...prev.hinhAnh, ...absoluteUrls],
      }));
      setImagePreview(prev => [...prev, ...absoluteUrls]);
      showSuccessToast('Images uploaded successfully!');
    } catch (error: any) {
      showErrorToast(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      hinhAnh: prev.hinhAnh.filter((_, i) => i !== index),
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.ten || !formData.danhMucId || formData.gia <= 0) {
      showErrorToast('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, formData);
        showSuccessToast('Product updated successfully!');
      } else {
        await productsAPI.create(formData);
        showSuccessToast('Product created successfully!');
      }
      handleClose();
      loadProducts();
    } catch (error: any) {
      showErrorToast(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await productsAPI.delete(productToDelete.id);
      showSuccessToast('Product deleted successfully!');
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      loadProducts();
    } catch (error) {
      showErrorToast('Failed to delete product');
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.moTa?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status based on tab
    switch (selectedTab) {
      case 0: // All
        break;
      case 1: // Active
        filtered = filtered.filter(p => p.trangThai === true && p.soLuong > 0);
        break;
      case 2: // Out of Stock
        filtered = filtered.filter(p => p.soLuong === 0);
        break;
    }

    return filtered;
  };

  const filteredProducts = filterProducts();
  const activeCount = products.filter(p => p.trangThai === true && p.soLuong > 0).length;
  const outOfStockCount = products.filter(p => p.soLuong === 0).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              My Products
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your product catalog
            </Typography>
          </Box>
          <Button variant="contained" size="large" startIcon={<Add />} onClick={() => handleOpen()}>
            Add Product
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <Inventory color="primary" />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {products.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Products
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <CheckCircle color="success" />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {activeCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <Warning color="warning" />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {outOfStockCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Out of Stock
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search products by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)}>
          <Tab label={`All (${products.length})`} />
          <Tab label={`Active (${activeCount})`} />
          <Tab label={`Out of Stock (${outOfStockCount})`} />
        </Tabs>
      </Card>

      {/* Products List */}
      {loading ? (
        <ListSkeleton count={5} />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={<Inventory />}
          title={searchTerm ? "No products found" : "No products yet"}
          description={
            searchTerm
              ? "Try adjusting your search to find what you're looking for."
              : "Create your first product to start selling."
          }
          actionLabel="Add Product"
          onAction={() => handleOpen()}
        />
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => {
            const imageUrl = product.hinhAnh?.[0] || PLACEHOLDER_IMAGE;
            const isOutOfStock = product.soLuong === 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={imageUrl}
                    alt={product.ten}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                        {product.ten}
                      </Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleOpen(product)} color="primary">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteClick(product)} color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                      {product.moTa || 'No description'}
                    </Typography>

                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                        {formatCurrency(product.gia)}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          size="small"
                          label={`Stock: ${product.soLuong}`}
                          color={isOutOfStock ? 'error' : 'success'}
                          icon={isOutOfStock ? <Warning /> : <CheckCircle />}
                        />
                        <Chip
                          size="small"
                          label={categories.find(c => c.id === product.danhMucId)?.ten || 'No Category'}
                          icon={<CategoryIcon />}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Product Name"
            value={formData.ten}
            onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.moTa}
            onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={formData.gia}
            onChange={(e) => setFormData({ ...formData, gia: Number(e.target.value) })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Stock Quantity"
            type="number"
            value={formData.soLuong}
            onChange={(e) => setFormData({ ...formData, soLuong: Number(e.target.value) })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            select
            label="Category"
            value={formData.danhMucId}
            onChange={(e) => setFormData({ ...formData, danhMucId: e.target.value })}
            margin="normal"
            required
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.ten}
              </MenuItem>
            ))}
          </TextField>

          {/* Image Upload Section */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Product Images (Max 5)
            </Typography>

            <Button
              variant="outlined"
              component="label"
              disabled={uploadingImages || imagePreview.length >= 5}
              sx={{ mb: 2 }}
            >
              {uploadingImages ? 'Uploading...' : 'Upload Images'}
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </Button>

            {/* Image Preview Grid */}
            {imagePreview.length > 0 && (
              <Grid container spacing={2}>
                {imagePreview.map((url, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <Card sx={{ position: 'relative' }}>
                      <Box
                        component="img"
                        src={url}
                        alt={`Preview ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: 120,
                          objectFit: 'cover',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'background.paper',
                          '&:hover': { bgcolor: 'error.light' },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting || uploadingImages}>
            {submitting ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{productToDelete?.ten}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductManagement;
