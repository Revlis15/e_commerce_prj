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
  Button,
  Divider,
} from '@mui/material';
import {
  ReportProblem,
  Assignment,
  Add,
  CheckCircle,
  HourglassEmpty,
  Cancel,
} from '@mui/icons-material';
import { complaintsAPI } from '../../services/api';
import { Complaint } from '../../types';
import { ListSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { showErrorToast } from '../../components/common/ToastProvider';
import { formatDate } from '../../utils/formatters';
import { COMPLAINT_STATUS } from '../../constants';

const MyComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const response = await complaintsAPI.getMy();
      setComplaints(response.data);
    } catch (error) {
      console.error('Failed to load complaints:', error);
      showErrorToast('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return <CheckCircle color="success" />;
      case 'REJECTED':
        return <Cancel color="error" />;
      case 'IN_PROGRESS':
        return <HourglassEmpty color="info" />;
      default:
        return <ReportProblem color="warning" />;
    }
  };

  const getStatusConfig = (status: string) => {
    return Object.values(COMPLAINT_STATUS).find(s => s.value === status) || COMPLAINT_STATUS.PENDING;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            My Complaints
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and track your complaint history
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/orders')}
          sx={{ height: 'fit-content' }}
        >
          File New Complaint
        </Button>
      </Box>

      {/* Complaints List */}
      {loading ? (
        <ListSkeleton count={5} />
      ) : complaints.length === 0 ? (
        <EmptyState
          icon={<ReportProblem />}
          title="No complaints filed"
          description="You haven't filed any complaints yet. If you have an issue with an order, you can file a complaint from your order details page."
          action={{
            label: 'View Orders',
            onClick: () => navigate('/orders'),
          }}
        />
      ) : (
        <Grid container spacing={3}>
          {complaints.map((complaint) => {
            const statusConfig = getStatusConfig(complaint.trangThai);

            return (
              <Grid item xs={12} key={complaint.id}>
                <Card
                  sx={{
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>
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
                          {getStatusIcon(complaint.trangThai)}
                        </Box>
                      </Grid>

                      {/* Complaint Info */}
                      <Grid item xs={12} sm>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Complaint #{complaint.id.slice(0, 8)}...
                          </Typography>
                          <Chip
                            label={statusConfig.label}
                            color={statusConfig.color}
                            size="small"
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <Assignment fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Order ID: {complaint.donHangId.slice(0, 8)}...
                          </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Filed on {formatDate(complaint.createdAt)}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Complaint Details:
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {complaint.noiDung}
                        </Typography>

                        {complaint.bangChung && complaint.bangChung.length > 0 && (
                          <>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              Evidence Attached:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {complaint.bangChung.map((evidence, index) => (
                                <Chip
                                  key={index}
                                  label={`Attachment ${index + 1}`}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </>
                        )}

                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/orders/${complaint.donHangId}`)}
                          >
                            View Order
                          </Button>
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

export default MyComplaints;
