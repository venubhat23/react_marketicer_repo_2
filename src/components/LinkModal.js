import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Link as LinkIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LinkModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleShortLinkClick = () => {
    navigate('/link/short');
    onClose();
  };

  const handleAdvancedLinkClick = () => {
    navigate('/link/advanced');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: '#f8f9fa'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: '#091a48',
        color: 'white',
        py: 2
      }}>
        <Typography variant="h6" component="div">
          Link Management Options
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 2, color: '#666' }}>
            Choose the type of link management you want to use:
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<LinkIcon />}
            onClick={handleShortLinkClick}
            sx={{
              py: 2,
              px: 4,
              bgcolor: '#091a48',
              '&:hover': {
                bgcolor: '#0f2557'
              },
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem'
            }}
          >
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h6" component="div">
                Short Link
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Create and manage shortened URLs with analytics
              </Typography>
            </Box>
          </Button>
          
          <Button
            variant="contained"
            size="large"
            startIcon={<SettingsIcon />}
            onClick={handleAdvancedLinkClick}
            sx={{
              py: 2,
              px: 4,
              bgcolor: '#6c5ce7',
              '&:hover': {
                bgcolor: '#5a4fcf'
              },
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem'
            }}
          >
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h6" component="div">
                Advanced Link
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Advanced link creation with UTM parameters
              </Typography>
            </Box>
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LinkModal;