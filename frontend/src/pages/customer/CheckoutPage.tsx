import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
} from '@mui/material';
import {
  ShoppingCart,
  Payment,
  CheckCircle,
  ArrowBack,
} from '@mui/icons-material';
import { ordersAPI, cartAPI } from '../../services/api';
import { Cart } from '../../types';
import { ProductDetailSkeleton } from '../../components/common/LoadingSkeleton';
import { showSuccessToast, showErrorToast } from '../../components/common/ToastProvider';
import { formatCurrency } from '../../utils/formatters';
import { PAYMENT_METHODS, PLACEHOLDER_IMAGE } from '../../constants';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (error) {
      console.error('Failed to load cart:', error);
      showErrorToast('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cart?.chiTiets.reduce((sum, item) => sum + item.sanPham.gia * item.soLuong, 0) || 0;
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 100 ? 0 : 10;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleCheckout = async () => {
    if (!cart || cart.chiTiets.length === 0) {
      showErrorToast('Your cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      const response = await ordersAPI.create(paymentMethod);
      showSuccessToast('Order placed successfully!');
      navigate(`/orders/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create order:', error);
      showErrorToast('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <ProductDetailSkeleton />
      </Container>
    );
  }

  if (!cart || cart.chiTiets.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your cart is empty. Add some items before checkout.
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/cart')}
        sx={{ mb: 3 }}
      >
        Back to Cart
      </Button>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Checkout
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review your order and complete payment
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Order Review */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Order Summary ({cart.chiTiets.length} item{cart.chiTiets.length !== 1 ? 's' : ''})
            </Typography>

            {cart.chiTiets.map((item) => {
              const imageUrl = item.sanPham.hinhAnh?.[0] || PLACEHOLDER_IMAGE;

              return (
                <Card key={item.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                    <Box
                      component="img"
                      src={imageUrl}
                      alt={item.sanPham.ten}
                      sx={{
                        width: 60,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {item.sanPham.ten}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.soLuong} × {formatCurrency(item.sanPham.gia)}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {formatCurrency(item.sanPham.gia * item.soLuong)}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Paper>
        </Grid>

        {/* Payment Method */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Payment color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Payment Method
              </Typography>
            </Box>

            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {PAYMENT_METHODS.map((method) => (
                <FormControlLabel
                  key={method.value}
                  value={method.value}
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {method.label}
                      </Typography>
                      {method.value === 'COD' && (
                        <Typography variant="caption" color="text.secondary">
                          Pay with cash upon delivery
                        </Typography>
                      )}
                    </Box>
                  }
                  sx={{
                    border: '1px solid',
                    borderColor: paymentMethod === method.value ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    mb: 1,
                    p: 1.5,
                    ml: 0,
                    mr: 0,
                  }}
                />
              ))}
            </RadioGroup>
          </Paper>
        </Grid>

        {/* Order Total */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Order Total
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1" fontWeight={600}>
                {formatCurrency(calculateSubtotal())}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">Shipping</Typography>
              <Typography variant="body1" fontWeight={600}>
                {calculateShipping() === 0 ? 'FREE' : formatCurrency(calculateShipping())}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                Total
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                {formatCurrency(calculateTotal())}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleCheckout}
              disabled={submitting}
              startIcon={<CheckCircle />}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 2, textAlign: 'center' }}
            >
              By placing this order, you agree to our terms and conditions
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
