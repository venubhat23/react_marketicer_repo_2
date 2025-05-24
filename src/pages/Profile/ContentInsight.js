import React from 'react';
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import LinkIcon from '@mui/icons-material/Link';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const postData = Array(8).fill({
  avatar: 'https://i.pravatar.cc/100',
  type: 'Reel',
  name: 'Influencer',
  handle: '@name',
  caption: 'This is caption',
  likes: '37.8K',
  comments: 248,
  shares: 234,
  engagement: '4.2%',
});

const engagementMetrics = [
  { label: 'Average Engagement Rate', value: '3.9%' },
  { label: 'Average Comments per Post', value: '3.1%' },
  { label: 'Average Likes per Post', value: '4.9%' },
  { label: 'Save/Share Ratio', value: '2.9%' },
];

const pieData = [
  { name: 'Reels', value: 40, color: '#3f51b5' },
  { name: 'Stories', value: 30, color: '#2196f3' },
  { name: 'Static Posts', value: 20, color: '#03a9f4' },
  { name: 'Carousels', value: 10, color: '#00bcd4' },
];

const  ContentInsight= ()=> {
  return (
    <Box p={2}>
      <Grid container spacing={2}>
        {/* Left: Top Performing Posts */}
        <Grid item xs={12} md={8} size={8}>
          <Typography variant="subtitle1" gutterBottom align='left'>
            Top Performing Posts
          </Typography>
          <Grid container spacing={2}>
            {postData.map((post, i) => (
              <Grid item xs={6} sm={3} size={3} key={i}>
                <Card sx={{ position: 'relative' }}>
                  <Chip
                    label={post.type}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }}
                  />
                  <Box
                    component="img"
                    src={post.avatar}
                    alt=""
                    sx={{ width: '100%', height: 140, objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Box display="flex" gap={1} mb={1}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <FavoriteBorderIcon fontSize="small" />
                        <Typography variant="caption">{post.likes}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <ChatBubbleOutlineIcon fontSize="small" />
                        <Typography variant="caption">{post.comments}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <SendIcon fontSize="small" />
                        <Typography variant="caption">{post.shares}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="subtitle2">{post.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {post.handle}
                    </Typography>
                    <Typography variant="body2" mt={1}>
                      {post.caption}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="caption">
                      Engagement rate: <Box component="span" color="success.main">{post.engagement}</Box>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right: Engagement Metrics & Pie */}
        <Grid item xs={12} md={4} size={4}>
          <Typography variant="subtitle1" gutterBottom>
            Engagement Metrics
          </Typography>
          <Grid container spacing={2}>
            {engagementMetrics.map((m, i) => (
              <Grid item xs={6} key={i}>
                <Card sx={{ p: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {m.label}
                  </Typography>
                  <Typography variant="h6" display="inline">
                    {m.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    component="span"
                    color="success.main"
                    sx={{ ml: 0.5 }}
                  >
                    ↑
                  </Typography>
                </Card>
              </Grid>
            ))}
            {/* Pie Chart */}
            <Grid item xs={12} size={12}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Content type Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius="60%"
                      outerRadius="80%"
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <Box mt={1}>
                  {pieData.map((entry, i) => (
                    <Typography variant="caption" key={i} display="block">
                      <Box
                        component="span"
                        sx={{
                          width: 10,
                          height: 10,
                          bgcolor: entry.color,
                          display: 'inline-block',
                          borderRadius: '50%',
                          mr: 0.5,
                        }}
                      />
                      {entry.name} {entry.value}%
                    </Typography>
                  ))}
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption">Post Frequency: 5 posts/week</Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ContentInsight