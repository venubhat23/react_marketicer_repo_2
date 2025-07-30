import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Grid,
  Container,
  Snackbar
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Launch as LaunchIcon,
  Add as AddIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../authContext/AuthContext';
import AxiosManager from '../../utils/api';
import {
  isValidUrl,
  copyToClipboard
} from '../../services/urlShortenerApi';

const ShortLinkPage = ({ noLayout = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [longUrl, setLongUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const handleSwitchToLink = () => {
    navigate('/link-advanced');
  };

  const handleGenerateShortUrl = async () => {
    // Validate input
    if (!longUrl.trim()) {
      showSnackbar('Please enter a URL', 'warning');
      return;
    }

    if (!isValidUrl(longUrl)) {
      showSnackbar('Please enter a valid URL', 'error');
      return;
    }

    try {
      setLoading(true);
      
      // Create payload similar to LinkAdvancedPage
      const payload = {
        short_url: {
          long_url: longUrl.trim(),
          title: title.trim() || undefined,
          description: description.trim() || undefined
        }
      };

      // Call API using AxiosManager similar to LinkAdvancedPage
      const response = await AxiosManager.post('/api/v1/short_links', payload);
      
      if (response.data) {
        const data = response.data;
        setGeneratedUrl({
          short_url: data.short_url,
          long_url: data.long_url,
          title: data.title,
          description: data.description,
          id: data.id,
          created_at: data.created_at
        });
        setLongUrl('');
        setTitle('');
        setDescription('');
        showSnackbar('Short URL generated successfully!', 'success');
      } else {
        showSnackbar('Failed to generate short URL', 'error');
      }
    } catch (error) {
      console.error('Error generating short URL:', error);
      
      let errorMessage = 'Failed to generate short URL. Please try again.';
      
      // Handle specific error cases based on API response
      if (error.response && error.response.data) {
        const apiError = error.response.data;
        if (apiError.message) {
          errorMessage = apiError.message;
        } else if (apiError.error) {
          errorMessage = apiError.error;
        }
        
        // Handle specific error cases
        if (errorMessage.includes('already taken') || errorMessage.includes('exists')) {
          errorMessage = 'The URL or custom back-half is already taken. Please choose a different one.';
        } else if (errorMessage.includes('required')) {
          errorMessage = 'Destination URL is required.';
        } else if (errorMessage.includes('invalid')) {
          errorMessage = 'Please check your input data and try again.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showSnackbar(errorMessage, 'error');
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

  const content = (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
      {/* URL Generator Section */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>              
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Enter your destination URL"
                placeholder="https://example.com/your-long-url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                variant="outlined"
                size="large"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Title (Optional)"
                placeholder="Enter a title for your link"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                label="Description (Optional)"
                placeholder="Enter a description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleGenerateShortUrl}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                sx={{
                  py: 1.5,
                  px:2,
                  background: '#882AFF',
                  '&:hover': {
                    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
                  }
                }}
              >
                {loading ? 'Generating...' : 'Generate Short URL'}
              </Button>
            </Grid>
          </Grid>

          {/* Generated URL Display */}
          {generatedUrl && (
            <Box sx={{ mt: 4, p: 3, bgcolor: '#f0f7ff', borderRadius: 2, border: '2px solid #e3f2fd' }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
                ✅ Short URL Generated Successfully!
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
            </Box>
          )}
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
    </Box>
  );

  return noLayout ? content : <Layout>{content}</Layout>;
};

export default ShortLinkPage;