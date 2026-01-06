import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Inventory,
  ShoppingBag,
  TrendingUp,
  Star,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { productsAPI, ordersAPI } from '../../services/api';
import { Product, Order } from '../../types';
import StatsCard from '../../components/common/StatsCard';
import { StatsCardSkeleton, TableSkeleton, ChartSkeleton } from '../../components/common/LoadingSkeleton';
import { showErrorToast } from '../../components/common/ToastProvider';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUS, PLACEHOLDER_IMAGE } from '../../constants';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  lowStockProducts: number;
}

interface RevenueData {
  date: string;
  revenue: number;
}

interface TopProduct {
  product: Product;
  totalSold: number;
  revenue: number;
}

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    lowStockProducts: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        productsAPI.getMyProducts(),
        ordersAPI.getAll(),
      ]);

      const products = productsRes.data;
      const allOrders = ordersRes.data;

      // Filter orders that contain seller's products
      const sellerProductIds = new Set(products.map(p => p.id));
      const sellerOrders = allOrders.filter(order =>
        order.chiTiets.some(item => sellerProductIds.has(item.sanPhamId))
      );

      // Calculate stats
      const totalRevenue = sellerOrders.reduce((sum, order) => {
        const sellerItemsTotal = order.chiTiets
          .filter(item => sellerProductIds.has(item.sanPhamId))
          .reduce((itemSum, item) => itemSum + item.donGia * item.soLuong, 0);
        return sum + sellerItemsTotal;
      }, 0);

      const lowStockCount = products.filter(p => p.soLuong > 0 && p.soLuong <= 10).length;

      setStats({
        totalProducts: products.length,
        totalOrders: sellerOrders.length,
        revenue: totalRevenue,
        lowStockProducts: lowStockCount,
      });

      // Calculate revenue data for last 30 days
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      const revenueByDate = last30Days.map(date => {
        const dayRevenue = sellerOrders
          .filter(order => order.createdAt.startsWith(date))
          .reduce((sum, order) => {
            const sellerItemsTotal = order.chiTiets
              .filter(item => sellerProductIds.has(item.sanPhamId))
              .reduce((itemSum, item) => itemSum + item.donGia * item.soLuong, 0);
            return sum + sellerItemsTotal;
          }, 0);

        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: dayRevenue,
        };
      });

      setRevenueData(revenueByDate);

      // Get recent orders (last 10)
      const sortedOrders = [...sellerOrders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentOrders(sortedOrders.slice(0, 10));

      // Calculate top products
      const productSales = new Map<string, { product: Product; totalSold: number; revenue: number }>();

      sellerOrders.forEach(order => {
        order.chiTiets.forEach(item => {
          if (sellerProductIds.has(item.sanPhamId)) {
            const existing = productSales.get(item.sanPhamId);
            const product = products.find(p => p.id === item.sanPhamId)!;

            if (existing) {
              existing.totalSold += item.soLuong;
              existing.revenue += item.donGia * item.soLuong;
            } else {
              productSales.set(item.sanPhamId, {
                product,
                totalSold: item.soLuong,
                revenue: item.donGia * item.soLuong,
              });
            }
          }
        });
      });

      const topProductsList = Array.from(productSales.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setTopProducts(topProductsList);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      showErrorToast('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case ORDER_STATUS.DELIVERED:
        return 'success';
      case ORDER_STATUS.CANCELLED:
        return 'error';
      case ORDER_STATUS.SHIPPING:
        return 'info';
      case ORDER_STATUS.PROCESSING:
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Seller Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your store performance and manage your products
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Grid item xs={12} sm={6} lg={3} key={i}>
                <StatsCardSkeleton />
              </Grid>
            ))}
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} lg={3}>
              <StatsCard
                title="Total Products"
                value={stats.totalProducts.toString()}
                icon={<Inventory />}
                color="primary"
                trend={
                  stats.lowStockProducts > 0
                    ? { value: stats.lowStockProducts, label: 'low stock' }
                    : undefined
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatsCard
                title="Total Orders"
                value={stats.totalOrders.toString()}
                icon={<ShoppingBag />}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatsCard
                title="Total Revenue"
                value={formatCurrency(stats.revenue)}
                icon={<TrendingUp />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StatsCard
                title="Low Stock Alert"
                value={stats.lowStockProducts.toString()}
                icon={<Inventory />}
                color="warning"
                subtitle="products running low"
              />
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Revenue Overview (Last 30 Days)
            </Typography>
            {loading ? (
              <ChartSkeleton height={300} />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#9e9e9e"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#9e9e9e"
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: 8,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: '#2563eb', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Top Selling Products
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[...Array(5)].map((_, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        bgcolor: 'grey.200',
                        borderRadius: 1,
                        animation: 'pulse 1.5s ease-in-out infinite',
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          height: 16,
                          bgcolor: 'grey.200',
                          borderRadius: 1,
                          mb: 0.5,
                          animation: 'pulse 1.5s ease-in-out infinite',
                        }}
                      />
                      <Box
                        sx={{
                          height: 12,
                          bgcolor: 'grey.200',
                          borderRadius: 1,
                          width: '60%',
                          animation: 'pulse 1.5s ease-in-out infinite',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : topProducts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No sales data available yet
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {topProducts.map((item, index) => {
                  const imageUrl = item.product.hinhAnh?.[0] || PLACEHOLDER_IMAGE;
                  return (
                    <Card
                      key={item.product.id}
                      variant="outlined"
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 2,
                          transform: 'translateX(4px)',
                        },
                      }}
                      onClick={() => navigate(`/products/${item.product.id}`)}
                    >
                      <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                        <Box
                          sx={{
                            position: 'relative',
                            width: 50,
                            height: 50,
                            borderRadius: 1,
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={imageUrl}
                            alt={item.product.ten}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              bgcolor: 'primary.main',
                              color: 'white',
                              px: 0.5,
                              fontSize: '0.625rem',
                              fontWeight: 600,
                            }}
                          >
                            #{index + 1}
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.product.ten}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {item.totalSold} sold
                            </Typography>
                            <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                              {formatCurrency(item.revenue)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Recent Orders
            </Typography>
            {loading ? (
              <TableSkeleton rows={10} columns={5} />
            ) : recentOrders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No orders yet
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => {
                      // Filter to show only seller's items
                      const sellerItems = order.chiTiets.filter(item =>
                        item.sanPham && item.sanPham.nguoiBanId
                      );
                      const sellerTotal = sellerItems.reduce(
                        (sum, item) => sum + item.donGia * item.soLuong,
                        0
                      );

                      return (
                        <TableRow
                          key={order.id}
                          hover
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                          onClick={() => navigate(`/seller/orders/${order.id}`)}
                        >
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {order.id.slice(0, 8)}...
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(order.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {sellerItems.length} item{sellerItems.length !== 1 ? 's' : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {formatCurrency(sellerTotal)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={order.trangThai}
                              color={getOrderStatusColor(order.trangThai) as any}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SellerDashboard;
