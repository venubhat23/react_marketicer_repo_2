import React,{useEffect, useState} from 'react'
import PlusCircleIcon from "@mui/icons-material/AddCircle";
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarIcon from "@mui/icons-material/CalendarMonth";
import FileTextIcon from "@mui/icons-material/Description";
import GridIcon from "@mui/icons-material/GridView";
import HomeIcon from "@mui/icons-material/Home";
import ChevronDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GlobeIcon from "@mui/icons-material/Language";
import MessageSquareIcon from "@mui/icons-material/Message";
import FilePlusIcon from "@mui/icons-material/NoteAdd";
import UserPlusIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Paper,
  Stack,
  Toolbar,
  Typography,
  Modal, Grid,
} from "@mui/material";
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon, } from '@mui/icons-material';
import SocialConnect from './SocialConnect';
import SocialDisConnect from './SocialDisConnect';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import axios from "axios";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const SocialMedia =()=>{
  const socialAccountss = [
    {
      id: 1,
      platform: "LinkedIn",
      icon: "https://c.animaapp.com/mayvvv0wua9Y41/img/avatar.png",
      users: [
        {
          name: "John Johnson",
          avatar: "https://c.animaapp.com/mayvvv0wua9Y41/img/ellipse-125-1.png",
          status: "Active",
        },
        {
          name: "Marketincer",
          avatar: "https://c.animaapp.com/mayvvv0wua9Y41/img/ellipse-125-1.png",
          status: "Active",
        },
      ],
    },
    {
      id: 2,
      platform: "Instagram",
      icon: "https://c.animaapp.com/mayvvv0wua9Y41/img/avatar-1.png",
      user: {
        name: "John Johnson",
        username: "@johnjohnson",
        avatar: "https://c.animaapp.com/mayvvv0wua9Y41/img/ellipse-125-2.png",
        status: "Active",
      },
    },
    {
      id: 3,
      platform: "YouTube",
      icon: "https://c.animaapp.com/mayvvv0wua9Y41/img/avatar-2.png",
      user: {
        name: "John Johnson",
        username: "@itsjohn",
        avatar: "https://c.animaapp.com/mayvvv0wua9Y41/img/ellipse-125-3.png",
        status: "Active",
      },
    },
    {
      id: 4,
      platform: "TikTok",
      icon: "https://c.animaapp.com/mayvvv0wua9Y41/img/avatar-3.png",
      user: {
        name: "John Johnson",
        username: "@johnjohnson",
        avatar: "https://c.animaapp.com/mayvvv0wua9Y41/img/ellipse-125-4.png",
        status: "Active",
      },
    },
  ];

  const icons = {
    "linkedin": {
      "name": "LinkedIn",
      "icon":"https://c.animaapp.com/mayvvv0wua9Y41/img/avatar.png",
    },
    "instagram": {
      "name": "Instagram",
      "icon":"https://c.animaapp.com/mayvvv0wua9Y41/img/avatar-1.png",
    },
  }

  const [openConnect, setOpenConnect] = useState(false);
  const [openInstaConnect, setOpenInstaConnect] = useState(false);
  const [open, setOpen] = useState(false)
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleConnectOpen = () => {setOpenConnect(true)};
  const handleInstaConnectOpen = () => {setOpenInstaConnect(true)};

  const handleDisconnectOpen=(user)=>{
    setSelectedUser(user);
    setOpen(true);
  }
  
  const handleClose = () => setOpen(false);

  const handleConnectClose=() => setOpenConnect(false)
  const handleInstaConnectClose=() => setOpenInstaConnect(false)

  const getAccounts = async () => {
    try {
      const res = await axios.get("https://api.marketincer.com/api/v1/social_pages/connected_pages", {
        headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
      });
      console.log("Response from API:", res);
      let accounts = res?.data?.data?.accounts;
      console.log(("Fetched accounts:", accounts));
      accounts = accounts?.map((account) => {
        let new_account = {}
        // Map the fetched accounts to the desired structure
        new_account['id'] = account.id;
        new_account['platform'] = icons[account.page_type].name;
        new_account['icon'] = icons[account.page_type].icon;
        new_account['users'] = [{
          id: account.id,
          social_account_id: account.social_account_id,
          name: account.name,
          username: account.username,
          avatar: account.picture_url,
          status: "Active",
        }]
        return new_account;
      });
      setSocialAccounts(socialAccounts => [...socialAccounts, ...accounts]);
      console.log("Mapped accounts:", accounts);
      // navigate('/dashboard');
      
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get("code");
  const authState = urlParams.get("state");

  useEffect(() => { 
    // Fetch social media accounts data if needed
    // This is a placeholder for any data fetching logic
    console.log("Auth Code:", authCode);
    console.log("Auth State:", authState);
    if (authCode) {
      // Handle the authentication code and state
      if(authState) {
        setOpenConnect(true);
      } else {
        setOpenInstaConnect(true);
      }
      // You can call your API to exchange the code for tokens here
    } else {
      getAccounts();
    }
  }, []);

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', height: '100vh' }}>
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

              <Typography variant="h6" sx={{ color: '#fff' }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="back"
                  sx={{ mr: 2, color: '#fff' }}
                >
                  <ArrowLeftIcon />
                </IconButton>
                Social Media Accounts
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="large" sx={{ color: '#fff' }}>
                  <NotificationsIcon />
                </IconButton>
                <IconButton size="large" sx={{ color: '#fff' }}>
                  <AccountCircleIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
          <Box
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Title */}
          <Box sx={{ textAlign: "center", mb: 2, maxWidth: 600 }}>
            <Typography variant="h5" gutterBottom>
              Manage Your Social Media Accounts
            </Typography>
            <Typography variant="body1">
              Connect your social media accounts to manage your presence and
              collaborations seamlessly.
            </Typography>
          </Box>

     

          {/* Accounts List */}
          <Paper
            sx={{
              width: "100%",
              maxWidth: 958,
              p: 3,
              borderRadius: 2,
              border: "1px solid #a1a1a1",
            }}
          >

            <Typography variant="h6" sx={{ mb: 2, ml: 2, textAlign: "start" }}>
              Connected Accounts List
            </Typography>

            <Stack spacing={2}>
              {/* LinkedIn Account */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid #d2d2d2",
                  borderRadius: 4,
                  boxShadow: "2px 2px 4px rgba(0,0,0,0.06)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar
                    src={icons["linkedin"].icon}
                    sx={{ width: 41, height: 41, mr: 2 }} />
                  <Typography variant="h6">LinkedIn</Typography>
                  <IconButton sx={{ ml: 1 }}>
                    <ChevronDownIcon />
                  </IconButton>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button
                    variant="contained"
                    onClick={handleConnectOpen}
                    sx={{
                      width:'15%',
                      mr: 2,
                    }}
                  >
                    Connect
                  </Button>
                  <Modal open={openConnect} onClose={handleConnectClose}>
                    <Box sx={style}>
                      <SocialConnect onClose={handleConnectClose} authCode={authCode} authState={authState} socialMediaType="Linkedin"/>
                    </Box>
                  </Modal>

                  {/* <Button
      variant="contained"
      onClick={handleDisconnectOpen}
      sx={{
        bgcolor: "#d92c20",
        borderColor: "#d92c20",
        "&:hover": { bgcolor: "#b82318" },
      }}
    >
      Disconnect
    </Button> */}
                  <Modal open={open} onClose={handleClose}>
                    <Box sx={style}>
                      <SocialDisConnect onClose={handleClose} account={selectedUser} getAccounts={getAccounts} />
                    </Box>
                  </Modal>
                </Box>

                <Stack spacing={2} sx={{ ml: 2 }}>
                  {socialAccounts?.filter(account => account.platform == "LinkedIn")?.map(account => account.users.map((user, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Avatar
                        src={user.avatar}
                        sx={{ width: 34, height: 34, mr: 2 }} />
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {user.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={user.status}
                          sx={{
                            color: "#21d548",
                            bgcolor: "white",
                            border: "0.5px solid #21d548",
                            textAlign: 'start',
                            height: 20,
                            "& .MuiChip-label": { px: 1 },
                          }}
                          icon={<Box
                            sx={{
                              width: 6,
                              height: 6,
                              bgcolor: "#21d548",
                              borderRadius: "50%",
                              //ml: 0.5,
                            }} />} />
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => handleDisconnectOpen(user)}
                        sx={{
                          ml: "auto",
                          width:'15%',
                          bgcolor: "#882AFF",
                          "&:hover": { bgcolor: "#7625e6" },
                        }}
                      >
                        Disconnect
                      </Button>
                    </Box>
                  )))}
                </Stack>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid #d2d2d2",
                  borderRadius: 4,
                  boxShadow: "2px 2px 4px rgba(0,0,0,0.06)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar
                    src={icons["instagram"].icon}
                    sx={{ width: 30, height: 30, mr: 2 }} />
                  <Typography variant="h6">Instagram</Typography>
                  <IconButton sx={{ ml: 1 }}>
                    <ChevronDownIcon />
                  </IconButton>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button
                    variant="contained"
                    onClick={handleInstaConnectOpen}
                    sx={{
                      width:'15%',
                    }}
                  >
                    Connect
                  </Button>
                  <Modal open={openInstaConnect} onClose={handleInstaConnectClose}>
                    <Box sx={style}>
                      <SocialConnect onClose={handleInstaConnectClose} authCode={authCode} authState={authState} socialMediaType="Instagram"/>
                    </Box>
                  </Modal>

                  {/* <Button
      variant="contained"
      onClick={handleDisconnectOpen}
      sx={{
        bgcolor: "#d92c20",
        borderColor: "#d92c20",
        "&:hover": { bgcolor: "#b82318" },
      }}
    >
      Disconnect
    </Button> */}
                  {/* <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <SocialDisConnect onClose={handleClose}/>
      </Box>
    </Modal> */}
                </Box>

                <Stack spacing={2} sx={{ ml: 2 }}>
                  {socialAccounts?.filter(account => account.platform == "Instagram")?.map(account => account.users.map((user, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Avatar
                        src={user.avatar}
                        sx={{ width: 34, height: 34, mr: 2 }} />
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {user.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={user.status}
                          sx={{
                            color: "#21d548",
                            bgcolor: "white",
                            border: "0.5px solid #21d548",
                            height: 20,
                            "& .MuiChip-label": { px: 1 },
                          }}
                          icon={<Box
                            sx={{
                              width: 6,
                              height: 6,
                              bgcolor: "#21d548",
                              borderRadius: "50%",
                              //ml: 0.5,
                              mr:'auto'
                            }} />} />
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => handleDisconnectOpen(user)}
                        sx={{
                          ml: "auto",
                          width:'15%',
                          bgcolor: "#882AFF",
                          "&:hover": { bgcolor: "#7625e6" },
                        }}
                      >
                        Disconnect
                      </Button>
                    </Box>
                  )))}
                </Stack>
              </Paper>

              {/* Other Social Media Accounts */}
              {/* {socialAccounts.map((account) => (
      <Paper
        key={account.id}
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid #d2d2d2",
          borderRadius: 4,
          boxShadow: "2px 2px 4px rgba(0,0,0,0.06)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={account.user.avatar}
            sx={{ width: 50, height: 50, mr: 2 }}
          />
          <Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" fontWeight={500}>
                {account.user.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                {account.user.username}
              </Typography>
              <Avatar
                src={account.icon}
                sx={{
                  width: 31,
                  height: 31,
                  ml: 2,
                  border: "0.5px solid #d6bbfb",
                }}
              />
            </Box>
            <Chip
              size="small"
              label={account.user.status}
              sx={{
                color: "#21d548",
                bgcolor: "white",
                border: "0.5px solid #21d548",
                height: 20,
                mt: 0.5,
                "& .MuiChip-label": { px: 1 },
              }}
              icon={
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    bgcolor: "#21d548",
                    borderRadius: "50%",
                    ml: 0.5,
                  }}
                />
              }
            />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="outlined"
            sx={{
              color: "#21d548",
              borderColor: "#21d548",
              mr: 2,
              "&:hover": {
                borderColor: "#1bb33e",
                bgcolor: "rgba(33, 213, 72, 0.04)",
              },
            }}
          >
            Connect
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#d92c20",
              borderColor: "#d92c20",
              "&:hover": { bgcolor: "#b82318" },
            }}
          >
            Disconnect
          </Button>
        </Box>
      </Paper>
    ))}*/}
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Layout>
  )
}

export default SocialMedia