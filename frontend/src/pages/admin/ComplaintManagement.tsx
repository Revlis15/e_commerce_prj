import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Button,
  Chip,
  Box,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
} from '@mui/material';
import {
  ReportProblem,
  CheckCircle,
  HourglassEmpty,
  Cancel,
  Assignment,
} from '@mui/icons-material';
import { complaintsAPI } from '../../services/api';
import { Complaint } from '../../types';
import { ListSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { showSuccessToast, showErrorToast } from '../../components/common/ToastProvider';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { COMPLAINT_STATUS } from '../../constants';

const ComplaintManagement = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [actionType, setActionType] = useState<'resolve' | 'reject' | null>(null);
  const [responseNote, setResponseNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const response = await complaintsAPI.getAll();
      setComplaints(response.data);
    } catch (error) {
      console.error('Failed to load complaints:', error);
      showErrorToast('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedComplaint || !actionType) return;

    setSubmitting(true);
    try {
      const newStatus = actionType === 'resolve' ? 'RESOLVED' : 'REJECTED';
      await complaintsAPI.updateStatus(selectedComplaint.id, newStatus);
      showSuccessToast(`Complaint ${newStatus.toLowerCase()} successfully`);
      setActionDialogOpen(false);
      setSelectedComplaint(null);
      setActionType(null);
      setResponseNote('');
      loadComplaints();
    } catch (error) {
      console.error('Failed to update complaint status:', error);
      showErrorToast('Failed to update complaint status');
    } finally {
      setSubmitting(false);
    }
  };

  const openActionDialog = (complaint: Complaint, action: 'resolve' | 'reject') => {
    setSelectedComplaint(complaint);
    setActionType(action);
    setActionDialogOpen(true);
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

  const filterComplaints = () => {
    switch (selectedTab) {
      case 0:
        return complaints;
      case 1:
        return complaints.filter(c => c.trangThai === 'PENDING');
      case 2:
        return complaints.filter(c => c.trangThai === 'IN_PROGRESS');
      case 3:
        return complaints.filter(c => c.trangThai === 'RESOLVED');
      case 4:
        return complaints.filter(c => c.trangThai === 'REJECTED');
      default:
        return complaints;
    }
  };

  const filteredComplaints = filterComplaints();
  const pendingCount = complaints.filter(c => c.trangThai === 'PENDING').length;
  const inProgressCount = complaints.filter(c => c.trangThai === 'IN_PROGRESS').length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Complaint Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and resolve customer complaints
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <ReportProblem color="primary" />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {complaints.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Complaints
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
                  <HourglassEmpty color="info" />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {inProgressCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
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
                    {complaints.filter(c => c.trangThai === 'RESOLVED').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Resolved
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)}>
          <Tab label="All" />
          <Tab label="Pending" />
          <Tab label="In Progress" />
          <Tab label="Resolved" />
          <Tab label="Rejected" />
        </Tabs>
      </Paper>

      {/* Complaints List */}
      {loading ? (
        <ListSkeleton count={5} />
      ) : filteredComplaints.length === 0 ? (
        <EmptyState
          icon={<ReportProblem />}
          title="No complaints found"
          description={
            selectedTab === 0
              ? "There are no complaints to display."
              : "There are no complaints with this status."
          }
        />
      ) : (
        <Grid container spacing={3}>
          {filteredComplaints.map((complaint) => {
            const statusConfig = getStatusConfig(complaint.trangThai);
            const isPending = complaint.trangThai === 'PENDING';
            const isInProgress = complaint.trangThai === 'IN_PROGRESS';

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
                          Filed {formatRelativeTime(complaint.createdAt)} on {formatDate(complaint.createdAt)}
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
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
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
                          {(isPending || isInProgress) && (
                            <>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => openActionDialog(complaint, 'resolve')}
                              >
                                Resolve
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => openActionDialog(complaint, 'reject')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
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

      {/* Action Dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {actionType === 'resolve' ? 'Resolve Complaint' : 'Reject Complaint'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedComplaint && (
              <>
                Complaint ID: {selectedComplaint.id.slice(0, 8)}...
                <br />
                Order ID: {selectedComplaint.donHangId.slice(0, 8)}...
              </>
            )}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedComplaint?.noiDung}
          </Typography>
          <TextField
            label="Response / Notes (Optional)"
            multiline
            rows={4}
            fullWidth
            value={responseNote}
            onChange={(e) => setResponseNote(e.target.value)}
            placeholder="Add any notes or response for the customer"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            color={actionType === 'resolve' ? 'success' : 'error'}
            disabled={submitting}
          >
            {submitting ? 'Updating...' : actionType === 'resolve' ? 'Resolve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ComplaintManagement;
