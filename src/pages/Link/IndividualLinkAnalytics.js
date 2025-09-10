import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Tabs,
  Tab,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Launch as LaunchIcon,
  TrendingUp as TrendingUpIcon,
  QrCode as QrCodeIcon,
  Add as AddIcon,
  DateRange as DateRangeIcon,
  Refresh as RefreshIcon,
  GetApp as DownloadIcon,
  Public as PublicIcon,
  Computer as ComputerIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Language as LanguageIcon,
  Devices as DevicesIcon
} from '@mui/icons-material';
import { 
  getUrlAnalytics, 
  copyToClipboard,
  formatDate,
  formatNumber,
  calculatePercentage,
  generateQRCodeUrl
} from '../../services/urlShortenerApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

// Color palette based on specifications
const COLORS = {
  primary: '#882AFF', // Vivid violet
  secondary: '#091A48', // Navy Blue
  black: '#0b0b0b',
  white: '#ffffff',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336'
};

const CHART_COLORS = ['#882AFF', '#091A48', '#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0', '#ff5722'];

const IndividualLinkAnalytics = ({ url, onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState({
    start: '2025-01-01',
    end: '2025-07-29'
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (url?.short_code) {
      loadAnalytics();
    }
  }, [url]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getUrlAnalytics(url.short_code);
      if (response.success) {
        setAnalytics(response.data);
      } else {
        showSnackbar('Failed to load analytics', 'error');
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      showSnackbar('Error loading analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCopyUrl = async (url) => {
    const success = await copyToClipboard(url);
    if (success) {
      showSnackbar('URL copied to clipboard!', 'success');
    } else {
      showSnackbar('Failed to copy URL', 'error');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: analytics?.title || 'Shared Link',
        url: analytics?.short_url
      });
    } else {
      handleCopyUrl(analytics?.short_url);
    }
  };

  const getCountryFlag = (country) => {
    const flags = {
      'USA': '🇺🇸',
      'India': '🇮🇳',
      'Germany': '🇩🇪',
      'UK': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'France': '🇫🇷',
      'Japan': '🇯🇵',
      'Brazil': '🇧🇷',
      'Others': '🌍'
    };
    return flags[country] || '🌍';
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

  // Mock engagement data for charts
  const engagementData = [
    { date: '26', linkClicks: 0, qrScans: 0, bitlyClicks: 0 },
    { date: '27', linkClicks: 0, qrScans: 0, bitlyClicks: 0 },
    { date: '28', linkClicks: 1, qrScans: 0, bitlyClicks: 0 },
    { date: '29', linkClicks: 0, qrScans: 0, bitlyClicks: 0 }
  ];

  const referrerData = [
    { name: 'Direct', value: 1, color: '#40E0D0' }
  ];

  const deviceData = [
    { name: 'Desktop', value: 60, color: '#882AFF' },
    { name: 'Mobile', value: 30, color: '#091A48' },
    { name: 'Tablet', value: 10, color: '#ff9800' }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={50} sx={{ color: COLORS.primary }} />
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No analytics data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: COLORS.black, mb: 1 }}>
              Social Media Platform
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              bit.ly/LoginURL
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {analytics.long_url || 'https://app.marketincer.com/login?utm_source=google&utm_medium=email&utm_campaign=sale&utm_ter...'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              July 26, 2025, 11:55 PM GMT+5:30 • No tags
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<CopyIcon />} size="small">
              Copy
            </Button>
            <Button variant="outlined" startIcon={<ShareIcon />} size="small" onClick={handleShare}>
              Share
            </Button>
            <Button variant="outlined" startIcon={<EditIcon />} size="small">
              Edit
            </Button>
            <IconButton size="small">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: COLORS.primary, mb: 1 }}>
              1
            </Typography>
            <Typography variant="body2" color="text.secondary">Engagements</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: COLORS.primary, mb: 1 }}>
              1
            </Typography>
            <Typography variant="body2" color="text.secondary">Last 7 days</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <TrendingUpIcon sx={{ color: COLORS.success, mr: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.success }}>
                +100%
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">Weekly change</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* QR Code and Bitly Page Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>QR Code</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 120, 
                height: 120, 
                border: '2px dashed #ddd', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: 2
              }}>
                <QrCodeIcon sx={{ fontSize: 60, color: '#ddd' }} />
              </Box>
              <Button variant="outlined" startIcon={<AddIcon />} sx={{ color: COLORS.primary, borderColor: COLORS.primary }}>
                Create QR Code
              </Button>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Bitly Page</Typography>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Box sx={{ 
              width: 120, 
              height: 120, 
              bgcolor: '#f0f0f0', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}>
              <AddIcon sx={{ fontSize: 40, color: '#999' }} />
            </Box>
            <Button variant="outlined" startIcon={<AddIcon />}>
              Add to a page
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Date Range Selector */}
      <Card sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DateRangeIcon />
          <TextField
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            size="small"
          />
          <Typography>-</Typography>
          <TextField
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            size="small"
          />
        </Box>
      </Card>

      {/* Engagements Over Time Chart */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Engagements over time</Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="linkClicks" stroke="#40E0D0" name="Link clicks" strokeWidth={2} />
              <Line type="monotone" dataKey="qrScans" stroke="#091A48" name="QR Code scans" strokeWidth={2} />
              <Line type="monotone" dataKey="bitlyClicks" stroke="#ff9800" name="Bitly Page clicks" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* Locations Section */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Locations</Typography>
          <Box>
            <Button variant="text" sx={{ mr: 2, color: COLORS.primary }}>Countries</Button>
            <Button variant="text" color="text.secondary">Cities</Button>
          </Box>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Country</TableCell>
                <TableCell align="center">Engagements</TableCell>
                <TableCell align="center">%</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>🇮🇳</span>
                    <Typography>India</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={100} 
                      sx={{ 
                        flex: 1, 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: '#e3f2fd',
                        '& .MuiLinearProgress-bar': { bgcolor: '#2196f3' }
                      }} 
                    />
                    <Typography variant="body2">1</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Referrers and Devices Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Referrers</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ position: 'relative', width: 200, height: 200, mb: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={referrerData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {referrerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLORS.primary }}>1</Typography>
                  <Typography variant="caption" color="text.secondary">ENGAGEMENT</Typography>
                </Box>
              </Box>
              <Typography variant="body2">direct: 1</Typography>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Devices</Typography>
              <Chip label="Upgrade" size="small" sx={{ bgcolor: COLORS.black, color: COLORS.white }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative', width: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Changes to bit.ly/LoginURL */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Changes to bit.ly/LoginURL</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>Destination URL</TableCell>
                <TableCell align="center">Engagements</TableCell>
                <TableCell>Dates active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Created</TableCell>
                <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  https://app.marketincer.com/login?utm_source=google&utm_medium=email&utm_campaign=sale&utm_term=background&utm_content=promo1
                </TableCell>
                <TableCell align="center">1</TableCell>
                <TableCell>Jul 26, 2025 - Today</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default IndividualLinkAnalytics;