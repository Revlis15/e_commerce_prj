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
  TextField,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  ArrowBack,
  ShoppingBag,
  LocalShipping,
  CheckCircle,
  ReportProblem,
  Receipt,
} from '@mui/icons-material';
import { ordersAPI, complaintsAPI } from '../../services/api';
import { Order } from '../../types';
import { ProductDetailSkeleton } from '../../components/common/LoadingSkeleton';
import { showSuccessToast, showErrorToast } from '../../components/common/ToastProvider';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUS, PLACEHOLDER_IMAGE } from '../../constants';

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false);
  const [complaintText, setComplaintText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getOne(id!);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to load order:', error);
      showErrorToast('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleFileComplaint = async () => {
    if (!complaintText.trim()) {
      showErrorToast('Please describe your complaint');
      return;
    }

    setSubmitting(true);
    try {
      await complaintsAPI.create({
        donHangId: id!,
        noiDung: complaintText,
      });
      showSuccessToast('Complaint filed successfully');
      setComplaintDialogOpen(false);
      setComplaintText('');
      navigate('/my-complaints');
    } catch (error) {
      console.error('Failed to file complaint:', error);
      showErrorToast('Failed to file complaint');
    } finally {
      setSubmitting(false);
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
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/orders')} sx={{ mt: 2 }}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  const statusConfig = getStatusConfig(order.trangThai);
  const { steps, activeStep } = getOrderSteps();
  const canFileComplaint = order.trangThai !== ORDER_STATUS.CANCELLED.value;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/orders')}
        sx={{ mb: 3 }}
      >
        Back to Orders
      </Button>

      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              Order Details
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Order ID: {order.id}
            </Typography>
          </Box>
          <Chip
            label={statusConfig.label}
            color={statusConfig.color}
            size="large"
            sx={{ px: 2, py: 3, fontSize: '1rem' }}
          />
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

        {/* Order Summary */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Order Items
            </Typography>

            {order.chiTiets?.map((item) => {
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
            })}
          </Paper>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {canFileComplaint && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<ReportProblem />}
                onClick={() => setComplaintDialogOpen(true)}
              >
                File Complaint / Request Refund
              </Button>
            )}
          </Box>
        </Grid>

        {/* Order Info Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Subtotal
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {formatCurrency(order.tongTien)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h6" fontWeight={700}>
                Total
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                {formatCurrency(order.tongTien)}
              </Typography>
            </Box>
          </Paper>

          {/* Help Card */}
          <Card
            sx={{
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ReportProblem />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Need Help?
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                If you have any issues with your order, you can file a complaint or request a refund.
              </Typography>
              <Button
                variant="contained"
                color="inherit"
                fullWidth
                onClick={() => navigate('/my-complaints')}
              >
                View My Complaints
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* File Complaint Dialog */}
      <Dialog
        open={complaintDialogOpen}
        onClose={() => setComplaintDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>File Complaint / Request Refund</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please describe the issue with your order. Our support team will review your complaint and respond as soon as possible.
          </Typography>
          <TextField
            label="Complaint Details"
            multiline
            rows={6}
            fullWidth
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            placeholder="Describe the issue with your order (defective item, wrong product, damaged packaging, etc.)"
            helperText="Be as detailed as possible to help us resolve your issue quickly"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComplaintDialogOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleFileComplaint}
            variant="contained"
            color="error"
            disabled={submitting || !complaintText.trim()}
          >
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderDetailPage;
