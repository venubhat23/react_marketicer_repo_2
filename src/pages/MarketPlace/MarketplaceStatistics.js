import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Visibility as ViewsIcon,
  People as BidsIcon,
  AttachMoney as MoneyIcon,
  Star as TopIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import MarketplaceAPI, { handleApiError } from '../../services/marketplaceApi';

const MarketplaceStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch marketplace statistics
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await MarketplaceAPI.getMarketplaceStatistics();
      if (response.success) {
        setStatistics(response.data);
      } else {
        toast.error('Failed to fetch statistics');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!statistics) {
    return <Alert severity="error">Failed to load statistics</Alert>;
  }

  const {
    total_posts,
    published_posts,
    draft_posts,
    total_views,
    total_bids,
    pending_bids,
    accepted_bids,
    rejected_bids,
    average_bid_amount,
    top_performing_posts,
    category_breakdown,
    recent_activity
  } = statistics;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#882AFF' }}>
        📊 Marketplace Statistics
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {total_posts}
                  </Typography>
                  <Typography variant="body2">Total Posts</Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {total_views.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">Total Views</Typography>
                </Box>
                <ViewsIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {total_bids}
                  </Typography>
                  <Typography variant="body2">Total Bids</Typography>
                </Box>
                <BidsIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ₹{average_bid_amount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">Avg Bid Amount</Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Post Status Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                📝 Post Status Breakdown
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Published</Typography>
                  <Typography variant="body2">{published_posts} ({((published_posts/total_posts)*100).toFixed(1)}%)</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(published_posts/total_posts)*100}
                  sx={{ 
                    height: 8, 
                    borderRadius: 1,
                    '& .MuiLinearProgress-bar': { bgcolor: '#4caf50' }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Draft</Typography>
                  <Typography variant="body2">{draft_posts} ({((draft_posts/total_posts)*100).toFixed(1)}%)</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(draft_posts/total_posts)*100}
                  sx={{ 
                    height: 8, 
                    borderRadius: 1,
                    '& .MuiLinearProgress-bar': { bgcolor: '#ff9800' }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Bid Status Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                🎯 Bid Status Breakdown
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Pending</Typography>
                  <Typography variant="body2">{pending_bids} ({((pending_bids/total_bids)*100).toFixed(1)}%)</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(pending_bids/total_bids)*100}
                  sx={{ 
                    height: 8, 
                    borderRadius: 1,
                    '& .MuiLinearProgress-bar': { bgcolor: '#ff9800' }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Accepted</Typography>
                  <Typography variant="body2">{accepted_bids} ({((accepted_bids/total_bids)*100).toFixed(1)}%)</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(accepted_bids/total_bids)*100}
                  sx={{ 
                    height: 8, 
                    borderRadius: 1,
                    '& .MuiLinearProgress-bar': { bgcolor: '#4caf50' }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Rejected</Typography>
                  <Typography variant="body2">{rejected_bids} ({((rejected_bids/total_bids)*100).toFixed(1)}%)</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(rejected_bids/total_bids)*100}
                  sx={{ 
                    height: 8, 
                    borderRadius: 1,
                    '& .MuiLinearProgress-bar': { bgcolor: '#f44336' }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performing Posts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                🏆 Top Performing Posts
              </Typography>
              
              <List>
                {top_performing_posts.map((post, index) => (
                  <React.Fragment key={post.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: index === 0 ? '#FFD700' : '#882AFF' }}>
                          {index === 0 ? <TopIcon /> : index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {post.title}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {post.views_count} views • {post.bids_count} bids
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <Chip 
                                label={`Category ${post.category}`} 
                                size="small" 
                                sx={{ mr: 1 }}
                              />
                              <Chip 
                                label={`₹${post.budget.toLocaleString()}`} 
                                size="small"
                                color="primary"
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < top_performing_posts.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                📊 Category Breakdown
              </Typography>
              
              {category_breakdown.map((category) => (
                <Box key={category.category} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">Category {category.category}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {category.total_views} views
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {category.post_count} posts
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(category.post_count/total_posts)*100}
                    sx={{ 
                      height: 8, 
                      borderRadius: 1,
                      '& .MuiLinearProgress-bar': { 
                        bgcolor: category.category === 'A' ? '#882AFF' : '#ff6b35' 
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {((category.post_count/total_posts)*100).toFixed(1)}% of total posts
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarketplaceStatistics;