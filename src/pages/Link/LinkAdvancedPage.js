import React, { useState, useEffect } from 'react';
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
  Tabs,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Launch as LaunchIcon,
  Link as LinkIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  QrCode as QrCodeIcon,
  CloudUpload as UploadIcon,
  Palette as PaletteIcon,
  Visibility as PreviewIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import AxiosManager from '../../utils/api';

const LinkAdvancedPage = () => {
  // Basic form states
  const [longUrl, setLongUrl] = useState('');
  const [title, setTitle] = useState('');
  const [customBackHalf, setCustomBackHalf] = useState('');
  const [domain] = useState('marketincer.com');
  
  // QR Code states
  const [enableQR, setEnableQR] = useState(false);
  const [qrColor, setQrColor] = useState('#882AFF');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  
  // UTM Parameters states
  const [enableUTM, setEnableUTM] = useState(false);
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [previewDialog, setPreviewDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [apiError, setApiError] = useState('');

  // Color palette for QR codes
  const qrColors = [
    '#0b0b0b', // Black
    '#882AFF', // Vivid Violet
    '#091A48', // Navy Blue
    '#FF4444', // Red
    '#FF8800', // Orange
    '#00AA00', // Green
    '#0088FF', // Blue
    '#8800FF', // Purple
    '#FF0088'  // Pink
  ];

  // Generate preview URL with UTM parameters
  const generatePreviewUrl = () => {
    if (!longUrl) return '';
    
    let previewUrl = longUrl;
    const utmParams = [];
    
    if (enableUTM) {
      if (utmSource) utmParams.push(`utm_source=${encodeURIComponent(utmSource)}`);
      if (utmMedium) utmParams.push(`utm_medium=${encodeURIComponent(utmMedium)}`);
      if (utmCampaign) utmParams.push(`utm_campaign=${encodeURIComponent(utmCampaign)}`);
      if (utmTerm) utmParams.push(`utm_term=${encodeURIComponent(utmTerm)}`);
      if (utmContent) utmParams.push(`utm_content=${encodeURIComponent(utmContent)}`);
    }
    
    if (utmParams.length > 0) {
      const separator = longUrl.includes('?') ? '&' : '?';
      previewUrl = `${longUrl}${separator}${utmParams.join('&')}`;
    }
    
    return previewUrl;
  };

  // Generate short URL preview
  const getShortUrlPreview = () => {
    const backHalf = customBackHalf || 'abc123';
    return `${domain}/${backHalf}`;
  };

  // Handle logo upload
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate QR Code (mock implementation for preview)
  const generateQRCode = () => {
    const url = getShortUrlPreview();
    // For preview purposes only - actual QR code will come from API
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&color=${qrColor.replace('#', '')}&bgcolor=FFFFFF`;
  };

  // API call to create short link
  const createShortLink = async () => {
    const payload = {
      short_url: {
        long_url: longUrl.trim(),
        title: title.trim() || undefined,
        custom_back_half: customBackHalf.trim() || undefined,
        enable_utm: enableUTM,
        enable_qr: enableQR
      }
    };

    // Add UTM parameters if enabled
    if (enableUTM) {
      if (utmSource.trim()) payload.short_url.utm_source = utmSource.trim();
      if (utmMedium.trim()) payload.short_url.utm_medium = utmMedium.trim();
      if (utmCampaign.trim()) payload.short_url.utm_campaign = utmCampaign.trim();
      if (utmTerm.trim()) payload.short_url.utm_term = utmTerm.trim();
      if (utmContent.trim()) payload.short_url.utm_content = utmContent.trim();
    }

    try {
      const response = await AxiosManager.post('/api/v1/short_links', payload);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const handleCreateLink = async () => {
    // Validation
    if (!longUrl.trim()) {
      showSnackbar('Please enter a destination URL', 'warning');
      return;
    }

    // Basic URL validation
    try {
      new URL(longUrl);
    } catch (error) {
      showSnackbar('Please enter a valid URL (including http:// or https://)', 'error');
      return;
    }

    // Custom back-half validation
    if (customBackHalf.trim()) {
      const backHalf = customBackHalf.trim();
      if (backHalf.length < 3 || backHalf.length > 50) {
        showSnackbar('Custom back-half must be between 3-50 characters', 'error');
        return;
      }
      
      // Check for valid characters (alphanumeric, hyphens, underscores)
      if (!/^[a-zA-Z0-9_-]+$/.test(backHalf)) {
        showSnackbar('Custom back-half can only contain letters, numbers, hyphens, and underscores', 'error');
        return;
      }
    }

    setLoading(true);
    setApiError('');
    
    try {
      const result = await createShortLink();
      
      setGeneratedUrl({
        short_link: result.short_link,
        long_url: result.final_url,
        original_url: result.original_url,
        qr_code: result.qr_code_url || null,
        title: result.title,
        utm_params: result.utm_params,
        created_at: result.created_at
      });
      
      showSnackbar('Link created successfully!', 'success');
    } catch (error) {
      let errorMessage = 'Failed to create link. Please try again.';
      
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
          errorMessage = 'The custom back-half is already taken. Please choose a different one.';
        } else if (errorMessage.includes('required')) {
          errorMessage = 'Destination URL is required.';
        } else if (errorMessage.includes('invalid')) {
          errorMessage = 'Please check your input data and try again.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setApiError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      showSnackbar('URL copied to clipboard!', 'success');
    } catch (error) {
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
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc', 
      p: 1.5
    }}>

      <Card sx={{ 
        mb: 1, 
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 0 }}>
          {/* API Error Display */}
          {apiError && (
            <Box sx={{ p: 1.5, pb: 0 }}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 0,
                  borderRadius: 1,
                  py: 1,
                  '& .MuiAlert-message': {
                    fontSize: '12px'
                  }
                }}
                onClose={() => setApiError('')}
              >
                {apiError}
              </Alert>
            </Box>
          )}
            
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {/* Left Column - Form */}
              <Grid size={{ xs: 12, sm: 12, md: 7 }}>
                {/* Basic Information Section */}
                <Box sx={{ 
                  mb: 1.5,
                  p: 3,
                  bgcolor: 'white',
                  borderRadius: 2,
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 1.5, 
                      color: '#1e293b',
                      fontWeight: 600,
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <LinkIcon sx={{ color: '#882AFF', fontSize: 16 }} />
                    Basic Information
                  </Typography>
                  
                  {/* Destination */}
                  <Box sx={{ mb: 1.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 0.5, 
                        color: '#374151',
                        fontWeight: 500,
                        fontSize: '12px'
                      }}
                    >
                      Destination URL *
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="https://example.com/my-long-url"
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      variant="outlined"
                      error={!longUrl.trim() && apiError.includes('required')}
                      helperText={!longUrl.trim() && apiError.includes('required') ? 'Destination URL is required' : ''}
                      size="medium"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '14px',
                          '&:hover fieldset': {
                            borderColor: '#882AFF',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#882AFF',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#882AFF',
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '10px',
                          mt: 0.25
                        }
                      }}
                    />
                  </Box>

                  {/* Title */}
                  <Box sx={{ mb: 1.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 0.5, 
                        color: '#374151',
                        fontWeight: 500,
                        fontSize: '12px'
                      }}
                    >
                      Title (Optional)
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter a descriptive title for your link"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      variant="outlined"
                      size="medium"
                      helperText=""
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          fontSize: '14px',
                          '&:hover fieldset': {
                            borderColor: '#882AFF',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#882AFF',
                          }
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#882AFF',
                        },
                        '& .MuiFormHelperText-root': {
                          fontSize: '10px',
                          mt: 0.25
                        }
                      }}
                    />
                  </Box>

                  {/* Short Link */}
                  <Box sx={{ mb: 0 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 0.5, 
                        color: '#374151',
                        fontWeight: 500,
                        fontSize: '12px'
                      }}
                    >
                      Custom Short URL
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        bgcolor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        minWidth: 140
                      }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#64748b',
                            fontWeight: 500,
                            fontSize: '13px'
                          }}
                        >
                          {domain}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#64748b',
                          alignSelf: 'center',
                          fontSize: '14px'
                        }}
                      >
                        /
                      </Typography>
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          placeholder="custom-back-half"
                          value={customBackHalf}
                          onChange={(e) => setCustomBackHalf(e.target.value)}
                          variant="outlined"
                          error={apiError.includes('already taken') || apiError.includes('characters')}
                          helperText={
                            apiError.includes('already taken') ? 'This custom back-half is already taken' :
                            apiError.includes('characters') ? 'Must be 3-50 characters, letters/numbers/hyphens/underscores only' : 
                            customBackHalf.length > 0 ? `${customBackHalf.length}/50 characters` : ''
                          }
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              fontSize: '14px',
                              '&:hover fieldset': {
                                borderColor: '#882AFF',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#882AFF',
                                borderWidth: 2,
                              }
                            },
                            '& .MuiFormHelperText-root': {
                              fontSize: '12px',
                              mt: 1
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* UTM Parameters Section */}
                <Box sx={{ 
                  mb: 4,
                  p: 3,
                  bgcolor: 'white',
                  borderRadius: 3,
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#1e293b',
                          fontWeight: 600,
                          fontSize: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1
                        }}
                      >
                        <SettingsIcon sx={{ color: '#882AFF' }} />
                        UTM Parameters
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          fontSize: '14px',
                          lineHeight: 1.5
                        }}
                      >
                        Track campaign performance with Google Analytics and other tools
                      </Typography>
                    </Box>
                    <Switch
                      checked={enableUTM}
                      onChange={(e) => setEnableUTM(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#882AFF',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#882AFF',
                        },
                        '& .MuiSwitch-track': {
                          borderRadius: 12,
                        },
                        '& .MuiSwitch-thumb': {
                          borderRadius: 10,
                        }
                      }}
                    />
                  </Box>

                  {enableUTM && (
                    <Box 
                      sx={{ 
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 3,
                        pt: 2,
                        borderTop: '1px solid #f1f5f9'
                      }}
                    >
                      <TextField
                        label="UTM Source"
                        placeholder="e.g., google, newsletter, facebook"
                        value={utmSource}
                        onChange={(e) => setUtmSource(e.target.value)}
                        variant="outlined"
                        helperText="Identify the advertiser, site, publication, etc."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            fontSize: '14px',
                            '&:hover fieldset': {
                              borderColor: '#882AFF',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#882AFF',
                              borderWidth: 2,
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#882AFF',
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '12px',
                            mt: 1
                          }
                        }}
                      />
                      <TextField
                        label="UTM Medium"
                        placeholder="e.g., cpc, email, social"
                        value={utmMedium}
                        onChange={(e) => setUtmMedium(e.target.value)}
                        variant="outlined"
                        helperText="Identify the marketing medium"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            fontSize: '14px',
                            '&:hover fieldset': {
                              borderColor: '#882AFF',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#882AFF',
                              borderWidth: 2,
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#882AFF',
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '12px',
                            mt: 1
                          }
                        }}
                      />
                      <TextField
                        label="UTM Campaign"
                        placeholder="e.g., spring_sale, product_launch"
                        value={utmCampaign}
                        onChange={(e) => setUtmCampaign(e.target.value)}
                        variant="outlined"
                        helperText="Identify the specific campaign"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            fontSize: '14px',
                            '&:hover fieldset': {
                              borderColor: '#882AFF',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#882AFF',
                              borderWidth: 2,
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#882AFF',
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '12px',
                            mt: 1
                          }
                        }}
                      />
                      <TextField
                        label="UTM Term"
                        placeholder="e.g., running+shoes, blue+widget"
                        value={utmTerm}
                        onChange={(e) => setUtmTerm(e.target.value)}
                        variant="outlined"
                        helperText="Identify paid search keywords"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            fontSize: '14px',
                            '&:hover fieldset': {
                              borderColor: '#882AFF',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#882AFF',
                              borderWidth: 2,
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#882AFF',
                          },
                          '& .MuiFormHelperText-root': {
                            fontSize: '12px',
                            mt: 1
                          }
                        }}
                      />
                      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                        <TextField
                          fullWidth
                          label="UTM Content"
                          placeholder="e.g., logolink, textlink, sidebar_ad"
                          value={utmContent}
                          onChange={(e) => setUtmContent(e.target.value)}
                          variant="outlined"
                          helperText="Differentiate ads or links that point to the same URL"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              fontSize: '14px',
                              '&:hover fieldset': {
                                borderColor: '#882AFF',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#882AFF',
                                borderWidth: 2,
                              }
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#882AFF',
                            },
                            '& .MuiFormHelperText-root': {
                              fontSize: '12px',
                              mt: 1
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* QR Code Section */}
                <Box sx={{ 
                  mb: 4,
                  p: 3,
                  bgcolor: 'white',
                  borderRadius: 3,
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#1e293b',
                          fontWeight: 600,
                          fontSize: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1
                        }}
                      >
                        <QrCodeIcon sx={{ color: '#882AFF' }} />
                        QR Code
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          fontSize: '14px',
                          lineHeight: 1.5
                        }}
                      >
                        Generate a scannable QR code for your short link
                      </Typography>
                    </Box>
                    <Switch
                      checked={enableQR}
                      onChange={(e) => setEnableQR(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#882AFF',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#882AFF',
                        },
                        '& .MuiSwitch-track': {
                          borderRadius: 12,
                        },
                        '& .MuiSwitch-thumb': {
                          borderRadius: 10,
                        }
                      }}
                    />
                  </Box>

                  {enableQR && (
                    <Box 
                      sx={{ 
                        pt: 2,
                        borderTop: '1px solid #f1f5f9'
                      }}
                    >
                      <Grid container spacing={4}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mb: 2, 
                              color: '#374151',
                              fontWeight: 500,
                              fontSize: '14px'
                            }}
                          >
                            QR Code Color
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3}}>
                            {qrColors.map((color) => (
                              <Box
                                key={color}
                                onClick={() => setQrColor(color)}
                                sx={{
                                  width: 36,
                                  height: 36,
                                  bgcolor: color,
                                  borderRadius: 2,
                                  border: qrColor === color ? '3px solid #882AFF' : '2px solid #e2e8f0',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                                  }
                                }}
                              />
                            ))}
                          </Box>

                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mb: 2, 
                              color: '#374151',
                              fontWeight: 500,
                              fontSize: '14px'
                            }}
                          >
                            Logo (Optional)
                          </Typography>
                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<UploadIcon />}
                            sx={{
                              borderColor: '#882AFF',
                              color: '#882AFF',
                              borderRadius: 3,
                              textTransform: 'none',
                              fontWeight: 500,
                              py: 1.5,
                              px: 3,
                              '&:hover': {
                                borderColor: '#7C3AED',
                                backgroundColor: 'rgba(136, 42, 255, 0.04)',
                              }
                            }}
                          >
                            Choose Logo
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={handleLogoUpload}
                            />
                          </Button>
                          {logoPreview && (
                            <Box sx={{ 
                              mt: 2,
                              p: 2,
                              border: '1px solid #e2e8f0',
                              borderRadius: 2,
                              bgcolor: '#f8fafc',
                              display: 'inline-block'
                            }}>
                              <img
                                src={logoPreview}
                                alt="Logo preview"
                                style={{ 
                                  width: 48, 
                                  height: 48, 
                                  objectFit: 'contain',
                                  borderRadius: 4 
                                }}
                              />
                            </Box>
                          )}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mb: 2, 
                              color: '#374151',
                              fontWeight: 500,
                              fontSize: '14px'
                            }}
                          >
                            Preview
                          </Typography>
                          <Box sx={{ 
                            p: 3, 
                            bgcolor: '#f8fafc', 
                            borderRadius: 3, 
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 180
                          }}>
                            <img
                              src={generateQRCode()}
                              alt="QR Code Preview"
                              style={{ 
                                width: 120, 
                                height: 120,
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}
                            />
                          </Box>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              mt: 2, 
                              display: 'block',
                              color: '#64748b',
                              fontSize: '12px',
                              textAlign: 'center'
                            }}
                          >
                            More customizations available after creating
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 3, 
                  mt: 4,
                  pt: 3,
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <Button
                    variant="outlined"
                    sx={{
                      py: 2,
                      px: 4,
                      borderColor: '#e2e8f0',
                      color: '#64748b',
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        borderColor: '#882AFF',
                        backgroundColor: 'rgba(136, 42, 255, 0.04)',
                        color: '#882AFF'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleCreateLink}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                    sx={{
                      py: 2,
                      px: 4,
                      backgroundColor: '#882AFF',
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '14px',
                      boxShadow: '0 4px 6px -1px rgba(136, 42, 255, 0.3)',
                      '&:hover': {
                        backgroundColor: '#7C3AED',
                        boxShadow: '0 6px 12px -1px rgba(136, 42, 255, 0.4)',
                        transform: 'translateY(-1px)'
                      },
                      '&:disabled': {
                        backgroundColor: '#e2e8f0',
                        color: '#64748b',
                        boxShadow: 'none'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {loading ? 'Creating Link...' : 'Create Short Link'}
                  </Button>
                </Box>
              </Grid>

              {/* Right Column - Preview */}
              <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                <Box sx={{ 
                  position: 'sticky', 
                  top: 20,
                  p: 3,
                  bgcolor: 'white',
                  borderRadius: 3,
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 3, 
                      color: '#1e293b',
                      fontWeight: 600,
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <PreviewIcon sx={{ color: '#882AFF' }} />
                    Live Preview
                  </Typography>
                  
                  {/* Short URL Preview */}
                  <Box sx={{ 
                    mb: 3, 
                    p: 3, 
                    bgcolor: '#f8fafc', 
                    borderRadius: 3,
                    border: '1px solid #e2e8f0'
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2, 
                        color: '#64748b',
                        fontWeight: 500,
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Short URL Preview
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#882AFF',
                        fontSize: '16px',
                        wordBreak: 'break-all'
                      }}
                    >
                      {getShortUrlPreview()}
                    </Typography>
                  </Box>

                  {/* UTM Tags Preview */}
                  {enableUTM && (
                    <Box sx={{ 
                      mb: 3, 
                      p: 3, 
                      bgcolor: '#f8fafc', 
                      borderRadius: 3,
                      border: '1px solid #e2e8f0'
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 2, 
                          color: '#64748b',
                          fontWeight: 500,
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        UTM Parameters
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {utmSource && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
                              Source:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#1e293b', fontSize: '13px', fontWeight: 600 }}>
                              {utmSource}
                            </Typography>
                          </Box>
                        )}
                        {utmMedium && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
                              Medium:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#1e293b', fontSize: '13px', fontWeight: 600 }}>
                              {utmMedium}
                            </Typography>
                          </Box>
                        )}
                        {utmCampaign && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
                              Campaign:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#1e293b', fontSize: '13px', fontWeight: 600 }}>
                              {utmCampaign}
                            </Typography>
                          </Box>
                        )}
                        {utmTerm && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
                              Term:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#1e293b', fontSize: '13px', fontWeight: 600 }}>
                              {utmTerm}
                            </Typography>
                          </Box>
                        )}
                        {utmContent && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
                              Content:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#1e293b', fontSize: '13px', fontWeight: 600 }}>
                              {utmContent}
                            </Typography>
                          </Box>
                        )}
                        
                        {(utmSource || utmMedium || utmCampaign || utmTerm || utmContent) && (
                          <Box sx={{ 
                            mt: 2, 
                            p: 2, 
                            bgcolor: 'white', 
                            borderRadius: 2, 
                            border: '1px solid #e2e8f0',
                            borderLeft: '3px solid #882AFF'
                          }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                mb: 1, 
                                display: 'block',
                                color: '#64748b',
                                fontSize: '11px',
                                fontWeight: 500,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}
                            >
                              Final URL with UTM
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                wordBreak: 'break-all', 
                                color: '#1e293b',
                                fontSize: '12px',
                                lineHeight: 1.4,
                                fontFamily: 'monospace'
                              }}
                            >
                              {generatePreviewUrl()}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* QR Code Preview */}
                  {enableQR && (
                    <Box sx={{ 
                      mb: 3, 
                      p: 3, 
                      bgcolor: '#f8fafc', 
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      textAlign: 'center' 
                    }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 2, 
                          color: '#64748b',
                          fontWeight: 500,
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        QR Code Preview
                      </Typography>
                      <Box sx={{
                        display: 'inline-block',
                        p: 2,
                        bgcolor: 'white',
                        borderRadius: 2,
                        border: '1px solid #e2e8f0'
                      }}>
                        <img
                          src={generateQRCode()}
                          alt="QR Code Preview"
                          style={{ 
                            width: 100, 
                            height: 100,
                            borderRadius: 4
                          }}
                        />
                      </Box>
                    </Box>
                  )}

                  {/* Features Summary */}
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2, 
                        color: '#64748b',
                        fontWeight: 500,
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      Enabled Features
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Chip 
                        label="Short Link" 
                        size="small" 
                        sx={{ 
                          bgcolor: '#e3f2fd', 
                          color: '#1976d2',
                          fontWeight: 500,
                          borderRadius: 2,
                          justifyContent: 'flex-start'
                        }}
                      />
                      {enableQR && (
                        <Chip 
                          icon={<QrCodeIcon sx={{ fontSize: '14px' }} />}
                          label="QR Code" 
                          size="small" 
                          sx={{ 
                            bgcolor: '#f3e5f5', 
                            color: '#882AFF',
                            fontWeight: 500,
                            borderRadius: 2,
                            justifyContent: 'flex-start'
                          }}
                        />
                      )}
                      {enableUTM && (
                        <Chip 
                          label="UTM Tracking" 
                          size="small" 
                          sx={{ 
                            bgcolor: '#e8f5e8', 
                            color: '#4caf50',
                            fontWeight: 500,
                            borderRadius: 2,
                            justifyContent: 'flex-start'
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>

          </Box>

          {/* Generated URL Display */}
          {generatedUrl && (
            <Box sx={{ 
              mt: 4, 
              p: 4, 
              bgcolor: 'white', 
              borderRadius: 3, 
              border: '2px solid #882AFF',
              boxShadow: '0 4px 6px -1px rgba(136, 42, 255, 0.1)'
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  color: '#882AFF', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: '18px'
                }}
              >
                ✅ Link Created Successfully!
              </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <TextField
                        value={generatedUrl.short_link}
                        variant="outlined"
                        size="small"
                        sx={{ flex: '1 1 auto' }}
                        InputProps={{
                          readOnly: true,
                          style: { fontWeight: 'bold', color: '#882AFF' }
                        }}
                      />
                      <Button
                        variant="contained"
                        startIcon={<CopyIcon />}
                        onClick={() => handleCopyUrl(generatedUrl.short_link)}
                        sx={{ 
                          bgcolor: '#882AFF',
                          '&:hover': { bgcolor: '#7a26e6' }
                        }}
                      >
                        Copy
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<LaunchIcon />}
                        onClick={() => window.open(generatedUrl.short_link, '_blank')}
                        sx={{ 
                          borderColor: '#882AFF',
                          color: '#882AFF'
                        }}
                      >
                        Open
                      </Button>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Original URL:</strong> {generatedUrl.original_url}
                    </Typography>
                    
                    {generatedUrl.long_url !== generatedUrl.original_url && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Final URL (with UTM):</strong> {generatedUrl.long_url}
                      </Typography>
                    )}
                    
                    {generatedUrl.title && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Title:</strong> {generatedUrl.title}
                      </Typography>
                    )}
                    
                    {generatedUrl.created_at && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Created:</strong> {new Date(generatedUrl.created_at).toLocaleString()}
                      </Typography>
                    )}
                  </Grid>
                  
                  {generatedUrl.qr_code && (
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          QR Code
                        </Typography>
                        <img
                          src={generatedUrl.qr_code}
                          alt="Generated QR Code"
                          style={{ width: 100, height: 100 }}
                          onError={(e) => {
                            // Fallback to preview QR code if API QR code fails to load
                            e.target.src = generateQRCode();
                          }}
                        />
                        <Box sx={{ mt: 1 }}>
                          <Button
                            variant="text"
                            size="small"
                            startIcon={<CopyIcon />}
                            onClick={() => handleCopyUrl(generatedUrl.qr_code)}
                            sx={{ color: '#882AFF' }}
                          >
                            Copy QR URL
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>
                
                {/* UTM Parameters Display */}
                {generatedUrl.utm_params && Object.keys(generatedUrl.utm_params).length > 0 && (
                  <Box sx={{ mt: 3, p: 2, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                    <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold' }}>
                      UTM Parameters Applied:
                    </Typography>
                    <Grid container spacing={2}>
                      {Object.entries(generatedUrl.utm_params).map(([key, value]) => (
                        value && (
                          <Grid item xs={12} sm={6} key={key}>
                            <Typography variant="body2">
                              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                            </Typography>
                          </Grid>
                        )
                      ))}
                    </Grid>
                  </Box>
                )}
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
};

export default LinkAdvancedPage;