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
  ListItemSecondaryAction
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
  Tablet as TabletIcon
} from '@mui/icons-material';
import { getUrlAnalytics, formatDate } from '../../services/urlShortenerApi';

const LinkAnalytics = ({ url, onClose }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

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
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
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
        <Chip
          label={analytics.short_url}
          color="primary"
          variant="outlined"
          icon={<LaunchIcon />}
          onClick={() => window.open(analytics.short_url, '_blank')}
          clickable
        />
      </Box>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <VisibilityIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {analytics.total_clicks}
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
                {analytics.performance_metrics?.average_clicks_per_day?.toFixed(1) || '0.0'}
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
                  const percentage = ((clicks / analytics.total_clicks) * 100).toFixed(1);
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
                              {clicks} clicks ({percentage}%)
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
                  const percentage = ((clicks / analytics.total_clicks) * 100).toFixed(1);
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
                              {clicks} clicks ({percentage}%)
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
              const percentage = ((clicks / analytics.total_clicks) * 100).toFixed(1);
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
                      {clicks}
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
    </Box>
  );
};

export default LinkAnalytics;