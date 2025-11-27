import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Download as DownloadIcon,
  FilterList as FilterIcon,
  VideoFile as VideoIcon,
  Image as ImageIcon,
  Instagram,
  Facebook,
  LinkedIn,
  Twitter,
  YouTube,
  MusicVideo as TikTok,
  SelectAll as SelectAllIcon,
  GetApp as DownloadAllIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import { socialMediaApi, getAllPlatformPosts } from '../../services/socialMediaApi';

const MediaPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [mediaFilter, setMediaFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [error, setError] = useState(null);
  const [connectedAccounts, setConnectedAccounts] = useState([]);

  // Load connected accounts and posts
  useEffect(() => {
    loadConnectedAccounts();
    loadSocialMediaPosts();
  }, []);

  const loadConnectedAccounts = async () => {
    try {
      console.log('🔗 Media Page: Loading connected accounts...');
      const response = await socialMediaApi.getConnectedAccounts();
      console.log('📱 Media Page: Connected accounts response:', response);
      
      if (response.success) {
        const accounts = response.data.accounts || response.data || [];
        console.log('✅ Media Page: Found connected accounts:', accounts);
        setConnectedAccounts(accounts);
      } else {
        console.error('❌ Media Page: Failed to load connected accounts:', response.error);
      }
    } catch (error) {
      console.error('🚨 Media Page: Error loading connected accounts:', error);
    }
  };

  const loadSocialMediaPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        platform: filter,
        mediaType: mediaFilter
      };

      console.log('🔍 Media Page: Fetching social media posts with filters:', filters);
      const response = await getAllPlatformPosts(filters);
      console.log('📥 Media Page: API Response:', response);
      
      if (response.success) {
        const postsData = response.data || [];
        
        // Transform the API data to match our component structure
        const transformedPosts = postsData.map((post, index) => ({
          id: post.id || `post_${index}`,
          platform: post.platform || 'unknown',
          type: determineMediaType(post),
          title: post.caption || post.title || post.message || 'Untitled Post',
          description: post.description || post.caption || '',
          mediaUrl: post.video_url || post.image_url || post.media_url,
          thumbnailUrl: post.thumbnail_url || post.image_url || 'https://via.placeholder.com/300x200',
          dateCreated: formatDate(post.created_at || post.published_at),
          likes: post.likes_count || post.like_count || 0,
          comments: post.comments_count || post.comment_count || 0,
          shares: post.shares_count || post.share_count || 0,
          accountName: post.account_name || '',
          accountId: post.account_id || ''
        }));

        console.log('✅ Media Page: Transformed posts:', transformedPosts);
        setPosts(transformedPosts);
        setFilteredPosts(transformedPosts);
      } else {
        console.error('❌ Media Page: API failed:', response.error);
        setError(response.error || 'Failed to load social media posts');
        // Fallback to empty array if API fails
        setPosts([]);
        setFilteredPosts([]);
      }
    } catch (error) {
      console.error('🚨 Media Page: Error loading social media posts:', error);
      setError('Failed to connect to social media APIs. Check console for details.');
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setLoading(false);
    }
  }, [filter, mediaFilter]);

  // Helper function to determine media type from post data
  const determineMediaType = (post) => {
    if (post.media_type) return post.media_type;
    if (post.video_url || post.media_url?.includes('.mp4') || post.media_url?.includes('.mov')) return 'video';
    if (post.image_url || post.media_url?.includes('.jpg') || post.media_url?.includes('.png')) return 'image';
    return 'image'; // default fallback
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch (error) {
      return new Date().toISOString().split('T')[0];
    }
  };

  useEffect(() => {
    // Reload posts when filters change
    loadSocialMediaPosts();
  }, [filter, mediaFilter]);

  useEffect(() => {
    // Apply client-side filtering for better performance
    let filtered = posts;

    // Filter by platform
    if (filter !== 'all') {
      filtered = filtered.filter(post => post.platform === filter);
    }

    // Filter by media type
    if (mediaFilter !== 'all') {
      filtered = filtered.filter(post => post.type === mediaFilter);
    }

    setFilteredPosts(filtered);
  }, [posts]);

  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: <Instagram sx={{ color: '#E4405F' }} />,
      facebook: <Facebook sx={{ color: '#1877F2' }} />,
      linkedin: <LinkedIn sx={{ color: '#0A66C2' }} />,
      youtube: <YouTube sx={{ color: '#FF0000' }} />,
      tiktok: <TikTok sx={{ color: '#000000' }} />,
      twitter: <Twitter sx={{ color: '#1DA1F2' }} />
    };
    return icons[platform] || <VideoIcon />;
  };

  const handleSelectPost = (postId) => {
    setSelectedPosts(prev => {
      if (prev.includes(postId)) {
        return prev.filter(id => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(post => post.id));
    }
  };

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDownloadSingle = async (post) => {
    const filename = `${post.platform}_${post.title.replace(/\s+/g, '_')}_${post.id}.${post.type === 'video' ? 'mp4' : 'jpg'}`;
    await downloadFile(post.mediaUrl, filename);
  };

  const handleDownloadSelected = async () => {
    setDownloading(true);
    setShowDownloadDialog(true);
    
    const selectedPostsData = filteredPosts.filter(post => selectedPosts.includes(post.id));
    
    for (let i = 0; i < selectedPostsData.length; i++) {
      const post = selectedPostsData[i];
      const filename = `${post.platform}_${post.title.replace(/\s+/g, '_')}_${post.id}.${post.type === 'video' ? 'mp4' : 'jpg'}`;
      
      await downloadFile(post.mediaUrl, filename);
      
      // Update progress
      setDownloadProgress(((i + 1) / selectedPostsData.length) * 100);
      
      // Small delay to prevent overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setDownloading(false);
    setTimeout(() => {
      setShowDownloadDialog(false);
      setDownloadProgress(0);
    }, 2000);
  };

  if (loading) {
    return (
      <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
        <Grid container>
          <Grid size={{ md: 1 }} className="side_section">
            <Sidebar />
          </Grid>
          <Grid size={{ md: 11 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
              <CircularProgress size={60} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

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
              p: 1,
              backgroundColor: '#091a48',
              borderRadius: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6" sx={{ color: '#fff' }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="back"
                sx={{ mr: 2, color: '#fff' }}
              >
                <ArrowLeftIcon />
              </IconButton>
              Media Library
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton size="large" sx={{ color: 'white' }}>
                <NotificationsIcon />
              </IconButton>
              <Link to="/SettingPage">
                <IconButton size="large" sx={{ color: 'white' }}>
                  <AccountCircleIcon />
                </IconButton>
              </Link>
            </Box>
          </Paper>

          {/* Controls */}
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                Social Media Posts
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {/* Platform Filter */}
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Platform</InputLabel>
                  <Select
                    value={filter}
                    label="Platform"
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Platforms</MenuItem>
                    <MenuItem value="instagram">Instagram</MenuItem>
                    <MenuItem value="facebook">Facebook</MenuItem>
                    <MenuItem value="linkedin">LinkedIn</MenuItem>
                    <MenuItem value="youtube">YouTube</MenuItem>
                    <MenuItem value="tiktok">TikTok</MenuItem>
                  </Select>
                </FormControl>

                {/* Media Type Filter */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Media Type</InputLabel>
                  <Select
                    value={mediaFilter}
                    label="Media Type"
                    onChange={(e) => setMediaFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Media</MenuItem>
                    <MenuItem value="video">Videos</MenuItem>
                    <MenuItem value="image">Images</MenuItem>
                  </Select>
                </FormControl>

                {/* Select All Button */}
                <Button
                  startIcon={<SelectAllIcon />}
                  onClick={handleSelectAll}
                  variant="outlined"
                  sx={{ borderColor: '#882AFF', color: '#882AFF' }}
                >
                  {selectedPosts.length === filteredPosts.length ? 'Deselect All' : 'Select All'}
                </Button>

                {/* Download Selected Button */}
                {selectedPosts.length > 0 && (
                  <Button
                    startIcon={<DownloadAllIcon />}
                    onClick={handleDownloadSelected}
                    variant="contained"
                    disabled={downloading}
                    sx={{ 
                      bgcolor: '#882AFF',
                      '&:hover': { bgcolor: '#7625e6' }
                    }}
                  >
                    Download Selected ({selectedPosts.length})
                  </Button>
                )}
              </Box>
            </Box>

            {/* Posts Grid */}
            {error ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <VideoIcon sx={{ fontSize: 64, color: '#ff5722', mb: 2 }} />
                <Typography variant="h6" color="error">
                  Error Loading Posts
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {error}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={loadSocialMediaPosts}
                  sx={{ bgcolor: '#882AFF', '&:hover': { bgcolor: '#7625e6' } }}
                >
                  Retry
                </Button>
              </Box>
            ) : filteredPosts.length === 0 && !loading ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <VideoIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No social media posts found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {connectedAccounts.length === 0 
                    ? "Connect your social media accounts to see your posts here"
                    : "Try adjusting your filters or check if your connected accounts have posts"
                  }
                </Typography>
                {connectedAccounts.length === 0 && (
                  <Button 
                    variant="contained" 
                    component={Link}
                    to="/socialMedia"
                    sx={{ bgcolor: '#882AFF', '&:hover': { bgcolor: '#7625e6' } }}
                  >
                    Connect Social Media Accounts
                  </Button>
                )}
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredPosts.map((post) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
                    <Card 
                      sx={{ 
                        position: 'relative',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.3s ease'
                        }
                      }}
                    >
                      {/* Selection Checkbox */}
                      <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
                        <Checkbox
                          checked={selectedPosts.includes(post.id)}
                          onChange={() => handleSelectPost(post.id)}
                          sx={{
                            color: 'white',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            borderRadius: '50%',
                            '&.Mui-checked': {
                              color: '#882AFF'
                            }
                          }}
                        />
                      </Box>

                      {/* Download Button */}
                      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                        <Tooltip title="Download">
                          <IconButton
                            onClick={() => handleDownloadSingle(post)}
                            sx={{
                              bgcolor: 'rgba(0,0,0,0.7)',
                              color: 'white',
                              '&:hover': {
                                bgcolor: '#882AFF'
                              }
                            }}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      {/* Media Preview */}
                      <CardMedia
                        component="div"
                        sx={{
                          height: 200,
                          backgroundImage: `url(${post.thumbnailUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative'
                        }}
                      >
                        {/* Media Type Indicator */}
                        <Box sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          bgcolor: 'rgba(0,0,0,0.7)',
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}>
                          {post.type === 'video' ? (
                            <VideoIcon sx={{ color: 'white', fontSize: 16 }} />
                          ) : (
                            <ImageIcon sx={{ color: 'white', fontSize: 16 }} />
                          )}
                          <Typography variant="caption" sx={{ color: 'white' }}>
                            {post.type.toUpperCase()}
                          </Typography>
                        </Box>
                      </CardMedia>

                      {/* Card Content */}
                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        {/* Platform Badge */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {getPlatformIcon(post.platform)}
                          <Chip 
                            label={post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                            size="small"
                            sx={{ 
                              bgcolor: '#f3e5f5',
                              color: '#882AFF',
                              fontWeight: 500
                            }}
                          />
                        </Box>

                        {/* Title */}
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          mb: 1,
                          fontSize: '1rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {post.title}
                        </Typography>

                        {/* Description */}
                        <Typography variant="body2" color="text.secondary" sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {post.description}
                        </Typography>

                        {/* Stats */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                          <Typography variant="caption" color="text.secondary">
                            {post.dateCreated}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              👍 {post.likes}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              💬 {post.comments}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              📤 {post.shares}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Download Progress Dialog */}
      <Dialog open={showDownloadDialog} onClose={() => {}}>
        <DialogTitle>
          {downloading ? 'Downloading Media Files...' : 'Download Complete!'}
        </DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {downloading 
                ? `Downloading ${selectedPosts.length} files...`
                : `Successfully downloaded ${selectedPosts.length} files!`
              }
            </Typography>
            <Box sx={{ width: '100%' }}>
              <CircularProgress 
                variant="determinate" 
                value={downloadProgress} 
                sx={{ 
                  color: downloading ? '#882AFF' : '#4CAF50',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                {Math.round(downloadProgress)}%
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        {!downloading && (
          <DialogActions>
            <Button 
              onClick={() => {
                setShowDownloadDialog(false);
                setSelectedPosts([]);
              }}
              sx={{ color: '#882AFF' }}
            >
              Close
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default MediaPage;