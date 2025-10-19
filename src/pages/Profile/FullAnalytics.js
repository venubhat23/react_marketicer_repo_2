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
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, CartesianGrid, PieChart,Pie,Cell,
  ResponsiveContainer, } from 'recharts';
import { useParams } from "react-router-dom";
import axios from 'axios';
import Sidebar from '../../components/Sidebar'

const FullAnalytics = () => {

  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [engagementData, setEngagementData] = useState([]);
  const [monthlyEng, setMonthlyEng] = useState([]);
  const [performanceData, setPerformanceData] = useState([])

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

  useEffect(() => {
    if (post?.chart_data?.engagement_breakdown) {
      setEngagementData(post.chart_data.engagement_breakdown);
    } else {
      setEngagementData([]); // fallback
    }
    if (Array.isArray(post?.chart_data?.monthly_engagement)) {
      setMonthlyEng(post.chart_data.monthly_engagement);
    } else {
      setMonthlyEng([]); // fallback
    }
    if (Array.isArray(post?.chart_data?.performance_trends)) {
      setPerformanceData(post?.chart_data?.performance_trends);
    } else {
      setPerformanceData([]); // fallback
    }
  }, [post]);


  const COLORS = ["#8B5CF6", "#A78BFA", "#C4B5FD"];


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

            <Grid container spacing={2}>
              <Grid size={{ xs: 2, sm: 4, md: 3 }} spacing={2}>

                <Card>
                  {post && post.url ? (
                    <CardContent sx={{ width: '200', height: '100', borderRadius: 2, border: "1px solid #e2e2e2", boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)" }}>
                      <img
                        alt="Influencer"
                        src={post.url || null}
                        width='200'
                      />
                    </CardContent>
                  ) : (
                    <p>No image available</p>
                  )}

                </Card>
              </Grid>

              <Grid size={{ xs: 2, sm: 4, md: 9 }} spacing={2}>
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
                            Total Reach
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                </Box>
              </Grid>

              <Grid size={{ xs: 2, sm: 4, md: 6 }} spacing={2} >
                <Card sx={{ p: 1, background: '#fff', borderRadius: 2, border: "1px solid #e2e2e2", boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)", }}>
                  <CardContent>
                    <Typography variant='body1'>Engagement Breakdown</Typography>
                    {engagementData.length > 0 ? (
                      <ResponsiveContainer width="60%" height={300}>
                        <PieChart>
                          <Pie
                            data={engagementData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={120}
                            label
                          >
                            {engagementData.map((entry, index) => (
                              <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p>No data available</p>
                    )}

                  </CardContent>
                </Card>

              </Grid>

              <Grid size={{ xs: 2, sm: 4, md: 6 }} spacing={2}>
                <Card sx={{ p: 1, background: '#fff', borderRadius: 2, border: "1px solid #e2e2e2", boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)", }}>
                  <CardContent>
                    <Typography variant='body1'> Monthly Engagement </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyEng} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="likes" fill="#8B5CF6" />
                        <Bar dataKey="comments" fill="#A78BFA" />
                        <Bar dataKey="views" fill="#C4B5FD" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

              </Grid>

              <Grid item xs={12} md={12} size={12}>
                <Card sx={{ p: 1, background: '#fff', borderRadius: 2, border: "1px solid #e2e2e2", boxShadow: "0px 2px 6px rgba(123, 123, 123, 0.25)", }}>
                  <Typography variant="body1">
                    Performance Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="views" stroke="#8884d8" />
                      <Line type="monotone" dataKey="engagement" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="followers_gained" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>

            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FullAnalytics