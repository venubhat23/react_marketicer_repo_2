import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import Favorite from "@mui/icons-material/Favorite";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import LinkIcon from "@mui/icons-material/Link";
import Send from "@mui/icons-material/Send";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

const BrandProfile = () => {
  // Data for the influencer posts
  const influencerPosts = [
    {
      id: 1,
      image: "https://c.animaapp.com/mavezxjciUNcPR/img/rectangle-75.png",
      username: "@name",
      content: "Lorem ipsum dolor sit....",
      likes: "37.8K",
      comments: "248",
      shares: "234",
      links: "122",
      date: "13March",
    },
    {
      id: 2,
      image: "https://c.animaapp.com/mavezxjciUNcPR/img/rectangle-75-1.png",
      username: "@name",
      content: "Lorem ipsum dolor sit....",
      likes: "37.8K",
      comments: "248",
      shares: "234",
      links: "122",
      date: "13March",
    },
    {
      id: 3,
      image: "https://c.animaapp.com/mavezxjciUNcPR/img/rectangle-75-2.png",
      username: "@name",
      content: "Lorem ipsum dolor sit....",
      likes: "37.8K",
      comments: "248",
      shares: "234",
      links: "122",
      date: "13March",
    },
  ];

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Stack spacing={2}>
        {influencerPosts.map((post) => (
          <Card
            key={post.id}
            sx={{
              p: 2,
              borderRadius: "10px",
              border: "1px solid #d6d6d6",
              boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)",
              bgcolor: "#fffdfd",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Grid container spacing={2}>
                <Grid item>
                  <Box
                    component="img"
                    src={post.image}
                    alt="Post thumbnail"
                    sx={{
                      width: 75,
                      height: post.id === 3 ? 24 : 85,
                      objectFit: "cover",
                    }}
                  />
                </Grid>

                <Grid item xs>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <span>Influencer</span>
                      <Typography component="span" color="text.secondary">
                        @anybrand
                      </Typography>
                      <Typography component="span" color="text.secondary">
                        {post.date}
                      </Typography>
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">{post.username}</Typography>
                      <Typography variant="body2">{post.content}</Typography>
                    </Box>
                  </Box>

                  <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Favorite fontSize="small" />
                      <Typography
                        variant="body2"
                        sx={{ ml: 1, fontWeight: 300 }}
                      >
                        {post.likes}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ChatBubbleOutline fontSize="small" />
                      <Typography
                        variant="body2"
                        sx={{ ml: 1, fontWeight: 300 }}
                      >
                        {post.comments}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Send fontSize="small" />
                      <Typography
                        variant="body2"
                        sx={{ ml: 1, fontWeight: 300 }}
                      >
                        {post.shares}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LinkIcon fontSize="small" />
                      <Typography
                        variant="body2"
                        sx={{ ml: 1, fontWeight: 300 }}
                      >
                        {post.links}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item>
                  <Button
                    variant="text"
                    endIcon={<KeyboardArrowDown />}
                    sx={{
                      bgcolor: "#fffdfd",
                      borderRadius: "8px",
                      color: "text.primary",
                      textTransform: "none",
                      p: 1,
                    }}
                  >
                    View full Analytics
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default BrandProfile