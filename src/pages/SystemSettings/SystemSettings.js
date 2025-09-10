import React, { useState } from 'react';
import SystemSettingsLayout from './SystemSettingsLayout';
import RolesPermissions from './RolesPermissions';
import CreateUser from './CreateUser';
import UserManagement from './UserManagement';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Alert, Button 
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  History as HistoryIcon
} from '@mui/icons-material';

// Placeholder components for remaining tabs
const SystemSettingsTab = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <SettingsIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
    <Typography variant="h5" color="textSecondary" gutterBottom>
      System Settings
    </Typography>
    <Typography variant="body1" color="textSecondary">
      Configure system-wide preferences and configurations
    </Typography>
    <Alert severity="info" sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
      This module is under development
    </Alert>
  </Box>
);

const NotificationSettings = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <NotificationsIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
    <Typography variant="h5" color="textSecondary" gutterBottom>
      Notification Settings
    </Typography>
    <Typography variant="body1" color="textSecondary">
      Manage email, SMS and in-app notification preferences
    </Typography>
    <Alert severity="info" sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
      This module is under development
    </Alert>
  </Box>
);

const AuditLogs = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <HistoryIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
    <Typography variant="h5" color="textSecondary" gutterBottom>
      Audit Logs
    </Typography>
    <Typography variant="body1" color="textSecondary">
      View system activity logs and user actions
    </Typography>
    <Alert severity="info" sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
      This module is under development
    </Alert>
  </Box>
);

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('roles-permissions');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'roles-permissions':
        return <RolesPermissions />;
      case 'create-user':
        return <CreateUser />;
      case 'user-management':
        return <UserManagement />;
      case 'system-settings':
        return <SystemSettingsTab />;
      case 'notification-settings':
        return <NotificationSettings />;
      case 'audit-logs':
        return <AuditLogs />;
      default:
        return <RolesPermissions />;
    }
  };

  return (
    <SystemSettingsLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {renderContent()}
    </SystemSettingsLayout>
  );
};

export default SystemSettings;