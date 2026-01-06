import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  LocalShipping,
  CheckCircle,
  Person,
  Receipt,
  Edit,
} from '@mui/icons-material';
import { ordersAPI, productsAPI } from '../../services/api';
import { Order } from '../../types';
import { ProductDetailSkeleton } from '../../components/common/LoadingSkeleton';
import { showSuccessToast, showErrorToast } from '../../components/common/ToastProvider';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUS, PLACEHOLDER_IMAGE } from '../../constants';

const SellerOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellerProductIds, setSellerProductIds] = useState<Set<string>>(new Set());
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadSellerProducts();
  }, []);

  useEffect(() => {
    if (sellerProductIds.size > 0) {
      loadOrder();
    }
  }, [id, sellerProductIds]);

  const loadSellerProducts = async () => {
    try {
      const response = await productsAPI.getMyProducts();
      const productIds = new Set(response.data.map(p => p.id));
      setSellerProductIds(productIds);
    } catch (error) {
      console.error('Failed to load seller products:', error);
    }
  };

  const loadOrder = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getOne(id!);
      setOrder(response.data);
      setNewStatus(response.data.trangThai);
    } catch (error) {
      console.error('Failed to load order:', error);
      showErrorToast('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === order?.trangThai) {
      setStatusDialogOpen(false);
      return;
    }

    setUpdating(true);
    try {
      await ordersAPI.updateStatus(id!, newStatus);
      showSuccessToast('Order status updated successfully');
      setStatusDialogOpen(false);
      loadOrder();
    } catch (error) {
      console.error('Failed to update status:', error);
      showErrorToast('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusConfig = (status: string) => {
    return Object.values(ORDER_STATUS).find(s => s.value === status) || ORDER_STATUS.PENDING;
  };

  const getOrderSteps = () => {
    const allSteps = ['PENDING', 'PROCESSING', 'SHIPPING', 'DELIVERED'];
    const currentStatusIndex = allSteps.indexOf(order?.trangThai || 'PENDING');
    const activeStep = currentStatusIndex >= 0 ? currentStatusIndex : 0;

    return { steps: allSteps, activeStep };
  };

  const getAvailableStatuses = () => {
    const current = order?.trangThai;
    const statuses = [];

    if (current === ORDER_STATUS.PENDING.value) {
      statuses.push(ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED);
    } else if (current === ORDER_STATUS.PROCESSING.value) {
      statuses.push(ORDER_STATUS.SHIPPING, ORDER_STATUS.CANCELLED);
    } else if (current === ORDER_STATUS.SHIPPING.value) {
      statuses.push(ORDER_STATUS.DELIVERED);
    }

    return statuses;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ProductDetailSkeleton />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Order not found</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/seller/orders')} sx={{ mt: 2 }}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  const statusConfig = getStatusConfig(order.trangThai);
  const { steps, activeStep } = getOrderSteps();
  const sellerItems = order.chiTiets?.filter(item => sellerProductIds.has(item.sanPhamId)) || [];
  const sellerTotal = sellerItems.reduce((sum, item) => sum + item.donGia * item.soLuong, 0);
  const canUpdateStatus = order.trangThai !== ORDER_STATUS.DELIVERED.value && order.trangThai !== ORDER_STATUS.CANCELLED.value;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/seller/orders')}
        sx={{ mb: 3 }}
      >
        Back to Orders
      </Button>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              Order Details
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Order ID: {order.id}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip
              label={statusConfig.label}
              color={statusConfig.color}
              size="large"
              sx={{ px: 2, py: 3, fontSize: '1rem' }}
            />
            {canUpdateStatus && (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setStatusDialogOpen(true)}
              >
                Update Status
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Order Timeline */}
        {order.trangThai !== ORDER_STATUS.CANCELLED.value && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Order Status
              </Typography>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step) => (
                  <Step key={step}>
                    <StepLabel>{ORDER_STATUS[step as keyof typeof ORDER_STATUS]?.label || step}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>
        )}

        {/* Your Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Your Items in this Order
            </Typography>

            {sellerItems.length === 0 ? (
              <Alert severity="warning">
                This order doesn't contain any of your products.
              </Alert>
            ) : (
              sellerItems.map((item) => {
                const imageUrl = item.sanPham.hinhAnh?.[0] || PLACEHOLDER_IMAGE;

                return (
                  <Card key={item.id} variant="outlined" sx={{ mb: 2 }}>
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
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
                        </Grid>

                        {/* Product Info */}
                        <Grid item xs={12} sm={5}>
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
                            {formatCurrency(item.donGia)} each
                          </Typography>
                        </Grid>

                        {/* Quantity & Total */}
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Quantity: {item.soLuong}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {formatCurrency(item.donGia * item.soLuong)}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </Paper>
        </Grid>

        {/* Order Info Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Order Summary */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Your Earnings
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Receipt fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Items Count
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 600, ml: 4 }}>
                {sellerItems.length} item{sellerItems.length !== 1 ? 's' : ''}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" fontWeight={700}>
                Your Total
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                {formatCurrency(sellerTotal)}
              </Typography>
            </Box>
          </Paper>

          {/* Order Info */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Order Information
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Receipt fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Order Date
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 600, ml: 4 }}>
                {formatDate(order.createdAt)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Person fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Customer ID
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, ml: 4, fontFamily: 'monospace' }}
              >
                {order.khachHangId.slice(0, 16)}...
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Update Status Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Current status: <strong>{statusConfig.label}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Update the order status to reflect the current fulfillment state.
          </Typography>
          <TextField
            select
            fullWidth
            label="New Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            {getAvailableStatuses().map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)} disabled={updating}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={updating || newStatus === order.trangThai}
          >
            {updating ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SellerOrderDetailPage;
