import { Card, CardMedia, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import { ShoppingCart, Inventory2 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { formatCurrency, truncateText } from '../../utils/formatters';
import { PLACEHOLDER_IMAGE, STOCK_STATUS } from '../../constants';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  showQuickAdd?: boolean;
}

/**
 * ProductCard Component
 * Reusable product card with hover effects, stock badges, and quick actions
 */
const ProductCard = ({ product, onAddToCart, showQuickAdd = true }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onAddToCart && product.soLuong > 0) {
      onAddToCart(product.id);
    }
  };

  // Determine stock status
  const getStockStatus = () => {
    if (product.soLuong === STOCK_STATUS.OUT_OF_STOCK) {
      return { label: 'Out of Stock', color: 'error' as const };
    } else if (product.soLuong <= STOCK_STATUS.LOW_STOCK) {
      return { label: 'Low Stock', color: 'warning' as const };
    } else {
      return { label: 'In Stock', color: 'success' as const };
    }
  };

  const stockStatus = getStockStatus();
  const imageUrl = product.hinhAnh && product.hinhAnh.length > 0
    ? product.hinhAnh[0]
    : PLACEHOLDER_IMAGE;

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
          '& .product-image': {
            transform: 'scale(1.05)',
          },
          '& .quick-add-btn': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      {/* Stock Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 1,
        }}
      >
        <Chip
          label={stockStatus.label}
          color={stockStatus.color}
          size="small"
          sx={{
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        />
      </Box>

      {/* Product Image */}
      <Box
        sx={{
          position: 'relative',
          paddingTop: '75%', // 4:3 aspect ratio
          overflow: 'hidden',
          bgcolor: 'grey.100',
        }}
      >
        <CardMedia
          component="img"
          image={imageUrl}
          alt={product.ten}
          className="product-image"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease-in-out',
          }}
        />

        {/* Quick Add Button (appears on hover) */}
        {showQuickAdd && product.soLuong > 0 && (
          <Button
            variant="contained"
            className="quick-add-btn"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            sx={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%) translateY(10px)',
              opacity: 0,
              transition: 'all 0.2s ease-in-out',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }}
          >
            Quick Add
          </Button>
        )}

        {/* Out of Stock Overlay */}
        {product.soLuong === 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'white',
              }}
            >
              <Inventory2 sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Out of Stock
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.ten}
        </Typography>

        {product.moTa && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {truncateText(product.moTa, 100)}
          </Typography>
        )}

        {/* Price */}
        <Typography
          variant="h5"
          color="primary"
          sx={{
            fontWeight: 700,
            mt: 'auto',
          }}
        >
          {formatCurrency(product.gia)}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleCardClick}
          sx={{
            borderRadius: 2,
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
