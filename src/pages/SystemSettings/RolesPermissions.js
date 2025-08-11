import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Switch, FormControlLabel,
  Button, Alert, Snackbar, Chip, Divider, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import {
  Security as SecurityIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const RolesPermissions = () => {
  const [roles, setRoles] = useState([
    {
      id: 'super-admin',
      name: 'Super Admin',
      description: 'Full system access',
      color: '#f44336',
      isSystem: true
    },
    {
      id: 'support-admin',
      name: 'Support Admin',
      description: 'Support operations access',
      color: '#ff9800',
      isSystem: true
    },
    {
      id: 'finance-admin',
      name: 'Finance Admin',
      description: 'Financial operations access',
      color: '#4caf50',
      isSystem: true
    },
    {
      id: 'brand',
      name: 'Brand',
      description: 'Brand management access',
      color: '#2196f3',
      isSystem: true
    },
    {
      id: 'influencer',
      name: 'Influencer',
      description: 'Influencer platform access',
      color: '#9c27b0',
      isSystem: true
    }
  ]);

  const [modules] = useState([
    { id: 'create-post', name: 'Create Post', category: 'Content' },
    { id: 'calendar', name: 'Calendar', category: 'Planning' },
    { id: 'discover', name: 'Discover', category: 'Discovery' },
    { id: 'analytics', name: 'Analytics', category: 'Insights' },
    { id: 'social-media', name: 'Social Media', category: 'Social' },
    { id: 'social-monitoring', name: 'Social Monitoring', category: 'Social' },
    { id: 'contracts', name: 'Contracts', category: 'Legal' },
    { id: 'link', name: 'Link', category: 'Tools' },
    { id: 'marketplace-brand', name: 'Marketplace – Brand', category: 'Commerce' },
    { id: 'marketplace-influencer', name: 'Marketplace – Influencer', category: 'Commerce' },
    { id: 'invoice', name: 'Invoice', category: 'Finance' },
    { id: 'purchase-order', name: 'Purchase Order', category: 'Finance' }
  ]);

  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('super-admin');
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '', color: '#2196f3' });

  // Initialize permissions
  useEffect(() => {
    const initialPermissions = {};
    roles.forEach(role => {
      initialPermissions[role.id] = {};
      modules.forEach(module => {
        // Default permissions based on role
        if (role.id === 'super-admin') {
          initialPermissions[role.id][module.id] = true;
        } else if (role.id === 'support-admin') {
          initialPermissions[role.id][module.id] = !['marketplace-brand', 'marketplace-influencer'].includes(module.id);
        } else if (role.id === 'finance-admin') {
          initialPermissions[role.id][module.id] = ['analytics', 'contracts', 'invoice', 'purchase-order'].includes(module.id);
        } else if (role.id === 'brand') {
          initialPermissions[role.id][module.id] = !['marketplace-influencer', 'social-monitoring'].includes(module.id);
        } else if (role.id === 'influencer') {
          initialPermissions[role.id][module.id] = !['marketplace-brand', 'contracts', 'invoice', 'purchase-order'].includes(module.id);
        } else {
          initialPermissions[role.id][module.id] = false;
        }
      });
    });
    setPermissions(initialPermissions);
  }, [roles, modules]);

  const handlePermissionChange = (roleId, moduleId, enabled) => {
    setPermissions(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [moduleId]: enabled
      }
    }));
  };

  const handleSavePermissions = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Saving permissions:', permissions);
      
      toast.success('Permissions saved successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Failed to save permissions', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = () => {
    if (!newRole.name.trim()) return;
    
    const roleId = newRole.name.toLowerCase().replace(/\s+/g, '-');
    const role = {
      id: roleId,
      name: newRole.name,
      description: newRole.description,
      color: newRole.color,
      isSystem: false
    };
    
    setRoles(prev => [...prev, role]);
    setNewRole({ name: '', description: '', color: '#2196f3' });
    setShowAddRole(false);
    
    toast.success('Role created successfully!', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const getRolePermissionSummary = (roleId) => {
    const rolePermissions = permissions[roleId] || {};
    const enabledCount = Object.values(rolePermissions).filter(Boolean).length;
    return `${enabledCount}/${modules.length} modules`;
  };

  const groupedModules = modules.reduce((acc, module) => {
    if (!acc[module.category]) acc[module.category] = [];
    acc[module.category].push(module);
    return acc;
  }, {});

  return (
    <Box>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SecurityIcon sx={{ color: '#882AFF', fontSize: 28 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#091A48' }}>
                Roles & Permissions
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Manage role-based access control for system modules
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setShowAddRole(true)}
              sx={{ borderColor: '#882AFF', color: '#882AFF' }}
            >
              Add Role
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSavePermissions}
              disabled={loading}
              sx={{ 
                backgroundColor: '#882AFF',
                '&:hover': { backgroundColor: '#7a4dd3' }
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Role Selection */}
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Select Role to Configure
        </Typography>
        <Grid container spacing={2}>
          {roles.map(role => (
            <Grid item xs={12} sm={6} md={4} key={role.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedRole === role.id ? '2px solid #882AFF' : '1px solid #e0e0e0',
                  '&:hover': { boxShadow: 2 },
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Chip
                      label={role.name}
                      sx={{
                        backgroundColor: role.color,
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                    {!role.isSystem && (
                      <Box>
                        <IconButton size="small" sx={{ color: '#666' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#f44336' }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {role.description}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#882AFF', fontWeight: 'bold' }}>
                    {getRolePermissionSummary(role.id)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Permissions Configuration */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
          Configure Permissions for{' '}
          <Chip
            label={roles.find(r => r.id === selectedRole)?.name || 'Selected Role'}
            sx={{
              backgroundColor: roles.find(r => r.id === selectedRole)?.color || '#2196f3',
              color: 'white',
              ml: 1
            }}
          />
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(groupedModules).map(([category, categoryModules]) => (
            <Grid item xs={12} key={category}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: '#091A48', fontWeight: 'bold' }}>
                    {category}
                  </Typography>
                  <Grid container spacing={2}>
                    {categoryModules.map(module => (
                      <Grid item xs={12} sm={6} md={4} key={module.id}>
                        <Box sx={{ 
                          p: 2, 
                          border: '1px solid #e0e0e0', 
                          borderRadius: 1,
                          backgroundColor: permissions[selectedRole]?.[module.id] ? '#f3e8ff' : '#f9f9f9'
                        }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={permissions[selectedRole]?.[module.id] || false}
                                onChange={(e) => handlePermissionChange(selectedRole, module.id, e.target.checked)}
                                sx={{
                                  '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#882AFF',
                                  },
                                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#882AFF',
                                  },
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {module.name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {permissions[selectedRole]?.[module.id] ? 'Enabled' : 'Disabled'}
                                </Typography>
                              </Box>
                            }
                            labelPlacement="start"
                            sx={{ width: '100%', justifyContent: 'space-between', m: 0 }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Add Role Dialog */}
      <Dialog open={showAddRole} onClose={() => setShowAddRole(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#091A48', fontWeight: 'bold' }}>
          Create New Role
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Role Name"
              value={newRole.name}
              onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={newRole.description}
              onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Color"
              type="color"
              value={newRole.color}
              onChange={(e) => setNewRole(prev => ({ ...prev, color: e.target.value }))}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowAddRole(false)} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddRole}
            variant="contained"
            disabled={!newRole.name.trim()}
            sx={{
              backgroundColor: '#882AFF',
              '&:hover': { backgroundColor: '#7a4dd3' }
            }}
          >
            Create Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolesPermissions;