import React, { useState, useEffect } from 'react';
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
  Tabs
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Launch as LaunchIcon,
  Analytics as AnalyticsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  QrCode as QrCodeIcon,
  Link as LinkIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
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
import { toast } from 'react-toastify';

const LinkPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0); // 0 for Short Link, 1 for Link
  const [longUrl, setLongUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customBackHalf, setCustomBackHalf] = useState('');
  const [bitlyPage, setBitlyPage] = useState('');
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]);
  const [loadingUrls, setLoadingUrls] = useState(true);
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, url: null });
  const [qrDialog, setQrDialog] = useState({ open: false, url: null });
  const [analyticsDialog, setAnalyticsDialog] = useState({ open: false, url: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load user's URLs on component mount
  useEffect(() => {
    if (user?.id) {
      loadUserUrls();
    }
  }, [user]);

  const loadUserUrls = async () => {
    try {
      setLoadingUrls(true);
      const response = await getUserUrls(user.id);
      if (response.success) {
        setUrls(response.data.urls || []);
      } else {
        showSnackbar('Failed to load URLs', 'error');
      }
    } catch (error) {
      console.error('Error loading URLs:', error);
      showSnackbar('Error loading URLs', 'error');
    } finally {
      setLoadingUrls(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Clear form fields when switching tabs
    setLongUrl('');
    setTitle('');
    setDescription('');
    setCustomBackHalf('');
    setBitlyPage('');
    setGeneratedUrl(null);
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
        setCustomBackHalf('');
        setBitlyPage('');
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

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderShortLinkForm = () => (
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
  );

  const renderLinkForm = () => (
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
          Example: marketincer.com/my-product-launch. You can customize the ending (my-product-launch) if you haven't reached your limit.
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
          {loading ? 'Creating...' : 'Create Link'}
        </Button>
      </Grid>
    </Grid>
  );

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
                      value={activeTab}
                      onChange={handleTabChange}
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
                      <Tab label="Short Link" />
                      <Tab label="Link" />
                    </Tabs>
                  </Box>

                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
                    {activeTab === 0 ? '🔗 Create Short URL' : '🔗 Create Link'}
                  </Typography>
                  
                  {activeTab === 0 ? renderShortLinkForm() : renderLinkForm()}

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

              {/* URLs Table Section - Only show for Short Link tab */}
              {activeTab === 0 && (
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 3, pb: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                        📊 Your Short URLs
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Manage and track all your shortened URLs
                      </Typography>
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
                  </CardContent>
                </Card>
              )}

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
    </Layout>
  );
};

export default LinkPage;