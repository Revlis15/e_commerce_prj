import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { VaiTro } from './types';

import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/public/HomePage';
import ProductListPage from './pages/public/ProductListPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderDetailPage from './pages/customer/OrderDetailPage';
import MyComplaints from './pages/customer/MyComplaints';
import SellerDashboard from './pages/seller/SellerDashboard';
import ProductManagement from './pages/seller/ProductManagement';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import SellerOrderDetailPage from './pages/seller/SellerOrderDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ComplaintManagement from './pages/admin/ComplaintManagement';
import { ToastProvider } from './components/common/ToastProvider';

function ProtectedRoute({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: VaiTro[] }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.vaiTro)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <ToastProvider />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />

          <Route path="cart" element={
            <ProtectedRoute allowedRoles={[VaiTro.CUSTOMER]}>
              <CartPage />
            </ProtectedRoute>
          } />
          <Route path="checkout" element={
            <ProtectedRoute allowedRoles={[VaiTro.CUSTOMER]}>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute allowedRoles={[VaiTro.CUSTOMER]}>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="orders/:id" element={
            <ProtectedRoute allowedRoles={[VaiTro.CUSTOMER]}>
              <OrderDetailPage />
            </ProtectedRoute>
          } />
          <Route path="my-complaints" element={
            <ProtectedRoute allowedRoles={[VaiTro.CUSTOMER]}>
              <MyComplaints />
            </ProtectedRoute>
          } />

          <Route path="seller/dashboard" element={
            <ProtectedRoute allowedRoles={[VaiTro.SELLER]}>
              <SellerDashboard />
            </ProtectedRoute>
          } />
          <Route path="seller/products" element={
            <ProtectedRoute allowedRoles={[VaiTro.SELLER]}>
              <ProductManagement />
            </ProtectedRoute>
          } />
          <Route path="seller/orders" element={
            <ProtectedRoute allowedRoles={[VaiTro.SELLER]}>
              <SellerOrdersPage />
            </ProtectedRoute>
          } />
          <Route path="seller/orders/:id" element={
            <ProtectedRoute allowedRoles={[VaiTro.SELLER]}>
              <SellerOrderDetailPage />
            </ProtectedRoute>
          } />

          <Route path="admin/dashboard" element={
            <ProtectedRoute allowedRoles={[VaiTro.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="admin/users" element={
            <ProtectedRoute allowedRoles={[VaiTro.ADMIN]}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="admin/complaints" element={
            <ProtectedRoute allowedRoles={[VaiTro.ADMIN]}>
              <ComplaintManagement />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </>
  );
}

export default App;
