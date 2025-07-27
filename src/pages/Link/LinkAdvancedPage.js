import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Paper,
  IconButton,
  Alert,
  CircularProgress,
  Grid,
  Container,
  Snackbar,
  Tab,
  Tabs
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Launch as LaunchIcon,
  Link as LinkIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../authContext/AuthContext';
import {
  createShortUrl,
  isValidUrl,
  copyToClipboard
} from '../../services/urlShortenerApi';

const LinkAdvancedPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [longUrl, setLongUrl] = useState('');
  const [title, setTitle] = useState('');
  const [customBackHalf, setCustomBackHalf] = useState('');
  const [bitlyPage, setBitlyPage] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSwitchToShortLink = () => {
    navigate('/link');
  };

  const handleCreateLink = async () => {
    // Validate input
    if (!longUrl.trim()) {
      showSnackbar('Please enter a destination URL', 'warning');
      return;
    }

    if (!isValidUrl(longUrl)) {
      showSnackbar('Please enter a valid URL', 'error');
      return;
    }

    try {
      setLoading(true);
      // For advanced link creation, we can pass additional parameters
      const response = await createShortUrl(
        longUrl, 
        title, 
        bitlyPage, // Using bitlyPage as description for now
        customBackHalf // Custom back-half if provided
      );
      
      if (response.success) {
        setGeneratedUrl(response.data);
        setLongUrl('');
        setTitle('');
        setCustomBackHalf('');
        setBitlyPage('');
        showSnackbar('Link created successfully!', 'success');
      } else {
        showSnackbar(response.message || 'Failed to create link', 'error');
      }
    } catch (error) {
      console.error('Error creating link:', error);
      showSnackbar('Error creating link', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async (url) => {
    const success = await copyToClipboard(url);
    if (success) {
      showSnackbar('URL copied to clipboard!', 'success');
    } else {
      showSnackbar('Failed to copy URL', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: '#091a48',
            borderRadius: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h6" sx={{ color: '#fff' }}>
            URL Shortener Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton size="large" sx={{ color: 'white' }}>
              <NotificationsIcon />
            </IconButton>
            <IconButton size="large" sx={{ color: 'white' }}>
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Paper>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* URL Generator Section */}
          <Card sx={{ mb: 4, boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              {/* Tab Switcher */}
              <Box sx={{ mb: 3 }}>
                <Tabs
                  value={1}
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      minWidth: 120,
                      color: '#666',
                      '&.Mui-selected': {
                        color: '#1976d2',
                      }
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#1976d2',
                      height: 3,
                    }
                  }}
                >
                  <Tab label="Short Link" onClick={handleSwitchToShortLink} />
                  <Tab label="Link" />
                </Tabs>
              </Box>

              <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
                🔗 Create Link
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Destination*
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="https://example.com/my-long-url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    variant="outlined"
                    size="large"
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    This is the long URL you want to shorten, like https://example.com/my-long-url
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Title (optional)
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter a title for your link"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    A name you can assign to the link internally (not shown to users)
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Short link (marketincer domain + optional custom back-half)
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      marketincer.com/
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="my-product-launch"
                      value={customBackHalf}
                      onChange={(e) => setCustomBackHalf(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Example: bit.ly/my-product-launch. You can customize the ending (my-product-launch) if you haven't reached your limit.
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Marketincer Page
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter Marketincer page information"
                    value={bitlyPage}
                    onChange={(e) => setBitlyPage(e.target.value)}
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    A landing page Marketincer can generate that holds multiple links—useful for things like social media bios.
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleCreateLink}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                      }
                    }}
                  >
                    {loading ? 'Creating...' : 'Create Link'}
                  </Button>
                </Grid>
              </Grid>

              {/* Generated URL Display */}
              {generatedUrl && (
                <Box sx={{ mt: 4, p: 3, bgcolor: '#f0f7ff', borderRadius: 2, border: '2px solid #e3f2fd' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
                    ✅ Link Created Successfully!
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      value={generatedUrl.short_url}
                      variant="outlined"
                      size="small"
                      sx={{ flexGrow: 1, minWidth: 300 }}
                      InputProps={{
                        readOnly: true,
                        style: { fontWeight: 'bold', color: '#1976d2' }
                      }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<CopyIcon />}
                      onClick={() => handleCopyUrl(generatedUrl.short_url)}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Copy URL
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<LaunchIcon />}
                      onClick={() => window.open(generatedUrl.short_url, '_blank')}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Open
                    </Button>
                  </Box>
                  
                  {/* Additional Information */}
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Original URL:</strong> {generatedUrl.long_url || longUrl}
                    </Typography>
                    {title && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Title:</strong> {title}
                      </Typography>
                    )}
                    {customBackHalf && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Custom Back-half:</strong> {customBackHalf}
                      </Typography>
                    )}
                    {bitlyPage && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Marketincer Page:</strong> {bitlyPage}
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card sx={{ boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
                ℹ️ Advanced Link Features
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Custom Back-half
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Personalize your short links with meaningful endings that are easy to remember and share.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Marketincer Page
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create landing pages that can hold multiple links, perfect for social media bios and campaigns.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1, borderLeft: '4px solid #1976d2' }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  💡 <strong>Tip:</strong> Use the "Short Link" tab for quick URL shortening, or stay here for advanced customization options.
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Layout>
  );
};

export default LinkAdvancedPage;