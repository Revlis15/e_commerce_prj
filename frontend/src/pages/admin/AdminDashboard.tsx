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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  People,
  Inventory,
  ShoppingBag,
  ReportProblem,
  PendingActions,
  TrendingUp,
  PersonAdd,
  Category as CategoryIcon,
  Store,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { productsAPI, ordersAPI, complaintsAPI, usersAPI } from '../../services/api';
import { Product, Order, Complaint } from '../../types';
import StatsCard from '../../components/common/StatsCard';
import { StatsCardSkeleton, ChartSkeleton, ListSkeleton } from '../../components/common/LoadingSkeleton';
import { showErrorToast } from '../../components/common/ToastProvider';
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/formatters';
import { ORDER_STATUS } from '../../constants';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalComplaints: number;
  pendingApprovals: number;
  totalRevenue: number;
}

interface RevenueData {
  date: string;
  revenue: number;
}

interface OrderStatusData {
  name: string;
  value: number;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'product' | 'order' | 'complaint';
  title: string;
  subtitle: string;
  timestamp: string;
}

const COLORS = ['#2563eb', '#f97316', '#10b981', '#ef4444', '#8b5cf6'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalComplaints: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes, complaintsRes, sellersRes] = await Promise.all([
        productsAPI.getAll(),
        ordersAPI.getAll(),
        complaintsAPI.getAll(),
        usersAPI.getSellers(),
      ]);

      const products = productsRes.data;
      const orders = ordersRes.data;
      const complaints = complaintsRes.data;
      const sellers = sellersRes.data;

      // Count pending seller approvals (assuming sellers have a status field)
      const pendingCount = sellers.filter((seller: any) =>
        !seller.approved && seller.approved !== false
      ).length;

      // Calculate total revenue
      const totalRevenue = orders.reduce((sum, order) => sum + order.tongTien, 0);

      // Count unique users (estimate from orders and products)
      const uniqueCustomers = new Set(orders.map(o => o.khachHangId));
      const uniqueSellers = new Set(products.map(p => p.nguoiBanId));
      const estimatedUsers = uniqueCustomers.size + uniqueSellers.size;

      setStats({
        totalUsers: estimatedUsers,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalComplaints: complaints.length,
        pendingApprovals: pendingCount,
        totalRevenue,
      });

      // Calculate revenue data for last 30 days
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      const revenueByDate = last30Days.map(date => {
        const dayRevenue = orders
          .filter(order => order.createdAt.startsWith(date))
          .reduce((sum, order) => sum + order.tongTien, 0);

        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: dayRevenue,
        };
      });

      setRevenueData(revenueByDate);

      // Calculate order status distribution
      const statusCounts = orders.reduce((acc, order) => {
        acc[order.trangThai] = (acc[order.trangThai] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const statusData = Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
      }));

      setOrderStatusData(statusData);

      // Generate recent activity
      const activities: RecentActivity[] = [];

      // Recent products
      const recentProducts = [...products]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

      recentProducts.forEach(product => {
        activities.push({
          id: product.id,
          type: 'product',
          title: 'New product added',
          subtitle: product.ten,
          timestamp: product.createdAt,
        });
      });

      // Recent orders
      const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

      recentOrders.forEach(order => {
        activities.push({
          id: order.id,
          type: 'order',
          title: 'New order placed',
          subtitle: `Order ${order.id.slice(0, 8)}... - ${formatCurrency(order.tongTien)}`,
          timestamp: order.createdAt,
        });
      });

      // Recent complaints
      const recentComplaints = [...complaints]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2);

      recentComplaints.forEach(complaint => {
        activities.push({
          id: complaint.id,
          type: 'complaint',
          title: 'New complaint filed',
          subtitle: complaint.noiDung.slice(0, 50) + '...',
          timestamp: complaint.createdAt,
        });
      });

      // Sort all activities by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setRecentActivity(activities.slice(0, 10));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      showErrorToast('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <PersonAdd color="primary" />;
      case 'product':
        return <Inventory color="secondary" />;
      case 'order':
        return <ShoppingBag color="success" />;
      case 'complaint':
        return <ReportProblem color="error" />;
      default:
        return <CategoryIcon />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'primary.light';
      case 'product':
        return 'secondary.light';
      case 'order':
        return 'success.light';
      case 'complaint':
        return 'error.light';
      default:
        return 'grey.300';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Platform overview and analytics
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <Grid item xs={12} sm={6} lg={2} key={i}>
                <StatsCardSkeleton />
              </Grid>
            ))}
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} lg={2}>
              <StatsCard
                title="Total Users"
                value={stats.totalUsers.toString()}
                icon={<People />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2}>
              <StatsCard
                title="Products"
                value={stats.totalProducts.toString()}
                icon={<Inventory />}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2}>
              <StatsCard
                title="Orders"
                value={stats.totalOrders.toString()}
                icon={<ShoppingBag />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2}>
              <StatsCard
                title="Revenue"
                value={formatCurrency(stats.totalRevenue)}
                icon={<TrendingUp />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2}>
              <StatsCard
                title="Complaints"
                value={stats.totalComplaints.toString()}
                icon={<ReportProblem />}
                color="error"
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2}>
              <StatsCard
                title="Pending"
                value={stats.pendingApprovals.toString()}
                icon={<PendingActions />}
                color="warning"
                subtitle="seller approvals"
              />
            </Grid>
          </>
        )}
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
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

          {/* Order Status Distribution */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Order Status Distribution
            </Typography>
            {loading ? (
              <ChartSkeleton height={300} />
            ) : orderStatusData.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No order data available
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Recent Activity
            </Typography>
            {loading ? (
              <ListSkeleton count={10} />
            ) : recentActivity.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No recent activity
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {recentActivity.map((activity, index) => (
                  <ListItem
                    key={activity.id + index}
                    sx={{
                      px: 0,
                      py: 1.5,
                      borderBottom: index < recentActivity.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getActivityColor(activity.type) }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {activity.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {activity.subtitle}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatRelativeTime(activity.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate('/admin/users')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <People sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Manage Users
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      View and manage all users
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate('/admin/sellers')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Store sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Seller Approvals
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.pendingApprovals} pending approval{stats.pendingApprovals !== 1 ? 's' : ''}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate('/admin/categories')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <CategoryIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Categories
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Manage product categories
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => navigate('/admin/complaints')}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <ReportProblem sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Complaints
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.totalComplaints} total complaint{stats.totalComplaints !== 1 ? 's' : ''}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
