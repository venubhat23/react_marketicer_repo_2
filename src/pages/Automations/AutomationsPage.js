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
              <Typography variant="subtitle1" sx={{ color: '#fff', fontSize: '16px' }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="back"
                  sx={{ mr: 1, color: '#fff' }}
                  size="small"
                >
                  <ArrowLeftIcon fontSize="small" />
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
          <Box sx={{ p: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon fontSize="small" />}
              onClick={handleCreateAutomation}
              size="small"
              sx={{
                bgcolor: '#000',
                color: 'white',
                borderRadius: '20px',
                px: 2,
                py: 0.5,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '12px',
                '&:hover': {
                  bgcolor: '#333'
                }
              }}
            >
              Create Automation
            </Button>
            <Button
              variant="outlined"
              startIcon={<HomeIcon fontSize="small" />}
              onClick={handleViewRuns}
              size="small"
              sx={{
                borderColor: '#666',
                color: '#666',
                borderRadius: '20px',
                px: 2,
                py: 0.5,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '12px',
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
          <Box sx={{ p: 2, pt: 0 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{
                      bgcolor: '#e3f2fd',
                      borderRadius: 1,
                      p: 0.5,
                      mr: 1
                    }}>
                      <AutoModeIcon sx={{ color: '#1976d2', fontSize: '16px' }} />
                    </Box>
                    <Typography variant="body1" sx={{ color: '#666', fontSize: '12px', fontWeight: 500 }}>
                      Total Automations
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, fontSize: '20px' }}>
                    {stats.totalAutomations}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666', fontSize: '10px' }}>
                    Across all integrations
                  </Typography>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{
                      bgcolor: '#e8f5e8',
                      borderRadius: 1,
                      p: 0.5,
                      mr: 1
                    }}>
                      <CheckCircleIcon sx={{ color: '#4caf50', fontSize: '16px' }} />
                    </Box>
                    <Typography variant="body1" sx={{ color: '#666', fontSize: '12px', fontWeight: 500 }}>
                      Active Automations
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, fontSize: '20px' }}>
                    {stats.activeAutomations}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666', fontSize: '10px' }}>
                    Currently running
                  </Typography>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{
                      bgcolor: '#f3e5f5',
                      borderRadius: 1,
                      p: 0.5,
                      mr: 1
                    }}>
                      <TrendingUpIcon sx={{ color: '#882AFF', fontSize: '16px' }} />
                    </Box>
                    <Typography variant="body1" sx={{ color: '#666', fontSize: '12px', fontWeight: 500 }}>
                      Success Rate
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, fontSize: '20px' }}>
                    {stats.successRate}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666', fontSize: '10px' }}>
                    Average across all automations
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Your Automations Section */}
          <Box sx={{ p: 2, pt: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#333', fontSize: '16px' }}>
              Your Automations
            </Typography>

            <Grid container spacing={2}>
              {automations.map((automation) => (
                <Grid size={{ xs: 12, md: 6, lg: 4 }} key={automation.id}>
                  <Card sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'white',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    position: 'relative'
                  }}>
                    {/* Header with icon and switch */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{
                          bgcolor: '#e3f2fd',
                          borderRadius: 1,
                          p: 0.5,
                          mr: 1
                        }}>
                          <AutoModeIcon sx={{ color: '#1976d2', fontSize: '16px' }} />
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '14px' }}>
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
                    <Typography variant="caption" sx={{ color: '#666', mb: 1.5, lineHeight: 1.3, fontSize: '11px', display: 'block' }}>
                      {automation.description}
                    </Typography>

                    {/* Frequency and Last Run */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ScheduleIcon sx={{ fontSize: 12, color: '#666', mr: 0.5 }} />
                      <Typography variant="caption" sx={{ color: '#666', fontSize: '11px' }}>
                        {automation.frequency}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 500, fontSize: '11px' }}>
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