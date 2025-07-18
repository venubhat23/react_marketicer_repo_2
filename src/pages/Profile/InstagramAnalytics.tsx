import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid2 as Grid,
  Avatar,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  IconButton,
  Divider,
  Stack,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  PersonAdd,
  Instagram,
  Download,
  Language,
  MoreVert,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import Layout from '../../components/Layout';

// Mock data for the analytics
const profileData = {
  username: 'virat.kohli',
  fullName: 'Virat Kohli',
  avatar: '/api/placeholder/80/80',
  website: 'http://ITGOL.com',
  verified: true,
  joinDate: 'Joined since Jan 10, 2017, Updated 4 hours ago',
  followers: 273949045,
  following: 260,
  posts: 1036,
  followersChange: -166348,
  followingChange: 0,
  postsChange: 1,
};

const metricsData = [
  {
    title: 'Followers Growth Rate (90 Days)',
    value: '1.04%',
    color: '#4caf50',
    icon: <TrendingUp />,
  },
  {
    title: 'Weekly Followers',
    value: '-53,653',
    color: '#f44336',
    icon: <TrendingDown />,
  },
  {
    title: 'Engagement Rate',
    value: '4.14%',
    color: '#ff9800',
    icon: <FavoriteBorder />,
  },
  {
    title: 'Average Likes',
    value: '11,022,461',
    color: '#2196f3',
    icon: <FavoriteBorder />,
  },
  {
    title: 'Average Comments',
    value: '323,928',
    color: '#9c27b0',
    icon: <ChatBubbleOutline />,
  },
  {
    title: 'Weekly Posts',
    value: '1',
    color: '#607d8b',
    icon: <Instagram />,
  },
  {
    title: 'Engagement Rate',
    value: '978,389.5',
    color: '#4caf50',
    icon: <Share />,
  },
  {
    title: 'Comments Rate',
    value: '2.94',
    color: '#ff5722',
    icon: <ChatBubbleOutline />,
  },
];

const followersChartData = [
  { date: '10/24', followers: 274.0 },
  { date: '11/24', followers: 273.8 },
  { date: '12/24', followers: 273.6 },
  { date: '01/25', followers: 273.4 },
  { date: '02/25', followers: 273.2 },
  { date: '03/25', followers: 273.0 },
];

const followingChartData = [
  { date: '10/24', following: 260 },
  { date: '11/24', following: 260 },
  { date: '12/24', following: 260 },
  { date: '01/25', following: 260 },
  { date: '02/25', following: 260 },
  { date: '03/25', following: 260 },
];

const engagementChartData = [
  { date: '10/24', rate: 4.0 },
  { date: '11/24', rate: 4.1 },
  { date: '12/24', rate: 4.2 },
  { date: '01/25', rate: 4.15 },
  { date: '02/25', rate: 4.12 },
  { date: '03/25', rate: 4.14 },
];

const averageLikesChartData = [
  { date: '10/24', likes: 11.5 },
  { date: '11/24', likes: 11.2 },
  { date: '12/24', likes: 11.0 },
  { date: '01/25', likes: 10.8 },
  { date: '02/25', likes: 10.5 },
  { date: '03/25', likes: 11.02 },
];

const historicalData = [
  { date: 'Jul 19 2025', day: 'Sat', followers: 273949045, change: -165, following: 260, posts: 1036, engagement: '4.14%' },
  { date: 'Jul 18 2025', day: 'Fri', followers: 273949842, change: -797, following: 260, posts: 1036, engagement: '4.14%' },
  { date: 'Jul 17 2025', day: 'Thu', followers: 273963707, change: -13865, following: 260, posts: 1036, engagement: '4.16%' },
  { date: 'Jul 16 2025', day: 'Wed', followers: 273968950, change: -5243, following: 260, posts: 1036, engagement: '4.16%' },
  { date: 'Jul 15 2025', day: 'Tue', followers: 273976508, change: -7558, following: 260, posts: 1036, engagement: '4.16%' },
  { date: 'Jul 14 2025', day: 'Mon', followers: 273985433, change: -8925, following: 260, posts: 1036, engagement: '4.16%' },
  { date: 'Jul 13 2025', day: 'Sun', followers: 273999207, change: -13774, following: 260, posts: 1036, engagement: '4.16%' },
  { date: 'Jul 12 2025', day: 'Sat', followers: 273993870, change: 5337, following: 260, posts: 1036, engagement: '4.16%' },
  { date: 'Jul 11 2025', day: 'Fri', followers: 274007385, change: -13515, following: 260, posts: 1036, engagement: '4.15%' },
  { date: 'Jul 10 2025', day: 'Thu', followers: 274014608, change: -7223, following: 260, posts: 1036, engagement: '4.15%' },
  { date: 'Jul 9 2025', day: 'Wed', followers: 274018589, change: -3981, following: 260, posts: 1036, engagement: '4.15%' },
  { date: 'Jul 8 2025', day: 'Tue', followers: 274018384, change: 205, following: 260, posts: 1036, engagement: '4.15%' },
  { date: 'Jul 7 2025', day: 'Mon', followers: 274042861, change: -24477, following: 260, posts: 1036, engagement: '4.14%' },
  { date: 'Jul 6 2025', day: 'Sun', followers: 274050951, change: -8090, following: 260, posts: 1036, engagement: '4.14%' },
];

const InstagramAnalytics: React.FC = () => {
  const theme = useTheme();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toLocaleString()}`;
  };

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Instagram Analytics Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Comprehensive analytics for @{profileData.username}
          </Typography>
        </Box>

      {/* Profile Header */}
      <Card sx={{ mb: 4, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar
            src={profileData.avatar}
            sx={{ width: 80, height: 80 }}
          />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {profileData.fullName}
              </Typography>
              {profileData.verified && (
                <Chip
                  label="Verified"
                  size="small"
                  color="primary"
                  sx={{ fontSize: '0.75rem' }}
                />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              @{profileData.username}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {profileData.website}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {profileData.joinDate}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              sx={{ borderRadius: 2 }}
            >
              Add to Favorites
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{ borderRadius: 2 }}
            >
              Last 30 Days
            </Button>
          </Box>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                {formatNumber(profileData.followers)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Followers
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: profileData.followersChange >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 'bold'
                }}
              >
                {formatChange(profileData.followersChange)} ({profileData.followersChange >= 0 ? '+' : ''}0.61%)
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                {profileData.following}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Following
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: profileData.followingChange >= 0 ? 'success.main' : 'text.secondary',
                  fontWeight: 'bold'
                }}
              >
                {formatChange(profileData.followingChange)} (0.00%)
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                {profileData.posts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Posts
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: profileData.postsChange >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 'bold'
                }}
              >
                {formatChange(profileData.postsChange)} (+0.10%)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metricsData.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ p: 2, height: '100%' }}>
              <CardContent sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ color: metric.color }}>
                    {metric.icon}
                  </Box>
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: metric.color, mb: 1 }}>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Followers
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={followersChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="followers" stroke="#4caf50" fill="#4caf50" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Following
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={followingChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="following" stroke="#2196f3" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Engagement Rate
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={engagementChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="rate" stroke="#ff9800" fill="#ff9800" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Average Likes
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={averageLikesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="likes" stroke="#e91e63" fill="#e91e63" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Historical Stats Table */}
      <Card sx={{ mb: 4 }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Historical Stats
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Download />}
            sx={{ borderRadius: 2 }}
          >
            Export Data
          </Button>
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Followers Count</TableCell>
                <TableCell>Following Count</TableCell>
                <TableCell>Media Count</TableCell>
                <TableCell>Engagement Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historicalData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{row.date}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.day}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{row.followers.toLocaleString()}</Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: row.change >= 0 ? 'success.main' : 'error.main',
                          fontWeight: 'bold'
                        }}
                      >
                        {formatChange(row.change)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{row.following}</TableCell>
                  <TableCell>{row.posts}</TableCell>
                  <TableCell>{row.engagement}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            InTrack offers powerful analytics and in-depth actionable insights for brands, influencers and agencies.
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
};

export default InstagramAnalytics;