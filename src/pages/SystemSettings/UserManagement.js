import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar, Chip, IconButton, Button, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch,
  FormControlLabel, Alert, Snackbar, Tooltip, Badge, InputAdornment,
  TablePagination, FormControl, InputLabel, Select, Grid
} from '@mui/material';
import {
  SupervisorAccount as SupervisorAccountIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  PersonAdd as PersonAddIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'super-admin',
      company: 'TechCorp Inc',
      phone: '+1-555-0123',
      status: 'active',
      avatar: null,
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@brandco.com',
      role: 'brand',
      company: 'BrandCo',
      phone: '+1-555-0456',
      status: 'active',
      avatar: null,
      lastLogin: '2024-01-14T15:45:00Z',
      createdAt: '2024-01-02T00:00:00Z'
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@influence.com',
      role: 'influencer',
      company: 'Self Employed',
      phone: '+1-555-0789',
      status: 'inactive',
      avatar: null,
      lastLogin: '2024-01-10T09:15:00Z',
      createdAt: '2024-01-03T00:00:00Z'
    },
    {
      id: 4,
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@support.com',
      role: 'support-admin',
      company: 'Support Services',
      phone: '+1-555-0321',
      status: 'active',
      avatar: null,
      lastLogin: '2024-01-15T08:00:00Z',
      createdAt: '2024-01-04T00:00:00Z'
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@finance.com',
      role: 'finance-admin',
      company: 'Finance Corp',
      phone: '+1-555-0654',
      status: 'active',
      avatar: null,
      lastLogin: '2024-01-13T16:30:00Z',
      createdAt: '2024-01-05T00:00:00Z'
    }
  ]);

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const roles = [
    { id: 'super-admin', name: 'Super Admin', color: '#f44336' },
    { id: 'support-admin', name: 'Support Admin', color: '#ff9800' },
    { id: 'finance-admin', name: 'Finance Admin', color: '#4caf50' },
    { id: 'brand', name: 'Brand', color: '#2196f3' },
    { id: 'influencer', name: 'Influencer', color: '#9c27b0' }
  ];

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
    setPage(0);
  }, [users, searchTerm, statusFilter, roleFilter]);

  const getRoleInfo = (roleId) => {
    return roles.find(role => role.id === roleId) || { name: roleId, color: '#666' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleViewUser = () => {
    setShowUserDetail(true);
    handleMenuClose();
  };

  const handleEditUser = () => {
    setEditFormData({ ...selectedUser });
    setShowEditUser(true);
    handleMenuClose();
  };

  const handleDeactivateUser = () => {
    setShowDeactivateConfirm(true);
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      toast.success('User deleted successfully', {
        position: "top-right",
        autoClose: 3000,
      });
    }
    handleMenuClose();
  };

  const confirmDeactivate = () => {
    if (selectedUser) {
      const newStatus = selectedUser.status === 'active' ? 'inactive' : 'active';
      setUsers(prev => prev.map(user =>
        user.id === selectedUser.id ? { ...user, status: newStatus } : user
      ));
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setShowDeactivateConfirm(false);
  };

  const handleSaveEdit = () => {
    setUsers(prev => prev.map(user =>
      user.id === editFormData.id ? editFormData : user
    ));
    setShowEditUser(false);
    toast.success('User updated successfully', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SupervisorAccountIcon sx={{ color: '#882AFF', fontSize: 28 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#091A48' }}>
                User Management
              </Typography>
              <Typography variant="body2" color="textSecondary">
                View and manage system users
              </Typography>
            </Box>
          </Box>
          <Badge badgeContent={filteredUsers.length} color="primary" sx={{ mr: 2 }}>
            <Typography variant="h6" sx={{ color: '#882AFF', fontWeight: 'bold' }}>
              Total Users
            </Typography>
          </Badge>
        </Box>
      </Box>

      {/* Filters and Search */}
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#882AFF' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Role"
              >
                <MenuItem value="all">All Roles</MenuItem>
                {roles.map(role => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Users Table */}
      <Box sx={{ p: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => {
                  const roleInfo = getRoleInfo(user.role);
                  return (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={user.avatar}
                            sx={{ bgcolor: '#882AFF' }}
                          >
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {user.firstName} {user.lastName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={roleInfo.name}
                          size="small"
                          sx={{
                            backgroundColor: roleInfo.color,
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessIcon sx={{ fontSize: 16, color: '#666' }} />
                          <Typography variant="body2">
                            {user.company}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 14, color: '#666' }} />
                            <Typography variant="caption">
                              {user.email}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 14, color: '#666' }} />
                            <Typography variant="caption">
                              {user.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          color={user.status === 'active' ? 'success' : 'default'}
                          variant={user.status === 'active' ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(user.lastLogin)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, user)}
                          size="small"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewUser}>
          <VisibilityIcon sx={{ mr: 1, fontSize: 18 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEditUser}>
          <EditIcon sx={{ mr: 1, fontSize: 18 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={handleDeactivateUser}>
          <BlockIcon sx={{ mr: 1, fontSize: 18 }} />
          {selectedUser?.status === 'active' ? 'Deactivate' : 'Activate'}
        </MenuItem>
        <MenuItem onClick={handleDeleteUser} sx={{ color: '#f44336' }}>
          <DeleteIcon sx={{ mr: 1, fontSize: 18 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* User Detail Dialog */}
      <Dialog open={showUserDetail} onClose={() => setShowUserDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#091A48', fontWeight: 'bold' }}>
          User Details
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={selectedUser.avatar}
                      sx={{ width: 100, height: 100, bgcolor: '#882AFF' }}
                    >
                      {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                    </Avatar>
                    <Chip
                      label={getRoleInfo(selectedUser.role).name}
                      sx={{
                        backgroundColor: getRoleInfo(selectedUser.role).color,
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedUser.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {selectedUser.phone}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Company:</strong> {selectedUser.company}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {selectedUser.status}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Created:</strong> {formatDate(selectedUser.createdAt)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Last Login:</strong> {formatDate(selectedUser.lastLogin)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUserDetail(false)} sx={{ color: '#666' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUser} onClose={() => setShowEditUser(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#091A48', fontWeight: 'bold' }}>
          Edit User
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  value={editFormData.firstName || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  value={editFormData.lastName || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Company"
                  value={editFormData.company || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, company: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone"
                  value={editFormData.phone || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={editFormData.role || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                    label="Role"
                  >
                    {roles.map(role => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowEditUser(false)} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{
              backgroundColor: '#882AFF',
              '&:hover': { backgroundColor: '#7a4dd3' }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deactivate Confirmation Dialog */}
      <Dialog open={showDeactivateConfirm} onClose={() => setShowDeactivateConfirm(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {selectedUser?.status === 'active' ? 'deactivate' : 'activate'} this user?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeactivateConfirm(false)} sx={{ color: '#666' }}>
            Cancel
          </Button>
          <Button onClick={confirmDeactivate} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;