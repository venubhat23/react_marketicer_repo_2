import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  ButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Language as LanguageIcon,
  Devices as DevicesIcon,
  Web as WebIcon,
  Launch as LaunchIcon,
  GetApp as DownloadIcon,
  Schedule as ScheduleIcon,
  Public as PublicIcon,
  Computer as ComputerIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
  Analytics as AnalyticsIcon,
  Assessment as AssessmentIcon,
  TrendingDown as TrendingDownIcon,
  Speed as SpeedIcon,
  Share as ShareIcon,
  QrCode as QrCodeIcon
} from '@mui/icons-material';
import { 
  getUrlAnalytics, 
  exportAnalytics, 
  getAnalyticsByDateRange,
  getRealTimeAnalytics,
  getConversionAnalytics,
  getGeographicAnalytics,
  getTechnologyAnalytics,
  formatDate,
  formatNumber,
  calculatePercentage,
  getTimePeriodLabel 
} from '../../services/urlShortenerApi';

const LinkAnalytics = ({ url, onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [advancedAnalytics, setAdvancedAnalytics] = useState({
    conversion: null,
    geographic: null,
    technology: null
  });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (url?.short_code) {
      loadAnalytics();
      loadAdvancedAnalytics();
    }
  }, [url, selectedPeriod]);

  useEffect(() => {
    if (autoRefresh && url?.short_code) {
      const interval = setInterval(() => {
        loadRealTimeAnalytics();
      }, 30000); // Refresh every 30 seconds
      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh, url]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      let response;
      
      if (selectedPeriod === 'custom' && dateRange.start && dateRange.end) {
        response = await getAnalyticsByDateRange(url.short_code, dateRange.start, dateRange.end);
      } else {
        response = await getUrlAnalytics(url.short_code);
      }
      
      if (response.success) {
        setAnalytics(response.data);
      } else {
        showSnackbar(response.message || 'Failed to load analytics', 'error');
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      showSnackbar('Error loading analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeAnalytics = async () => {
    try {
      const response = await getRealTimeAnalytics(url.short_code);
      if (response.success) {
        setRealTimeData(response.data);
      }
    } catch (error) {
      console.error('Error loading real-time analytics:', error);
    }
  };

  const loadAdvancedAnalytics = async () => {
    try {
      const [conversionRes, geoRes, techRes] = await Promise.all([
        getConversionAnalytics(url.short_code),
        getGeographicAnalytics(url.short_code),
        getTechnologyAnalytics(url.short_code)
      ]);

      setAdvancedAnalytics({
        conversion: conversionRes.success ? conversionRes.data : null,
        geographic: geoRes.success ? geoRes.data : null,
        technology: techRes.success ? techRes.data : null
      });
    } catch (error) {
      console.error('Error loading advanced analytics:', error);
    }
  };

  const handleExport = async (format = 'csv') => {
    try {
      const response = await exportAnalytics(url.short_code, format);
      if (response.success) {
        showSnackbar(`Analytics exported as ${format.toUpperCase()}`, 'success');
      } else {
        showSnackbar(response.message || 'Export failed', 'error');
      }
    } catch (error) {
      console.error('Error exporting analytics:', error);
      showSnackbar('Error exporting analytics', 'error');
    }
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (period === 'custom') {
      setShowDatePicker(true);
    }
  };

  const handleDateRangeSubmit = () => {
    setShowDatePicker(false);
    loadAnalytics();
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

  const renderTabButtons = () => (
    <ButtonGroup variant="outlined" sx={{ mb: 3 }}>
      <Button 
        variant={activeTab === 'overview' ? 'contained' : 'outlined'}
        onClick={() => setActiveTab('overview')}
        startIcon={<AnalyticsIcon />}
      >
        Overview
      </Button>
      <Button 
        variant={activeTab === 'geographic' ? 'contained' : 'outlined'}
        onClick={() => setActiveTab('geographic')}
        startIcon={<LanguageIcon />}
      >
        Geographic
      </Button>
      <Button 
        variant={activeTab === 'technology' ? 'contained' : 'outlined'}
        onClick={() => setActiveTab('technology')}
        startIcon={<DevicesIcon />}
      >
        Technology
      </Button>
      <Button 
        variant={activeTab === 'conversions' ? 'contained' : 'outlined'}
        onClick={() => setActiveTab('conversions')}
        startIcon={<AssessmentIcon />}
      >
        Conversions
      </Button>
    </ButtonGroup>
  );

  const renderControlPanel = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Time Period</InputLabel>
              <Select
                value={selectedPeriod}
                label="Time Period"
                onChange={(e) => handlePeriodChange(e.target.value)}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadAnalytics}
              disabled={loading}
            >
              Refresh
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => handleExport('csv')}
            >
              Export CSV
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
              }
              label="Auto Refresh"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderRealTimeStats = () => {
    if (!realTimeData) return null;
    
    return (
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpeedIcon />
            Real-time Analytics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {realTimeData.live_visitors}
              </Typography>
              <Typography variant="body2">Live Visitors</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {realTimeData.clicks_last_hour}
              </Typography>
              <Typography variant="body2">Last Hour</Typography>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
                onClick={loadRealTimeAnalytics}
                startIcon={<RefreshIcon />}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderOverviewTab = () => (
    <>
      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <VisibilityIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {formatNumber(analytics.total_clicks)}
              </Typography>
              <Typography variant="body2">Total Clicks</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {analytics.performance_metrics?.clicks_today || 0}
              </Typography>
              <Typography variant="body2">Today's Clicks</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <ScheduleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {analytics.performance_metrics?.clicks_this_week || 0}
              </Typography>
              <Typography variant="body2">This Week</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <PublicIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {analytics.performance_metrics?.average_clicks_per_day || '0.0'}
              </Typography>
              <Typography variant="body2">Avg/Day</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Country Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LanguageIcon color="primary" />
                Clicks by Country
              </Typography>
              <List dense>
                {Object.entries(analytics.clicks_by_country || {}).map(([country, clicks]) => {
                  const percentage = calculatePercentage(clicks, analytics.total_clicks);
                  return (
                    <ListItem key={country} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'transparent', fontSize: '1.5rem' }}>
                          {getCountryFlag(country)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={country}
                        secondary={
                          <Box>
                            <LinearProgress
                              variant="determinate"
                              value={parseFloat(percentage)}
                              sx={{ mt: 0.5, mb: 0.5 }}
                            />
                            <Typography variant="caption">
                              {formatNumber(clicks)} clicks ({percentage}%)
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Device Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <DevicesIcon color="primary" />
                Clicks by Device
              </Typography>
              <List dense>
                {Object.entries(analytics.clicks_by_device || {}).map(([device, clicks]) => {
                  const percentage = calculatePercentage(clicks, analytics.total_clicks);
                  return (
                    <ListItem key={device} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                          {getDeviceIcon(device)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={device}
                        secondary={
                          <Box>
                            <LinearProgress
                              variant="determinate"
                              value={parseFloat(percentage)}
                              sx={{ mt: 0.5, mb: 0.5 }}
                              color="secondary"
                            />
                            <Typography variant="caption">
                              {formatNumber(clicks)} clicks ({percentage}%)
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Browser Breakdown */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <WebIcon color="primary" />
            Clicks by Browser
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(analytics.clicks_by_browser || {}).map(([browser, clicks]) => {
              const percentage = calculatePercentage(clicks, analytics.total_clicks);
              return (
                <Grid item xs={12} sm={6} md={4} key={browser}>
                  <Box sx={{ 
                    p: 2, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 2,
                    textAlign: 'center',
                    '&:hover': { boxShadow: 2 }
                  }}>
                    <Typography variant="h6" sx={{ color: getBrowserColor(browser), fontWeight: 'bold' }}>
                      {browser}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1 }}>
                      {formatNumber(clicks)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {percentage}% of total
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={parseFloat(percentage)}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Recent Clicks */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleIcon color="primary" />
            Recent Clicks
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Browser</TableCell>
                  <TableCell>Referrer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(analytics.recent_clicks || []).slice(0, 10).map((click, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(click.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{getCountryFlag(click.country)}</span>
                        <Typography variant="body2">
                          {click.city}, {click.country}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={click.device_type} variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: getBrowserColor(click.browser) }}>
                        {click.browser}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={click.referrer || 'Direct'}>
                        <Typography variant="body2" sx={{ 
                          maxWidth: 150, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {click.referrer ? new URL(click.referrer).hostname : 'Direct'}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );

  const renderGeographicTab = () => {
    if (!advancedAnalytics.geographic) return <LinearProgress />;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Clicks by Country</Typography>
              {Object.entries(advancedAnalytics.geographic.clicks_by_country || {}).map(([country, clicks]) => (
                <Box key={country} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{getCountryFlag(country)} {country}</Typography>
                    <Typography variant="body2">{formatNumber(clicks)}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(clicks / Math.max(...Object.values(advancedAnalytics.geographic.clicks_by_country))) * 100} 
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Clicks by City</Typography>
              {Object.entries(advancedAnalytics.geographic.clicks_by_city || {}).map(([city, clicks]) => (
                <Box key={city} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{city}</Typography>
                    <Typography variant="body2">{formatNumber(clicks)}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(clicks / Math.max(...Object.values(advancedAnalytics.geographic.clicks_by_city))) * 100} 
                    color="secondary"
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
    if (!advancedAnalytics.technology) return <LinearProgress />;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Devices</Typography>
              {Object.entries(advancedAnalytics.technology.devices || {}).map(([device, clicks]) => (
                <Box key={device} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getDeviceIcon(device)}
                      <Typography variant="body2">{device}</Typography>
                    </Box>
                    <Typography variant="body2">{formatNumber(clicks)}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(clicks / Math.max(...Object.values(advancedAnalytics.technology.devices))) * 100} 
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Browsers</Typography>
              {Object.entries(advancedAnalytics.technology.browsers || {}).map(([browser, clicks]) => (
                <Box key={browser} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: getBrowserColor(browser) }}>
                      {browser}
                    </Typography>
                    <Typography variant="body2">{formatNumber(clicks)}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(clicks / Math.max(...Object.values(advancedAnalytics.technology.browsers))) * 100} 
                    color="secondary"
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Operating Systems</Typography>
              {Object.entries(advancedAnalytics.technology.operating_systems || {}).map(([os, clicks]) => (
                <Box key={os} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{os}</Typography>
                    <Typography variant="body2">{formatNumber(clicks)}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(clicks / Math.max(...Object.values(advancedAnalytics.technology.operating_systems))) * 100} 
                    color="info"
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
    if (!advancedAnalytics.conversion) return <LinearProgress />;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Conversion Metrics</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    {advancedAnalytics.conversion.conversion_rate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversion Rate
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" color="secondary" sx={{ fontWeight: 'bold' }}>
                    {formatNumber(advancedAnalytics.conversion.conversions)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Conversions
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Conversions by Source</Typography>
              {Object.entries(advancedAnalytics.conversion.conversion_by_source || {}).map(([source, conversions]) => (
                <Box key={source} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{source}</Typography>
                    <Typography variant="body2">{formatNumber(conversions)}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(conversions / Math.max(...Object.values(advancedAnalytics.conversion.conversion_by_source))) * 100} 
                    color="success"
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Loading analytics...
        </Typography>
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
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          📊 Analytics Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {analytics.title || 'Untitled URL'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={analytics.short_url}
            color="primary"
            variant="outlined"
            icon={<LaunchIcon />}
            onClick={() => window.open(analytics.short_url, '_blank')}
            clickable
          />
          <Chip
            label="Share QR Code"
            color="secondary"
            variant="outlined"
            icon={<QrCodeIcon />}
            onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(analytics.short_url)}`, '_blank')}
            clickable
          />
        </Box>
      </Box>

      {/* Control Panel */}
      {renderControlPanel()}

      {/* Real-time Stats */}
      {autoRefresh && renderRealTimeStats()}

      {/* Tab Navigation */}
      {renderTabButtons()}

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'geographic' && renderGeographicTab()}
      {activeTab === 'technology' && renderTechnologyTab()}
      {activeTab === 'conversions' && renderConversionsTab()}

      {/* Date Range Dialog */}
      <Dialog open={showDatePicker} onClose={() => setShowDatePicker(false)}>
        <DialogTitle>Select Date Range</DialogTitle>
        <DialogContent>
          <TextField
            label="Start Date"
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            fullWidth
            sx={{ mb: 2, mt: 1 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDatePicker(false)}>Cancel</Button>
          <Button onClick={handleDateRangeSubmit} variant="contained">Apply</Button>
        </DialogActions>
      </Dialog>

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

export default LinkAnalytics;