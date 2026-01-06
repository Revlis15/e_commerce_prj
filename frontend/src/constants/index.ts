// Order status constants with colors
export const ORDER_STATUS = {
  PENDING: {
    value: 'PENDING',
    label: 'Pending',
    color: 'warning' as const,
  },
  PROCESSING: {
    value: 'PROCESSING',
    label: 'Processing',
    color: 'info' as const,
  },
  SHIPPING: {
    value: 'SHIPPING',
    label: 'Shipping',
    color: 'info' as const,
  },
  DELIVERED: {
    value: 'DELIVERED',
    label: 'Delivered',
    color: 'success' as const,
  },
  CANCELLED: {
    value: 'CANCELLED',
    label: 'Cancelled',
    color: 'error' as const,
  },
} as const;

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'COD', label: 'Cash on Delivery' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'E_WALLET', label: 'E-Wallet' },
] as const;

// Payment status
export const PAYMENT_STATUS = {
  PENDING: {
    value: 'PENDING',
    label: 'Pending',
    color: 'warning' as const,
  },
  COMPLETED: {
    value: 'COMPLETED',
    label: 'Completed',
    color: 'success' as const,
  },
  FAILED: {
    value: 'FAILED',
    label: 'Failed',
    color: 'error' as const,
  },
} as const;

// Complaint status
export const COMPLAINT_STATUS = {
  PENDING: {
    value: 'PENDING',
    label: 'Pending',
    color: 'warning' as const,
  },
  IN_PROGRESS: {
    value: 'IN_PROGRESS',
    label: 'In Progress',
    color: 'info' as const,
  },
  RESOLVED: {
    value: 'RESOLVED',
    label: 'Resolved',
    color: 'success' as const,
  },
  REJECTED: {
    value: 'REJECTED',
    label: 'Rejected',
    color: 'error' as const,
  },
} as const;

// Stock status thresholds
export const STOCK_STATUS = {
  OUT_OF_STOCK: 0,
  LOW_STOCK: 10,
  IN_STOCK: 50,
} as const;

// Placeholder image for products without images
export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=No+Image';

// App configuration
export const APP_CONFIG = {
  PRODUCTS_PER_PAGE: 12,
  ORDERS_PER_PAGE: 10,
  MAX_CART_QUANTITY: 99,
  MIN_ORDER_AMOUNT: 0,
  FREE_SHIPPING_THRESHOLD: 100,
  REVIEWS_PER_PAGE: 5,
} as const;

// Rating options for filters
export const RATING_OPTIONS = [
  { value: 5, label: '5 Stars' },
  { value: 4, label: '4 Stars & Up' },
  { value: 3, label: '3 Stars & Up' },
  { value: 2, label: '2 Stars & Up' },
  { value: 1, label: '1 Star & Up' },
] as const;

// Sort options for products
export const PRODUCT_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
  { value: 'rating', label: 'Highest Rated' },
] as const;

// User roles
export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
} as const;

// Toast auto-close duration (ms)
export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
} as const;

// Breakpoints (matching MUI defaults)
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

// Animation durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
} as const;
