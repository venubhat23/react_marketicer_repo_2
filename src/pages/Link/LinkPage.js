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
  Tabs,
  Tab,
  Switch,
  FormControlLabel
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
  AccountCircle as AccountCircleIcon,
  ShortText as ShortTextIcon,
  WebAsset as WebAssetIcon,
  ArrowBack as ArrowLeftIcon
} from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../authContext/AuthContext';
import LinkAnalytics from './LinkAnalytics';
import {
  createShortUrl,
  getUserUrls,
  deleteUrl,
  updateUrl,
  getUrlAnalytics
} from '../../services/linkService';

const LinkPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0); // 0 for Short Link, 1 for Link
  const [longUrl, setLongUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customBackHalf, setCustomBackHalf] = useState('');
  const [createBitlyPage, setCreateBitlyPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]);
  const [loadingUrls, setLoadingUrls] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, url: null });
  const [qrDialog, setQrDialog] = useState({ open: false, url: null });
  const [analyticsDialog, setAnalyticsDialog] = useState({ open: false, url: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (user?.id) {
      fetchUrls();
    }
  }, [user]);

  const fetchUrls = async () => {
    try {
      setLoadingUrls(true);
      const response = await getUserUrls(user.id);
      if (response.success) {
        setUrls(response.data);
      } else {
        showSnackbar('Failed to fetch URLs', 'error');
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
      showSnackbar('Error fetching URLs', 'error');
    } finally {
      setLoadingUrls(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Clear form when switching tabs
    setLongUrl('');
    setTitle('');
    setDescription('');
    setCustomBackHalf('');
    setCreateBitlyPage(false);
    setGeneratedUrl(null);
  };

  const handleGenerateShortUrl = async () => {
    if (!longUrl.trim()) {
      showSnackbar('Please enter a destination URL', 'warning');
      return;
    }

    try {
      setLoading(true);
      const urlData = {
        long_url: longUrl,
        title: title || null,
        description: description || null,
        custom_back_half: customBackHalf || null,
        user_id: user.id
      };

      const response = await createShortUrl(urlData);
      
      if (response.success) {
        setGeneratedUrl(response.data);
        showSnackbar('Short URL generated successfully!', 'success');
        
        // Clear form
        setLongUrl('');
        setTitle('');
        setDescription('');
        setCustomBackHalf('');
        setCreateBitlyPage(false);
        
        // Refresh URLs list
        fetchUrls();
      } else {
        showSnackbar(response.message || 'Error generating short URL', 'error');
      }
    } catch (error) {
      console.error('Error generating short URL:', error);
      showSnackbar('Error generating short URL', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      showSnackbar('URL copied to clipboard!', 'success');
    } catch {
      showSnackbar('Failed to copy URL', 'error');
    }
  };

  const handleDeleteUrl = async (urlId) => {
    try {
      const response = await deleteUrl(urlId);
      if (response.success) {
        showSnackbar('URL deleted successfully', 'success');
        fetchUrls();
      } else {
        showSnackbar('Failed to delete URL', 'error');
      }
    } catch (error) {
      console.error('Error deleting URL:', error);
      showSnackbar('Error deleting URL', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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
        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
          Destination
        </Typography>
        <TextField
          fullWidth
          placeholder="https://example.com/my-long-url"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          variant="outlined"
          size="large"
          helperText="This is the long URL you want to shorten"
          InputProps={{
            startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
          Title (optional)
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter a name for internal use"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          helperText="A name you can assign to the link internally (not shown to users)"
        />
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
          Short link (marketincer domain + optional custom back-half)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
            bit.ly/
          </Typography>
          <TextField
            fullWidth
            placeholder="my-product-launch"
            value={customBackHalf}
            onChange={(e) => setCustomBackHalf(e.target.value)}
            variant="outlined"
            helperText="You can customize the ending if you haven't reached your limit"
          />
        </Box>
      </Grid>
      
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
          Marketincer Page
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={createBitlyPage}
              onChange={(e) => setCreateBitlyPage(e.target.checked)}
              color="primary"
            />
          }
          label="Create a Marketincer Page"
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          A landing page Marketincer can generate that holds multiple links—useful for things like social media bios
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
          {loading ? 'Creating Link...' : 'Create Link'}
        </Button>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
      <Grid container>
        <Grid size={{ md: 1 }} className="side_section">
          <Sidebar />
        </Grid>
        <Grid size={{ md: 11 }}>
          {/* Header */}
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
                URL Shortener Dashboard
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

          <Box sx={{ flexGrow: 1, mt: { xs: 8, md: 0 }, height: '100vh', overflow: 'hidden !important', padding: '20px' }}>
            {/* Tab Switcher */}
            <Card sx={{ mb: 4, boxShadow: 3 }}>
              <CardContent sx={{ p: 0 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    '& .MuiTab-root': {
                      minWidth: 120,
                      fontWeight: 'bold',
                      textTransform: 'none',
                      fontSize: '1rem',
                    },
                    '& .Mui-selected': {
                      color: '#1976d2 !important',
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#1976d2',
                      height: 3,
                    }
                  }}
                >
                  <Tab 
                    label="Short Link" 
                    icon={<ShortTextIcon />} 
                    iconPosition="start"
                    sx={{ px: 3 }}
                  />
                  <Tab 
                    label="Link" 
                    icon={<WebAssetIcon />} 
                    iconPosition="start"
                    sx={{ px: 3 }}
                  />
                </Tabs>
              </CardContent>
            </Card>

            {/* URL Generator Section */}
            <Card sx={{ mb: 4, boxShadow: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
                  {activeTab === 0 ? '🔗 Create Short URL' : '🔗 Create Link'}
                </Typography>
                
                {activeTab === 0 ? renderShortLinkForm() : renderLinkForm()}

                {/* Generated URL Display */}
                {generatedUrl && (
                  <Box sx={{ mt: 4, p: 3, bgcolor: '#f0f7ff', borderRadius: 2, border: '2px solid #e3f2fd' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
                      ✅ {activeTab === 0 ? 'Short URL Generated Successfully!' : 'Link Created Successfully!'}
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
                                    color="success"
                                    onClick={() => setAnalyticsDialog({ open: true, url })}
                                  >
                                    <AnalyticsIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="QR Code">
                                  <IconButton 
                                    size="small" 
                                    color="secondary"
                                    onClick={() => setQrDialog({ open: true, url })}
                                  >
                                    <QrCodeIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit">
                                  <IconButton 
                                    size="small" 
                                    color="info"
                                    onClick={() => setEditDialog({ open: true, url })}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleDeleteUrl(url.id)}
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

            {/* Analytics Dialog */}
            <Dialog
              open={analyticsDialog.open}
              onClose={() => setAnalyticsDialog({ open: false, url: null })}
              maxWidth="lg"
              fullWidth
            >
              <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6">URL Analytics</Typography>
                  <IconButton onClick={() => setAnalyticsDialog({ open: false, url: null })}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                {analyticsDialog.url && (
                  <LinkAnalytics urlId={analyticsDialog.url.id} />
                )}
              </DialogContent>
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default LinkPage;