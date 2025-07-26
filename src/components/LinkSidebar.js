import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse,
  Badge
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Link as LinkIcon,
  Analytics as AnalyticsIcon,
  QrCode as QrCodeIcon,
  TrendingUp as TrendingUpIcon,
  Pages as PagesIcon,
  ExpandLess,
  ExpandMore,
  Article as ArticleIcon,
  Launch as LaunchIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const LinkSidebar = ({ currentView, onViewChange, linkStats = {} }) => {
  const [pagesOpen, setPagesOpen] = useState(false);

  const handlePagesClick = () => {
    setPagesOpen(!pagesOpen);
  };

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      description: 'Overview & Analytics'
    },
    {
      id: 'links',
      label: 'My Links',
      icon: <LinkIcon />,
      description: 'Manage Short URLs',
      badge: linkStats.totalLinks || 0
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <AnalyticsIcon />,
      description: 'Detailed Reports'
    },
    {
      id: 'qr-codes',
      label: 'QR Codes',
      icon: <QrCodeIcon />,
      description: 'Generate QR Codes'
    }
  ];

  const pageItems = [
    {
      id: 'bitly-pages',
      label: 'Bitly Pages',
      icon: <ArticleIcon />,
      description: 'Landing Pages'
    },
    {
      id: 'custom-pages',
      label: 'Custom Pages',
      icon: <LaunchIcon />,
      description: 'Custom Landing Pages'
    },
    {
      id: 'page-analytics',
      label: 'Page Analytics',
      icon: <VisibilityIcon />,
      description: 'Page Performance'
    }
  ];

  return (
    <Box
      sx={{
        width: 280,
        height: '100%',
        backgroundColor: '#f8f9fa',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
          Link Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create, manage and analyze your links
        </Typography>
      </Box>

      {/* Main Navigation */}
      <List sx={{ flex: 1, px: 2, py: 1 }}>
        {sidebarItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={currentView === item.id}
              onClick={() => onViewChange(item.id)}
              sx={{
                borderRadius: '8px',
                '&.Mui-selected': {
                  backgroundColor: '#e3f2fd',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                  },
                },
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              <ListItemIcon sx={{ color: currentView === item.id ? '#1976d2' : 'inherit' }}>
                {item.badge > 0 ? (
                  <Badge badgeContent={item.badge} color="primary">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={item.description}
                primaryTypographyProps={{
                  fontWeight: currentView === item.id ? 'bold' : 'normal',
                  color: currentView === item.id ? '#1976d2' : 'inherit'
                }}
                secondaryTypographyProps={{
                  fontSize: '0.75rem'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ my: 2 }} />

        {/* Link Pages Section */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={handlePagesClick}
            sx={{
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ListItemIcon>
              <PagesIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Link Pages" 
              secondary="Manage landing pages"
              secondaryTypographyProps={{
                fontSize: '0.75rem'
              }}
            />
            {pagesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        <Collapse in={pagesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            {pageItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={currentView === item.id}
                  onClick={() => onViewChange(item.id)}
                  sx={{
                    borderRadius: '6px',
                    py: 1,
                    '&.Mui-selected': {
                      backgroundColor: '#e3f2fd',
                      '&:hover': {
                        backgroundColor: '#e3f2fd',
                      },
                    },
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 36,
                    color: currentView === item.id ? '#1976d2' : 'inherit' 
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    secondary={item.description}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: currentView === item.id ? 'bold' : 'normal',
                      color: currentView === item.id ? '#1976d2' : 'inherit'
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.7rem'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>

      {/* Quick Stats Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', backgroundColor: '#fff' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Quick Stats
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Total Links:</Typography>
          <Typography variant="body2" fontWeight="bold">
            {linkStats.totalLinks || 0}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Total Clicks:</Typography>
          <Typography variant="body2" fontWeight="bold">
            {linkStats.totalClicks || 0}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">This Month:</Typography>
          <Typography variant="body2" fontWeight="bold" color="primary">
            {linkStats.monthlyClicks || 0}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LinkSidebar;