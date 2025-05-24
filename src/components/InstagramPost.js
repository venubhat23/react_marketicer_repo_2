import React from 'react'
import { Box, Typography,Button,
    TextField,
    Avatar,
    Chip,
    Select,
    MenuItem,
    IconButton,
    Card,
    CardMedia,
    CardContent,Autocomplete } from "@mui/material";
import Grid from "@mui/material/Grid";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';


const InstagramPost =()=>{

    const previewImage = 'https://randomuser.me/api/portraits/women/45.jpg';
  const uploadedImages = [
    'https://randomuser.me/api/portraits/women/20.jpg',
    'https://randomuser.me/api/portraits/women/25.jpg',
  ];

    return(
        <Grid item xs={12} md={12}>
          <Card sx={{ borderRadius: 2 }}>
            <CardMedia
              component="img"
              height="250"
              image={previewImage}
              alt="Preview"
            />
            <CardContent>
              <Typography variant="body2">
                Lorem ipsum dolor sit Lorem ipsum dolor sit #instagram
              </Typography>

              {/* Post Footer */}
              <Box display="flex" alignItems="center" mt={2} gap={3}>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <FavoriteBorderIcon fontSize="small" />
                  <Typography variant="body2">37.8K</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <ChatBubbleOutlineIcon fontSize="small" />
                  <Typography variant="body2">248</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <SendIcon fontSize="small" />
                  <Typography variant="body2">234</Typography>
                </Box>
              </Box>

              {/* Metadata */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography variant="body2" color="text.secondary">
                  Brand Name
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Just Now
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
    )

}

export default InstagramPost