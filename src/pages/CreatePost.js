
import React,{useEffect, useState} from "react";
import { Box, Typography,Button,
  TextField,
  Avatar,
  Chip,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardMedia,
  Grid,
  Stack,
  AppBar, Toolbar,
  CardContent,Autocomplete } from "@mui/material";

import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';

//import MyEditor from "../../components/Editor";
import TabComponent from "../components/TabComponent";
import InstagramPost from "../components/InstagramPost"
import MyEditor from "../components/MyEditor";
import Sidebar  from "../components/Sidebar";
import Navbar from "../components/Navbar";

const CreatePost = () => {

  const selectedUsers = ['John', 'John', 'John'];
  const Brands = ['Brand1', 'Brand2', 'Brand 3']
  const previewImage = 'https://randomuser.me/api/portraits/women/45.jpg';
  const uploadedImages = [
    'https://randomuser.me/api/portraits/women/20.jpg',
    'https://randomuser.me/api/portraits/women/25.jpg',
  ];

  const tabs = [
    {
      label: 'Instagram',
      content: <div><InstagramPost /></div>,
    },
    {
      label: 'Facebook',
      content: <div>This is the Facebook section.</div>,
    },
    {
      label: 'Twitter',
      content: <div>This is the Twitter section.</div>,
    },
  ];

  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  return (

    <Grid container spacing={2}>
        <Grid item xs={1} md={1} size={1}>
          <Sidebar />
        </Grid>
        <Grid item xs={11} md={11} size={11} sx={{ bgcolor: '#f3edf8' }}>
        <AppBar position="static" sx={{ bgcolor: "#091a48", boxShadow: "none" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              sx={{ mr: 2 }}
            >
              <ArrowLeftIcon />
            </IconButton>
            <Typography variant="h5" component="div" fontWeight={500}>
              Create Post
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container spacing={2}>
        {/* Left Side */}
        <Grid item xs={12} md={7} size={7} sx={{bgcolor:'#fff', padding:'10px',height:'100vh', boxShadow: '2px 2px 2px 1px rgb(0 0 0 / 20%)', }}>
          {/* Dropdowns */}
          <Box display="flex" gap={2} mb={2} >
          <Autocomplete
                disablePortal
                options={Brands}
                renderInput={(params) => <TextField {...params} label="Brand" />}
                sx={{
                  '& .MuiInputBase-root': {
                    width:300,
                    height: 40, // set desired height
                    paddingRight: '8px', // optional padding
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '5px',
                    bgcolor:'#fff',
                    padding:'0px'
                  },
                  '& .MuiInputLabel-root': {
                    top: '-5px', // optional: adjust label position
                  },
                }}
              />
            <Autocomplete
                disablePortal
                options={selectedUsers}
                renderInput={(params) => <TextField {...params}  />}
                sx={{
                  '& .MuiInputBase-root': {
                    width:300,
                    height: 40, // set desired height
                    paddingRight: '8px', // optional padding
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '5px',
                    bgcolor:'#fff',
                    padding:'0px'
                  },
                  '& .MuiInputLabel-root': {
                    top: '-5px', // optional: adjust label position
                  },
                }}
              />
          </Box>

          {/* User Chips */}
          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            {selectedUsers.map((user, i) => (
              <Chip
                key={i}
                avatar={<Avatar>{user[0]}</Avatar>}
                label={user}
                onDelete={() => {}}
              />
            ))}
          </Box>

          {/* Text Field */}
          <MyEditor  />

          <Typography variant="caption" display="block" mb={2}>
            275 characters left
          </Typography>

          {/* Uploaded Images */}
          <Box display="flex" gap={1} mb={2}>
            {uploadedImages.map((src, i) => (
              <Box key={i} position="relative">
                <Avatar
                  variant="rounded"
                  src={src}
                  sx={{ width: 80, height: 80 }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bgcolor: 'white',
                    borderRadius: '50%',
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Button variant="text">+ Upload Media</Button>
          </Box>

          {/* Buttons */}
          <Box display="flex" gap={2}>
            <Button variant="outlined" sx={{color:'#000', border:'2px solid #7F56D9'}} >Save as Draft</Button>
            <Button variant="contained" sx={{bgcolor:'#7F56D9', color:'#fff' }}>Schedule Post</Button>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, bgcolor:'#7F56D9', color:'#fff' }}
          >
            Publish Now
          </Button>
        </Grid>

        {/* Right Side - Preview */}
        <Grid item xs={12} md={5} size={5} sx={{ bgcolor:'#fff', padding:'10px', boxShadow: '2px 2px 2px 1px rgb(0 0 0 / 20%)',     borderLeft: '10px solid #eff1f4'}}>
          <TabComponent tabs={tabs} defaultIndex={0}/>
          
        </Grid>
      </Grid>
        </Grid>

    </Grid>
           
   
  );
};

export default CreatePost;
