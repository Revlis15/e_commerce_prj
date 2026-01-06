import { Card, CardContent, Box, Typography, Skeleton } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  iconColor?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  trend?: {
    value: number;
    label: string;
  };
  loading?: boolean;
  onClick?: () => void;
  formatValue?: (value: number | string) => string;
}

/**
 * StatsCard Component
 * Displays dashboard statistics with icon, value, and optional trend indicator
 */
const StatsCard = ({
  title,
  value,
  icon,
  iconColor = 'primary',
  trend,
  loading = false,
  onClick,
  formatValue,
}: StatsCardProps) => {
  const displayValue = formatValue && typeof value === 'number'
    ? formatValue(value)
    : value;

  const isPositiveTrend = trend && trend.value >= 0;

  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
        } : {},
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          {/* Left side - Text content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Title */}
            {loading ? (
              <Skeleton variant="text" width="60%" height={20} animation="wave" />
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.75rem',
                }}
              >
                {title}
              </Typography>
            )}

            {/* Value */}
            {loading ? (
              <Skeleton variant="text" width="40%" height={40} animation="wave" />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: trend ? 1 : 0,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {displayValue}
              </Typography>
            )}

            {/* Trend indicator */}
            {trend && !loading && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {isPositiveTrend ? (
                  <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: isPositiveTrend ? 'success.main' : 'error.main',
                    fontWeight: 600,
                  }}
                >
                  {isPositiveTrend ? '+' : ''}{trend.value}%
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 0.5 }}
                >
                  {trend.label}
                </Typography>
              </Box>
            )}

            {loading && trend && (
              <Skeleton variant="text" width="50%" height={16} animation="wave" sx={{ mt: 1 }} />
            )}
          </Box>

          {/* Right side - Icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '50%',
              bgcolor: loading ? 'grey.200' : `${iconColor}.main`,
              color: 'white',
              flexShrink: 0,
              ml: 2,
              transition: 'all 0.2s ease-in-out',
              boxShadow: loading ? 'none' : `0 4px 12px rgba(0, 0, 0, 0.1)`,
              '& .MuiSvgIcon-root': {
                fontSize: 28,
              },
            }}
          >
            {loading ? (
              <Skeleton variant="circular" width={56} height={56} animation="wave" />
            ) : (
              icon
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
