import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Link as LinkIcon,
  Visibility as VisibilityIcon,
  Public as PublicIcon,
  QrCode as QrCodeIcon,
  Analytics as AnalyticsIcon,
  Launch as LaunchIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const LinkDashboard = ({ linkStats = {} }) => {
  // Sample data for charts
  const clicksData = [
    { date: '2024-01-01', clicks: 120 },
    { date: '2024-01-02', clicks: 150 },
    { date: '2024-01-03', clicks: 180 },
    { date: '2024-01-04', clicks: 220 },
    { date: '2024-01-05', clicks: 190 },
    { date: '2024-01-06', clicks: 250 },
    { date: '2024-01-07', clicks: 280 }
  ];

  const deviceData = [
    { name: 'Desktop', clicks: 450, color: '#1976d2' },
    { name: 'Mobile', clicks: 320, color: '#4caf50' },
    { name: 'Tablet', clicks: 130, color: '#ff9800' }
  ];

  const topLinks = [
    { 
      id: 1, 
      title: 'Summer Sale Campaign', 
      shortUrl: 'bit.ly/summer2024', 
      clicks: 1240, 
      created: '2024-01-15',
      status: 'active'
    },
    { 
      id: 2, 
      title: 'Product Launch', 
      shortUrl: 'bit.ly/newproduct', 
      clicks: 890, 
      created: '2024-01-10',
      status: 'active'
    },
    { 
      id: 3, 
      title: 'Newsletter Signup', 
      shortUrl: 'bit.ly/newsletter', 
      clicks: 650, 
      created: '2024-01-05',
      status: 'active'
    }
  ];

  const recentActivity = [
    { type: 'link_created', message: 'New link created: Summer Sale Campaign', time: '2 hours ago' },
    { type: 'milestone', message: '1000 clicks milestone reached', time: '5 hours ago' },
    { type: 'qr_generated', message: 'QR code generated for newsletter link', time: '1 day ago' },
    { type: 'link_shared', message: 'Link shared on social media', time: '2 days ago' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'link_created': return <LinkIcon />;
      case 'milestone': return <TrendingUpIcon />;
      case 'qr_generated': return <QrCodeIcon />;
      case 'link_shared': return <PublicIcon />;
      default: return <AnalyticsIcon />;
    }
  };

  const StatCard = ({ title, value, change, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>
            {icon}
          </Avatar>
        </Box>
        {change && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`${change > 0 ? '+' : ''}${change}%`}
              size="small"
              color={change > 0 ? 'success' : 'error'}
              sx={{ fontSize: '0.75rem' }}
            />
            <Typography variant="body2" color="text.secondary">
              vs last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          Welcome back! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your links today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Links"
            value={linkStats.totalLinks || 24}
            change={12}
            icon={<LinkIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clicks"
            value={linkStats.totalClicks || '12.4K'}
            change={8}
            icon={<VisibilityIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="QR Codes"
            value={linkStats.qrCodes || 8}
            change={-2}
            icon={<QrCodeIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Links"
            value={linkStats.activeLinks || 21}
            change={5}
            icon={<TrendingUpIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Clicks Over Time */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 400, border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Clicks Over Time
                </Typography>
                <Button size="small" variant="outlined">
                  Last 7 days
                </Button>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={clicksData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#1976d2" 
                    strokeWidth={3}
                    dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Device Breakdown */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 400, border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Device Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="clicks"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                {deviceData.map((device, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: device.color 
                        }} 
                      />
                      <Typography variant="body2">{device.name}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="bold">
                      {device.clicks}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        {/* Top Performing Links */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400, border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  Top Performing Links
                </Typography>
                <Button size="small" endIcon={<LaunchIcon />}>
                  View All
                </Button>
              </Box>
              <List>
                {topLinks.map((link, index) => (
                  <React.Fragment key={link.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {link.title}
                            </Typography>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              {link.clicks.toLocaleString()}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="primary" sx={{ mb: 0.5 }}>
                              {link.shortUrl}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <ScheduleIcon fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                Created {link.created}
                              </Typography>
                              <Chip 
                                label={link.status} 
                                size="small" 
                                color="success" 
                                sx={{ ml: 1 }} 
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < topLinks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 400, border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Recent Activity
              </Typography>
              <List>
                {recentActivity.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'grey.100', color: 'text.primary' }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.message}
                        secondary={activity.time}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LinkDashboard;