import React, { useEffect, useState } from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Paper,
  Grid,
  Container,
  Card,
  CardContent,
  CssBaseline,
  ThemeProvider,
  createTheme,
  styled
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Sidebar from '../../components/Sidebar'

const FullAnalytics = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const fullAnalyticsData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://api.marketincer.com/api/instagram/posts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(response?.data?.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fullAnalyticsData();
  }, [id]);




  if (loading) return <Typography>Loading...</Typography>;
  if (!post) return <Typography>No data found</Typography>;

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', height: '100%' }} >
      <Grid container>
        <Grid size={{ md: 1 }} className="side_section"> <Sidebar /></Grid>
        <Grid size={{ md: 11 }}>
          <Paper
            elevation={0}
            sx={{
              display: { xs: 'none', md: 'block' },
              p: 1,
              backgroundColor: '#091a48',
              borderBottom: '1px solid',
              borderColor: 'divider',
              borderRadius: 0
            }}
          >
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>

              <Typography variant="h6" sx={{ color: '#fff' }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="back"
                  onClick={handleBack}
                  sx={{ mr: 2, color: '#fff' }}
                >
                  <ArrowLeftIcon />
                </IconButton>
                Full Analytics
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="large" sx={{ color: '#fff' }}>
                  <NotificationsIcon />
                </IconButton>
                <IconButton size="large" sx={{ color: '#fff' }}>
                  <AccountCircleIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
          <Box sx={{ flexGrow: 1, mt: { xs: 8, md: 0 }, padding: '20px' }}>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {post && post.media_url ? (
                    <CardContent sx={{ p: 2, borderRadius: 2, border: "1px solid #e2e2e2", boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)" }}>
                      <img
                        alt="Post"
                        src={post.media_url}
                        style={{
                          width: '100%',
                          maxWidth: '300px',
                          height: 'auto',
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }}
                      />
                    </CardContent>
                  ) : (
                    <p>No image available</p>
                  )}
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                <Box sx={{ p: 2, background: '#fff', borderRadius: 2, border: "1px solid #e2e2e2", boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)", }}>
                  <Typography variant="h6" >{post.caption}</Typography>
                  <Typography variant="body2">@mybrand</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Typography>
                  {/* <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    textAlign: "left",
                    display:'table-cell',
                    mt: 2,
                    mb: 2,
                    ml: 61,
                  }}
                >
                  Campaign Analytics
                </Typography> */}
                  {/* Analytics Cards Section with Creative Layout */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1a1a1a' }}>
                    Post Analytics Overview
                  </Typography>
                  
                  {/* Primary Metrics - Featured Cards (4 cards) */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#666' }}>
                      Primary Metrics
                    </Typography>
                    <Grid container spacing={3}>
                      {[
                        { value: post.likes, label: "Total Likes", color: '#E91E63', icon: '❤️' },
                        { value: post.comments, label: "Total Comments", color: '#2196F3', icon: '💬' },
                        { value: post.engagement, label: "Total Engagement", color: '#FF9800', icon: '🔥' },
                        { value: post.reach, label: "Accounts Reached", color: '#4CAF50', icon: '👥' }
                      ].map((metric, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                          <Card
                            sx={{
                              height: 120,
                              borderRadius: '16px',
                              background: `linear-gradient(135deg, ${metric.color}15 0%, ${metric.color}25 100%)`,
                              border: `2px solid ${metric.color}30`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: `0 8px 25px ${metric.color}40`,
                                border: `2px solid ${metric.color}60`,
                              }
                            }}
                          >
                            <CardContent sx={{ textAlign: "center", p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <Box sx={{ fontSize: '24px', mb: 1 }}>
                                {metric.icon}
                              </Box>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: metric.color, mb: 0.5 }}>
                                {metric.value?.toLocaleString() || '0'}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                                {metric.label}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Engagement Metrics (3 cards) */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#666' }}>
                      Engagement Details
                    </Typography>
                    <Grid container spacing={3}>
                      {[
                        { value: post.saved, label: "Total Saved", color: '#9C27B0', icon: '🔖' },
                        { value: post.shares, label: "Total Shares", color: '#00BCD4', icon: '📤' },
                        { value: post.impressions, label: "Impressions", color: '#795548', icon: '👁️' }
                      ].map((metric, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card
                            sx={{
                              height: 110,
                              borderRadius: '14px',
                              background: `linear-gradient(135deg, ${metric.color}10 0%, ${metric.color}20 100%)`,
                              border: `1px solid ${metric.color}40`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 6px 20px ${metric.color}30`,
                              }
                            }}
                          >
                            <CardContent sx={{ textAlign: "center", p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <Box sx={{ fontSize: '20px', mb: 1 }}>
                                {metric.icon}
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: metric.color, mb: 0.5 }}>
                                {metric.value?.toLocaleString() || '0'}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                                {metric.label}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Performance Rates (2 cards) */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#666' }}>
                      Performance Rates
                    </Typography>
                    <Grid container spacing={3}>
                      {[
                        { value: `${post.engagement_rate?.toFixed(1) || '0'}%`, label: "Engagement Rate", color: '#FF5722', icon: '📊' },
                        { value: `${post.reach_rate?.toFixed(1) || '0'}%`, label: "Reach Rate", color: '#3F51B5', icon: '📈' }
                      ].map((metric, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Card
                            sx={{
                              height: 110,
                              borderRadius: '14px',
                              background: `linear-gradient(135deg, ${metric.color}10 0%, ${metric.color}20 100%)`,
                              border: `1px solid ${metric.color}40`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 6px 20px ${metric.color}30`,
                              }
                            }}
                          >
                            <CardContent sx={{ textAlign: "center", p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <Box sx={{ fontSize: '20px', mb: 1 }}>
                                {metric.icon}
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: metric.color, mb: 0.5 }}>
                                {metric.value}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                                {metric.label}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Additional Insights (2 cards) */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#666' }}>
                      Post Insights
                    </Typography>
                    <Grid container spacing={3}>
                      {[
                        { value: post.days_since_posted, label: "Days Since Posted", color: '#607D8B', icon: '⏰', unit: ' days' },
                        { value: post.caption_length, label: "Caption Length", color: '#8BC34A', icon: '📝', unit: ' chars' }
                      ].map((metric, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Card
                            sx={{
                              height: 100,
                              borderRadius: '12px',
                              background: `linear-gradient(135deg, ${metric.color}08 0%, ${metric.color}15 100%)`,
                              border: `1px solid ${metric.color}30`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: `0 4px 15px ${metric.color}25`,
                              }
                            }}
                          >
                            <CardContent sx={{ textAlign: "center", p: 1.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <Box sx={{ fontSize: '18px', mb: 0.5 }}>
                                {metric.icon}
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: metric.color, mb: 0.5, fontSize: '1.1rem' }}>
                                {metric.value || '0'}{metric.unit || ''}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500, fontSize: '0.8rem' }}>
                                {metric.label}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                </Box>
              </Grid>

            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FullAnalytics