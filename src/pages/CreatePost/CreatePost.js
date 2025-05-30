
import React, {useEffect, useState, useRef} from "react";

import { Box, Typography,Button,
  TextField,
  Avatar,
  Chip,
  Select,
  MenuItem,
  IconButton,
  Card,
  Tab,Tabs,
  Grid,Modal,Paper,
  AppBar, Toolbar,Container,
  CardContent,Autocomplete } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import Editor from "../../components/Editor";
import TabComponent from "../../components/TabComponent";
import InstagramPost from "../../components/InstagramPost"
import Sidebar  from "../../components/Sidebar";
import axios from 'axios';
import { useMutation } from "@tanstack/react-query";
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon,} from '@mui/icons-material';
import { toast } from "react-toastify";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Skeleton from "@mui/material/Skeleton";



const CreatePost = () => {

  const Brands = ['D-Mart', 'V-Mart', 'Blinkit']
  
  const TabPanel = ({ value, index, children }) => {
    return (
      value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )
    );
  };
  
  const [postContent, setPostContent] = useState("");
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  //const [openAnother, setOpenAnother] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPages, setSelectedPages] = useState([]);
  const [brandName, setBrandName] = useState("");
  const fileInputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [posting, setPosting] = useState(false);
  const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  //const [createPostMode, setCreatePostMode] = useState("");
  const [editorLoaded, setEditorLoaded] = useState(false);
  // const [data, setData] = useState("");
  const [createPostMode, setCreatePostMode] = useState("");
  const [pages, setPages] = useState([]);
  const [selectedOption, setSelectedOption] = useState('')
  const [previewUrl, setPreviewUrl] = useState('');
  const[selectUser, setSelectUser] = useState('')

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    const selectedUser = pages.find((user) => user.social_id);
    setSelectUser(selectedUser)
    console.log('3333', selectUser)
  };
 
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };


  const fetchAccountsFromAPI = async () => {

    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      // Fetch the accounts from the dummy API
      const response = await fetch(
        `https://api.marketincer.com/api/v1/social_pages/connected_pages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

      }
      );

      const data = await response.json();
      setPages(data.data.accounts); // Store the fetched accounts in the state
      
      
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountsFromAPI();
  }, []);
  

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const draftModelOpen= async (action) => {
    if ( !uploadedImageUrl || !postContent) {
      alert("Please make sure all fields are filled out!");
      return;
    }
    setCreatePostMode(action);
    setOpenDateTimePicker(true);
   
  };

  const handleBoxClick = () => {
    fileInputRef.current.click(); // ✅ Triggers the hidden file input
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setUploadedFileName(droppedFile.name);
      console.log('imgggg', uploadedImageUrl)

      // ✅ Auto-upload the file after drop
      handleFileUpload(droppedFile);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://kitintellect.tech/storage/public/api/upload/aaFacebook",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.url) {
        setUploadedImageUrl(data.url); // ✅ Store uploaded file URL

        toast.success("File uploaded successfully!", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.error("File upload failed!", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log('11111', file)
      setUploadedFileName(selectedFile.name);
      

      // ✅ Auto-upload the file after selection
      handleFileUpload(selectedFile);
    }
  };

  const handlePublish = async () => {
    if ( !uploadedImageUrl || !postContent) {
      alert("Please make sure all fields are filled out!");
      return;
    }
    setPosting(true);
    const stripHtmlTags = (postContent) => postContent.replace(/<[^>]*>/g, '').trim();
    const payloadData = {
      social_page_ids: selectedPages,  // Only sending the first selected page for now
      post: {
        s3_url: uploadedImageUrl,
        note: stripHtmlTags(postContent),        // ✅ Apply to postContent
        comments: stripHtmlTags(postContent),  
        brand_name: brandName,
        status: "publish"
      },
    };
    console.log('papapa',payloadData )

    try {
      const token = localStorage.getItem("token");
      await axios.post("https://api.marketincer.com/api/v1/posts", payloadData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      alert("Post published successfully!");
      // Optionally, clear form states
      setSelectedPages([]);
      setPostContent("");
      setUploadedImageUrl("");
      setPosting(false);
      setUploadedFileName('');
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error publishing post:", error);
      alert("Failed to publish post");
    }
  };

  const draftHandler = async () => {
   
    if (  !uploadedImageUrl || !postContent) {
      alert("Please make sure all fields are filled out!");
      return;
    }
    setPosting(true);
    const stripHtmlTags = (postContent) => postContent.replace(/<[^>]*>/g, '').trim();
    const payloadData = {
      social_page_ids: selectedPages,  // Only sending the first selected page for now
      post: {
        s3_url: uploadedImageUrl,
        note: stripHtmlTags(postContent),        // ✅ Apply to postContent
        comments: stripHtmlTags(postContent),  // Use the postContent for comments as well
        brand_name: brandName,
        status: createPostMode,
        scheduled_at: selectedDateTime
      },
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("https://api.marketincer.com/api/v1/posts/schedule", payloadData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      alert(`Post ${createPostMode} successfully!`);
      // Optionally, clear form states
      setSelectedPages([]);
      setPostContent("");
      setUploadedImageUrl("");
      setPosting(false);
      setOpenDateTimePicker(false);
      setUploadedFileName('');
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(`Error ${createPostMode}  post:`, error);
      alert(`Failed to ${createPostMode} post`);
    }
  };
  console.log('poooooo', postContent)

  const mutation = useMutation({
    mutationFn: (payloadData) => {
      const token = localStorage.getItem("token"); // Retrieve token from local storage (or state)

      return axios.post(
        "https://api.marketincer.com/api/v1/posts",
        payloadData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the Bearer token
          },
        }
      );
    },
    onSuccess: (response) => {
      console.log(response);
      toast.success(response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
      });
      setOpen(false);
      setPostContent("");
    },
    onError: (error) => {
      toast.error("Failed to Create Post", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Post creation failed", error);
    },
  });

  const handleAvatarClick = (pageId) => {
    console.log("Page ID clicked:", pageId, selectedPages);
    setSelectedPages((selectedPages) =>
    selectedPages.includes(pageId)
        ? selectedPages.filter((id) => id !== pageId) // Deselect if already selected
        : [...selectedPages, pageId] // Select if not selected
    );
    
  };
  console.log('seseses', selectedPages)
 


  return (

    <>
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box
          component="nav"
          sx={{ 
            width: { md: '5.333%' }, 
            minWidth: { md: '80px' },
            flexShrink: 0 
          }}
        >
          <Sidebar />
        </Box>

        {/* Main Content - 11/12 */}
        <Box
          component="main"
          sx={{ 
            flexGrow: 1,
            width: { md: '92.667%' },
            backgroundColor: '#f4edf8',
            mt: { xs: 8, md: 0 }
          }}
        >

        <Paper
          elevation={0}
          sx={{
            display: { xs: 'none', md: 'block' },
            p: 1,
            backgroundColor: '#091a48',
            borderBottom: '1px solid',
            borderColor: 'divider',
            borderRadius: 0
          }}
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            
            <Typography variant="h6" sx={{ color:'#fff' }}>
              <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              sx={{ mr: 2, color:'#fff' }}
            >
              <ArrowLeftIcon />
            </IconButton>
              Create Post
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="large" sx={{ color:'#fff' }}>
                <NotificationsIcon />
              </IconButton>
              <IconButton size="large" sx={{ color:'#fff' }}>
                <AccountCircleIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>

          {/* Content Container */}
          <Container maxWidth={false} sx={{ py: 2,height: '100vh', overflow: 'hidden !important', px: { xs: 2, sm: 3 } }}>
            <Grid container spacing={2}>

            {/* Left Side */}
        <Grid item xs={12} md={6} sx={{bgcolor:'#fff', padding:'10px', boxShadow: '2px 2px 2px 1px rgb(0 0 0 / 20%)', }}>
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
            <Select
                
                labelId="icon-select-label"
                id="icon-select"
                value={selectedOption}
                label="Select an Option"
                onChange={handleOptionChange}
                sx={{ width: 300, height: 40 }} 
              >
                {pages.map((user, i) => (
                <MenuItem value={user.name}>
                  <Avatar alt={user.name} src={user.picture_url} sx={{width:25,height:25, display:'flex'}}/><Typography sx={{textAlign: 'left',
    position: 'absolute',top: '7px',left:' 15%'}}> {user.name}</Typography>
                </MenuItem>
                ))}
              </Select>
          </Box>

          {/* User Chips */}
          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            {selectedOption && (
              <Chip
                //key={i}
                //avatar={<Avatar alt={user.name} src={user.picture_url}>{user.name}</Avatar>}
                avatar={selectedOption}
                label={selectedOption}
                //onClick={() => handleAvatarClick(socialID.social_id)}
                onDelete={() => {}}
              />
            )}

            {selectedPages.includes(pages.social_id) && (
              <Box
                sx={{
                  position:'relative',
                  top:'5px',
                  right:'7px',
                  background: "white",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  alignItems: "center",
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{
                    color: "#5ebfa6",
                    fontSize: 20,
                    width: 20,
                    height: 20
                  }}
                />
              </Box>
            )}
            
          </Box>

          {/* Text Field */}
          <Editor value={postContent} onChange={setPostContent} />

          <Typography variant="caption" display="block" mb={2}>
            275 characters left
          </Typography>

          {/* Uploaded Images */}
          <Box display="flex" gap={1} mb={2}>
            {/* {file.map((img, i) => ( */}
              <Box  position="relative">
                <Avatar
                  variant="rounded"
                  src={uploadedImageUrl}
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
            {/* ))} */}
           
          </Box>

            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              sx={{
                //width: "100%",
                padding: "16px",
                border: "1px dashed #ccc",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                textAlign: "center",
                cursor: "pointer",
                my: 2,
                margin: "10px",
                marginLeft: "0px",
              }}
              onClick={handleBoxClick}
              onDrop={handleDrop} // ✅ Handles dropped files
              onDragOver={(e) => e.preventDefault()} // ✅ Prevents default drag behavior
            >


              <Typography variant="body1" sx={{ color: "#666",  }}>
                 +  Upload Media
              </Typography>

              {uploadedFileName && (
                <Typography variant="body2" sx={{ color: "#444", mt: 1, whiteSpace: "nowrap", // ✅ Ensures text does not wrap
                  overflow: "hidden", // ✅ Hides overflow text
                  textOverflow: "ellipsis",    maxWidth: "400px", }}>
                  Selected File: {uploadedFileName}
                </Typography>
              )}

              {uploading && <Typography variant="body2">Uploading...</Typography>}
            </Box>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

          {/* Buttons */}
          <Box display="flex" gap={2}>
            <Button variant="outlined" sx={{color:'#000', border:'2px solid #7F56D9'}} >Save as Draft</Button>
            {/* <Button variant="contained" sx={{bgcolor:'#7F56D9', color:'#fff' }}>Schedule Post</Button> */}
            <Button
              variant="contained"
              sx={{
                margin: "0.09375rem 1px",
                //mb: 2,
                bgcolor:'#7F56D9', 
                color:'#fff',
                "&:hover": {
                  backgroundColor: "#00b3ad !important", // Slightly darker on hover
                },
              }}
              onClick={()=> draftModelOpen("schedule")}
            >
              Schedule Post
            </Button>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handlePublish}
            sx={{ mt: 2, bgcolor:'#7F56D9', color:'#fff' }}
          >
            Publish Now
          </Button>
        </Grid>

        {/* Right Side - Preview */}
        <Grid item xs={12} md={6} lg={6} xl={12} sx={{ bgcolor: '#fff', padding: '10px', boxShadow: '2px 2px 2px 1px rgb(0 0 0 / 20%)'}}>
          {/* <TabComponent tabs={tabs} defaultIndex={0} /> */}
          
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
              
              <Tab label="Instagram" />
              <Tab label="Linkedin" />
              <Tab label="Facebook" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
            <Grid item xs={12} md={12} lg={12}>
              <Card sx={{ borderRadius: 2 }}>
               {!uploadedImageUrl || !postContent ? (
                <Skeleton animation="wave" variant="circular" width={100} height={100} sx={{display:'block', margin:'auto'}}/>
              ) : (
                <Avatar src={uploadedImageUrl} alt="Uploaded" sx={{ width: 300, height: 300 }} />
              )}
                <CardContent>
                {uploadedImageUrl && postContent && (
                    <Typography variant="body2" color="text.secondary" sx={{ display: "flex",}}>
                  <span
                    dangerouslySetInnerHTML={{ __html: postContent }} // Render the HTML content
                  />
                </Typography>
                )}
                  

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
                      {selectUser.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Just Now
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
             this is Linkedin section
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              this is Facebook section
            </TabPanel>
    

        </Grid>
              
          
            </Grid>

            {/* Modal for Adding Account */}
      <Modal
        open={openDateTimePicker}
        onClose={() => setOpenDateTimePicker(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }} 
        >
          <h6 >Select a predefined timeslot</h6>
          <Flatpickr
          options={{
            inline: true,
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            time_24hr: true,
            defaultDate: selectedDateTime,
          }}
            value={selectedDateTime}
            onChange={([date]) => {
              console.log("raw date:", date);
       
              console.log("ISO:", date.toISOString());
              setSelectedDateTime(date)

            }}
          />
       
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginTop: "20px" }}>
            <Button variant="outlined" 
            sx={{
              margin: "0.09375rem 1px",
              mb: 2,
              border: "1px solid #01cbc6",
              backgroundColor: "transprant !important", // Ensures background color applies
              color: "#01cbc6 !important", // ✅ Forces white text
              "&:hover": {
                border: "1px solid #00b3ad",
                backgroundColor: "#transprant !important", // Slightly darker on hover
              },
            }}
            onClick={() => setOpenDateTimePicker(false)}>
              Cancel
            </Button>
            <Button variant="gradient"
            onClick={draftHandler}
              sx={{
                margin: "0.09375rem 1px",
                mb: 2,
                backgroundColor: "#01cbc6 !important", // Ensures background color applies
                color: "white !important", // ✅ Forces white text
                "&:hover": {
                  backgroundColor: "#00b3ad !important", // Slightly darker on hover
                },
              }}>
              Save
            </Button>
          </Box>

        </Box>
      </Modal>
          </Container>
        </Box>
      </Box>
    
    
      </>
           
   
  );
};

export default CreatePost;
