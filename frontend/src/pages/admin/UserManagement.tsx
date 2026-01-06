import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';
import { usersAPI } from '../../services/api';

const UserManagement = () => {
  const [sellers, setSellers] = useState<any[]>([]);

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      const response = await usersAPI.getSellers();
      setSellers(response.data);
    } catch (error) {
      console.error('Failed to load sellers:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await usersAPI.approveSeller(id);
      loadSellers();
    } catch (error) {
      console.error('Failed to approve seller:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Seller Approvals</Typography>

      {sellers.map((seller) => (
        <Paper key={seller.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{seller.tenCuaHang || 'Unnamed Shop'}</Typography>
          <Typography>Email: {seller.taiKhoan?.email}</Typography>
          <Typography>Status: {seller.trangThaiKiemDuyet ? 'Approved' : 'Pending'}</Typography>
          {!seller.trangThaiKiemDuyet && (
            <Button variant="contained" onClick={() => handleApprove(seller.id)} sx={{ mt: 1 }}>
              Approve
            </Button>
          )}
        </Paper>
      ))}
    </Container>
  );
};

export default UserManagement;
