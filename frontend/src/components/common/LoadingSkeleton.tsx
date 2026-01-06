import { Skeleton, Box, Card, CardContent, Grid } from '@mui/material';

/**
 * Product Card Skeleton
 * Used for loading states in product grids
 */
export const ProductCardSkeleton = () => {
  return (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={200} animation="wave" />
      <CardContent>
        <Skeleton variant="text" width="80%" height={28} animation="wave" />
        <Skeleton variant="text" width="60%" height={20} animation="wave" sx={{ mt: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Skeleton variant="text" width={80} height={32} animation="wave" />
          <Skeleton variant="rounded" width={100} height={36} animation="wave" />
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * Product Card Grid Skeleton
 * Renders multiple product card skeletons in a grid
 */
interface ProductGridSkeletonProps {
  count?: number;
}

export const ProductGridSkeleton = ({ count = 8 }: ProductGridSkeletonProps) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <ProductCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * Product Detail Page Skeleton
 * Used for loading state on product detail pages
 */
export const ProductDetailSkeleton = () => {
  return (
    <Grid container spacing={4}>
      {/* Image Section */}
      <Grid item xs={12} md={6}>
        <Skeleton variant="rectangular" width="100%" height={400} animation="wave" sx={{ borderRadius: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Skeleton variant="rectangular" width={80} height={60} animation="wave" sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={80} height={60} animation="wave" sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={80} height={60} animation="wave" sx={{ borderRadius: 1 }} />
        </Box>
      </Grid>

      {/* Details Section */}
      <Grid item xs={12} md={6}>
        <Skeleton variant="text" width="70%" height={40} animation="wave" />
        <Skeleton variant="text" width="50%" height={28} animation="wave" sx={{ mt: 1 }} />
        <Skeleton variant="text" width="30%" height={36} animation="wave" sx={{ mt: 2 }} />
        <Skeleton variant="text" width="100%" animation="wave" sx={{ mt: 2 }} />
        <Skeleton variant="text" width="100%" animation="wave" />
        <Skeleton variant="text" width="80%" animation="wave" />
        <Skeleton variant="rounded" width="100%" height={56} animation="wave" sx={{ mt: 3 }} />
      </Grid>
    </Grid>
  );
};

/**
 * Table Skeleton
 * Used for loading states in data tables
 */
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton = ({ rows = 5, columns = 5 }: TableSkeletonProps) => {
  return (
    <Box>
      {/* Table Header */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} variant="text" width={`${100 / columns}%`} height={24} animation="wave" />
        ))}
      </Box>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box key={rowIndex} sx={{ display: 'flex', gap: 2, p: 2, mb: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width={`${100 / columns}%`} height={20} animation="wave" />
          ))}
        </Box>
      ))}
    </Box>
  );
};

/**
 * Stats Card Skeleton
 * Used for loading states in dashboard statistics cards
 */
export const StatsCardSkeleton = () => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={20} animation="wave" />
            <Skeleton variant="text" width="40%" height={40} animation="wave" sx={{ mt: 1 }} />
            <Skeleton variant="text" width="50%" height={16} animation="wave" sx={{ mt: 1 }} />
          </Box>
          <Skeleton variant="circular" width={56} height={56} animation="wave" />
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * Stats Grid Skeleton
 * Renders multiple stats card skeletons in a grid
 */
interface StatsGridSkeletonProps {
  count?: number;
}

export const StatsGridSkeleton = ({ count = 4 }: StatsGridSkeletonProps) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatsCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * List Item Skeleton
 * Used for loading states in lists (orders, complaints, etc.)
 */
export const ListItemSkeleton = () => {
  return (
    <Box sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" height={24} animation="wave" />
          <Skeleton variant="text" width="60%" height={20} animation="wave" sx={{ mt: 1 }} />
        </Box>
        <Skeleton variant="rounded" width={100} height={32} animation="wave" />
      </Box>
    </Box>
  );
};

/**
 * List Skeleton
 * Renders multiple list item skeletons
 */
interface ListSkeletonProps {
  count?: number;
}

export const ListSkeleton = ({ count = 5 }: ListSkeletonProps) => {
  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <ListItemSkeleton key={index} />
      ))}
    </Box>
  );
};

/**
 * Chart Skeleton
 * Used for loading states of charts in dashboards
 */
export const ChartSkeleton = () => {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="30%" height={28} animation="wave" />
        <Skeleton variant="rectangular" width="100%" height={300} animation="wave" sx={{ mt: 2, borderRadius: 1 }} />
      </CardContent>
    </Card>
  );
};

/**
 * Form Skeleton
 * Used for loading states in forms
 */
export const FormSkeleton = () => {
  return (
    <Box>
      <Skeleton variant="text" width="30%" height={24} animation="wave" />
      <Skeleton variant="rounded" width="100%" height={56} animation="wave" sx={{ mt: 1, mb: 3 }} />
      <Skeleton variant="text" width="30%" height={24} animation="wave" />
      <Skeleton variant="rounded" width="100%" height={56} animation="wave" sx={{ mt: 1, mb: 3 }} />
      <Skeleton variant="text" width="30%" height={24} animation="wave" />
      <Skeleton variant="rounded" width="100%" height={120} animation="wave" sx={{ mt: 1, mb: 3 }} />
      <Skeleton variant="rounded" width={120} height={40} animation="wave" />
    </Box>
  );
};

/**
 * Page Header Skeleton
 * Used for loading states of page headers
 */
export const PageHeaderSkeleton = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width="40%" height={48} animation="wave" />
      <Skeleton variant="text" width="60%" height={24} animation="wave" sx={{ mt: 1 }} />
    </Box>
  );
};
