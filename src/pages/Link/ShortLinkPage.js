import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Refresh as RefreshIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../authContext/AuthContext';
import AnalyticsModal from './AnalyticsModal';
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
  const { user, fetchUserProfile } = useAuth();
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnalyticOpenModal = (rowData) => {
    //setSelectedData(rowData);
    setIsModalOpen(true);
  };

  const handleAnalyticCloseModal = () => {
    //setSelectedData(null);
    setIsModalOpen(false);
  };
  
  useEffect(() => {
    loadUserUrls();
  }, []);
  

  
  // Pagination and filtering states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLinks, setTotalLinks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedInitialData = useRef(false);
  const perPageRef = useRef(20);

  // Keep perPageRef in sync with perPage state
  useEffect(() => {
    perPageRef.current = perPage;
  }, [perPage]);

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
        
        // Calculate total pages using the current perPage value
        const calculatedTotalPages = Math.ceil((data.total_links || 0) / perPageRef.current);
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
    // Reset flag when user changes (for logout/login scenarios)
    if (!user?.id) {
      hasLoadedInitialData.current = false;
    }
    
    if (user?.id && !hasLoadedInitialData.current) {
      hasLoadedInitialData.current = true;
      loadUserUrls(1);
    } else if (user && !user.id && fetchUserProfile && !hasLoadedInitialData.current) {
      // If user exists but no ID, try to fetch profile
      fetchUserProfile().then(() => {
        // After fetching profile, the user object should be updated with ID
        // The effect will run again due to user dependency
        if (user?.id) {
          hasLoadedInitialData.current = true;
          loadUserUrls(1);
        }
      });
    }
  }, [user]);

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
    debugger
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
          title: title.trim() ||  undefined,
          description: description.trim() || undefined
        }
      };

      // Call API using AxiosManager similar to LinkAdvancedPage
      const response = await AxiosManager.post('/api/v1/short_links', payload);
      
      if (response.data) {
        const data = response.data;
        setGeneratedUrl({
          short_url: data.short_link,
          long_url: data.final_url,
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
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh', p: 3 }}>
      {/* URL Generator Section */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 2}}>              
          <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Enter your destination URL"
                    placeholder="https://example.com/your-long-url"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#882AFF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#882AFF',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#882AFF',
                      },
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Title (Optional)"
                    placeholder="Enter a title for your link"
                    size='small'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#882AFF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#882AFF',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#882AFF',
                      },
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Description (Optional)"
                    placeholder="Enter a description"
                    size='small'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': {
                          borderColor: '#882AFF',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#882AFF',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#882AFF',
                      },
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={handleGenerateShortUrl}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderRadius: 3,
                      backgroundColor: '#882AFF',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#7C3AED',
                        boxShadow: '0 4px 12px rgba(136, 42, 255, 0.4)',
                      },
                      '&:disabled': {
                        backgroundColor: '#e2e8f0',
                        color: '#64748b'
                      }
                    }}
                  >
                    {loading ? 'Generating...' : 'Generate Short URL'}
                  </Button>
                </Grid>
              </Grid>

              {/* Generated URL Display */}
              {generatedUrl && (
                <Box sx={{ 
                  mt: 4, 
                  p: 3, 
                  bgcolor: '#f8fafc', 
                  borderRadius: 3, 
                  border: '2px solid #882AFF',
                  boxShadow: '0 4px 12px rgba(136, 42, 255, 0.15)'
                }}>
                  <Typography variant="h6" sx={{ 
                    mb: 2, 
                    color: '#882AFF', 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <CheckIcon sx={{ color: '#22c55e' }} />
                    Short URL Generated Successfully!
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                      value={generatedUrl.short_url}
                      variant="outlined"
                      size="small"
                      sx={{ 
                        flexGrow: 1, 
                        minWidth: 300,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'white',
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                          },
                        }
                      }}
                      InputProps={{
                        readOnly: true,
                        style: { fontWeight: 'bold', color: '#882AFF' }
                      }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<CopyIcon />}
                      onClick={() => handleCopyUrl(generatedUrl.short_url)}
                      sx={{ 
                        whiteSpace: 'nowrap',
                        backgroundColor: '#882AFF',
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#7C3AED',
                        }
                      }}
                    >
                      Copy URL
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<LaunchIcon />}
                      onClick={() => window.open(generatedUrl.short_url, '_blank')}
                      sx={{ 
                        whiteSpace: 'nowrap',
                        borderColor: '#882AFF',
                        color: '#882AFF',
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#7C3AED',
                          backgroundColor: '#f8fafc',
                        }
                      }}
                    >
                      Open
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* URLs Table Section */}
          <Card sx={{ 
            boxShadow: 3,
            borderRadius: 3,
            border: '1px solid #e2e8f0'
          }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" sx={{
                      color: '#882AFF', 
                      mb: 1,
                      fontWeight: 'bold',
                      fontSize: '18px'
                    }}>
                      Your Short URLs
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: '#64748b',
                      fontSize: '14px'
                    }}>
                      Manage and track all your shortened URLs
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
                    onClick={handleRefresh}
                    disabled={refreshing || loadingUrls}
                    size="small"
                    sx={{
                      borderColor: '#882AFF',
                      color: '#882AFF',
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#7C3AED',
                        backgroundColor: '#f8fafc',
                      },
                      '&:disabled': {
                        borderColor: '#e2e8f0',
                        color: '#64748b'
                      }
                    }}
                  >
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </Box>

                {/* Statistics Cards */}
                {!loadingUrls && totalLinks > 0 && (
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card sx={{ 
                        bgcolor: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: 2,
                        height: '100%',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(136, 42, 255, 0.15)',
                          borderColor: '#882AFF'
                        }
                      }}>
                        <CardContent sx={{ 
                          p: 3, 
                          '&:last-child': { pb: 3 },
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center'
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#64748b',
                              fontWeight: 500,
                              mb: 1,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              fontSize: '12px'
                            }}
                          >
                            Total Links
                          </Typography>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              fontWeight: 'bold', 
                              color: '#882AFF',
                              fontSize: '28px'
                            }}
                          >
                            {totalLinks.toLocaleString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card sx={{ 
                        bgcolor: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: 2,
                        height: '100%',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(136, 42, 255, 0.15)',
                          borderColor: '#882AFF'
                        }
                      }}>
                        <CardContent sx={{ 
                          p: 3, 
                          '&:last-child': { pb: 3 },
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center'
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#64748b',
                              fontWeight: 500,
                              mb: 1,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              fontSize: '12px'
                            }}
                          >
                            Total Clicks
                          </Typography>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              fontWeight: 'bold', 
                              color: '#882AFF',
                              fontSize: '28px'
                            }}
                          >
                            {totalClicks.toLocaleString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card sx={{ 
                        bgcolor: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: 2,
                        height: '100%',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(136, 42, 255, 0.15)',
                          borderColor: '#882AFF'
                        }
                      }}>
                        <CardContent sx={{ 
                          p: 3, 
                          '&:last-child': { pb: 3 },
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center'
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#64748b',
                              fontWeight: 500,
                              mb: 1,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              fontSize: '12px'
                            }}
                          >
                            Current Page
                          </Typography>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              fontWeight: 'bold', 
                              color: '#882AFF',
                              fontSize: '28px'
                            }}
                          >
                            {currentPage} of {totalPages}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card sx={{ 
                        bgcolor: '#f8fafc', 
                        border: '1px solid #e2e8f0',
                        borderRadius: 2,
                        height: '100%',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(136, 42, 255, 0.15)',
                          borderColor: '#882AFF'
                        }
                      }}>
                        <CardContent sx={{ 
                          p: 3, 
                          '&:last-child': { pb: 3 },
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center'
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#64748b',
                              fontWeight: 500,
                              mb: 1,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              fontSize: '12px'
                            }}
                          >
                            Per Page
                          </Typography>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              fontWeight: 'bold', 
                              color: '#882AFF',
                              fontSize: '28px'
                            }}
                          >
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
                      <TableHead sx={{ backgroundColor: '#091a48' }}>
                        <TableRow>
                          <TableCell sx={{ 
                            fontWeight: 'bold', 
                            color: 'white',
                            fontSize: '15px',
                            padding: '18px 14px'
                          }}>Original URL</TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold', 
                            color: 'white',
                            fontSize: '15px',
                            padding: '18px 14px'
                          }}>Short URL</TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold', 
                            color: 'white',
                            fontSize: '15px',
                            padding: '18px 14px'
                          }}>Title</TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold', 
                            color: 'white',
                            fontSize: '15px',
                            padding: '18px 14px',
                            textAlign: 'center' 
                          }}>Clicks</TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold', 
                            color: 'white',
                            fontSize: '15px',
                            padding: '18px 14px'
                          }}>Created</TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold', 
                            color: 'white',
                            fontSize: '15px',
                            padding: '18px 14px'
                          }}>Status</TableCell>
                          <TableCell sx={{ 
                            fontWeight: 'bold', 
                            color: 'white',
                            fontSize: '15px',
                            padding: '18px 14px',
                            textAlign: 'center' 
                          }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {urls.map((url) => (
                          <TableRow 
                            key={url.id} 
                            hover
                            sx={{
                              '&:nth-of-type(odd)': { 
                                backgroundColor: '#f9fafb' 
                              },
                              '&:hover': {
                                backgroundColor: '#f3f4f6'
                              }
                            }}
                          >
                            <TableCell sx={{ padding: '14px' }}>
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
                            <TableCell sx={{ padding: '14px' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: '#882AFF', 
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
                                  sx={{ 
                                    p: 0.5,
                                    color: '#882AFF',
                                    '&:hover': {
                                      backgroundColor: '#f8fafc'
                                    }
                                  }}
                                >
                                  <CopyIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ padding: '14px' }}>
                              <Typography variant="body2" sx={{ fontSize: '13px', color: '#374151' }}>
                                {url.title || 'Untitled'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', padding: '14px' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                <VisibilityIcon fontSize="small" sx={{ color: '#882AFF' }} />
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#882AFF' }}>
                                  {url.clicks || 0}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ padding: '14px' }}>
                              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px' }}>
                                {formatDate(url.created_at)}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ padding: '14px' }}>
                              <Chip
                                label={url.active ? 'Active' : 'Inactive'}
                                color={url.active ? 'success' : 'default'}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderRadius: 2,
                                  fontSize: '11px',
                                  fontWeight: 600
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ padding: '14px' }}>
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
                                    onClick={() => handleAnalyticOpenModal(url)}
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

            <AnalyticsModal 
              open={isModalOpen} 
              onClose={handleAnalyticCloseModal} 
              //data={selectedData} 
            />
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

          {/* Analytics Modal */}
          <AnalyticsModal
            open={analyticsDialog.open}
            onClose={() => setAnalyticsDialog({ open: false, url: null })}
            url={analyticsDialog.url}
          />

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