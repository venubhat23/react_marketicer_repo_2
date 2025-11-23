import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Chat as ChatIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { Link, useNavigate } from 'react-router-dom';

const AutomationRuns = () => {
  const navigate = useNavigate();
  
  const [runs] = useState([
    {
      id: 1,
      automation: 'Daily AI & Fundraising Posts',
      description: 'Share a daily article from https://news.google.com/ho...',
      status: 'Success',
      created: 'about 1 hour ago',
      createdDate: 'Oct 10, 2025 at 5:56 AM',
      failureReason: null
    }
  ]);

  const getStatusChip = (status) => {
    const statusConfig = {
      'Success': { color: '#4caf50', bgcolor: '#e8f5e8' },
      'Failed': { color: '#f44336', bgcolor: '#ffebee' },
      'Running': { color: '#ff9800', bgcolor: '#fff3e0' },
      'Pending': { color: '#9e9e9e', bgcolor: '#f5f5f5' }
    };

    const config = statusConfig[status] || statusConfig['Pending'];

    return (
      <Chip
        label={status}
        size="small"
        sx={{
          color: config.color,
          bgcolor: config.bgcolor,
          fontWeight: 500,
          border: 'none',
          fontSize: '10px',
          height: '20px'
        }}
      />
    );
  };

  const handleBackToAutomations = () => {
    navigate('/automations');
  };

  const handleCreateAutomation = () => {
    navigate('/automations/create');
  };

  const handleEditRun = (run) => {
    // Navigate to edit the automation that created this run
    navigate('/automations/create', { 
      state: { 
        editMode: true, 
        automationData: {
          name: run.automation,
          description: run.description,
          // Add other relevant data as needed
        }
      } 
    });
  };

  const handleDeleteRun = (runId) => {
    if (window.confirm('Are you sure you want to delete this automation run?')) {
      // Implement delete logic here
      console.log('Deleting run:', runId);
      // You would typically make an API call to delete the run
    }
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
                  onClick={handleBackToAutomations}
                  sx={{ mr: 1, color: '#fff' }}
                  size="small"
                >
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
                Automation Runs
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

          {/* Page Title and Description */}
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#333', fontSize: '20px' }}>
              Automation Runs
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 2, fontWeight: 400, fontSize: '14px' }}>
              Monitor and track your automation execution history
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon fontSize="small" />}
                onClick={handleBackToAutomations}
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
                Back to Automations
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon fontSize="small" />}
                onClick={handleCreateAutomation}
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
                Create Automation
              </Button>
            </Box>
          </Box>

          {/* Runs Table */}
          <Box sx={{ p: 2 }}>
            <TableContainer 
              component={Paper} 
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: '11px', textTransform: 'uppercase', py: 1 }}>
                      AUTOMATION
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: '11px', textTransform: 'uppercase', py: 1 }}>
                      STATUS
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: '11px', textTransform: 'uppercase', py: 1 }}>
                      CREATED
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: '11px', textTransform: 'uppercase', py: 1 }}>
                      FAILURE REASON
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#666', fontSize: '11px', textTransform: 'uppercase', py: 1 }}>
                      ACTIONS
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {runs.map((run) => (
                    <TableRow 
                      key={run.id}
                      sx={{ 
                        '&:hover': { bgcolor: '#f8f9fa' },
                        borderBottom: '1px solid #e0e0e0'
                      }}
                    >
                      <TableCell sx={{ py: 1.5 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#333', mb: 0.3, fontSize: '13px' }}>
                            {run.automation}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666', fontSize: '11px' }}>
                            {run.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(run.status)}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#333', fontWeight: 500, fontSize: '12px', display: 'block' }}>
                            {run.created}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666', fontSize: '10px' }}>
                            {run.createdDate}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography variant="caption" sx={{ color: '#666', fontSize: '11px' }}>
                          {run.failureReason || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditRun(run)}
                            sx={{
                              color: '#882AFF',
                              '&:hover': {
                                bgcolor: 'rgba(136, 42, 255, 0.1)'
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteRun(run.id)}
                            sx={{
                              color: '#f44336',
                              '&:hover': {
                                bgcolor: 'rgba(244, 67, 54, 0.1)'
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              color: '#1976d2',
                              '&:hover': {
                                bgcolor: 'rgba(25, 118, 210, 0.1)'
                              }
                            }}
                          >
                            <ChatIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {runs.length === 0 && (
              <Box sx={{ 
                textAlign: 'center', 
                py: 8,
                bgcolor: 'white',
                borderRadius: 3,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                  No automation runs yet
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  Start by creating your first automation
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AutomationRuns;