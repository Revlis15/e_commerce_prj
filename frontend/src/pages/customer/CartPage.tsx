import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  IconButton,
  Grid,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  ArrowForward,
  LocalShipping,
} from '@mui/icons-material';
import { cartAPI } from '../../services/api';
import { Cart } from '../../types';
import { ListSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { showSuccessToast, showErrorToast } from '../../components/common/ToastProvider';
import { formatCurrency } from '../../utils/formatters';
import { PLACEHOLDER_IMAGE } from '../../constants';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

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

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItem(itemId);
    try {
      await cartAPI.update(itemId, newQuantity);
      await loadCart();
      showSuccessToast('Cart updated');
    } catch (error) {
      console.error('Failed to update quantity:', error);
      showErrorToast('Failed to update quantity');
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleRemoveConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await cartAPI.remove(itemToDelete);
      await loadCart();
      showSuccessToast('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item:', error);
      showErrorToast('Failed to remove item');
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" sx={{ mb: 4, fontWeight: 700 }}>
          Shopping Cart
        </Typography>
        <ListSkeleton count={3} />
      </Container>
    );
  }

  if (!cart || cart.chiTiets.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" sx={{ mb: 4, fontWeight: 700 }}>
          Shopping Cart
        </Typography>
        <EmptyState
          icon={<ShoppingCart />}
          title="Your cart is empty"
          description="Looks like you haven't added any items to your cart yet. Start shopping to fill it up!"
          action={{
            label: 'Continue Shopping',
            onClick: () => navigate('/products'),
          }}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 700 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Cart Items ({cart.chiTiets.length})
          </Typography>

          {cart.chiTiets.map((item) => {
            const imageUrl = item.sanPham.hinhAnh?.[0] || PLACEHOLDER_IMAGE;
            const isUpdating = updatingItem === item.id;

            return (
              <Card key={item.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    {/* Product Image */}
                    <Grid item xs={12} sm={3}>
                      <Box
                        component="img"
                        src={imageUrl}
                        alt={item.sanPham.ten}
                        sx={{
                          width: '100%',
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    </Grid>

                    {/* Product Info */}
                    <Grid item xs={12} sm={4}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          cursor: 'pointer',
                          '&:hover': { color: 'primary.main' },
                        }}
                        onClick={() => navigate(`/products/${item.sanPham.id}`)}
                      >
                        {item.sanPham.ten}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(item.sanPham.gia)} each
                      </Typography>
                    </Grid>

                    {/* Quantity Controls */}
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.soLuong - 1)}
                          disabled={isUpdating || item.soLuong <= 1}
                          sx={{ border: '1px solid', borderColor: 'divider' }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography
                          sx={{
                            minWidth: 40,
                            textAlign: 'center',
                            fontWeight: 600,
                          }}
                        >
                          {item.soLuong}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.id, item.soLuong + 1)}
                          disabled={isUpdating || item.soLuong >= item.sanPham.soLuong}
                          sx={{ border: '1px solid', borderColor: 'divider' }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>

                    {/* Price and Delete */}
                    <Grid item xs={12} sm={2}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {formatCurrency(item.sanPham.gia * item.soLuong)}
                        </Typography>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveClick(item.id)}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}

          {/* Continue Shopping Button */}
          <Button
            variant="outlined"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Grid>

        {/* Order Summary - Sticky */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              position: { md: 'sticky' },
              top: 80,
            }}
          >
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              Order Summary
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatCurrency(calculateSubtotal())}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Shipping</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {calculateShipping() === 0 ? 'FREE' : formatCurrency(calculateShipping())}
                </Typography>
              </Box>

              {calculateShipping() > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <LocalShipping fontSize="small" color="info" />
                  <Typography variant="caption" color="info.main">
                    Add {formatCurrency(100 - calculateSubtotal())} more for free shipping!
                  </Typography>
                </Box>
              )}
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
              variant="contained"
              size="large"
              fullWidth
              endIcon={<ArrowForward />}
              onClick={() => navigate('/checkout')}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Proceed to Checkout
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 2, textAlign: 'center' }}
            >
              Secure checkout powered by SSL encryption
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Remove Item?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove this item from your cart?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRemoveConfirm} color="error" variant="contained">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CartPage;
