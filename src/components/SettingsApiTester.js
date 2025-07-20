import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  CircularProgress,
  TextField,
  Grid,
  Divider,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import settingsApi from '../services/settingsApi';

const SettingsApiTester = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTest, setActiveTest] = useState(null);

  // Sample data matching the API documentation
  const [personalTestData, setPersonalTestData] = useState({
    first_name: 'Olivia',
    last_name: 'Rhye',
    email: 'olivia@untitledui.com',
    phone_number: '+1 (555) 123-4567',
    bio: 'Senior Digital Marketing Specialist with expertise in growth hacking and data-driven strategies.',
    avatar_url: 'https://example.com/avatars/olivia.jpg'
  });

  const [companyTestData, setCompanyTestData] = useState({
    company_name: 'Untitled UI Inc',
    gst_name: 'Untitled UI Incorporated',
    gst_number: '29ABCDE1234F1Z6',
    company_phone: '+1 (555) 000-1000',
    company_address: '456 Innovation Drive, Tech Hub, TH 54321',
    company_website: 'https://www.untitledui.com'
  });

  const [passwordTestData, setPasswordTestData] = useState({
    current_password: 'password123',
    new_password: 'newpassword456',
    confirm_password: 'newpassword456'
  });

  const testEndpoint = async (testName, apiCall) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setActiveTest(testName);

    try {
      const response = await apiCall();
      setResult({ testName, data: response });
      console.log(`✅ ${testName} Success:`, response);
    } catch (err) {
      setError({ testName, error: err });
      console.error(`❌ ${testName} Error:`, err);
    } finally {
      setLoading(false);
      setActiveTest(null);
    }
  };

  const testGetSettings = () => {
    testEndpoint('GET /api/v1/settings', () => settingsApi.getSettings());
  };

  const testUpdatePersonal = () => {
    testEndpoint('PATCH /api/v1/settings/personal_information', () => 
      settingsApi.updatePersonalInformation(personalTestData)
    );
  };

  const testUpdateCompany = () => {
    testEndpoint('PATCH /api/v1/settings/company_details', () => 
      settingsApi.updateCompanyDetails(companyTestData)
    );
  };

  const testChangePassword = () => {
    testEndpoint('PATCH /api/v1/settings/change_password', () => 
      settingsApi.changePassword(passwordTestData)
    );
  };

  const handlePersonalDataChange = (field, value) => {
    setPersonalTestData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompanyDataChange = (field, value) => {
    setCompanyTestData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordDataChange = (field, value) => {
    setPasswordTestData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box p={3} maxWidth={1200} mx="auto">
      <Typography variant="h4" gutterBottom color="primary">
        Settings API Tester
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Instructions:</strong> Make sure you have a valid JWT token in localStorage. 
          You can get a token by logging in through the login endpoint first. 
          The API base URL is configured in <code>src/utils/api.js</code>.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* GET Settings Test */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                1. GET Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Fetches all user settings including personal information and company details.
              </Typography>
              <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                GET /api/v1/settings
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                variant="contained" 
                onClick={testGetSettings} 
                disabled={loading}
                color="primary"
              >
                {loading && activeTest === 'GET /api/v1/settings' ? 'Testing...' : 'Test GET Settings'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Update Personal Information Test */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                2. Update Personal Information
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Updates user's personal information.
              </Typography>
              <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1, mb: 2 }}>
                PATCH /api/v1/settings/personal_information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="First Name"
                    value={personalTestData.first_name}
                    onChange={(e) => handlePersonalDataChange('first_name', e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Last Name"
                    value={personalTestData.last_name}
                    onChange={(e) => handlePersonalDataChange('last_name', e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    value={personalTestData.email}
                    onChange={(e) => handlePersonalDataChange('email', e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone"
                    value={personalTestData.phone_number}
                    onChange={(e) => handlePersonalDataChange('phone_number', e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button 
                variant="contained" 
                onClick={testUpdatePersonal} 
                disabled={loading}
                color="secondary"
              >
                {loading && activeTest === 'PATCH /api/v1/settings/personal_information' ? 'Testing...' : 'Test Update Personal'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Update Company Details Test */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                3. Update Company Details
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Updates user's company information.
              </Typography>
              <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1, mb: 2 }}>
                PATCH /api/v1/settings/company_details
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Company Name"
                    value={companyTestData.company_name}
                    onChange={(e) => handleCompanyDataChange('company_name', e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="GST Number"
                    value={companyTestData.gst_number}
                    onChange={(e) => handleCompanyDataChange('gst_number', e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Website"
                    value={companyTestData.company_website}
                    onChange={(e) => handleCompanyDataChange('company_website', e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button 
                variant="contained" 
                onClick={testUpdateCompany} 
                disabled={loading}
                color="success"
              >
                {loading && activeTest === 'PATCH /api/v1/settings/company_details' ? 'Testing...' : 'Test Update Company'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Change Password Test */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                4. Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Changes user's password with current password verification.
              </Typography>
              <Typography variant="caption" display="block" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1, mb: 2 }}>
                PATCH /api/v1/settings/change_password
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Current Password"
                    type="password"
                    value={passwordTestData.current_password}
                    onChange={(e) => handlePasswordDataChange('current_password', e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="New Password"
                    type="password"
                    value={passwordTestData.new_password}
                    onChange={(e) => handlePasswordDataChange('new_password', e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Confirm Password"
                    type="password"
                    value={passwordTestData.confirm_password}
                    onChange={(e) => handlePasswordDataChange('confirm_password', e.target.value)}
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button 
                variant="contained" 
                onClick={testChangePassword} 
                disabled={loading}
                color="warning"
              >
                {loading && activeTest === 'PATCH /api/v1/settings/change_password' ? 'Testing...' : 'Test Change Password'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Loading State */}
      {loading && (
        <Box display="flex" alignItems="center" gap={2} mt={3} p={2} bgcolor="grey.50" borderRadius={1}>
          <CircularProgress size={20} />
          <Typography>Testing {activeTest}...</Typography>
        </Box>
      )}

      {/* Success Result */}
      {result && (
        <Paper elevation={2} sx={{ p: 3, mt: 3, bgcolor: 'success.light', border: '1px solid', borderColor: 'success.main' }}>
          <Typography variant="h6" color="success.dark" gutterBottom>
            ✅ {result.testName} - Success
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" component="pre" sx={{ 
            fontSize: '0.85rem', 
            bgcolor: 'white', 
            p: 2, 
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: '300px'
          }}>
            {JSON.stringify(result.data, null, 2)}
          </Typography>
        </Paper>
      )}

      {/* Error Result */}
      {error && (
        <Paper elevation={2} sx={{ p: 3, mt: 3, bgcolor: 'error.light', border: '1px solid', borderColor: 'error.main' }}>
          <Typography variant="h6" color="error.dark" gutterBottom>
            ❌ {error.testName} - Error
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" component="pre" sx={{ 
            fontSize: '0.85rem', 
            bgcolor: 'white', 
            p: 2, 
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: '300px'
          }}>
            {JSON.stringify(error.error, null, 2)}
          </Typography>
        </Paper>
      )}

      {/* cURL Examples */}
      <Paper elevation={1} sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          📋 cURL Examples
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          You can also test these endpoints directly using cURL:
        </Typography>
        
        <Box component="pre" sx={{ 
          fontSize: '0.8rem', 
          bgcolor: 'grey.900', 
          color: 'white',
          p: 2, 
          borderRadius: 1,
          overflow: 'auto'
        }}>
{`# Get Settings
curl -X GET https://api.marketincer.com/api/v1/settings \\
  -H "Authorization: Bearer <your_jwt_token>" \\
  -H "Content-Type: application/json"

# Update Personal Information
curl -X PATCH https://api.marketincer.com/api/v1/settings/personal_information \\
  -H "Authorization: Bearer <your_jwt_token>" \\
  -H "Content-Type: application/json" \\
  -d '{"personal_information": {"first_name": "Olivia", "last_name": "Rhye"}}'

# Update Company Details
curl -X PATCH https://api.marketincer.com/api/v1/settings/company_details \\
  -H "Authorization: Bearer <your_jwt_token>" \\
  -H "Content-Type: application/json" \\
  -d '{"company_details": {"company_name": "Untitled UI Inc"}}'

# Change Password
curl -X PATCH https://api.marketincer.com/api/v1/settings/change_password \\
  -H "Authorization: Bearer <your_jwt_token>" \\
  -H "Content-Type: application/json" \\
  -d '{"current_password": "old", "new_password": "new", "confirm_password": "new"}'`}
        </Box>
      </Paper>
    </Box>
  );
};

export default SettingsApiTester;