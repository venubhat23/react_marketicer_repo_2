import React, { useEffect, useState } from 'react';
import {
  Box, Typography, FormControl, Avatar, Grid,
  Select, MenuItem, Card, CardContent,
  Paper, IconButton, CircularProgress,
  Divider, Container, Stack, SelectChangeEvent
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Layout from '../../components/Layout';
import axios from 'axios';

// Type definitions
interface ProfileData {
  page_name: string;
  name: string;
  username: string;
  profileImage: string;
  biography: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  website: string;
  staff_count_range: string;
  company_type: string;
  vanity_name: string;
  industries: string[];
  locations: any[];
  total_posts: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_saves: number;
  displayName: string;
}

interface ApiItem {
  page_name?: string;
  profile?: {
    name?: string;
    username?: string;
    profile_picture_url?: string;
    biography?: string;
    followers_count?: number;
    follows_count?: number;
    media_count?: number;
    website?: string;
    staff_count_range?: string;
    company_type?: string;
    vanity_name?: string;
    industries?: string[];
    locations?: any[];
  };
  analytics?: {
    total_posts?: number;
    total_likes?: number;
    total_comments?: number;
    total_shares?: number;
    total_saves?: number;
  };
}

interface ProfileCardProps {
  data: ProfileData;
}

interface AnalyticsCardProps {
  value: number | string;
  label: string;
}

const Analytics2 = () => {
  const [profileData, setProfileData] = useState<ProfileData[]>([]);
  const [selectedUser, setSelectedUser] = useState<ProfileData | null>(null);
  const [platformOption, setPlatformOption] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Helper function to format API data
  const formatApiData = (apiData: ApiItem[]): ProfileData[] => {
    return apiData.map((item: ApiItem) => ({
      page_name: item.page_name || 'N/A',
      name: item.profile?.name || 'N/A',
      username: item.profile?.username || 'N/A',
      profileImage: item.profile?.profile_picture_url || '',
      biography: item.profile?.biography || 'N/A',
      followers_count: item.profile?.followers_count || 0,
      follows_count: item.profile?.follows_count || 0,
      media_count: item.profile?.media_count || 0,
      website: item.profile?.website || 'N/A',
      staff_count_range: item.profile?.staff_count_range || 'N/A',
      company_type: item.profile?.company_type || 'N/A',
      vanity_name: item.profile?.vanity_name || 'N/A',
      industries: item.profile?.industries || [],
      locations: item.profile?.locations || [],
      total_posts: item.analytics?.total_posts || 0,
      total_likes: item.analytics?.total_likes || 0,
      total_comments: item.analytics?.total_comments || 0,
      total_shares: item.analytics?.total_shares || 0,
      total_saves: item.analytics?.total_saves || 0,
      // For dropdown selection
      displayName: item.page_name || item.profile?.name || 'N/A'
    }));
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('https://api.marketincer.com/api/v1/influencer/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const rawData = response?.data?.data || [];
      if (rawData.length > 0) {
        const formattedData = formatApiData(rawData);
        setProfileData(formattedData);
        setSelectedUser(formattedData[0]);
        setPlatformOption(formattedData[0].displayName);
      } else {
        // No data available
        setProfileData([]);
        setSelectedUser(null);
        setPlatformOption('');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // No data on error
      setProfileData([]);
      setSelectedUser(null);
      setPlatformOption('');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: SelectChangeEvent<string>) => {
    const name = e.target.value;
    if (!name) return;

    setPlatformOption(name);
    const user = profileData.find(item => item.displayName === name);
    setSelectedUser(user || null);
  };

  // Helper function to format staff count range
  const formatStaffCountRange = (range: string) => {
    if (!range || range === 'N/A') return 'N/A';
    const rangeMap = {
      'SIZE_2_TO_10': '2-10 employees',
      'SIZE_11_TO_50': '11-50 employees',
      'SIZE_51_TO_200': '51-200 employees',
      'SIZE_201_TO_500': '201-500 employees',
      'SIZE_501_TO_1000': '501-1000 employees',
      'SIZE_1001_TO_5000': '1001-5000 employees',
      'SIZE_5001_TO_10000': '5001-10000 employees',
      'SIZE_10001_OR_MORE': '10000+ employees'
    };
    return rangeMap[range as keyof typeof rangeMap] || range;
  };

  // Helper function to format location
  const formatLocation = (locations: any[]) => {
    if (!locations || locations.length === 0) return 'N/A';
    const location = locations[0];
    if (!location.address) return 'N/A';

    const { line1, city, geographicArea, country, postalCode } = location.address;
    const parts = [line1, city, geographicArea, country, postalCode].filter(Boolean);
    return parts.join(', ');
  };

  // Helper function to format company type
  const formatCompanyType = (companyType: string) => {
    if (!companyType || companyType === 'N/A') return 'N/A';
    const typeMap = {
      'PUBLIC_COMPANY': 'Public Company',
      'EDUCATIONAL_INSTITUTION': 'Educational Institution',
      'SELF_EMPLOYED': 'Self Employed',
      'GOVERNMENT_AGENCY': 'Government Agency',
      'NON_PROFIT': 'Non Profit',
      'SELF_OWNED': 'Self Owned',
      'PRIVATELY_HELD': 'Privately Held',
      'PARTNERSHIP': 'Partnership'
    };
    return typeMap[companyType as keyof typeof typeMap] || companyType;
  };

  // Helper function to format industries
  const formatIndustries = (industries: string[]) => {
    if (!industries || industries.length === 0) return 'N/A';
    // Extract industry names from URN format if needed
    const industryNames = industries.map((industry: string) => {
      if (typeof industry === 'string' && industry.includes('urn:li:industry:')) {
        // You might want to map these to actual industry names
        return industry.replace('urn:li:industry:', 'Industry ');
      }
      return industry;
    });
    return industryNames.join(', ');
  };

  const ProfileCard = ({ data }: ProfileCardProps) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        background: '#ffffff',
        height: 'fit-content',
        p: 2
      }}
    >
      {/* Profile Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          src={data.profileImage}
          alt={data.name}
          sx={{
            width: 60,
            height: 60,
            mr: 2
          }}
        />
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a',
              mb: 0.5,
              fontSize: '18px'
            }}
          >
            {data.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              backgroundColor: '#e8f5e8',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: '12px',
              fontWeight: 500,
              display: 'inline-block'
            }}
          >
            {data.username}
          </Typography>
        </Box>
      </Box>

      {/* Followers Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a',
              fontSize: '16px'
            }}
          >
            {data.followers_count !== undefined ? data.followers_count : 'N/A'} followers
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a',
              fontSize: '16px'
            }}
          >
            {data.follows_count !== undefined ? data.follows_count : 'N/A'} following
          </Typography>
        </Box>
      </Box>

      {/* Bio */}
      <Typography
        variant="body2"
        sx={{
          color: '#666',
          mb: 2,
          fontSize: '14px',
          lineHeight: 1.4,
          whiteSpace: 'pre-line'
        }}
      >
        {data.biography}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Professional Company Profile - Only show if LinkedIn data is available */}
      {(data.website !== 'N/A' || data.vanity_name !== 'N/A' || data.company_type !== 'N/A' ||
        data.staff_count_range !== 'N/A' || (data.industries && data.industries.length > 0)) && (
        <>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              mb: 2,
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            Professional company profile
          </Typography>

          {/* Company Details */}
          <Box sx={{ mt: 2 }}>
            <Stack spacing={1.5}>
          {data.website && data.website !== 'N/A' && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                Website:
              </Typography>
              <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '14px' }}>
                {data.website}
              </Typography>
            </Box>
          )}
          {data.vanity_name && data.vanity_name !== 'N/A' && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                Vanity Name:
              </Typography>
              <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '14px' }}>
                {data.vanity_name}
              </Typography>
            </Box>
          )}
          {data.industries && data.industries.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                Industries:
              </Typography>
              <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '14px' }}>
                {formatIndustries(data.industries)}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
              Staff Count Range:
            </Typography>
            <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '14px' }}>
              {formatStaffCountRange(data.staff_count_range)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
              Company Type:
            </Typography>
            <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '14px' }}>
              {formatCompanyType(data.company_type)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
              Earned Media:
            </Typography>
            <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '14px' }}>
              {data.media_count !== undefined ? data.media_count : 'N/A'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
              Average Interactions:
            </Typography>
            <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '14px' }}>
              {data.media_count !== undefined ? data.media_count : 'N/A'}
            </Typography>
          </Box>
            </Stack>
          </Box>
        </>
      )}
    </Card>
  );

  const AnalyticsCard = ({ value, label }: AnalyticsCardProps) => (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        background: '#ffffff',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', p: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1a1a1a',
            mb: 1,
            fontSize: '24px'
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          {label}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Layout>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, backgroundColor: '#f8f9ff', minHeight: '100vh' }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: '#1a237e',
            borderRadius: 0,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton sx={{ color: '#fff', mr: 1 }}>
                <ArrowLeftIcon />
              </IconButton>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                Influencers Analytics
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ color: '#fff' }}>
                <NotificationsIcon />
              </IconButton>
              <IconButton sx={{ color: '#fff' }}>
                <AccountCircleIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Search Bar */}
        <Box sx={{ backgroundColor: '#e3f2fd', p: 2 }}>
          <Container maxWidth="lg">
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 2.4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: '#fff',
                    borderRadius: '25px',
                    height: '45px',
                    px: 2,
                    gap: 1
                  }}
                >
                  <Box sx={{ color: '#999', fontSize: '16px' }}>🔍</Box>
                  <Typography sx={{ color: '#999', fontSize: '14px' }}>Search</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 2.4 }}>
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    defaultValue=""
                    sx={{
                      bgcolor: '#fff',
                      borderRadius: '25px',
                      height: '45px',
                      '& .MuiSelect-select': {
                        padding: '10px 20px'
                      }
                    }}
                  >
                    <MenuItem value=""><em>Date Range</em></MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 2.4 }}>
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    defaultValue=""
                    sx={{
                      bgcolor: '#fff',
                      borderRadius: '25px',
                      height: '45px',
                      '& .MuiSelect-select': {
                        padding: '10px 20px'
                      }
                    }}
                  >
                    <MenuItem value=""><em>Platform: Instagram</em></MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 2.4 }}>
                <FormControl fullWidth>
                  <Select
                    value={platformOption}
                    onChange={handleProfileChange}
                    displayEmpty
                    sx={{
                      bgcolor: '#fff',
                      borderRadius: '25px',
                      height: '45px',
                      '& .MuiSelect-select': {
                        padding: '10px 20px'
                      }
                    }}
                  >
                    <MenuItem value=""><em>Influencer</em></MenuItem>
                    {profileData.map((item, index) => (
                      <MenuItem key={index} value={item.displayName}>
                        {item.displayName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 2.4 }}>
                <FormControl fullWidth>
                  <Select
                    displayEmpty
                    defaultValue=""
                    sx={{
                      bgcolor: '#fff',
                      borderRadius: '25px',
                      height: '45px',
                      '& .MuiSelect-select': {
                        padding: '10px 20px'
                      }
                    }}
                  >
                    <MenuItem value=""><em>Post Type</em></MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {profileData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                No Analytics Data Available
              </Typography>
              <Typography variant="body2" sx={{ color: '#999' }}>
                Please connect your social media accounts to view analytics.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Profile Section */}
              <Grid size={{ xs: 12, md: 4 }}>
                {selectedUser && <ProfileCard data={selectedUser} />}
              </Grid>

              {/* Campaign Analytics Section */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#1a1a1a',
                    mb: 2,
                    fontSize: '18px'
                  }}
                >
                  Campaign Analytics
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                    <AnalyticsCard
                      value={selectedUser?.total_likes || 0}
                      label="Total Likes"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                    <AnalyticsCard
                      value={selectedUser?.total_comments || 0}
                      label="Total Comments"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                    <AnalyticsCard
                      value={selectedUser?.total_shares || 0}
                      label="Total Shares"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                    <AnalyticsCard
                      value={selectedUser?.total_saves || 0}
                      label="Total Saves"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default Analytics2;