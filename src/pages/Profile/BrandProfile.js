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

  console.log('🎨 BRAND PROFILE DEBUG:');
  console.log('brand:', brand);
  console.log('brand type:', typeof brand);
  console.log('brand length:', brand?.length);

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
        has_media: true
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
        has_media: false
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
        has_media: true
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
            sx={{
              p: 3,
              mb: 2,
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Post Header */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
                  Post ID: {post.id}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Timestamp:</strong> {new Date(post.timestamp).toLocaleString()}
                </Typography>
              </Box>

              {/* Content */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  Caption:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {post.caption || "No caption available"}
                </Typography>

                {post.full_caption && post.full_caption !== post.caption && (
                  <>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                      Full Caption:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {post.full_caption}
                    </Typography>
                  </>
                )}
              </Box>

              {/* Media and Content Info */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Media Type:</strong> {post.media_type || 'Unknown'} |
                  <strong> Content Length:</strong> {post.content_length || 0} characters |
                  <strong> Has Media:</strong> {post.has_media ? 'Yes' : 'No'}
                </Typography>
              </Box>

              {/* Engagement Metrics */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  Engagement Metrics:
                </Typography>
                <Grid container spacing={2}>
                  <Grid xs={6} sm={3}>
                    <Box sx={{ textAlign: "center", p: 1, bgcolor: "#f8f9fa", borderRadius: 1 }}>
                      <Typography variant="h6" color="#e91e63">{post.likes || 0}</Typography>
                      <Typography variant="caption" color="text.secondary">Likes</Typography>
                    </Box>
                  </Grid>
                  <Grid xs={6} sm={3}>
                    <Box sx={{ textAlign: "center", p: 1, bgcolor: "#f8f9fa", borderRadius: 1 }}>
                      <Typography variant="h6" color="#2196f3">{post.comments || 0}</Typography>
                      <Typography variant="caption" color="text.secondary">Comments</Typography>
                    </Box>
                  </Grid>
                  <Grid xs={6} sm={3}>
                    <Box sx={{ textAlign: "center", p: 1, bgcolor: "#f8f9fa", borderRadius: 1 }}>
                      <Typography variant="h6" color="#4caf50">{post.shares || 0}</Typography>
                      <Typography variant="caption" color="text.secondary">Shares</Typography>
                    </Box>
                  </Grid>
                  <Grid xs={6} sm={3}>
                    <Box sx={{ textAlign: "center", p: 1, bgcolor: "#f8f9fa", borderRadius: 1 }}>
                      <Typography variant="h6" color="#ff9800">{post.engagement || 0}</Typography>
                      <Typography variant="caption" color="text.secondary">Total Engagement</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Additional Metrics */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Engagement Rate:</strong> {post.engagement_rate || 0}%
                </Typography>
              </Box>
            </CardContent>
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
          sx={{
            p: 3,
            mb: 2,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Post Header */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
                Post ID: {post.id}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Timestamp:</strong> {new Date(post.timestamp).toLocaleString()}
              </Typography>
            </Box>

            {/* Content */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                Caption:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {post.caption || "No caption available"}
              </Typography>

              {post.full_caption && post.full_caption !== post.caption && (
                <>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    Full Caption:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {post.full_caption}
                  </Typography>
                </>
              )}
            </Box>

            {/* Media and Content Info */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Media Type:</strong> {post.media_type || 'Unknown'} |
                <strong> Content Length:</strong> {post.content_length || 0} characters |
                <strong> Has Media:</strong> {post.has_media ? 'Yes' : 'No'}
              </Typography>
            </Box>

            {/* Engagement Metrics */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                Engagement Metrics:
              </Typography>
              <Grid container spacing={2}>
                <Grid xs={6} sm={3}>
                  <Box sx={{ textAlign: "center", p: 1, bgcolor: "#f8f9fa", borderRadius: 1 }}>
                    <Typography variant="h6" color="#e91e63">{post.likes || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Likes</Typography>
                  </Box>
                </Grid>
                <Grid xs={6} sm={3}>
                  <Box sx={{ textAlign: "center", p: 1, bgcolor: "#f8f9fa", borderRadius: 1 }}>
                    <Typography variant="h6" color="#2196f3">{post.comments || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Comments</Typography>
                  </Box>
                </Grid>
                <Grid xs={6} sm={3}>
                  <Box sx={{ textAlign: "center", p: 1, bgcolor: "#f8f9fa", borderRadius: 1 }}>
                    <Typography variant="h6" color="#4caf50">{post.shares || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Shares</Typography>
                  </Box>
                </Grid>
                <Grid xs={6} sm={3}>
                  <Box sx={{ textAlign: "center", p: 1, bgcolor: "#f8f9fa", borderRadius: 1 }}>
                    <Typography variant="h6" color="#ff9800">{post.engagement || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Total Engagement</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Additional Metrics */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Engagement Rate:</strong> {post.engagement_rate || 0}%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default BrandProfile;