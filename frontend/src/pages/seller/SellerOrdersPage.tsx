import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Avatar,
  Divider,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ShoppingBag,
  Search,
  Visibility,
  LocalShipping,
  CheckCircle,
  HourglassEmpty,
  Cancel,
} from '@mui/icons-material';
import { ordersAPI, productsAPI } from '../../services/api';
import { Order } from '../../types';
import { ListSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { showErrorToast } from '../../components/common/ToastProvider';
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/formatters';
import { ORDER_STATUS } from '../../constants';

const SellerOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedTab, setSelectedTab] = useState(0);
  const [sellerProductIds, setSellerProductIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadSellerProducts();
  }, []);

  useEffect(() => {
    if (sellerProductIds.size > 0) {
      loadOrders();
    }
  }, [sellerProductIds]);

  const loadSellerProducts = async () => {
    try {
      const response = await productsAPI.getMyProducts();
      const productIds = new Set(response.data.map(p => p.id));
      setSellerProductIds(productIds);
    } catch (error) {
      console.error('Failed to load seller products:', error);
      showErrorToast('Failed to load your products');
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getAll();
      // Filter to only show orders containing seller's products
      const sellerOrders = response.data.filter(order =>
        order.chiTiets?.some(item => sellerProductIds.has(item.sanPhamId))
      );
      setOrders(sellerOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      showErrorToast('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case ORDER_STATUS.DELIVERED.value:
        return <CheckCircle color="success" />;
      case ORDER_STATUS.CANCELLED.value:
        return <Cancel color="error" />;
      case ORDER_STATUS.SHIPPING.value:
        return <LocalShipping color="info" />;
      default:
        return <HourglassEmpty color="warning" />;
    }
  };

  const getStatusConfig = (status: string) => {
    return Object.values(ORDER_STATUS).find(s => s.value === status) || ORDER_STATUS.PENDING;
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.khachHangId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status based on tab
    switch (selectedTab) {
      case 0: // All
        break;
      case 1: // Pending
        filtered = filtered.filter(o => o.trangThai === ORDER_STATUS.PENDING.value);
        break;
      case 2: // Processing
        filtered = filtered.filter(o => o.trangThai === ORDER_STATUS.PROCESSING.value);
        break;
      case 3: // Shipping
        filtered = filtered.filter(o => o.trangThai === ORDER_STATUS.SHIPPING.value);
        break;
      case 4: // Delivered
        filtered = filtered.filter(o => o.trangThai === ORDER_STATUS.DELIVERED.value);
        break;
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const filteredOrders = filterOrders();
  const pendingCount = orders.filter(o => o.trangThai === ORDER_STATUS.PENDING.value).length;
  const processingCount = orders.filter(o => o.trangThai === ORDER_STATUS.PROCESSING.value).length;
  const shippingCount = orders.filter(o => o.trangThai === ORDER_STATUS.SHIPPING.value).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          My Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and fulfill customer orders
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <ShoppingBag color="primary" />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {orders.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <HourglassEmpty color="warning" />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {pendingCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.light' }}>
                  <LocalShipping color="info" />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {shippingCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Shipping
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <CheckCircle color="success" />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {orders.filter(o => o.trangThai === ORDER_STATUS.DELIVERED.value).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Delivered
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
          placeholder="Search by Order ID or Customer ID..."
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
          <Tab label={`All (${orders.length})`} />
          <Tab label={`Pending (${pendingCount})`} />
          <Tab label={`Processing (${processingCount})`} />
          <Tab label={`Shipping (${shippingCount})`} />
          <Tab label="Delivered" />
        </Tabs>
      </Card>

      {/* Orders List */}
      {loading ? (
        <ListSkeleton count={5} />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag />}
          title={searchTerm ? "No orders found" : "No orders yet"}
          description={
            searchTerm
              ? "Try adjusting your search to find what you're looking for."
              : "Orders containing your products will appear here."
          }
        />
      ) : (
        <Grid container spacing={3}>
          {filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.trangThai);
            // Calculate seller's items and total
            const sellerItems = order.chiTiets?.filter(item => sellerProductIds.has(item.sanPhamId)) || [];
            const sellerTotal = sellerItems.reduce((sum, item) => sum + item.donGia * item.soLuong, 0);

            return (
              <Grid item xs={12} key={order.id}>
                <Card
                  sx={{
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => navigate(`/seller/orders/${order.id}`)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                      {/* Status Icon */}
                      <Grid item xs={12} sm="auto">
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: `${statusConfig.color}.light`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {getStatusIcon(order.trangThai)}
                        </Box>
                      </Grid>

                      {/* Order Info */}
                      <Grid item xs={12} sm>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Order #{order.id.slice(0, 8)}...
                          </Typography>
                          <Chip
                            label={statusConfig.label}
                            color={statusConfig.color}
                            size="small"
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {sellerItems.length} item{sellerItems.length !== 1 ? 's' : ''} from your products
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          Placed {formatRelativeTime(order.createdAt)} • {formatDate(order.createdAt)}
                        </Typography>
                      </Grid>

                      {/* Amount & Action */}
                      <Grid item xs={12} sm="auto">
                        <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            {formatCurrency(sellerTotal)}
                          </Typography>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/seller/orders/${order.id}`);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default SellerOrdersPage;
