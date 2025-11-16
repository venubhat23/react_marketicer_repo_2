import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent,
  CircularProgress, Alert, Tab, Tabs, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, LinearProgress
} from '@mui/material';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import LinkedInAudienceAPI from '../../services/linkedinAudienceApi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`audience-tabpanel-${index}`}
      aria-labelledby={`audience-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const EnhancedAudienceInsights = ({ organizationId, selectedUser }) => {
  const [loading, setLoading] = useState(true);
  const [audienceData, setAudienceData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (organizationId || selectedUser?.page_id) {
      fetchAudienceData();
    }
  }, [organizationId, selectedUser]);

  const fetchAudienceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const orgId = organizationId || selectedUser?.page_id;
      const data = await LinkedInAudienceAPI.getComprehensiveAudienceData(orgId);

      if (data.success) {
        setAudienceData(data.data);
      } else {
        setError('Failed to fetch audience data');
      }
    } catch (err) {
      console.error('Error fetching audience data:', err);
      setError(err.message || 'Failed to fetch audience insights');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading audience insights...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
        <Typography variant="body2" sx={{ mt: 1 }}>
          This feature requires additional LinkedIn API permissions. Please contact support to enable advanced audience insights.
        </Typography>
      </Alert>
    );
  }

  if (!audienceData) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No audience insights data available. Please ensure your LinkedIn account has the necessary permissions and try again.
      </Alert>
    );
  }

  const renderDemographicsTab = () => {
    const demographics = audienceData.audienceInsights?.demographics || audienceData.followerDemographics;

    if (!demographics) {
      return (
        <Alert severity="info">
          Demographics data not available. This requires the r_organization_followers permission.
        </Alert>
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Job Functions</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={demographics.jobFunctions?.slice(0, 8) || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="totalCount"
                  >
                    {demographics.jobFunctions?.slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Industries</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={demographics.industries?.slice(0, 10) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalCount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Seniority Levels</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={demographics.seniorities || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#82ca9d"
                    dataKey="totalCount"
                  >
                    {demographics.seniorities?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Company Sizes</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={demographics.companySizes || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalCount" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderEngagementTab = () => {
    const engagement = audienceData.engagementByAudience;

    if (!engagement) {
      return (
        <Alert severity="info">
          Engagement data not available. This requires enhanced analytics permissions.
        </Alert>
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top Performing Audience Segments</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Segment</TableCell>
                      <TableCell>Engagement Rate</TableCell>
                      <TableCell>Total Engagement</TableCell>
                      <TableCell>Audience Size</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {engagement.topPerformingSegments?.map((segment, index) => (
                      <TableRow key={index}>
                        <TableCell>{segment.name}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinearProgress
                              variant="determinate"
                              value={segment.engagementRate * 100}
                              sx={{ width: 100, mr: 1 }}
                            />
                            {(segment.engagementRate * 100).toFixed(1)}%
                          </Box>
                        </TableCell>
                        <TableCell>{segment.totalEngagement}</TableCell>
                        <TableCell>{segment.audienceSize}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Engagement by Industry</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagement.byIndustry || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="industry" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="engagementRate" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Engagement Trends</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagement.engagementTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="engagementRate" stroke="#8884d8" />
                  <Line type="monotone" dataKey="reach" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderProfileViewersTab = () => {
    const viewers = audienceData.profileViewers;

    if (!viewers) {
      return (
        <Alert severity="info">
          Profile viewers data not available. This requires the r_member_profileAnalytics permission.
        </Alert>
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">{viewers.totalViews || 0}</Typography>
              <Typography variant="body1">Total Profile Views</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">{viewers.uniqueViewers || 0}</Typography>
              <Typography variant="body1">Unique Viewers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary">{viewers.averageViewsPerDay || 0}</Typography>
              <Typography variant="body1">Average Views/Day</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Profile Viewer Trends</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={viewers.viewerTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderContentPerformanceTab = () => {
    const content = audienceData.contentPerformance;

    if (!content) {
      return (
        <Alert severity="info">
          Content performance data not available. Additional analytics permissions required.
        </Alert>
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Performance by Content Type</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={content.byContentType || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="contentType" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="engagementRate" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Content Recommendations</Typography>
              {content.contentRecommendations?.map((rec, index) => (
                <Chip
                  key={index}
                  label={rec.recommendation}
                  sx={{ m: 0.5 }}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Enhanced Audience Insights
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Comprehensive audience analytics powered by LinkedIn's advanced API
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Demographics" />
          <Tab label="Engagement Analytics" />
          <Tab label="Profile Viewers" />
          <Tab label="Content Performance" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          {renderDemographicsTab()}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {renderEngagementTab()}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {renderProfileViewersTab()}
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          {renderContentPerformanceTab()}
        </TabPanel>
      </Paper>

      {audienceData && Object.values(audienceData).every(data => data === null) && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="h6">Enhanced Features Not Available</Typography>
          <Typography>
            To unlock comprehensive audience insights, your LinkedIn app needs additional permissions:
          </Typography>
          <ul>
            <li><strong>r_organization_followers</strong> - For detailed follower demographics</li>
            <li><strong>r_member_profileAnalytics</strong> - For profile viewer insights</li>
            <li><strong>r_ads</strong> - For audience insights API access</li>
          </ul>
          <Typography sx={{ mt: 1 }}>
            Contact LinkedIn's Developer Support to request these advanced permissions for your application.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default EnhancedAudienceInsights;