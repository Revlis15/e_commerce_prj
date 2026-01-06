import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Chip,
  Breadcrumbs,
  Link,
  IconButton,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  ShoppingCart,
  Add,
  Remove,
  ArrowBack,
  LocalShipping,
  Verified,
  Inventory2,
} from '@mui/icons-material';
import { productsAPI, cartAPI } from '../../services/api';
import { Product } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { VaiTro } from '../../types';
import { ProductDetailSkeleton } from '../../components/common/LoadingSkeleton';
import { showSuccessToast, showErrorToast } from '../../components/common/ToastProvider';
import { formatCurrency } from '../../utils/formatters';
import { PLACEHOLDER_IMAGE, STOCK_STATUS } from '../../constants';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getOne(id!);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to load product:', error);
      showErrorToast('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      showErrorToast('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (user?.vaiTro !== VaiTro.CUSTOMER) {
      showErrorToast('Only customers can add items to cart');
      return;
    }

    try {
      await cartAPI.add(id!, quantity);
      showSuccessToast(`Added ${quantity} item(s) to cart!`);
      setQuantity(1);
    } catch (error) {
      showErrorToast('Failed to add to cart');
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.soLuong || 1)) {
      setQuantity(newQuantity);
    }
  };

  // Determine stock status
  const getStockStatus = () => {
    if (!product) return null;
    if (product.soLuong === STOCK_STATUS.OUT_OF_STOCK) {
      return { label: 'Out of Stock', color: 'error' as const };
    } else if (product.soLuong <= STOCK_STATUS.LOW_STOCK) {
      return { label: `Only ${product.soLuong} left!`, color: 'warning' as const };
    } else {
      return { label: 'In Stock', color: 'success' as const };
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ProductDetailSkeleton />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Product not found</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/products')} sx={{ mt: 2 }}>
          Back to Products
        </Button>
      </Container>
    );
  }

  const stockStatus = getStockStatus();
  const images = product.hinhAnh && product.hinhAnh.length > 0 ? product.hinhAnh : [PLACEHOLDER_IMAGE];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/')}
          sx={{ textDecoration: 'none', cursor: 'pointer' }}
        >
          Home
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/products')}
          sx={{ textDecoration: 'none', cursor: 'pointer' }}
        >
          Products
        </Link>
        <Typography variant="body2" color="text.primary">
          {product.ten}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          {/* Main Image */}
          <Box
            sx={{
              position: 'relative',
              paddingTop: '100%',
              bgcolor: 'grey.100',
              borderRadius: 2,
              overflow: 'hidden',
              mb: 2,
            }}
          >
            <img
              src={images[selectedImage]}
              alt={product.ten}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {images.map((image, index) => (
                <Box
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: selectedImage === index ? 'primary.main' : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.light',
                    },
                  }}
                >
                  <img
                    src={image}
                    alt={`${product.ten} ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          {/* Product Name */}
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            {product.ten}
          </Typography>

          {/* Stock Badge */}
          {stockStatus && (
            <Chip
              label={stockStatus.label}
              color={stockStatus.color}
              icon={stockStatus.color === 'success' ? <Verified /> : <Inventory2 />}
              sx={{ mb: 2 }}
            />
          )}

          {/* Price */}
          <Typography
            variant="h3"
            color="primary"
            sx={{ fontWeight: 700, mb: 3 }}
          >
            {formatCurrency(product.gia)}
          </Typography>

          {/* Description */}
          <Typography variant="body1" color="text.secondary" paragraph>
            {product.moTa || 'No description available.'}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Quantity Selector (for customers) */}
          {user?.vaiTro === VaiTro.CUSTOMER && product.soLuong > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Quantity
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    size="small"
                  >
                    <Remove />
                  </IconButton>
                  <Typography
                    sx={{
                      minWidth: 40,
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.soLuong}
                    size="small"
                  >
                    <Add />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {product.soLuong} available
                </Typography>
              </Box>
            </Box>
          )}

          {/* Add to Cart Button */}
          {user?.vaiTro === VaiTro.CUSTOMER && (
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.soLuong === 0}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                mb: 2,
              }}
            >
              {product.soLuong === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          )}

          {/* Login prompt for non-authenticated users */}
          {!isAuthenticated() && (
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => navigate('/login')}
              sx={{ py: 1.5, mb: 2 }}
            >
              Login to Purchase
            </Button>
          )}

          {/* Benefits Cards */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocalShipping color="primary" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Free Shipping
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      On orders over $100
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Verified color="primary" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Authentic Product
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      100% original guarantee
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Back to Products Button */}
      <Box sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
          variant="outlined"
        >
          Back to Products
        </Button>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;
