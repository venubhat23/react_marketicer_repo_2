import React, { useState } from 'react';
import { Box, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import settingsApi from '../services/settingsApi';

const SettingsApiTester = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testEndpoint = async (testName, apiCall) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await apiCall();
      setResult({ testName, data: response });
    } catch (err) {
      setError({ testName, error: err });
    } finally {
      setLoading(false);
    }
  };

  const testGetSettings = () => {
    testEndpoint('GET Settings', () => settingsApi.getSettings());
  };

  const testUpdatePersonal = () => {
    const sampleData = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone_number: '+1 (555) 123-4567',
      bio: 'This is a test bio',
      avatar_url: 'https://example.com/avatar.jpg'
    };
    testEndpoint('Update Personal Info', () => settingsApi.updatePersonalInformation(sampleData));
  };

  const testUpdateCompany = () => {
    const sampleData = {
      company_name: 'Test Company',
      gst_name: 'Test Company Private Limited',
      gst_number: '29ABCDE1234F1Z5',
      company_phone: '+1 (555) 000-1000',
      company_address: '123 Test Street, Test City, TC 12345',
      company_website: 'https://www.testcompany.com'
    };
    testEndpoint('Update Company Details', () => settingsApi.updateCompanyDetails(sampleData));
  };

  const testChangePassword = () => {
    const sampleData = {
      current_password: 'oldpassword123',
      new_password: 'newpassword456',
      confirm_password: 'newpassword456'
    };
    testEndpoint('Change Password', () => settingsApi.changePassword(sampleData));
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Settings API Tester
      </Typography>
      
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Button variant="contained" onClick={testGetSettings} disabled={loading}>
          Test GET Settings
        </Button>
        <Button variant="contained" onClick={testUpdatePersonal} disabled={loading}>
          Test Update Personal
        </Button>
        <Button variant="contained" onClick={testUpdateCompany} disabled={loading}>
          Test Update Company
        </Button>
        <Button variant="contained" onClick={testChangePassword} disabled={loading}>
          Test Change Password
        </Button>
      </Box>

      {loading && (
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <CircularProgress size={20} />
          <Typography>Testing API...</Typography>
        </Box>
      )}

      {result && (
        <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: 'success.light' }}>
          <Typography variant="h6" color="success.dark">
            ✓ {result.testName} - Success
          </Typography>
          <Typography variant="body2" component="pre" sx={{ mt: 1, fontSize: '0.8rem' }}>
            {JSON.stringify(result.data, null, 2)}
          </Typography>
        </Paper>
      )}

      {error && (
        <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: 'error.light' }}>
          <Typography variant="h6" color="error.dark">
            ✗ {error.testName} - Error
          </Typography>
          <Typography variant="body2" component="pre" sx={{ mt: 1, fontSize: '0.8rem' }}>
            {JSON.stringify(error.error, null, 2)}
          </Typography>
        </Paper>
      )}

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Make sure you have a valid JWT token in localStorage and the API server is running.
          You can get a token by logging in through the login endpoint first.
        </Typography>
      </Alert>
    </Box>
  );
};

export default SettingsApiTester;