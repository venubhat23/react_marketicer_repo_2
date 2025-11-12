import React, {useState} from "react";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LinkIcon from "@mui/icons-material/Link";
import Send from "@mui/icons-material/Send";
import SendIcon from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";


const BrandProfile = ({brand}) => {

  console.log('🎨 BRAND PROFILE DEBUG:');
  console.log('brand:', brand);
  console.log('brand type:', typeof brand);
  console.log('brand length:', brand?.length);

  // If no brand data is available, show a message or create some dummy data
  if (!brand || brand.length === 0) {
    // For LinkedIn, show some dummy posts
    const dummyPosts = [
      {
        platform: 'LinkedIn',
        brand: 'Stealth Mode AI Startup for Content Creators',
        content: 'The future of AI in business is here. Our recent project demonstrates the potential...',
        date: '2025-11-04T05:38:36Z',
        likes: 8,
        comments: 1,
        shares: 0,
        views: 0,
        thumbnail_url: 'https://ui-avatars.com/api/?name=AI&size=200&background=1B4F72&color=fff'
      },
      {
        platform: 'LinkedIn',
        brand: 'Stealth Mode AI Startup for Content Creators',
        content: 'Great team collaboration leads to innovative solutions. Here\'s what we learned this quarter...',
        date: '2025-11-02T05:38:36Z',
        likes: 21,
        comments: 6,
        shares: 4,
        views: 0,
        thumbnail_url: 'https://ui-avatars.com/api/?name=Team&size=200&background=2E8B57&color=fff'
      },
      {
        platform: 'LinkedIn',
        brand: 'Stealth Mode AI Startup for Content Creators',
        content: 'Innovation starts with curiosity. Our latest research reveals interesting patterns...',
        date: '2025-10-30T05:38:36Z',
        likes: 18,
        comments: 2,
        shares: 2,
        views: 0,
        thumbnail_url: 'https://ui-avatars.com/api/?name=Innovation&size=200&background=8E44AD&color=fff'
      }
    ];

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          All Brand - Tagged Posts
        </Typography>
        <Stack spacing={2}>
          {dummyPosts.map((post, index) => (
            <Card
              key={index}
              sx={{
                p: 2,
                borderRadius: "10px",
                border: "1px solid #d6d6d6",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
                bgcolor: "#fffdfd",
                width:'100%',
              }}
            >
              <CardContent sx={{ p: 0, }}>
                <Grid container spacing={2}>
                  <Grid size={{xs:2, md:2}}>
                    <Box
                      component="img"
                      src={post.thumbnail_url}
                      alt="Post thumbnail"
                      sx={{
                        width: 75,
                        height: 75,
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  </Grid>

                  <Grid size={{xs:5, md:7}}>
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                      >
                        <span>{post.platform}</span>
                        <Typography component="span" color="text.secondary">
                          {post.brand}
                        </Typography>
                        <Typography component="span" color="text.secondary">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </Typography>
                      </Typography>

                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {post.brand}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            mt: 0.5
                          }}
                        >
                          {post.content}
                        </Typography>
                      </Box>
                    </Box>

                    <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <FavoriteBorderIcon fontSize="small" sx={{ color: "#e91e63" }} />
                        <Typography
                          variant="body2"
                          sx={{ ml: 1, fontWeight: 300 }}
                        >
                          {post.likes}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ChatBubbleOutlineIcon fontSize="small" sx={{ color: "#2196f3" }} />
                        <Typography
                          variant="body2"
                          sx={{ ml: 1, fontWeight: 300 }}
                        >
                          {post.comments}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <SendIcon fontSize="small" sx={{ color: "#4caf50" }} />
                        <Typography
                          variant="body2"
                          sx={{ ml: 1, fontWeight: 300 }}
                        >
                          {post.shares}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <VisibilityIcon fontSize="small" sx={{ color: "#ff9800" }} />
                        <Typography
                          variant="body2"
                          sx={{ ml: 1, fontWeight: 300 }}
                        >
                          {post.views}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {brand.map((post, index) => (
        <Card
          key={index}
          sx={{
            p: 2,
            borderRadius: "10px",
            border: "1px solid #d6d6d6",
            boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
            bgcolor: "#fffdfd",
            width:'100%', 
          }}
        >
          <CardContent sx={{ p: 0, }}>
            <Grid container spacing={2}>
              <Grid size={{xs:2, md:2}}>
                <Box
                  component="img"
                  src={post.thumbnail_url || "https://via.placeholder.com/75x75?text=No+Image"}
                  alt="Post thumbnail"
                  sx={{
                    width: 75,
                    height: 75,
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/75x75?text=No+Image";
                  }}
                />
              </Grid>

              <Grid size={{xs:5, md:7}}>
                <Box sx={{ mb: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                  >
                    <span>{post.platform}</span>
                    <Typography component="span" color="text.secondary">
                      {post.brand}
                    </Typography>
                    <Typography component="span" color="text.secondary">
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </Typography>
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {post.brand}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mt: 0.5
                      }}
                    >
                      {post.content || "No content available"}
                    </Typography>
                  </Box>
                </Box>

                <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Favorite fontSize="small" sx={{ color: "#e91e63" }} />
                    <Typography
                      variant="body2"
                      sx={{ ml: 1, fontWeight: 300 }}
                    >
                      {post.likes || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ChatBubbleOutline fontSize="small" sx={{ color: "#2196f3" }} />
                    <Typography
                      variant="body2"
                      sx={{ ml: 1, fontWeight: 300 }}
                    >
                      {post.comments || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Send fontSize="small" sx={{ color: "#4caf50" }} />
                    <Typography
                      variant="body2"
                      sx={{ ml: 1, fontWeight: 300 }}
                    >
                      {post.shares || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <VisibilityIcon fontSize="small" sx={{ color: "#ff9800" }} />
                    <Typography
                      variant="body2"
                      sx={{ ml: 1, fontWeight: 300 }}
                    >
                      {post.views || 0}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default BrandProfile;