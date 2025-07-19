import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Divider,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext/AuthContext';
import routes from '../routes-demo';
import { getSidebarRoutes } from '../utils/routeUtils';

const DynamicSidenav = ({ isOpen = true }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Get filtered routes based on user role
  const filteredRoutes = getSidebarRoutes(routes, user?.role);

  return (
    <Box
      sx={{
        bgcolor: '#091a48',
        width: isOpen ? 240 : 80,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
        transition: 'width 0.3s ease',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 2, pt: 4, pb: 2, textAlign: 'center' }}>
        <img
          src="https://c.animaapp.com/mayvvv0wua9Y41/img/marketincer-logo-1.svg"
          alt="Marketincer logo"
          width={29}
          height={21}
          style={{ display: 'block', margin: 'auto' }}
        />
        {isOpen && (
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              mt: 1,
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Marketincer
          </Typography>
        )}
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mx: 1 }} />

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List sx={{ px: 1, py: 2 }}>
          {filteredRoutes.map((route) => {
            const isActive = location.pathname === route.route;
            
            return (
              <ListItem key={route.key} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={route.route}
                  sx={{
                    borderRadius: 2,
                    color: isActive ? '#fff' : '#cbaef7',
                    bgcolor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.05)',
                    },
                    px: 2,
                    py: 1.5,
                    minHeight: 48,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: isOpen ? 40 : 'auto',
                      mr: isOpen ? 2 : 0,
                      justifyContent: 'center',
                    }}
                  >
                    {route.icon}
                  </ListItemIcon>
                  {isOpen && (
                    <ListItemText
                      primary={route.name}
                      primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User Role Badge */}
      {isOpen && user?.role && (
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              borderRadius: 1,
              p: 1,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#cbaef7',
                fontSize: '12px',
                textTransform: 'capitalize',
              }}
            >
              Role: {user.role}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DynamicSidenav;