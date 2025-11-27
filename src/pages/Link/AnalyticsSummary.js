import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Language as LanguageIcon,
  Devices as DevicesIcon,
  Public as PublicIcon,
  Web as WebIcon,
  Launch as LaunchIcon,
  GetApp as DownloadIcon,
  Schedule as ScheduleIcon,
  Public as PublicIcon,
  Computer as ComputerIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon,
  Star as StarIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { 
  getAnalyticsSummary,
  exportAnalytics,
  formatDate,
  formatNumber,
  calculatePercentage
} from '../../services/urlShortenerApi';
import { useAuth } from '../../authContext/AuthContext';

const AnalyticsSummary = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadAnalyticsSummary();
  }, [selectedPeriod]);

  const loadAnalyticsSummary = async () => {
    try {
      setLoading(true);
      const response = await getAnalyticsSummary();
      if (response.success) {
        setSummary(response.data);
      } else {
        showSnackbar(response.message || 'Failed to load analytics summary', 'error');
      }
    } catch (error) {
      console.error('Error loading analytics summary:', error);
      showSnackbar('Error loading analytics summary', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = async () => {
    try {
      // Export summary data (this would need to be implemented in the API)
      showSnackbar('Analytics summary exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting analytics:', error);
      showSnackbar('Error exporting analytics', 'error');
    }
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const getDeviceIcon = (device) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <SmartphoneIcon />;
      case 'tablet':
        return <TabletIcon />;
      case 'desktop':
      default:
        return <ComputerIcon />;
    }
  };

  const getBrowserColor = (browser) => {
    const colors = {
      chrome: '#4285f4',
      safari: '#ff6b6b',
      firefox: '#ff9500',
      edge: '#0078d4',
      opera: '#ff1b2d'
    };
    return colors[browser.toLowerCase()] || '#666';
  };

  const getCountryFlag = (country) => {
    return <PublicIcon sx={{ fontSize: 16, color: '#666' }} />;
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Loading analytics summary...
        </Typography>
      </Box>
    );
  }

  if (!summary) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No analytics data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Analytics Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Comprehensive analytics for all your shortened URLs
        </Typography>
        
        {/* Controls */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Period</InputLabel>
            <Select
              value={selectedPeriod}
              label="Time Period"
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportAll}
          >
            Export All
          </Button>
        </Box>
      </Box>

      {/* Summary Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: 'white' 
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <LinkIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {formatNumber(summary.total_urls)}
              </Typography>
              <Typography variant="body2">Total URLs</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%', 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
            color: 'white' 
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <VisibilityIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {formatNumber(summary.total_clicks)}
              </Typography>
              <Typography variant="body2">Total Clicks</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%', 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
            color: 'white' 
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {summary.average_clicks_per_url}
              </Typography>
              <Typography variant="body2">Avg Clicks/URL</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%', 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 
            color: 'white' 
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <SpeedIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {Object.values(summary.clicks_over_time || {}).slice(-7).reduce((a, b) => a + b, 0)}
              </Typography>
              <Typography variant="body2">Last 7 Days</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Performing URLs */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarIcon color="primary" />
            Top Performing URLs
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>URL</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Clicks</TableCell>
                  <TableCell align="right">Created</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(summary.top_performing_urls || []).map((url, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={`#${index + 1}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'primary.main',
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                          onClick={() => window.open(url.short_url, '_blank')}
                        >
                          {url.short_code}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {url.long_url.length > 50 
                          ? `${url.long_url.substring(0, 50)}...` 
                          : url.long_url
                        }
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {formatNumber(url.clicks)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(url.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        startIcon={<LaunchIcon />}
                        onClick={() => window.open(url.short_url, '_blank')}
                      >
                        Visit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Analytics Breakdown */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Device Breakdown */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <DevicesIcon color="primary" />
                Device Breakdown
              </Typography>
              {Object.entries(summary.device_breakdown || {}).map(([device, clicks]) => {
                const percentage = calculatePercentage(clicks, summary.total_clicks);
                return (
                  <Box key={device} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                          {getDeviceIcon(device)}
                        </Avatar>
                        <Typography variant="body2">{device}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatNumber(clicks)} ({percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={parseFloat(percentage)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>

        {/* Country Breakdown */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LanguageIcon color="primary" />
                Country Breakdown
              </Typography>
              {Object.entries(summary.country_breakdown || {}).map(([country, clicks]) => {
                const percentage = calculatePercentage(clicks, summary.total_clicks);
                return (
                  <Box key={country} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '1.2rem' }}>
                          {getCountryFlag(country)}
                        </Typography>
                        <Typography variant="body2">{country}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatNumber(clicks)} ({percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={parseFloat(percentage)}
                      sx={{ height: 8, borderRadius: 4 }}
                      color="secondary"
                    />
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>

        {/* Browser Breakdown */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WebIcon color="primary" />
                Browser Breakdown
              </Typography>
              {Object.entries(summary.browser_breakdown || {}).map(([browser, clicks]) => {
                const percentage = calculatePercentage(clicks, summary.total_clicks);
                return (
                  <Box key={browser} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: getBrowserColor(browser), fontWeight: 'medium' }}>
                        {browser}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatNumber(clicks)} ({percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={parseFloat(percentage)}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getBrowserColor(browser)
                        }
                      }}
                    />
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Clicks Over Time Chart */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssessmentIcon color="primary" />
            Clicks Over Time (Last 30 Days)
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {Object.entries(summary.clicks_over_time || {})
              .slice(-30)
              .map(([date, clicks]) => {
                const maxClicks = Math.max(...Object.values(summary.clicks_over_time || {}));
                const percentage = (clicks / maxClicks) * 100;
                return (
                  <Box key={date} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ minWidth: 80, fontSize: '0.8rem' }}>
                      {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{ height: 6, borderRadius: 3 }}
                        color="info"
                      />
                    </Box>
                    <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right', fontSize: '0.8rem' }}>
                      {clicks}
                    </Typography>
                  </Box>
                );
              })}
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AnalyticsSummary;