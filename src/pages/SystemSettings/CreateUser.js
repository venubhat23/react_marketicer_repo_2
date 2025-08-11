import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Avatar, IconButton,
  Divider, Chip, FormControlLabel, Switch, InputAdornment,
  Alert, CircularProgress, Stepper, Step, StepLabel, StepContent
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  PhotoCamera as PhotoCameraIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const CreateUser = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    email: '',
    photo: null,
    
    // Company Details
    gstName: '',
    gstNumber: '',
    phoneNumber: '',
    address: '',
    companyWebsite: '',
    jobTitle: '',
    workEmail: '',
    authorizedPersonName: '',
    
    // Password Management
    currentPassword: '',
    
    // Permissions
    role: '',
    customPermissions: {}
  });

  const [errors, setErrors] = useState({});
  
  // Available roles
  const roles = [
    { id: 'super-admin', name: 'Super Admin', color: '#f44336' },
    { id: 'support-admin', name: 'Support Admin', color: '#ff9800' },
    { id: 'finance-admin', name: 'Finance Admin', color: '#4caf50' },
    { id: 'brand', name: 'Brand', color: '#2196f3' },
    { id: 'influencer', name: 'Influencer', color: '#9c27b0' }
  ];

  // Available modules for permissions
  const modules = [
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
  ];

  const steps = [
    {
      label: 'Personal Details',
      description: 'Basic user information'
    },
    {
      label: 'Company Details',
      description: 'Business and contact information'
    },
    {
      label: 'Security & Permissions',
      description: 'Role assignment and access control'
    }
  ];

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateGST = (gst) => {
    const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return re.test(gst);
  };

  const validatePhone = (phone) => {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
  };

  const validateURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          photo: 'File size must be less than 5MB'
        }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
        setFormData(prev => ({
          ...prev,
          photo: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle permission changes
  const handlePermissionChange = (moduleId, enabled) => {
    setFormData(prev => ({
      ...prev,
      customPermissions: {
        ...prev.customPermissions,
        [moduleId]: enabled
      }
    }));
  };

  // Validate current step
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      // Personal Details validation
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    } else if (step === 1) {
      // Company Details validation
      if (formData.gstNumber && !validateGST(formData.gstNumber)) {
        newErrors.gstNumber = 'Invalid GST number format';
      }
      if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Invalid phone number format';
      }
      if (formData.companyWebsite && !validateURL(formData.companyWebsite)) {
        newErrors.companyWebsite = 'Invalid website URL';
      }
      if (formData.workEmail && !validateEmail(formData.workEmail)) {
        newErrors.workEmail = 'Invalid work email format';
      }
    } else if (step === 2) {
      // Security validation
      if (!formData.role) newErrors.role = 'Role selection is required';
      if (!formData.currentPassword.trim()) newErrors.currentPassword = 'Current password is required for confirmation';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle step navigation
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Creating user with data:', formData);
      
      toast.success('User created successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Reset form
      setFormData({
        firstName: '', lastName: '', email: '', photo: null,
        gstName: '', gstNumber: '', phoneNumber: '', address: '',
        companyWebsite: '', jobTitle: '', workEmail: '', authorizedPersonName: '',
        currentPassword: '', role: '', customPermissions: {}
      });
      setPhotoPreview(null);
      setActiveStep(0);
      
    } catch (error) {
      toast.error('Failed to create user', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Group modules by category
  const groupedModules = modules.reduce((acc, module) => {
    if (!acc[module.category]) acc[module.category] = [];
    acc[module.category].push(module);
    return acc;
  }, {});

  return (
    <Box>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <PersonAddIcon sx={{ color: '#882AFF', fontSize: 28 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#091A48' }}>
              Create New User
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Add a new user to the system with role-based permissions
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stepper */}
      <Box sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} orientation="horizontal">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.Mui-active': { color: '#882AFF' },
                    '&.Mui-completed': { color: '#882AFF' }
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {step.label}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {step.description}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        <Box sx={{ mt: 4 }}>
          {/* Step 1: Personal Details */}
          {activeStep === 0 && (
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <PersonIcon sx={{ color: '#882AFF' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Personal Details
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* Photo Upload */}
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={photoPreview}
                        sx={{ width: 120, height: 120, bgcolor: '#882AFF' }}
                      >
                        {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                      </Avatar>
                      <input
                        accept="image/*"
                        type="file"
                        id="photo-upload"
                        hidden
                        onChange={handlePhotoUpload}
                      />
                      <label htmlFor="photo-upload">
                        <IconButton color="primary" component="span">
                          <PhotoCameraIcon />
                        </IconButton>
                      </label>
                      <Typography variant="caption" color="textSecondary" textAlign="center">
                        Upload photo (Max 5MB, JPEG/PNG)
                      </Typography>
                      {errors.photo && (
                        <Typography variant="caption" color="error">
                          {errors.photo}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* Form Fields */}
                  <Grid item xs={12} sm={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="First Name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          fullWidth
                          required
                          error={!!errors.firstName}
                          helperText={errors.firstName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Last Name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          fullWidth
                          required
                          error={!!errors.lastName}
                          helperText={errors.lastName}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Email Address"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          fullWidth
                          required
                          error={!!errors.email}
                          helperText={errors.email}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Company Details */}
          {activeStep === 1 && (
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <BusinessIcon sx={{ color: '#882AFF' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Company Details
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="GST Name"
                      value={formData.gstName}
                      onChange={(e) => handleInputChange('gstName', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="GST Number"
                      value={formData.gstNumber}
                      onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                      fullWidth
                      error={!!errors.gstNumber}
                      helperText={errors.gstNumber || "Format: 22AAAAA0000A1Z5"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      fullWidth
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Job Title"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Company Website"
                      value={formData.companyWebsite}
                      onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                      fullWidth
                      error={!!errors.companyWebsite}
                      helperText={errors.companyWebsite}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Work Email"
                      type="email"
                      value={formData.workEmail}
                      onChange={(e) => handleInputChange('workEmail', e.target.value)}
                      fullWidth
                      error={!!errors.workEmail}
                      helperText={errors.workEmail}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Authorized Person Name"
                      value={formData.authorizedPersonName}
                      onChange={(e) => handleInputChange('authorizedPersonName', e.target.value)}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Security & Permissions */}
          {activeStep === 2 && (
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <SecurityIcon sx={{ color: '#882AFF' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Security & Permissions
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* Password Confirmation */}
                  <Grid item xs={12}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Enter your current password to confirm user creation authorization
                    </Alert>
                    <TextField
                      label="Current Password (for confirmation)"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      fullWidth
                      required
                      error={!!errors.currentPassword}
                      helperText={errors.currentPassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Role Selection */}
                  <Grid item xs={12}>
                    <FormControl fullWidth required error={!!errors.role}>
                      <InputLabel>Assign Role</InputLabel>
                      <Select
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        label="Assign Role"
                      >
                        {roles.map(role => (
                          <MenuItem key={role.id} value={role.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={role.name}
                                size="small"
                                sx={{
                                  backgroundColor: role.color,
                                  color: 'white'
                                }}
                              />
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.role && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                          {errors.role}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Custom Permissions */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Custom Permissions (Optional)
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      Override default role permissions by enabling/disabling specific modules
                    </Typography>

                    {Object.entries(groupedModules).map(([category, categoryModules]) => (
                      <Card key={category} sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: '#091A48' }}>
                            {category}
                          </Typography>
                          <Grid container spacing={2}>
                            {categoryModules.map(module => (
                              <Grid item xs={12} sm={6} md={4} key={module.id}>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={formData.customPermissions[module.id] || false}
                                      onChange={(e) => handlePermissionChange(module.id, e.target.checked)}
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
                                  label={module.name}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ color: '#666' }}
            >
              Back
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    backgroundColor: '#882AFF',
                    '&:hover': { backgroundColor: '#7a4dd3' }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{
                    backgroundColor: '#882AFF',
                    '&:hover': { backgroundColor: '#7a4dd3' }
                  }}
                >
                  {loading ? 'Creating User...' : 'Create User'}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateUser;