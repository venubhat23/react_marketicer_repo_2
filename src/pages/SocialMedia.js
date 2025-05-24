import React,{useState} from 'react'
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
  Modal
} from "@mui/material";
import SocialConnect from './SocialConnect';
import SocialDisConnect from './SocialDisConnect';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

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
  const socialAccounts = [
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

  const [openConnect, setOpenConnect] = useState(false);
  const [open, setOpen] = useState(false)

  const handleConnectOpen = () => {setOpenConnect(true)};

  const handleDisconnectOpen=()=>{setOpen(true)}
  
  const handleClose = () => setOpen(false);

  const handleConnectClose=() => setOpenConnect(false)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Sidebar/>
      <Navbar/>
        {/* Header */}
        {/* <AppBar
          position="static"
          sx={{ bgcolor: "#091a48", boxShadow: "none" }}
        >
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
              Social Media Accounts
            </Typography>
          </Toolbar>
        </AppBar> */}

        {/* Content */}
        <Box
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Title */}
          <Box sx={{ textAlign: "center", mb:2, maxWidth: 600 }}>
            <Typography variant="h5" gutterBottom>
              Manage Your Social Media Accounts
            </Typography>
            <Typography variant="body1">
              Connect your social media accounts to manage your presence and
              collaborations seamlessly.
            </Typography>
          </Box>

          {/* Connect New Account Button */}
          <Box sx={{ alignSelf: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#7e56d8",
                borderColor: "#7e56d8",
                "&:hover": { bgcolor: "#6a46c0" },
                left:'-42%'
                // px: 1,
                // py: 1,
              }}
            >
              Connect New Account
            </Button>
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
            
            <Typography variant="h6" sx={{ mb: 2 }}>
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
                    src={socialAccounts[0].icon}
                    sx={{ width: 41, height: 41, mr: 2 }}
                  />
                  <Typography variant="h6">LinkedIn</Typography>
                  <IconButton sx={{ ml: 1 }}>
                    <ChevronDownIcon />
                  </IconButton>
                  <Box sx={{ flexGrow: 1 }} />
                  <Button
                    variant="outlined"
                    onClick={handleConnectOpen}
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
                  <Modal open={openConnect} onClose={handleConnectClose}>
                    <Box sx={style}>
                      <SocialConnect />
                    </Box>
                  </Modal>

                  <Button
                    variant="contained"
                    onClick={handleDisconnectOpen}
                    sx={{
                      bgcolor: "#d92c20",
                      borderColor: "#d92c20",
                      "&:hover": { bgcolor: "#b82318" },
                    }}
                  >
                    Disconnect
                  </Button>
                  <Modal open={open} onClose={handleClose}>
                    <Box sx={style}>
                      <SocialDisConnect />
                    </Box>
                  </Modal>
                </Box>

                <Stack spacing={2} sx={{ ml: 2 }}>
                  {socialAccounts[0].users.map((user, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Avatar
                        src={user.avatar}
                        sx={{ width: 34, height: 34, mr: 2 }}
                      />
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
                    </Box>
                  ))}
                </Stack>
              </Paper>

              {/* Other Social Media Accounts */}
              {socialAccounts.slice(1).map((account) => (
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
              ))}
            </Stack>
          </Paper>
        </Box>
       
      </Box>
  )
}

export default SocialMedia