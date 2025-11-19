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
                  <Grid container spacing={2}>

                    <Grid item xs={3}>
                      <Card
                        sx={{
                          width: 150,
                          height: 86,
                          border: "1px solid #b6b6b6",
                          borderRadius: "10px",
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="h6">{post.likes}</Typography>
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            Total Likes
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={3}>
                      <Card
                        sx={{
                          width: 150,
                          height: 86,
                          border: "1px solid #b6b6b6",
                          borderRadius: "10px",
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="h6">{post.comments}</Typography>
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            Total Comments
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={3}>
                      <Card
                        sx={{
                          width: 150,
                          height: 86,
                          border: "1px solid #b6b6b6",
                          borderRadius: "10px",
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="h6">{post.engagement}</Typography>
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            Total Engagemnet
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={3}>
                      <Card
                        sx={{
                          width: 150,
                          height: 86,
                          border: "1px solid #b6b6b6",
                          borderRadius: "10px",
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="h6">{post.reach}</Typography>
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            Accounts Reached
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={3}>
                      <Card
                        sx={{
                          width: 150,
                          height: 86,
                          border: "1px solid #b6b6b6",
                          borderRadius: "10px",
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="h6">{post.saved}</Typography>
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            Total Saved
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={3}>
                      <Card
                        sx={{
                          width: 150,
                          height: 86,
                          border: "1px solid #b6b6b6",
                          borderRadius: "10px",
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="h6">{post.shares}</Typography>
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            Total Shares
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={3}>
                      <Card
                        sx={{
                          width: 150,
                          height: 86,
                          border: "1px solid #b6b6b6",
                          borderRadius: "10px",
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="h6">{post.impressions}</Typography>
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            Impressions
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                  </Grid>

                  <Grid container spacing={2} sx={{ mt: 2 }}>


                    <Grid item xs={3}>
                      <Card
                        sx={{
                          width: 150,
                          height: 86,
                          border: "1px solid #b6b6b6",
                          borderRadius: "10px",
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="h6">{post.engagement_rate?.toFixed(1)}%</Typography>
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            Engagement Rate
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={3}>
                      <Card
                        sx={{
                          width: 150,
                          height: 86,
                          border: "1px solid #b6b6b6",
                          borderRadius: "10px",
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="h6">{post.reach_rate?.toFixed(1)}%</Typography>
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            Reach Rate
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={{ mt: 2 }}>


                    <Grid item xs={3}>
                      <Card
                        sx={{
                          width: 150,
                          height: 86,
                          border: "1px solid #b6b6b6",
                          borderRadius: "10px",
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="h6">{post.days_since_posted}</Typography>
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            Days Since Posted
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={3}>
                      <Card
                        sx={{
                          width: 150,
                          height: 86,
                          border: "1px solid #b6b6b6",
                          borderRadius: "10px",
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="h6">{post.caption_length}</Typography>
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            Caption Length
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

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