import React from 'react';
import { Grid, Box, Typography, Card, CardContent, Avatar, Button, Divider, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', Saves: 30, Shares: 40, Comments: 20 },
  { name: 'Feb', Saves: 50, Shares: 30, Comments: 25 },
  { name: 'Mar', Saves: 40, Shares: 60, Comments: 30 },
  { name: 'Apr', Saves: 60, Shares: 45, Comments: 35 },
  { name: 'May', Saves: 70, Shares: 55, Comments: 45 },
  { name: 'Jun', Saves: 80, Shares: 60, Comments: 50 },
  { name: 'Jul', Saves: 100, Shares: 70, Comments: 60 },
  { name: 'Aug', Saves: 90, Shares: 80, Comments: 55 },
  { name: 'Sep', Saves: 110, Shares: 85, Comments: 65 },
  { name: 'Oct', Saves: 120, Shares: 90, Comments: 70 },
  { name: 'Nov', Saves: 130, Shares: 100, Comments: 75 },
  { name: 'Dec', Saves: 140, Shares: 110, Comments: 80 },
];

const MetricCard = ({ title, value, icon }) => (
  <Card sx={{ p: 2 }}>
    <Typography variant="body2" color="text.secondary">{title}</Typography>
    <Box display="flex" alignItems="center" gap={1} mt={1}>
      <Typography variant="h6">{value}</Typography>
      {icon && <TrendingUpIcon color="success" />}
    </Box>
  </Card>
);

const PostCard = () => (
  <Card sx={{ p: 2 }}>
    <Box display="flex" gap={2}>
      <Avatar
        variant="rounded"
        src="https://via.placeholder.com/80"
        sx={{ width: 80, height: 80 }}
      />
      <Box flex={1}>
        <Box display="flex" gap={1} mb={1}>
          <Chip label="Most Liked" color="success" size="small" />
          <Chip label="Most Clicked" color="primary" size="small" />
          <Chip label="Best CTR" size="small" />
        </Box>
        <Typography variant="subtitle1">Influencer</Typography>
        <Typography variant="body2" color="text.secondary">
          @name — Lorem ipsum dolor sit...
        </Typography>
        <Box display="flex" gap={2} mt={1}>
          <Typography variant="caption">👍 3.6K</Typography>
          <Typography variant="caption">👁️ 248</Typography>
          <Typography variant="caption">💬 234</Typography>
        </Box>
        <Button size="small" sx={{ mt: 1 }} variant="outlined">Paid Promotion</Button>
      </Box>
    </Box>
  </Card>
);

const PaidPerformance= ()=> {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* LEFT COLUMN (8/12) */}
        <Grid item xs={12} md={8} size={8}>
          <Grid container spacing={2}>
            <Grid item xs={6}><MetricCard title="Total Paid Campaign" value="30" /></Grid>
            <Grid item xs={6}><MetricCard title="Paid Engagement Rate" value="3.9%" icon /></Grid>
            <Grid item xs={6}><MetricCard title="Total Paid Impressions" value="5M" /></Grid>
            <Grid item xs={6}><MetricCard title="Paid Click-through Rate" value="1.9%" icon /></Grid>
            <Grid item xs={6}><MetricCard title="Total Paid Reach" value="1.2M" /></Grid>
            <Grid item xs={6}><MetricCard title="Cost per Engagement" value="₹100000" /></Grid>
            <Grid item xs={6}><MetricCard title="Return on Ad Spend" value="5x" /></Grid>
            <Grid item xs={12} md={12} size={12}>
              <Card sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Bar Graph
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Saves" stroke="#8884d8" />
                    <Line type="monotone" dataKey="Shares" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="Comments" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* RIGHT COLUMN (4/12) */}
        <Grid item xs={12} md={4} size={4}>
          <Typography variant="h6" gutterBottom>Top Performing Paid Post</Typography>
          <PostCard />
          <Box mt={2}>
            <PostCard />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PaidPerformance
