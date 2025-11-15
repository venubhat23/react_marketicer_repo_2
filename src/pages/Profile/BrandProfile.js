import React, {useState} from "react";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LinkIcon from "@mui/icons-material/Link";
import Send from "@mui/icons-material/Send";
import SendIcon from "@mui/icons-material/Send";
import ShareIcon from "@mui/icons-material/Share";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";


const BrandProfile = ({brand}) => {
  const [loading, setLoading] = useState(false);

  const handleViewPost = (postLink) => {
    if (postLink) {
      window.open(postLink, '_blank', 'noopener,noreferrer');
    }
  };

  console.log('🎨 BRAND PROFILE DEBUG:');
  console.log('brand:', brand);
  console.log('brand type:', typeof brand);
  console.log('brand length:', brand?.length);
  console.log('brand === null:', brand === null);
  console.log('brand === undefined:', brand === undefined);
  console.log('Array.isArray(brand):', Array.isArray(brand));
  if (brand && brand.length > 0) {
    console.log('First post sample:', brand[0]);
    console.log('Is showing real data? Caption should be TEST POST or wee:', brand[0].caption);
  } else {
    console.log('⚠️ No brand data available, will show dummy posts');
  }

  // If no brand data is available, show a message or use real-time dummy data
  if (!brand || brand.length === 0) {
    // For LinkedIn, show some dummy posts with same format as API using current date
    const dummyPosts = [
      {
        id: "urn:li:ugcPost:dummy123",
        caption: 'The future of AI in business is here. Our recent project demonstrates the potential...',
        full_caption: 'The future of AI in business is here. Our recent project demonstrates the potential for transformative solutions.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        media_type: 'TEXT',
        likes: 8,
        comments: 1,
        shares: 0,
        engagement: 9,
        engagement_rate: 7,
        content_length: 197,
        has_media: true,
        post_link: "https://www.linkedin.com/feed/update/urn:li:activity:7395405979481403392/"
      },
      {
        id: "urn:li:ugcPost:dummy456",
        caption: 'Great team collaboration leads to innovative solutions. Here\'s what we learned this quarter...',
        full_caption: 'Technology should enable human potential, not replace it. Here\'s our philosophy...',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        media_type: 'MEDIA',
        likes: 21,
        comments: 6,
        shares: 4,
        engagement: 31,
        engagement_rate: 6,
        content_length: 149,
        has_media: false,
        post_link: "https://www.linkedin.com/feed/update/urn:li:activity:7395405979481403393/"
      },
      {
        id: "urn:li:ugcPost:dummy789",
        caption: 'Innovation starts with curiosity. Our latest research reveals interesting patterns...',
        full_caption: 'Innovation starts with curiosity. Our latest research reveals interesting patterns in user behavior.',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        media_type: 'MEDIA',
        likes: 18,
        comments: 2,
        shares: 2,
        engagement: 22,
        engagement_rate: 6,
        content_length: 156,
        has_media: true,
        post_link: "https://www.linkedin.com/feed/update/urn:li:activity:7395405979481403394/"
      }
    ];

    return (
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, fontSize: '16px' }}>
          All Brand - Tagged Posts
        </Typography>

        {dummyPosts.map((post, index) => (
          <Card
            key={post.id || index}
            variant="outlined"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              p: 2,
              mb: 2,
              borderRadius: 2,
            }}
          >
            {/* Left Side: Post Info */}
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                  {post.caption || post.full_caption || 'No caption'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  @LinkedIn • {post.media_type || 'MEDIA'} • {post.content_length || 0} chars
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                  Post ID: {post.id}
                </Typography>
                {post.full_caption && post.full_caption !== post.caption && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 300 }}>
                    {post.full_caption.length > 100
                      ? `${post.full_caption.substring(0, 100)}...`
                      : post.full_caption}
                  </Typography>
                )}

                {/* Stats */}
                <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <FavoriteBorderIcon fontSize="small" />
                    <Typography variant="body2">{post.likes || 0}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ChatBubbleOutlineIcon fontSize="small" />
                    <Typography variant="body2">{post.comments || 0}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <SendIcon fontSize="small" />
                    <Typography variant="body2">{post.shares || 0}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ShareIcon fontSize="small" />
                    <Typography variant="body2">{post.engagement || 0}</Typography>
                  </Box>
                </Box>

                {/* Engagement Rate */}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.75rem' }}>
                  Engagement Rate: {post.engagement_rate || 0}%
                </Typography>

                {/* View Post Button */}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LaunchIcon fontSize="small" />}
                  onClick={() => handleViewPost(post.post_link)}
                  sx={{
                    mt: 2,
                    borderColor: '#882AFF',
                    color: '#882AFF',
                    '&:hover': {
                      borderColor: '#6B1BA8',
                      backgroundColor: '#F9F5FF'
                    }
                  }}
                >
                  View Post
                </Button>
              </Box>
            </Box>

            {/* Right Side: Date */}
            <Box sx={{ textAlign: "right", minWidth: 'auto' }}>
              <Typography variant="body2" color="text.secondary">
                {new Date(post.timestamp).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
    );
  }

  // Show loading overlay when loading
  if (loading) {
    return (
      <Box sx={{
        position: 'relative',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(248, 249, 250, 0.8)',
        borderRadius: 2
      }}>
        <CircularProgress
          variant="indeterminate"
          size={60}
          thickness={4}
          sx={{
            color: '#882AFF',
            mb: 2
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#882AFF', mb: 1 }}>
          Marketincer
        </Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>
          Analytics Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, fontSize: '16px' }}>
        All Brand - Tagged Posts
      </Typography>

      {brand.map((post, index) => (
        <Card
          key={post.id || index}
          variant="outlined"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            p: 2,
            mb: 2,
            borderRadius: 2,
          }}
        >
          {/* Left Side: Post Info */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, flex: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                {post.caption || post.full_caption || 'No caption'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                @LinkedIn • {post.media_type || 'MEDIA'} • {post.content_length || 0} chars
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem' }}>
                Post ID: {post.id}
              </Typography>
              {post.full_caption && post.full_caption !== post.caption && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 300 }}>
                  {post.full_caption.length > 100
                    ? `${post.full_caption.substring(0, 100)}...`
                    : post.full_caption}
                </Typography>
              )}

              {/* Stats */}
              <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <FavoriteBorderIcon fontSize="small" />
                  <Typography variant="body2">{post.likes || 0}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <ChatBubbleOutlineIcon fontSize="small" />
                  <Typography variant="body2">{post.comments || 0}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <SendIcon fontSize="small" />
                  <Typography variant="body2">{post.shares || 0}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <ShareIcon fontSize="small" />
                  <Typography variant="body2">{post.engagement || 0}</Typography>
                </Box>
              </Box>

              {/* Engagement Rate */}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.75rem' }}>
                Engagement Rate: {post.engagement_rate || 0}%
              </Typography>

              {/* View Post Button */}
              <Button
                variant="outlined"
                size="small"
                startIcon={<LaunchIcon fontSize="small" />}
                onClick={() => handleViewPost(post.post_link)}
                sx={{
                  mt: 2,
                  borderColor: '#882AFF',
                  color: '#882AFF',
                  '&:hover': {
                    borderColor: '#6B1BA8',
                    backgroundColor: '#F9F5FF'
                  }
                }}
              >
                View Post
              </Button>
            </Box>
          </Box>

          {/* Right Side: Date */}
          <Box sx={{ textAlign: "right", minWidth: 'auto' }}>
            <Typography variant="body2" color="text.secondary">
              {new Date(post.timestamp).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default BrandProfile;