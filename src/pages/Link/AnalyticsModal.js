import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
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
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  Launch as LaunchIcon,
  TrendingUp as TrendingUpIcon,
  GetApp as DownloadIcon,
  Public as PublicIcon,
  Computer as ComputerIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Language as LanguageIcon,
  Devices as DevicesIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { 
  getUnifiedAnalytics, 
  copyToClipboard,
  formatDate,
  formatNumber,
  calculatePercentage,
  exportAnalytics
} from '../../services/urlShortenerApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

// Color palette
const COLORS = {
  primary: '#882AFF',
  secondary: '#091A48',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3'
};

const CHART_COLORS = ['#882AFF', '#091A48', '#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0', '#ff5722'];

const AnalyticsModal = ({ open, onClose, url }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (open && url?.short_code) {
      loadAnalytics();
    }
  }, [open, url]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getUnifiedAnalytics(url.short_code);
      if (response.success) {
        setAnalytics(response.data);
      } else {
        showSnackbar('Failed to load analytics data', 'error');
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      showSnackbar('Error loading analytics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCopyUrl = (url) => {
    copyToClipboard(url);
    showSnackbar('URL copied to clipboard!');
  };

  const handleExport = async () => {
    try {
      await exportAnalytics(url.short_code, 'csv');
      showSnackbar('Analytics exported successfully!');
    } catch (error) {
      showSnackbar('Failed to export analytics', 'error');
    }
  };

  const renderOverviewTab = () => {
    if (!analytics?.basic) return null;

    const { basic } = analytics;
    const clicksData = Object.entries(basic.clicks_by_day || {}).map(([date, clicks]) => ({
      date: new Date(date).toLocaleDateString(),
      clicks: clicks
    })).slice(-7);

    return (
      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ background: 'linear-gradient(135deg, #882AFF 0%, #6A1B9A 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {formatNumber(basic.total_clicks)}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Clicks
                      </Typography>
                    </Box>
                    <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ background: 'linear-gradient(135deg, #091A48 0%, #1A237E 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {formatNumber(basic.today_clicks)}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Today's Clicks
                      </Typography>
                    </Box>
                    <TimelineIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #388E3C 100%)', color: 'white' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {formatNumber(basic.week_clicks)}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        This Week
                      </Typography>
                    </Box>
                    <AssessmentIcon sx={{ fontSize: 40, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* URL Info */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>URL Information</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Short URL</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                    {basic.url?.short_url}
                  </Typography>
                  <IconButton size="small" onClick={() => handleCopyUrl(basic.url?.short_url)}>
                    <CopyIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => window.open(basic.url?.short_url, '_blank')}>
                    <LaunchIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Original URL</Typography>
                <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                  {basic.url?.original_url}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Created</Typography>
                <Typography variant="body1">
                  {formatDate(basic.url?.created_at)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Clicks Over Time */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Clicks Over Time (Last 7 Days)</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={clicksData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="clicks" stroke={COLORS.primary} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Device Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Device Breakdown</Typography>
              {Object.entries(basic.devices || {}).map(([device, count]) => (
                <Box key={device} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {device === 'Mobile' && <SmartphoneIcon color="primary" />}
                      {device === 'Desktop' && <ComputerIcon color="primary" />}
                      {device === 'Tablet' && <TabletIcon color="primary" />}
                      <Typography variant="body2">{device}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {count} ({calculatePercentage(count, basic.total_clicks)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={calculatePercentage(count, basic.total_clicks)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Browser Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Browser Breakdown</Typography>
              {Object.entries(basic.browsers || {}).map(([browser, count]) => (
                <Box key={browser} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">{browser}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {count} ({calculatePercentage(count, basic.total_clicks)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={calculatePercentage(count, basic.total_clicks)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderGeographicTab = () => {
    if (!analytics?.geographic) return null;

    const { geographic } = analytics;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Clicks by Country</Typography>
              {Object.entries(geographic.countries || {}).map(([country, count]) => (
                <Box key={country} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationIcon color="primary" fontSize="small" />
                      <Typography variant="body2">{country}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {count}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={calculatePercentage(count, analytics.basic.total_clicks)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Clicks by City</Typography>
              {Object.entries(geographic.cities || {}).map(([city, count]) => (
                <Box key={city} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">{city}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {count}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={calculatePercentage(count, analytics.basic.total_clicks)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderTechnologyTab = () => {
    if (!analytics?.technology) return null;

    const { technology } = analytics;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Devices</Typography>
              {Object.entries(technology.devices || {}).map(([device, count]) => (
                <Box key={device} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <DevicesIcon color="primary" fontSize="small" />
                      <Typography variant="body2">{device}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {count}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={calculatePercentage(count, analytics.basic.total_clicks)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Browsers</Typography>
              {Object.entries(technology.browsers || {}).map(([browser, count]) => (
                <Box key={browser} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">{browser}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {count}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={calculatePercentage(count, analytics.basic.total_clicks)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Operating Systems</Typography>
              {Object.entries(technology.operating_systems || {}).map(([os, count]) => (
                <Box key={os} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">{os}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {count}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={calculatePercentage(count, analytics.basic.total_clicks)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderConversionsTab = () => {
    if (!analytics?.conversions) return null;

    const { conversions } = analytics;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Conversion Metrics</Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {conversions.conversion_rate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Conversion Rate
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {formatNumber(conversions.total_conversions)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Conversions
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Conversion Sources</Typography>
              {Object.entries(conversions.conversion_sources || {}).map(([source, count]) => (
                <Box key={source} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">{source}</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {count}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={calculatePercentage(count, conversions.total_conversions)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderRealtimeTab = () => {
    if (!analytics?.realtime) return null;

    const { realtime } = analytics;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #388E3C 100%)', color: 'white' }}>
                <CardContent>
                  <Typography variant="h4" fontWeight="bold">
                    {realtime.active_users}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Users
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #F57C00 100%)', color: 'white' }}>
                <CardContent>
                  <Typography variant="h4" fontWeight="bold">
                    {realtime.clicks_last_hour}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Last Hour
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #2196f3 0%, #1976D2 100%)', color: 'white' }}>
                <CardContent>
                  <Typography variant="h4" fontWeight="bold">
                    {realtime.clicks_last_24h}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Last 24 Hours
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #9c27b0 0%, #7B1FA2 100%)', color: 'white' }}>
                <CardContent>
                  <Typography variant="body1" fontWeight="bold">
                    {realtime.peak_hour}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Peak Hour
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return renderOverviewTab();
      case 1:
        return renderGeographicTab();
      case 2:
        return renderTechnologyTab();
      case 3:
        return renderConversionsTab();
      case 4:
        return renderRealtimeTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="lg" 
        fullWidth 
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            minHeight: '80vh',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Box>
            <Typography variant="h6">Link Analytics</Typography>
            {url && (
              <Typography variant="body2" color="text.secondary">
                {url.title || url.short_url}
              </Typography>
            )}
          </Box>
          <Box display="flex" gap={1}>
            <Button
              startIcon={<RefreshIcon />}
              onClick={loadAnalytics}
              disabled={loading}
              size="small"
            >
              Refresh
            </Button>
            <Button
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              disabled={loading}
              size="small"
            >
              Export
            </Button>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <CircularProgress size={60} />
            </Box>
          ) : analytics ? (
            <>
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Overview" />
                <Tab label="Geographic" />
                <Tab label="Technology" />
                <Tab label="Conversions" />
                <Tab label="Real-time" />
              </Tabs>
              
              <Box sx={{ p: 3 }}>
                {renderTabContent()}
              </Box>
            </>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <Alert severity="error">Failed to load analytics data</Alert>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AnalyticsModal;