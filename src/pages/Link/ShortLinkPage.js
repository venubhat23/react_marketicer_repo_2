import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Grid,
  Divider,
  Container,
  Snackbar,
  Tab,
  Tabs,
  Pagination
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Launch as LaunchIcon,
  Analytics as AnalyticsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  QrCode as QrCodeIcon,
  Link as LinkIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../authContext/AuthContext';
import LinkAnalytics from './LinkAnalytics';
import {
  createShortUrl,
  getUserUrls,
  deleteShortUrl,
  updateShortUrl,
  isValidUrl,
  copyToClipboard,
  formatDate,
  generateQRCodeUrl
} from '../../services/urlShortenerApi';

const ShortLinkPage = ({ noLayout = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [longUrl, setLongUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]);
  const [loadingUrls, setLoadingUrls] = useState(true);
  const [urlStats, setUrlStats] = useState({ total_links: 0, total_clicks: 0 });
  const [pagination, setPagination] = useState({ page: 1, per_page: 20 });
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, url: null });
  const [qrDialog, setQrDialog] = useState({ open: false, url: null });
  const [analyticsDialog, setAnalyticsDialog] = useState({ open: false, url: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const loadUserUrls = useCallback(async (page = 1) => {
    try {
      setLoadingUrls(true);
      console.log('Loading URLs for user:', user.id, 'page:', page);
      const response = await getUserUrls(user.id, page, pagination.per_page);
      console.log('API Response:', response);
      
      if (response.success && response.data) {
        const { urls = [], total_links = 0, total_clicks = 0, page: currentPage = 1, per_page = 20 } = response.data;
        
        setUrls(urls);
        setUrlStats({
          total_links,
          total_clicks
        });
        setPagination(prev => ({
          ...prev,
          page: currentPage,
          per_page
        }));
        
        console.log('URLs loaded successfully:', urls.length, 'URLs');
      } else {
        console.error('API Error:', response.message || 'Failed to load URLs');
        showSnackbar(response.message || 'Failed to load URLs', 'error');
      }
    } catch (error) {
      console.error('Error loading URLs:', error);
      showSnackbar('Error loading URLs: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setLoadingUrls(false);
    }
  }, [user?.id, pagination.per_page, showSnackbar]);

  // Load user's URLs on component mount
  useEffect(() => {
    if (user?.id) {
      console.log('User authenticated, loading URLs for user ID:', user.id);
      loadUserUrls();
    } else {
      console.log('No user authenticated');
    }
  }, [user, loadUserUrls]);

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
      const response = await createShortUrl(longUrl, title, description);
      
      if (response.success) {
        setGeneratedUrl(response.data);
        setLongUrl('');
        setTitle('');
        setDescription('');
        showSnackbar('Short URL generated successfully!', 'success');
        loadUserUrls(); // Refresh the table
      } else {
        showSnackbar(response.message || 'Failed to generate short URL', 'error');
      }
    } catch (error) {
      console.error('Error generating short URL:', error);
      showSnackbar('Error generating short URL', 'error');
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

  const handleEditUrl = (url) => {
    setEditDialog({ open: true, url: { ...url } });
  };

  const handleUpdateUrl = async () => {
    try {
      const { url } = editDialog;
      const response = await updateShortUrl(url.id, url.title, url.description, url.active);
      
      if (response.success) {
        showSnackbar('URL updated successfully!', 'success');
        setEditDialog({ open: false, url: null });
        loadUserUrls();
      } else {
        showSnackbar(response.message || 'Failed to update URL', 'error');
      }
    } catch (error) {
      console.error('Error updating URL:', error);
      showSnackbar('Error updating URL', 'error');
    }
  };

  const handleDeleteUrl = async (urlId) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      try {
        const response = await deleteShortUrl(urlId);
        if (response.success) {
          showSnackbar('URL deleted successfully!', 'success');
          loadUserUrls();
        } else {
          showSnackbar(response.message || 'Failed to delete URL', 'error');
        }
      } catch (error) {
        console.error('Error deleting URL:', error);
        showSnackbar('Error deleting URL', 'error');
      }
    }
  };

  const handleShowQR = (url) => {
    setQrDialog({ open: true, url });
  };

  const handleShowAnalytics = (url) => {
    setAnalyticsDialog({ open: true, url });
  };




  const content = (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
        {/* Header */}

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Check for authenticated user */}
          {!user?.id && (
            <Alert severity="warning" sx={{ mb: 4 }}>
              Please log in to access URL shortening features.
            </Alert>
          )}
          
          {/* Tab Switcher - moved outside of Card */}


          {/* URL Generator Section */}
          <Card sx={{ mb: 4, boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>              
              <Grid container spacing={3}>
                <Grid item xs={12}>
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
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Title (Optional)"
                    placeholder="Enter a title for your link"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Description (Optional)"
                    placeholder="Enter a description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleGenerateShortUrl}
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

          {/* Statistics Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ boxShadow: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                  <LinkIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {loadingUrls ? <CircularProgress size={24} sx={{ color: 'white' }} /> : urlStats.total_links}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Links
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ boxShadow: 2, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                  <VisibilityIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {loadingUrls ? <CircularProgress size={24} sx={{ color: 'white' }} /> : urlStats.total_clicks}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Clicks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ boxShadow: 2, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                  <AnalyticsIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {loadingUrls ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 
                     (urlStats.total_links > 0 ? (urlStats.total_clicks / urlStats.total_links).toFixed(1) : '0.0')}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Avg. Clicks/Link
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ boxShadow: 2, background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                  <AccountCircleIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {loadingUrls ? <CircularProgress size={24} sx={{ color: 'white' }} /> : urls.filter(url => url.active).length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Links
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* URLs Table Section */}
          <Card sx={{ boxShadow: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                    📊 Your Short URLs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage and track all your shortened URLs ({urlStats.total_links} total links, {urlStats.total_clicks} total clicks)
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => loadUserUrls(pagination.page)}
                  disabled={loadingUrls}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Refresh
                </Button>
              </Box>
              
              <Divider />
              
              {loadingUrls ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress size={50} />
                </Box>
              ) : urls.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <LinkIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No URLs Created Yet
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Create your first short URL using the form above
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Original URL</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Short URL</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Clicks</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {urls.map((url) => (
                        <TableRow key={url.id} hover>
                          <TableCell>
                            <Tooltip title={url.long_url}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  maxWidth: 200, 
                                  overflow: 'hidden', 
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {url.long_url}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: '#1976d2', 
                                  fontWeight: 'bold',
                                  maxWidth: 150,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {url.short_url}
                              </Typography>
                              <IconButton 
                                size="small" 
                                onClick={() => handleCopyUrl(url.short_url)}
                                sx={{ p: 0.5 }}
                              >
                                <CopyIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {url.title || 'Untitled'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                              <VisibilityIcon fontSize="small" color="primary" />
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                {url.clicks || 0}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(url.created_at)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={url.active ? 'Active' : 'Inactive'}
                              color={url.active ? 'success' : 'default'}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                              <Tooltip title="Open URL">
                                <IconButton 
                                  size="small" 
                                  onClick={() => window.open(url.short_url, '_blank')}
                                  color="primary"
                                >
                                  <LaunchIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Analytics">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleShowAnalytics(url)}
                                  color="success"
                                >
                                  <AnalyticsIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="QR Code">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleShowQR(url)}
                                  color="secondary"
                                >
                                  <QrCodeIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditUrl(url)}
                                  color="info"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteUrl(url.id)}
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {/* Pagination Controls */}
              {urls.length > 0 && urlStats.total_links > pagination.per_page && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <Pagination
                    count={Math.ceil(urlStats.total_links / pagination.per_page)}
                    page={pagination.page}
                    onChange={(event, page) => loadUserUrls(page)}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, url: null })} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Short URL</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Title"
                value={editDialog.url?.title || ''}
                onChange={(e) => setEditDialog({
                  ...editDialog,
                  url: { ...editDialog.url, title: e.target.value }
                })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                value={editDialog.url?.description || ''}
                onChange={(e) => setEditDialog({
                  ...editDialog,
                  url: { ...editDialog.url, description: e.target.value }
                })}
                margin="normal"
                multiline
                rows={3}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialog({ open: false, url: null })}>
                Cancel
              </Button>
              <Button onClick={handleUpdateUrl} variant="contained">
                Update
              </Button>
            </DialogActions>
          </Dialog>

          {/* Analytics Dialog */}
          <Dialog 
            open={analyticsDialog.open} 
            onClose={() => setAnalyticsDialog({ open: false, url: null })} 
            maxWidth="lg" 
            fullWidth
            PaperProps={{ sx: { height: '90vh' } }}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">URL Analytics</Typography>
              <IconButton onClick={() => setAnalyticsDialog({ open: false, url: null })}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0, overflow: 'auto' }}>
              {analyticsDialog.url && (
                <LinkAnalytics 
                  url={analyticsDialog.url} 
                  onClose={() => setAnalyticsDialog({ open: false, url: null })}
                />
              )}
            </DialogContent>
          </Dialog>

          {/* QR Code Dialog */}
          <Dialog open={qrDialog.open} onClose={() => setQrDialog({ open: false, url: null })} maxWidth="sm" fullWidth>
            <DialogTitle>QR Code</DialogTitle>
            <DialogContent sx={{ textAlign: 'center', py: 3 }}>
              {qrDialog.url && (
                <>
                  <img
                    src={generateQRCodeUrl(qrDialog.url.short_url, '300x300')}
                    alt="QR Code"
                    style={{ maxWidth: '100%', height: 'auto', marginBottom: 16 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Scan this QR code to access: {qrDialog.url.short_url}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<CopyIcon />}
                    onClick={() => handleCopyUrl(qrDialog.url.short_url)}
                  >
                    Copy URL
                  </Button>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setQrDialog({ open: false, url: null })}>
                Close
              </Button>
            </DialogActions>
          </Dialog>

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
    );

  return noLayout ? content : <Layout>{content}</Layout>;
};

export default ShortLinkPage;