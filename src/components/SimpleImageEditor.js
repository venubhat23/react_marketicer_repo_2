import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  Slider,
  Grid,
  ButtonGroup,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  RotateRight as RotateIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const SimpleImageEditor = ({ open, onClose, imageUrl, onSave, originalFile }) => {
  // States for image editing
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState(null);
  const [cropDimensions, setCropDimensions] = useState(null);
  const imageRef = useRef(null);

  // Debug logging
  React.useEffect(() => {
    if (open) {
      console.log('SimpleImageEditor opened with imageUrl:', imageUrl);
      console.log('imageUrl type:', typeof imageUrl);
      console.log('imageUrl length:', imageUrl?.length);
    }
  }, [open, imageUrl]);

  // Simple filter presets
  const filters = [
    { name: 'Normal', value: 'none', style: '' },
    { name: 'B&W', value: 'grayscale', style: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia', style: 'sepia(100%)' },
    { name: 'Vintage', value: 'vintage', style: 'sepia(50%) contrast(1.2)' }
  ];

  // Social media sizes
  const aspectRatios = [
    { name: 'Instagram Square', ratio: 1, width: 1080, height: 1080, description: '1:1' },
    { name: 'Instagram Portrait', ratio: 0.8, width: 1080, height: 1350, description: '4:5' },
    { name: 'Instagram Story', ratio: 0.5625, width: 1080, height: 1920, description: '9:16' },
    { name: 'Facebook Post', ratio: 1.91, width: 1200, height: 628, description: '16:9' },
    { name: 'LinkedIn Post', ratio: 1.91, width: 1200, height: 628, description: '16:9' },
    { name: 'Twitter Post', ratio: 1.91, width: 1200, height: 628, description: '16:9' },
    { name: 'YouTube Thumbnail', ratio: 1.78, width: 1280, height: 720, description: '16:9' }
  ];

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter.value);
  };

  const handleAspectRatioSelect = (aspectRatio) => {
    setSelectedAspectRatio(aspectRatio);
    
    // Calculate crop dimensions based on image size
    if (imageRef.current) {
      const img = imageRef.current;
      const imageWidth = img.naturalWidth;
      const imageHeight = img.naturalHeight;
      const targetRatio = aspectRatio.ratio;
      
      let cropWidth, cropHeight, cropX, cropY;
      
      if (imageWidth / imageHeight > targetRatio) {
        // Image is wider than target ratio - crop horizontally
        cropHeight = imageHeight;
        cropWidth = imageHeight * targetRatio;
        cropX = (imageWidth - cropWidth) / 2;
        cropY = 0;
      } else {
        // Image is taller than target ratio - crop vertically
        cropWidth = imageWidth;
        cropHeight = imageWidth / targetRatio;
        cropX = 0;
        cropY = (imageHeight - cropHeight) / 2;
      }
      
      setCropDimensions({
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight
      });
    }
  };

  const resetAll = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);
    setSelectedFilter('none');
    setSelectedAspectRatio(null);
    setCropDimensions(null);
  };

  const getImageStyle = () => {
    let filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    
    if (selectedFilter !== 'none') {
      const filter = filters.find(f => f.value === selectedFilter);
      if (filter) {
        filterStr += ` ${filter.style}`;
      }
    }
    
    return {
      filter: filterStr,
      transform: `rotate(${rotation}deg)`,
      maxWidth: '100%',
      maxHeight: '380px',
      width: 'auto',
      height: 'auto',
      objectFit: 'contain',
      transition: 'all 0.3s ease',
      display: 'block'
    };
  };

  const handleSave = async () => {
    if (!imageRef.current) return;
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let sourceImage;
      
      // Try to use original file if available to avoid CORS issues
      if (originalFile && originalFile instanceof File) {
        // Create image from file blob
        const fileURL = URL.createObjectURL(originalFile);
        sourceImage = new Image();
        
        await new Promise((resolve, reject) => {
          sourceImage.onload = resolve;
          sourceImage.onerror = reject;
          sourceImage.src = fileURL;
        });
        
        // Clean up the object URL
        URL.revokeObjectURL(fileURL);
      } else {
        // Fallback to using the image URL
        sourceImage = new Image();
        sourceImage.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          sourceImage.onload = resolve;
          sourceImage.onerror = reject;
          sourceImage.src = imageUrl;
        });
      }
      
      // Set canvas dimensions based on crop or original image
      if (selectedAspectRatio && cropDimensions) {
        canvas.width = selectedAspectRatio.width;
        canvas.height = selectedAspectRatio.height;
      } else {
        canvas.width = sourceImage.naturalWidth;
        canvas.height = sourceImage.naturalHeight;
      }
      
      // Apply filters
      ctx.filter = getImageStyle().filter;
      
      // Handle rotation
      ctx.save();
      if (rotation !== 0) {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);
      }
      
      // Draw image with crop if applicable
      if (selectedAspectRatio && cropDimensions) {
        // Calculate scale factor between original and display image
        const scaleX = sourceImage.naturalWidth / imageRef.current.naturalWidth;
        const scaleY = sourceImage.naturalHeight / imageRef.current.naturalHeight;
        
        // Draw cropped image scaled to target dimensions
        ctx.drawImage(
          sourceImage,
          cropDimensions.x * scaleX, cropDimensions.y * scaleY,           // Source x, y
          cropDimensions.width * scaleX, cropDimensions.height * scaleY,  // Source width, height
          0, 0,                                                           // Dest x, y
          canvas.width, canvas.height                                     // Dest width, height
        );
      } else {
        // Draw full image
        ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
      }
      
      ctx.restore();
      
      const editedImageDataURL = canvas.toDataURL('image/png');
      onSave(editedImageDataURL);
    } catch (error) {
      console.error('Error saving image:', error);
      
      // Final fallback: try to create a simple edited version
      try {
        // If we can't export canvas, just return the original URL
        // In a real app, you might want to send the edit parameters to a server
        console.log('Canvas export failed, returning original image URL');
        onSave(imageUrl);
      } catch (finalError) {
        console.error('All save methods failed:', finalError);
        onSave(imageUrl);
      }
    }
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { 
          height: '80vh',
          maxHeight: '700px'
        }
      }}
    >
      {/* Header */}
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Edit Image</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ p: 2 }}>
        <Grid container spacing={3} sx={{ height: '100%' }}>
          
          {/* Image Preview - Left Side */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: 2,
                border: '2px dashed #dee2e6',
                padding: 2,
                position: 'relative'
              }}
            >
              {imageUrl && imageUrl.trim() ? (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  position: 'relative'
                }}>
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Preview"
                    style={getImageStyle()}
                    onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                    onError={(e) => {
                      console.error('Image failed to load:', imageUrl, e);
                      console.error('Error details:', e.target);
                    }}
                  />
                  
                  {/* Crop Indicator Overlay */}
                  {selectedAspectRatio && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: '2px dashed #1976d2',
                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        // Calculate size based on aspect ratio
                        width: selectedAspectRatio.ratio > 1 
                          ? '80%' 
                          : `${80 * selectedAspectRatio.ratio}%`,
                        aspectRatio: selectedAspectRatio.ratio,
                        maxWidth: '300px',
                        maxHeight: '300px'
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#1976d2',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          px: 1,
                          py: 0.5,
                          borderRadius: 0.5,
                          fontWeight: 500
                        }}
                      >
                        {selectedAspectRatio.name}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" variant="h6">
                    No image selected
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Please select an image to edit
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Controls - Right Side */}
          <Grid item xs={12} md={4}>
            <Box sx={{ height: '400px', overflowY: 'auto' }}>
              
              {/* Quick Actions */}
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>Quick Actions</Typography>
                <ButtonGroup size="small" variant="outlined" fullWidth>
                  <Button onClick={handleRotate} startIcon={<RotateIcon />}>
                    Rotate
                  </Button>
                  <Button onClick={resetAll}>
                    Reset
                  </Button>
                </ButtonGroup>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Filters */}
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>Filters</Typography>
                <Grid container spacing={1}>
                  {filters.map((filter) => (
                    <Grid item xs={6} key={filter.value}>
                      <Button
                        size="small"
                        variant={selectedFilter === filter.value ? 'contained' : 'outlined'}
                        onClick={() => handleFilterClick(filter)}
                        fullWidth
                      >
                        {filter.name}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Adjustments */}
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>Adjustments</Typography>
                
                <Box mb={2}>
                  <Typography variant="body2" gutterBottom>
                    Brightness: {brightness}%
                  </Typography>
                  <Slider
                    value={brightness}
                    onChange={(e, value) => setBrightness(value)}
                    min={50}
                    max={150}
                    size="small"
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" gutterBottom>
                    Contrast: {contrast}%
                  </Typography>
                  <Slider
                    value={contrast}
                    onChange={(e, value) => setContrast(value)}
                    min={50}
                    max={150}
                    size="small"
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" gutterBottom>
                    Saturation: {saturation}%
                  </Typography>
                  <Slider
                    value={saturation}
                    onChange={(e, value) => setSaturation(value)}
                    min={0}
                    max={200}
                    size="small"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Aspect Ratios */}
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>Social Media Sizes</Typography>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Click to crop image to specific social media dimensions
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {aspectRatios.map((ratio) => (
                    <Box key={ratio.name} sx={{ mb: 1 }}>
                      <Button
                        size="small"
                        variant={selectedAspectRatio?.name === ratio.name ? 'contained' : 'outlined'}
                        onClick={() => handleAspectRatioSelect(ratio)}
                        fullWidth
                        sx={{ justifyContent: 'space-between', px: 2 }}
                      >
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {ratio.name}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7 }}>
                            {ratio.width}×{ratio.height} ({ratio.description})
                          </Typography>
                        </Box>
                      </Button>
                    </Box>
                  ))}
                  
                  {selectedAspectRatio && (
                    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f0f7ff', borderRadius: 1 }}>
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                        Crop Preview Active
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Selected: {selectedAspectRatio.name} ({selectedAspectRatio.width}×{selectedAspectRatio.height})
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedAspectRatio(null);
                            setCropDimensions(null);
                          }}
                        >
                          Clear Crop
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Actions */}
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          startIcon={<SaveIcon />}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimpleImageEditor;