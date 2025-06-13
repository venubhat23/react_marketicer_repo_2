import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Checkbox,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Description as DescriptionIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import ArrowLeftIcon from "@mui/icons-material/ArrowBack";
import Sidebar from "../../components/Sidebar";

const ContractPage = () => {
  const [viewMode, setViewMode] = useState('list');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const contracts = [
    {
      id: 1,
      name: 'Spring Collab',
      type: 'Gifting',
      status: 'Sent',
      dateCreated: 'Jan 4, 2025',
      action: 'Viewed'
    },
    {
      id: 2,
      name: 'Campaign A',
      type: 'Sponsorship',
      status: 'Sent',
      dateCreated: 'Jan 4, 2025',
      action: 'Viewed'
    },
    {
      id: 3,
      name: 'Lorem Ipsum',
      type: 'Sponsorship',
      status: 'Draft',
      dateCreated: 'Jan 2, 2025',
      action: 'Pending'
    },
    {
      id: 4,
      name: 'Lorem Ipsum',
      type: 'Collaboration',
      status: 'Sent',
      dateCreated: 'Jan 6, 2025',
      action: 'Viewed'
    },
    {
      id: 5,
      name: 'Lorem Ipsum',
      type: 'Gift',
      status: 'Draft',
      dateCreated: 'Jan 8, 2025',
      action: 'Viewed'
    },
    {
      id: 6,
      name: 'Lorem Ipsum',
      type: 'Gift',
      status: 'Signed',
      dateCreated: 'Jan 6, 2025',
      action: 'Viewed'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sent':
        return 'primary';
      case 'Draft':
        return 'default';
      case 'Signed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getActionColor = (action) => {
    return action === 'Pending' ? 'warning' : 'default';
  };

  const handleCreateContract = () => {
    console.log('Create new contract');
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5edf8', height: '100%' }}>
      <Grid container>
        <Grid size={{ md: 1 }}>
          <Sidebar />
        </Grid>
        <Grid size={{ md: 11 }}>
          {/* Header */}
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
                Contract
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateContract}
                  sx={{
                    bgcolor: '#ded6e9',
                    '&:hover': {
                      bgcolor: '#F3F6FF',
                    },
                  }}
                >
                  Create Contract
                </Button>
                <IconButton size="large" sx={{ color: '#fff' }}>
                  <NotificationsIcon />
                </IconButton>
                <IconButton size="large" sx={{ color: '#fff' }}>
                  <AccountCircleIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>

          {/* Controls Bar */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              alignItems: 'center',
              bgcolor: '#B1C6FF',
              padding: '15px',
            }}
          >
            {/* Search */}
            <TextField
              placeholder="Search"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />

            {/* Filter */}
            <TextField
              select
              label="Filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Gifting">Gifting</MenuItem>
              <MenuItem value="Sponsorship">Sponsorship</MenuItem>
              <MenuItem value="Collaboration">Collaboration</MenuItem>
              <MenuItem value="Gift">Gift</MenuItem>
            </TextField>

            {/* Sort */}
            <TextField
              select
              label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </TextField>

            {/* View Toggle */}
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <IconButton
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
              >
                <ViewListIcon />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <ViewModuleIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ flexGrow: 1, mt: { xs: 8, md: 0 }, padding: '20px' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                {/* Table */}
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                        <TableCell padding="checkbox">
                          <Checkbox />
                        </TableCell>
                        <TableCell><strong>Contract Name</strong></TableCell>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Date Created</strong></TableCell>
                        <TableCell><strong>Action</strong></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {contracts.map((contract) => (
                        <TableRow
                          key={contract.id}
                          hover
                          sx={{ '&:hover': { bgcolor: '#f8f9fa' } }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox />
                          </TableCell>
                          <TableCell>
                            <Typography
                              component="span"
                              sx={{
                                color: '#7c3aed',
                                cursor: 'pointer',
                                fontWeight: 500,
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              {contract.name}
                            </Typography>
                          </TableCell>
                          <TableCell>{contract.type}</TableCell>
                          <TableCell>
                            <Chip
                              label={contract.status}
                              color={getStatusColor(contract.status)}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{contract.dateCreated}</TableCell>
                          <TableCell>
                            <Chip
                              label={contract.action}
                              color={getActionColor(contract.action)}
                              size="small"
                              variant="filled"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small">
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Empty State */}
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    <DescriptionIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    No Contracts Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Start by creating your first Contract
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreateContract}
                    sx={{
                      bgcolor: '#7c3aed',
                      '&:hover': {
                        bgcolor: '#6d28d9',
                      },
                    }}
                  >
                    Create Contract
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContractPage;