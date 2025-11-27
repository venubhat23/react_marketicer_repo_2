import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  CardMedia,
  InputAdornment,
} from "@mui/material";
import {
  PhotoCamera,
  Videocam,
  LocationOn,
  Schedule,
  LocalOffer,
  People,
  Language,
  Translate,
  DragIndicator,
  GroupWork,
  Smartphone,
  CurrencyRupee,
  DateRange,
  Tag,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import MarketplaceAPI, { handleApiError } from "../../services/marketplaceApi";

const CreateMarketplacePost = ({ 
  onBack, 
  onPostCreated, 
  initialData = null 
}) => {
  // Constants as per specification
  const InfluencerSizes = [
    { value: 'nano', label: 'Nano (1K-10K)' },
    { value: 'micro', label: 'Micro (10K-100K)' },
    { value: 'mid-tier', label: 'Mid-tier (100K-1M)' },
    { value: 'macro', label: 'Macro (1M-10M)' },
    { value: 'mega', label: 'Mega (10M+)' }
  ];
  const TargetAudiences = ['18–24', '24–30', '30–35', 'More than 35'];
  const Types = ['Sponsored Post', 'Product Review', 'Brand Collaboration', 'Event Promotion', 'Giveaway', 'Story Feature'];

  // Form states as per specification
  const [brandName, setBrandName] = useState(initialData?.brand || " "); // Auto-filled
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [influencerSize, setInfluencerSize] = useState(initialData?.influencerSize || "");
  const [targetAudience, setTargetAudience] = useState(initialData?.targetAudience || "");
  const [budget, setBudget] = useState(initialData?.budget || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [platform, setPlatform] = useState(initialData?.platform || "");
  const [languages, setLanguages] = useState(initialData?.languages || "");
  const [deadline, setDeadline] = useState(initialData?.deadline || "");
  const [tags, setTags] = useState(() => {
    if (!initialData?.tags) return "";
    // If tags is an array, join it to a string
    if (Array.isArray(initialData.tags)) {
      return initialData.tags.join(', ');
    }
    // If tags is already a string, use it as is
    return initialData.tags;
  });
  
  // Upload states
  const [uploadedImageUrl, setUploadedImageUrl] = useState(initialData?.imageUrl || "");
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(initialData?.videoUrl || "");
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  
  // Description resize state
  const [descriptionRows, setDescriptionRows] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startRows, setStartRows] = useState(2);
  
  // File input refs
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);


  // File upload handlers
  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleVideoUpload = () => {
    videoInputRef.current.click();
  };

  const handleFileUpload = async (file, type = 'image') => {
    if (!file) return;
    setUploading(true);
    try {
      const response = await MarketplaceAPI.uploadMedia(file, type);
      
      if (response.success && response.data.url) {
        if (type === 'image') {
          setUploadedImageUrl(response.data.url);
        } else {
          setUploadedVideoUrl(response.data.url);
        }
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(handleApiError(error));
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileUpload(selectedFile, 'image');
    }
  };

  const handleVideoChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileUpload(selectedFile, 'video');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  // Drag handlers for description resize
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartRows(descriptionRows);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaY = e.clientY - startY;
    const rowHeight = 24; // Approximate row height in pixels
    const newRows = Math.max(2, Math.min(10, startRows + Math.floor(deltaY / rowHeight)));
    setDescriptionRows(newRows);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none'; // Prevent text selection while dragging
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = 'auto';
      };
    }
  }, [isDragging, startY, startRows]);

  const handlePublish = async () => {
    if (!title || !description || !influencerSize || !targetAudience || !budget || !deadline) {
      setError("Please fill all required fields!");
      return;
    }
    
    setPosting(true);
    setError('');
    const payloadData = {
      title,
      description,
      influencerSize,
      targetAudience,
      budget: budget.startsWith('₹') ? budget : `₹${budget}`,
      location,
      platform,
      languages,
      deadline,
      tags,
      image_url: uploadedImageUrl,
      video_url: uploadedVideoUrl,
      status: "published",
      type: "Sponsored Post"
    };
    
    try {
      let response;
      
      if (initialData?.id) {
        // Update existing post
        response = await MarketplaceAPI.updateMarketplacePost(initialData.id, payloadData);
      } else {
        // Create new post
        response = await MarketplaceAPI.createMarketplacePost(payloadData);
      }
      
      if (response.success) {
        const newPost = {
          id: initialData?.id || response.data?.id || Date.now(),
          ...payloadData,
          imageUrl: uploadedImageUrl, // Keep both formats for compatibility
          videoUrl: uploadedVideoUrl,
          dateCreated: new Date().toISOString().split('T')[0],
          views: initialData?.views || 0,
          brand: brandName,
          bids_count: initialData?.bids_count || 0
        };
        
        toast.success(response.message || (initialData ? "Post updated successfully!" : "Post published successfully!"));
        
        // Callback to parent component
        if (onPostCreated) {
          onPostCreated(newPost);
        }
      } else {
        throw new Error(response.error?.message || 'Failed to publish post');
      }
      
    } catch (err) {
      setError(`Error publishing post: ${err.message}`);
      console.error("Error publishing post:", err);
    } finally {
      setPosting(false);
    }
  };


  const renderRightPanel = () => {
    return (
      <Box sx={{ p: 4 }}>
        {budget && (
          <Box sx={{ 
            mb: 4,
            p: 4,
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
            borderRadius: 4,
            boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
            textAlign: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              animation: 'pulse 3s ease-in-out infinite'
            },
            '@keyframes pulse': {
              '0%, 100%': {
                opacity: 0.5,
                transform: 'scale(1)'
              },
              '50%': {
                opacity: 1,
                transform: 'scale(1.05)'
              }
            }
          }}>
            {/* Background Pattern */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='50' cy='10' r='1'/%3E%3Ccircle cx='10' cy='50' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
            
            {/* Content */}
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Typography variant="body1" sx={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontWeight: 600, 
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontSize: '0.9rem'
              }}>
                Campaign Budget
              </Typography>
              <Typography variant="h3" sx={{ 
                color: '#fff', 
                fontWeight: 800,
                fontSize: '2.5rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                ₹{budget}
              </Typography>
            </Box>

            {/* Decorative Elements */}
            <Box sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 30,
              height: 30,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }} />
            
            <Box sx={{
              position: 'absolute',
              bottom: 15,
              left: 15,
              width: 20,
              height: 20,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }} />
          </Box>
        )}
        
        <Box sx={{ 
          p: 3,
          bgcolor: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          mb: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #882AFF 0%, #7C4DFF 50%, #9C27B0 100%)'
          }
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            mb: 2, 
            color: '#1f2937',
            fontSize: '1.1rem'
          }}>
            {brandName || 'Your Brand Name'}
          </Typography>
          
          <Typography variant="body1" sx={{ 
            mb: 2, 
            color: '#374151',
            fontSize: '0.95rem',
            lineHeight: 1.6
          }}>
            {title || 'Campaign title will appear here...'}
          </Typography>
          
          {description && (
            <Typography variant="body2" sx={{ 
              color: '#6b7280', 
              fontSize: '0.875rem',
              lineHeight: 1.5,
              mb: 2
            }}>
              {description}
            </Typography>
          )}
          
          {(uploadedImageUrl || uploadedVideoUrl) && (
            <Box sx={{ 
              mt: 2,
              p: 2,
              bgcolor: '#f1f5f9',
              borderRadius: 2,
              border: '1px dashed #cbd5e1'
            }}>
              <Typography variant="caption" sx={{ 
                color: '#64748b',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                {uploadedImageUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    📷 Image attached
                  </Box>
                )}
                {uploadedVideoUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    🎥 Video attached
                  </Box>
                )}
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Campaign Info */}
        <Box sx={{ 
          p: 3,
          bgcolor: '#ffffff',
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3, 
              color: '#1f2937', 
              fontWeight: 700,
              fontSize: '1.1rem'
            }}
          >
            Campaign Details
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Row 1: 3 items */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
              {influencerSize && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 1.5,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  minHeight: 60
                }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.7rem' }}>
                    Influencer Size
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.8rem' }}>
                    {influencerSize}
                  </Typography>
                </Box>
              )}
              
              {targetAudience && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 1.5,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  minHeight: 60
                }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.7rem' }}>
                    Target Audience
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.8rem' }}>
                    {targetAudience}
                  </Typography>
                </Box>
              )}
              
              {location && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 1.5,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  minHeight: 60
                }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.7rem' }}>
                    Location
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.8rem' }}>
                    {location}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Row 2: 3 items */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
              {languages && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 1.5,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  minHeight: 60
                }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.7rem' }}>
                    Language
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.8rem' }}>
                    {languages}
                  </Typography>
                </Box>
              )}
              
              {deadline && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 1.5,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  minHeight: 60
                }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.7rem' }}>
                    Deadline
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.8rem' }}>
                    {deadline}
                  </Typography>
                </Box>
              )}
              
              {tags && tags.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 1.5,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  minHeight: 60
                }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.7rem' }}>
                    Hashtags
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.8rem' }}>
                    {tags}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Row 3: Platform only */}
            {platform && (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 1.5,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  minHeight: 60
                }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, fontSize: '0.7rem' }}>
                    Platform
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600, fontSize: '0.8rem' }}>
                    {platform}
                  </Typography>
                </Box>
                
                {/* Empty columns for consistent grid */}
                <Box></Box>
                <Box></Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ height: '100vh', bgcolor: '#f6edf8', overflow: 'hidden' }}>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ m: 2, mx: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Box sx={{ p: 1, height: error ? 'calc(100vh - 80px)' : '100vh', overflow: 'hidden' }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* Left Panel - Post Details Form */}
          <Grid size={{ xs: 12, md: 7 }} sx={{ pl: 10, pr: 5 }}>
            <Paper sx={{ 
              borderRadius: 1, 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb',
              height: 'calc(100vh - 40px)',
              overflow: 'hidden'
            }}>
              <Box sx={{ p: 4 }}>
                {/* Brand Name Field */}
                <Box sx={{ mb: 0.5 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 0.3, 
                      color: '#374151', 
                      fontWeight: 500
                    }}
                  >
                    Brand Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your brand name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        bgcolor: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderWidth: '0.5px',
                          borderColor: '#d1d5db'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#9ca3af',
                          borderWidth: '0.5px'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#882AFF',
                          borderWidth: '1px'
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        py: 1
                      }
                    }}
                  />
                </Box>

                {/* Title Field */}
                <Box sx={{ mb: 0.5 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 0.3, 
                      color: '#374151', 
                      fontWeight: 500
                    }}
                  >
                    Post Title *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter an engaging post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        bgcolor: '#fff',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderWidth: '0.5px',
                          borderColor: '#d1d5db'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#9ca3af',
                          borderWidth: '0.5px'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#882AFF',
                          borderWidth: '1px'
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        py: 1
                      }
                    }}
                  />
                </Box>

                {/* Description Field */}
                <Box sx={{ mb: 0.5 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 0.3, 
                      color: '#374151', 
                      fontWeight: 500
                    }}
                  >
                    Description *
                  </Typography>
                  <Box sx={{ position: 'relative' }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={descriptionRows}
                      placeholder="Describe your campaign requirements in detail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          bgcolor: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '0.5px',
                            borderColor: '#d1d5db'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#9ca3af',
                            borderWidth: '0.5px'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#882AFF',
                            borderWidth: '1px'
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          py: 1
                        }
                      }}
                    />
                    
                    {/* Drag Handle */}
                    <Box
                      onMouseDown={handleMouseDown}
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 20,
                        height: 20,
                        cursor: 'ns-resize',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isDragging ? '#f3f4f6' : 'transparent',
                        borderRadius: '0 0 4px 0',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: '#f3f4f6'
                        }
                      }}
                    >
                      <DragIndicator 
                        sx={{ 
                          fontSize: 12, 
                          color: '#9ca3af',
                          transform: 'rotate(90deg)',
                          '&:hover': {
                            color: '#6b7280'
                          }
                        }} 
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Media Upload */}
                <Box sx={{ mb: 0.5 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 0.3, 
                      color: '#374151', 
                      fontWeight: 500
                    }}
                  >
                    Media Upload
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    p: 1,
                    border: '1px solid #e5e7eb',
                    borderRadius: 1,
                    bgcolor: '#f9fafb'
                  }}>
                    <Box
                      onClick={handleImageUpload}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        border: '0.5px dashed #d1d5db',
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: '#fff',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          borderColor: '#882AFF',
                          bgcolor: '#f3f4f6'
                        },
                        flex: 1
                      }}
                    >
                      <PhotoCamera sx={{ fontSize: 16, color: '#6b7280' }} />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 500, color: '#374151', display: 'block' }}>
                          Image
                        </Typography>
                        {uploadedImageUrl && (
                          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                            ✓ Uploaded
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    
                    <Box
                      onClick={handleVideoUpload}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        border: '0.5px dashed #d1d5db',
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: '#fff',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          borderColor: '#882AFF',
                          bgcolor: '#f3f4f6'
                        },
                        flex: 1
                      }}
                    >
                      <Videocam sx={{ fontSize: 16, color: '#6b7280' }} />
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 500, color: '#374151', display: 'block' }}>
                          Video
                        </Typography>
                        {uploadedVideoUrl && (
                          <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                            ✓ Uploaded
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Form Grid Fields */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ mb: 2 }}>
                    <FormControl fullWidth>
                      <Select
                        value={influencerSize}
                        onChange={(e) => setInfluencerSize(e.target.value)}
                        displayEmpty
                        startAdornment={
                          <InputAdornment position="start">
                            <GroupWork sx={{ color: '#6b7280', fontSize: 18 }} />
                          </InputAdornment>
                        }
                        sx={{
                          borderRadius: 1,
                          bgcolor: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': { 
                            borderWidth: '0.5px',
                            borderColor: '#e5e7eb'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': { 
                            borderColor: '#d1d5db',
                            borderWidth: '0.5px'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                            borderColor: '#882AFF',
                            borderWidth: '1px'
                          },
                          '& .MuiSelect-select': {
                            py: 1
                          }
                        }}
                      >
                        <MenuItem value="" disabled>Influencer Size *</MenuItem>
                        {InfluencerSizes.map((size) => (
                          <MenuItem key={size.value} value={size.value}>{size.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ mb: 2 }}>
                    <FormControl fullWidth>
                      <Select
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        displayEmpty
                        startAdornment={
                          <InputAdornment position="start">
                            <People sx={{ color: '#6b7280', fontSize: 18 }} />
                          </InputAdornment>
                        }
                        sx={{
                          borderRadius: 1,
                          bgcolor: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': { 
                            borderWidth: '0.5px',
                            borderColor: '#e5e7eb'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': { 
                            borderColor: '#d1d5db',
                            borderWidth: '0.5px'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                            borderColor: '#882AFF',
                            borderWidth: '1px'
                          },
                          '& .MuiSelect-select': {
                            py: 1
                          }
                        }}
                      >
                        <MenuItem value="" disabled>Target Audience *</MenuItem>
                        {TargetAudiences.map((audience) => (
                          <MenuItem key={audience} value={audience}>{audience}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="Budget (₹) *"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CurrencyRupee sx={{ color: '#6b7280', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          bgcolor: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '0.5px',
                            borderColor: '#e5e7eb'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d1d5db',
                            borderWidth: '0.5px'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#882AFF',
                            borderWidth: '1px'
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          py: 1
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Additional Fields */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Location"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn sx={{ color: '#6b7280', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          bgcolor: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '0.5px',
                            borderColor: '#e5e7eb'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d1d5db',
                            borderWidth: '0.5px'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#882AFF',
                            borderWidth: '1px'
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          py: 1
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      placeholder="Platform"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Smartphone sx={{ color: '#6b7280', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          bgcolor: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '0.5px',
                            borderColor: '#e5e7eb'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d1d5db',
                            borderWidth: '0.5px'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#882AFF',
                            borderWidth: '1px'
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          py: 1
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      placeholder="Languages"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Translate sx={{ color: '#6b7280', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          bgcolor: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '0.5px',
                            borderColor: '#e5e7eb'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d1d5db',
                            borderWidth: '0.5px'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#882AFF',
                            borderWidth: '1px'
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          py: 1
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Final Fields */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      placeholder="Deadline *"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DateRange sx={{ color: '#6b7280', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          bgcolor: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '0.5px',
                            borderColor: '#e5e7eb'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d1d5db',
                            borderWidth: '0.5px'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#882AFF',
                            borderWidth: '1px'
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          py: 1
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Tags"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tag sx={{ color: '#6b7280', fontSize: 18 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          bgcolor: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: '0.5px',
                            borderColor: '#e5e7eb'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d1d5db',
                            borderWidth: '0.5px'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#882AFF',
                            borderWidth: '1px'
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          py: 1
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Hidden file inputs */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
                
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoChange}
                  style={{ display: 'none' }}
                  accept="video/*"
                />

                {/* Publish Campaign Button */}
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                  <Button
                    variant="contained"
                    onClick={handlePublish}
                    disabled={posting || uploading}
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #7C4DFF 0%, #9C27B0 100%)',
                      boxShadow: '0 4px 15px rgba(124, 77, 255, 0.3)',
                      '&:hover': { 
                        background: 'linear-gradient(135deg, #5E35B1 0%, #7B1FA2 100%)',
                        boxShadow: '0 6px 20px rgba(124, 77, 255, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': {
                        bgcolor: '#9575cd',
                        color: '#fff'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {posting ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        <span>Publishing...</span>
                      </Box>
                    ) : (
                      initialData ? 'Update Campaign' : 'Publish Campaign'
                    )}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Panel - Campaign Budget */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ pl: 5, pr: 10 }}>
            <Paper sx={{ 
              borderRadius: 1, 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb',
              height: 'calc(100vh - 40px)',
              overflow: 'hidden'
            }}>
              <Box sx={{ height: '100%', overflow: 'auto' }}>
                {renderRightPanel()}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CreateMarketplacePost;