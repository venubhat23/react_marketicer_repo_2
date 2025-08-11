import React, { useState } from 'react';
import {
  Box, Grid, Paper, List, ListItem, ListItemIcon, ListItemText,
  Typography, Divider, useTheme, useMediaQuery
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  PersonAdd as PersonAddIcon,
  Notifications as NotificationsIcon,
  History as HistoryIcon,
  SupervisorAccount as SupervisorAccountIcon
} from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';

const SystemSettingsLayout = ({ children, activeTab, onTabChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const settingsMenuItems = [
    {
      id: 'roles-permissions',
      label: 'Roles & Permissions',
      icon: <SecurityIcon />,
      description: 'Manage user roles and module access'
    },
    {
      id: 'create-user',
      label: 'Create User',
      icon: <PersonAddIcon />,
      description: 'Add new users to the system'
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: <SupervisorAccountIcon />,
      description: 'View and manage existing users'
    },
    {
      id: 'system-settings',
      label: 'System Settings',
      icon: <SettingsIcon />,
      description: 'Configure system preferences'
    },
    {
      id: 'notification-settings',
      label: 'Notification Settings',
      icon: <NotificationsIcon />,
      description: 'Manage notification preferences'
    },
    {
      id: 'audit-logs',
      label: 'Audit Logs',
      icon: <HistoryIcon />,
      description: 'View system activity logs'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', minHeight: '100vh' }}>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={2} md={2} lg={1} className="side_section">
          <Sidebar />
        </Grid>
        <Grid item xs={12} sm={10} md={10} lg={11}>
          {/* Header */}
          <Paper
            elevation={0}
            sx={{
              display: { xs: 'none', md: 'block' },
              p: 2,
              backgroundColor: '#091a48',
              borderBottom: '1px solid',
              borderColor: 'divider',
              borderRadius: 0
            }}
          >
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
              System Settings
            </Typography>
            <Typography variant="body2" sx={{ color: '#fff', opacity: 0.8, mt: 0.5 }}>
              Manage roles, permissions, users and system configurations
            </Typography>
          </Paper>

          <Box sx={{ 
            flexGrow: 1, 
            mt: { xs: 8, md: 0 }, 
            padding: { xs: '10px', sm: '15px', md: '20px' },
            maxWidth: '100%'
          }}>
            <Grid container spacing={3}>
              {/* Settings Menu */}
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
                  <Box sx={{ p: 2, bgcolor: '#882AFF', color: 'white' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Settings Menu
                    </Typography>
                  </Box>
                  <List sx={{ p: 0 }}>
                    {settingsMenuItems.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <ListItem
                          button
                          selected={activeTab === item.id}
                          onClick={() => onTabChange(item.id)}
                          sx={{
                            py: 2,
                            '&.Mui-selected': {
                              backgroundColor: '#f3e8ff',
                              borderRight: '4px solid #882AFF',
                              '& .MuiListItemIcon-root': {
                                color: '#882AFF'
                              },
                              '& .MuiListItemText-primary': {
                                color: '#882AFF',
                                fontWeight: 'bold'
                              }
                            },
                            '&:hover': {
                              backgroundColor: '#f8f9fa'
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.label}
                            secondary={!isMobile ? item.description : null}
                            primaryTypographyProps={{
                              fontSize: '0.95rem'
                            }}
                            secondaryTypographyProps={{
                              fontSize: '0.8rem'
                            }}
                          />
                        </ListItem>
                        {index < settingsMenuItems.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Grid>

              {/* Content Area */}
              <Grid item xs={12} md={9}>
                <Paper sx={{ 
                  minHeight: 600, 
                  borderRadius: 2,
                  overflow: 'hidden'
                }}>
                  {children}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemSettingsLayout;