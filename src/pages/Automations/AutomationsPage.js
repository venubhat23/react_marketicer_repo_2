import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  Switch,
  IconButton,
  Chip,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Home as HomeIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AutoMode as AutoModeIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { Link, useNavigate } from 'react-router-dom';

const AutomationsPage = () => {
  const navigate = useNavigate();
  const [automations, setAutomations] = useState([
    {
      id: 1,
      name: 'Daily AI & Fundraising Posts',
      description: 'Share a daily article from https://news.google.com/home?hl=en-US&gl=US&ceid=US:en',
      frequency: 'Daily',
      lastRun: '44 minutes ago',
      status: 'active',
      isEnabled: true
    }
  ]);

  const [stats, setStats] = useState({
    totalAutomations: 1,
    activeAutomations: 1,
    successRate: 100
  });

  const handleToggleAutomation = (id) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === id 
        ? { ...automation, isEnabled: !automation.isEnabled, status: automation.isEnabled ? 'inactive' : 'active' }
        : automation
    ));
  };

  const handleViewRuns = () => {
    navigate('/automations/runs');
  };

  const handleCreateAutomation = () => {
    navigate('/automations/create');
  };

  const handleEditAutomation = (automation) => {
    navigate('/automations/create', { 
      state: { 
        editMode: true, 
        automationData: automation 
      } 
    });
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
      <Grid container>
        <Grid size={{ md: 1 }} className="side_section">
          <Sidebar />
        </Grid>
        <Grid size={{ md: 11 }}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              p: 1,
              backgroundColor: '#091a48',
              borderRadius: 0,
              color: 'white'
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
                Automations
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <IconButton size="large" sx={{ color: 'white' }}>
                  <NotificationsIcon />
                </IconButton>
                <Link to="/SettingPage">
                  <IconButton size="large" sx={{ color: '#fff' }}>
                    <AccountCircleIcon />
                  </IconButton>
                </Link>
              </Box>
            </Box>
          </Paper>

          {/* Action Buttons */}
          <Box sx={{ p: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateAutomation}
              sx={{
                bgcolor: '#000',
                color: 'white',
                borderRadius: '50px',
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#333'
                }
              }}
            >
              Create Automation
            </Button>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={handleViewRuns}
              sx={{
                borderColor: '#666',
                color: '#666',
                borderRadius: '50px',
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#333',
                  bgcolor: '#f5f5f5'
                }
              }}
            >
              View Runs
            </Button>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ p: 3, pt: 0 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                      bgcolor: '#e3f2fd',
                      borderRadius: 2,
                      p: 1,
                      mr: 2
                    }}>
                      <AutoModeIcon sx={{ color: '#1976d2' }} />
                    </Box>
                    <Typography variant="h6" sx={{ color: '#666' }}>
                      Total Automations
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.totalAutomations}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Across all integrations
                  </Typography>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                      bgcolor: '#e8f5e8',
                      borderRadius: 2,
                      p: 1,
                      mr: 2
                    }}>
                      <CheckCircleIcon sx={{ color: '#4caf50' }} />
                    </Box>
                    <Typography variant="h6" sx={{ color: '#666' }}>
                      Active Automations
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.activeAutomations}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Currently running
                  </Typography>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                      bgcolor: '#f3e5f5',
                      borderRadius: 2,
                      p: 1,
                      mr: 2
                    }}>
                      <TrendingUpIcon sx={{ color: '#882AFF' }} />
                    </Box>
                    <Typography variant="h6" sx={{ color: '#666' }}>
                      Success Rate
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.successRate}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Average across all automations
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Your Automations Section */}
          <Box sx={{ p: 3, pt: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#333' }}>
              Your Automations
            </Typography>

            <Grid container spacing={3}>
              {automations.map((automation) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={automation.id}>
                  <Card sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'white',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    position: 'relative'
                  }}>
                    {/* Header with icon and switch */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{
                          bgcolor: '#e3f2fd',
                          borderRadius: 2,
                          p: 1,
                          mr: 2
                        }}>
                          <AutoModeIcon sx={{ color: '#1976d2' }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {automation.name}
                        </Typography>
                      </Box>
                      <Switch
                        checked={automation.isEnabled}
                        onChange={() => handleToggleAutomation(automation.id)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#4caf50',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#4caf50',
                          },
                        }}
                      />
                    </Box>

                    {/* Description */}
                    <Typography variant="body2" sx={{ color: '#666', mb: 2, lineHeight: 1.4 }}>
                      {automation.description}
                    </Typography>

                    {/* Frequency and Last Run */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ScheduleIcon sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {automation.frequency}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 500 }}>
                        $ Last run: {automation.lastRun}
                      </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: '#e8f5e8',
                          color: '#4caf50',
                          '&:hover': { bgcolor: '#d4edda' }
                        }}
                      >
                        <PlayIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: '#fff3cd',
                          color: '#856404',
                          '&:hover': { bgcolor: '#ffeaa7' }
                        }}
                      >
                        <PauseIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditAutomation(automation)}
                        sx={{
                          bgcolor: '#e3f2fd',
                          color: '#1976d2',
                          '&:hover': { bgcolor: '#bbdefb' }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: '#ffebee',
                          color: '#d32f2f',
                          '&:hover': { bgcolor: '#ffcdd2' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AutomationsPage;