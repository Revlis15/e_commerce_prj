import { AppBar, Toolbar, Typography, Button, Badge, IconButton, Box } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { VaiTro } from '../../types';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { itemCount } = useCartStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          E-Commerce
        </Typography>

        <Button color="inherit" onClick={() => navigate('/products')}>
          Products
        </Button>

        {isAuthenticated() && user?.vaiTro === VaiTro.CUSTOMER && (
          <>
            <IconButton color="inherit" onClick={() => navigate('/cart')}>
              <Badge badgeContent={itemCount()} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <Button color="inherit" onClick={() => navigate('/orders')}>
              Orders
            </Button>
            <Button color="inherit" onClick={() => navigate('/my-complaints')}>
              My Complaints
            </Button>
          </>
        )}

        {isAuthenticated() && user?.vaiTro === VaiTro.SELLER && (
          <>
            <Button color="inherit" onClick={() => navigate('/seller/dashboard')}>
              Dashboard
            </Button>
            <Button color="inherit" onClick={() => navigate('/seller/products')}>
              My Products
            </Button>
            <Button color="inherit" onClick={() => navigate('/seller/orders')}>
              Orders
            </Button>
          </>
        )}

        {isAuthenticated() && user?.vaiTro === VaiTro.ADMIN && (
          <>
            <Button color="inherit" onClick={() => navigate('/admin/dashboard')}>
              Dashboard
            </Button>
            <Button color="inherit" onClick={() => navigate('/admin/users')}>
              Users
            </Button>
            <Button color="inherit" onClick={() => navigate('/admin/complaints')}>
              Complaints
            </Button>
          </>
        )}

        {isAuthenticated() ? (
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2" component="span" sx={{ mr: 2 }}>
              {user?.email}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
