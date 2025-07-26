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
  Snackbar
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
  Close as CloseIcon
} from '@mui/icons-material';
import Layout from '../../components/Layout';
import LinkTopBar from '../../components/LinkTopBar';
import LinkSidebar from '../../components/LinkSidebar';
import LinkDashboard from '../../components/LinkDashboard';
import CreateLinkModal from '../../components/CreateLinkModal';
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
  const [currentView, setCurrentView] = useState('dashboard');
  const [createModalOpen, setCreateModalOpen] = useState(false);
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
  
  // Link statistics
  const [linkStats, setLinkStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    monthlyClicks: 0,
    qrCodes: 0,
    activeLinks: 0
  });

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
        const urlsData = response.data.urls || [];
        setUrls(urlsData);
        
        // Calculate statistics
        const totalClicks = urlsData.reduce((sum, url) => sum + (url.clicks || 0), 0);
        const activeLinks = urlsData.filter(url => url.status === 'active').length;
        const qrCodes = urlsData.filter(url => url.hasQR).length;
        
        setLinkStats({
          totalLinks: urlsData.length,
          totalClicks: totalClicks,
          monthlyClicks: Math.floor(totalClicks * 0.3), // Mock monthly data
          qrCodes: qrCodes,
          activeLinks: activeLinks
        });
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

  // New handler functions for the updated interface
  const handleCreateLinkClick = () => {
    setCreateModalOpen(true);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleCreateLink = async (formData) => {
    try {
      setLoading(true);
      
      // Build the URL with UTM parameters if provided
      let finalUrl = formData.destination;
      const utmParams = new URLSearchParams();
      
      if (formData.utmSource) utmParams.append('utm_source', formData.utmSource);
      if (formData.utmMedium) utmParams.append('utm_medium', formData.utmMedium);
      if (formData.utmCampaign) utmParams.append('utm_campaign', formData.utmCampaign);
      if (formData.utmTerm) utmParams.append('utm_term', formData.utmTerm);
      if (formData.utmContent) utmParams.append('utm_content', formData.utmContent);
      
      if (utmParams.toString()) {
        const separator = finalUrl.includes('?') ? '&' : '?';
        finalUrl = `${finalUrl}${separator}${utmParams.toString()}`;
      }

      const response = await createShortUrl({
        userId: user.id,
        longUrl: finalUrl,
        title: formData.title,
        description: formData.description,
        customBackHalf: formData.customBackHalf,
        domain: formData.domain,
        enableQR: formData.enableQR,
        enableBitlyPage: formData.enableBitlyPage,
        password: formData.password,
        expirationDate: formData.expirationDate,
        enableTracking: formData.enableTracking
      });

      if (response.success) {
        showSnackbar('Link created successfully!', 'success');
        loadUserUrls(); // Refresh the links list
        setCreateModalOpen(false);
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

  // Helper functions for the existing functionality

  const handleShowAnalytics = (url) => {
    setAnalyticsDialog({ open: true, url });
  };

  const handleShowQR = (url) => {
    setQrDialog({ open: true, url });
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



  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Function to render different views based on currentView
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <LinkDashboard linkStats={linkStats} />;
      case 'links':
        return renderLinksView();
      case 'analytics':
        return <LinkAnalytics />;
      case 'qr-codes':
        return renderQRCodesView();
      case 'bitly-pages':
        return renderBitlyPagesView();
      case 'custom-pages':
        return renderCustomPagesView();
      case 'page-analytics':
        return renderPageAnalyticsView();
      default:
        return <LinkDashboard linkStats={linkStats} />;
    }
  };

  // Render the original links view
  const renderLinksView = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Your Short URLs
      </Typography>
      {renderOriginalContent()}
    </Box>
  );

  // Placeholder components for other views
  const renderQRCodesView = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        QR Codes
      </Typography>
      <Alert severity="info">
        QR Codes management feature coming soon!
      </Alert>
    </Box>
  );

  const renderBitlyPagesView = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Bitly Pages
      </Typography>
      <Alert severity="info">
        Bitly Pages feature coming soon! Create landing pages to organize your links.
      </Alert>
    </Box>
  );

  const renderCustomPagesView = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Custom Pages
      </Typography>
      <Alert severity="info">
        Custom Pages feature coming soon! Build your own branded landing pages.
      </Alert>
    </Box>
  );

  const renderPageAnalyticsView = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Page Analytics
      </Typography>
      <Alert severity="info">
        Page Analytics feature coming soon! Track performance of your landing pages.
      </Alert>
    </Box>
  );

  // Extract the original content to a separate function
  const renderOriginalContent = () => (
    <>
      {/* Create Short URL Form */}
      <Card sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            🔗 Create Short URL
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Enter your destination URL"
                placeholder="https://example.com/my-long-url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title (optional)"
                placeholder="Enter a title for your link"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description (optional)"
                placeholder="Add a description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateShortUrl}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                sx={{ px: 4 }}
              >
                {loading ? 'Generating...' : 'Generate Short URL'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

                  {/* Generated URL Display */}
            {generatedUrl && (
              <Card sx={{ mb: 4, border: '2px solid #4caf50', backgroundColor: '#f1f8e9' }}>
                <CardContent>
                  <Typography variant="h6" color="success.main" sx={{ mb: 2 }}>
                    ✅ Short URL Generated Successfully!
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      value={generatedUrl.short_url || generatedUrl.shortUrl}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <Tooltip title="Copy to clipboard">
                            <IconButton onClick={() => copyToClipboard(generatedUrl.short_url || generatedUrl.shortUrl)}>
                              <CopyIcon />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    <Tooltip title="Open in new tab">
                      <IconButton 
                        color="primary"
                        onClick={() => window.open(generatedUrl.short_url || generatedUrl.shortUrl, '_blank')}
                      >
                        <LaunchIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Original URL: {generatedUrl.long_url || generatedUrl.longUrl}
                  </Typography>
                </CardContent>
              </Card>
            )}

      {/* URLs Table */}
      <Card sx={{ border: '1px solid #e0e0e0' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              📊 Your URLs ({urls.length})
            </Typography>
            <Button
              variant="outlined"
              startIcon={<TrendingUpIcon />}
              onClick={() => setCurrentView('analytics')}
            >
              View Analytics
            </Button>
          </Box>

          {loadingUrls ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : urls.length === 0 ? (
            <Alert severity="info">
              No URLs found. Create your first short URL above!
            </Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Title</strong></TableCell>
                    <TableCell><strong>Short URL</strong></TableCell>
                    <TableCell><strong>Original URL</strong></TableCell>
                    <TableCell><strong>Clicks</strong></TableCell>
                    <TableCell><strong>Created</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {urls.map((url) => (
                    <TableRow key={url.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {url.title || 'Untitled'}
                        </Typography>
                        {url.description && (
                          <Typography variant="caption" color="text.secondary">
                            {url.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                  <Typography variant="body2" color="primary">
                          {url.short_url || url.shortUrl}
                        </Typography>
                        <Tooltip title="Copy to clipboard">
                          <IconButton 
                            size="small"
                            onClick={() => copyToClipboard(url.short_url || url.shortUrl)}
                          >
                            <CopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: 200, 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {url.long_url || url.longUrl}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={url.clicks || 0} 
                          color="primary" 
                          size="small"
                          icon={<VisibilityIcon />}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(url.created_at || url.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={(url.active !== undefined) ? (url.active ? 'Active' : 'Inactive') : (url.status || 'active')} 
                          color={(url.active !== undefined) ? (url.active ? 'success' : 'default') : (url.status === 'active' ? 'success' : 'default')}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="View Analytics">
                            <IconButton 
                              size="small"
                              onClick={() => setAnalyticsDialog({ open: true, url })}
                            >
                              <AnalyticsIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Generate QR Code">
                            <IconButton 
                              size="small"
                              onClick={() => setQrDialog({ open: true, url })}
                            >
                              <QrCodeIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small"
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
    </>
  );

  return (
    <Layout>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f8f9fa' }}>
        {/* Top Bar */}
        <LinkTopBar 
          onCreateLinkClick={handleCreateLinkClick}
          currentView={currentView}
          onViewChange={handleViewChange}
        />
        
        {/* Main Content Area */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <LinkSidebar 
            currentView={currentView}
            onViewChange={handleViewChange}
            linkStats={linkStats}
          />
          
          {/* Main Content */}
          <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: '#fff' }}>
            {renderCurrentView()}
          </Box>
        </Box>

        {/* Create Link Modal */}
        <CreateLinkModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreateLink={handleCreateLink}
        />

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
    </Layout>
  );
};

export default LinkPage;