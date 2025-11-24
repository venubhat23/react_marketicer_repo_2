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

  // If no brand data is available, show error message
  if (!brand || brand.length === 0) {
    return (
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, fontSize: '16px' }}>
          All Brand - Tagged Posts
        </Typography>

        <Card
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
            mb: 2,
            borderRadius: 2,
            textAlign: 'center',
            backgroundColor: '#fafafa',
            border: '2px dashed #d1d5db',
            minHeight: 200
          }}
        >
          <Box sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2
          }}>
            <Typography variant="h4" sx={{ color: '#dc2626' }}>
              ⚠️
            </Typography>
          </Box>

          <Typography variant="h6" sx={{
            fontWeight: 600,
            color: '#374151',
            mb: 1
          }}>
            No Posts Available
          </Typography>

          <Typography variant="body2" sx={{
            color: '#6b7280',
            maxWidth: 400,
            lineHeight: 1.5
          }}>
            API rate limit exceeded or do not have post data
          </Typography>
        </Card>
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
            </Box>
          </Box>

          {/* Right Side: Date and View Analytics */}
          <Box sx={{ textAlign: "right", minWidth: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {new Date(post.timestamp).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Typography>
            
            {/* View Post Button */}
            <Box 
              onClick={() => handleViewPost(post.post_link)}
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                color: '#8B5CF6',
                fontSize: '14px',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#8B5CF6',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                View Post
              </Typography>
              <KeyboardArrowRightIcon sx={{ fontSize: '16px', color: '#8B5CF6' }} />
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default BrandProfile;