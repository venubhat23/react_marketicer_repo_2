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
  Pagination,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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
import AxiosManager from '../../utils/api';
import {
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
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, url: null });
  const [qrDialog, setQrDialog] = useState({ open: false, url: null });
  const [analyticsDialog, setAnalyticsDialog] = useState({ open: false, url: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Pagination and filtering states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLinks, setTotalLinks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [refreshing, setRefreshing] = useState(false);

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const loadUserUrls = useCallback(async (page = 1, showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoadingUrls(true);
      }
      
      const response = await getUserUrls(user.id, page, perPage);
      if (response.success) {
        const data = response.data;
        setUrls(data.urls || []);
        setTotalLinks(data.total_links || 0);
        setTotalClicks(data.total_clicks || 0);
        setCurrentPage(data.page || 1);
        setPerPage(data.per_page || 20);
        
        // Calculate total pages
        const calculatedTotalPages = Math.ceil((data.total_links || 0) / (data.per_page || 20));
        setTotalPages(calculatedTotalPages);
      } else {
        showSnackbar('Failed to load URLs', 'error');
      }
    } catch (error) {
      console.error('Error loading URLs:', error);
      showSnackbar('Error loading URLs', 'error');
    } finally {
      setLoadingUrls(false);
      setRefreshing(false);
    }
  }, [user?.id, showSnackbar]);

  // Load user's URLs on component mount
  useEffect(() => {
    if (user?.id) {
      loadUserUrls(1);
    }
  }, [user, loadUserUrls]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    loadUserUrls(newPage);
  };

  const handleRefresh = () => {
    loadUserUrls(currentPage, true);
  };

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
        loadUserUrls(1); // Refresh the table and go to first page
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
        loadUserUrls(currentPage, true);
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
          loadUserUrls(currentPage, true);
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

       
          {/* Tab Switcher - moved outside of Card */}

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

          {/* URLs Table Section */}
          <Card sx={{ boxShadow: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" sx={{color: '#882AFF', mb: 1 }}>
                      📊 Your Short URLs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage and track all your shortened URLs
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
                    onClick={handleRefresh}
                    disabled={refreshing || loadingUrls}
                    size="small"
                  >
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </Box>

                {/* Statistics Cards */}
                {!loadingUrls && totalLinks > 0 && (
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ bgcolor: '#e3f2fd', border: '1px solid #90caf9' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Total Links
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                            {totalLinks.toLocaleString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ bgcolor: '#e8f5e8', border: '1px solid #a5d6a7' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Total Clicks
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                            {totalClicks.toLocaleString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ bgcolor: '#fff3e0', border: '1px solid #ffcc02' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Current Page
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                            {currentPage} of {totalPages}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ bgcolor: '#fce4ec', border: '1px solid #f8bbd9' }}>
                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Per Page
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
                            {perPage}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}
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
                <>
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

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3, pt: 2 }}>
                      <Stack spacing={2} direction="row" alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalLinks)} of {totalLinks} entries
                        </Typography>
                        <Pagination
                          count={totalPages}
                          page={currentPage}
                          onChange={handlePageChange}
                          color="primary"
                          shape="rounded"
                          showFirstButton
                          showLastButton
                          disabled={loadingUrls || refreshing}
                        />
                      </Stack>
                    </Box>
                  )}
                </>
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
      </Box>
    );

  return noLayout ? content : <Layout>{content}</Layout>;
};

export default ShortLinkPage;