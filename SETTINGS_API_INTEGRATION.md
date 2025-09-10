# Settings API Integration

This document describes the complete implementation of the Settings API integration in the React application.

## Overview

The Settings API integration provides a complete user interface for managing user settings including:
- Personal Information (name, email, phone, bio, avatar)
- Company Details (company name, GST details, address, website)
- Password Management

## Files Created/Modified

### 1. API Service Layer
- **`src/services/settingsApi.js`** - API service functions for all Settings endpoints
- **`src/utils/api.js`** - Added PATCH method support

### 2. React Hooks
- **`src/hooks/useSettings.js`** - Custom React Query hooks for Settings API

### 3. UI Components
- **`src/pages/Setting/SettingPage.js`** - Updated with full API integration
- **`src/components/SettingsApiTester.js`** - API testing component

### 4. Documentation
- **`SETTINGS_API_INTEGRATION.md`** - This documentation file

## API Endpoints Integrated

### 1. GET /api/v1/settings
- **Purpose**: Fetch all user settings
- **Hook**: `useGetSettings()`
- **Features**: 
  - Automatic caching with React Query
  - 5-minute stale time
  - Error handling with toast notifications

### 2. PATCH /api/v1/settings/personal_information
- **Purpose**: Update personal information
- **Hook**: `useUpdatePersonalInformation()`
- **Features**:
  - Optimistic cache updates
  - Validation error handling
  - Success/error toast notifications

### 3. PATCH /api/v1/settings/company_details
- **Purpose**: Update company details
- **Hook**: `useUpdateCompanyDetails()`
- **Features**:
  - Optimistic cache updates
  - Validation error handling
  - Success/error toast notifications

### 4. PATCH /api/v1/settings/change_password
- **Purpose**: Change user password
- **Hook**: `useChangePassword()`
- **Features**:
  - Client-side password confirmation validation
  - Secure form handling
  - Success/error toast notifications

## Key Features

### 1. State Management
- **React Query**: Used for server state management and caching
- **Local State**: Form data managed with React useState
- **Separate Edit Modes**: Independent edit states for personal and company sections

### 2. Form Handling
- **Controlled Components**: All form inputs are controlled
- **Real-time Validation**: Password confirmation validation
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Comprehensive error display

### 3. User Experience
- **Loading Indicators**: Shows loading spinner while fetching data
- **Edit/Save Flow**: Clean toggle between view and edit modes
- **Toast Notifications**: Success and error messages
- **Responsive Design**: Works on all screen sizes

## Usage Examples

### Basic Usage in Components
```javascript
import { useGetSettings, useUpdatePersonalInformation } from '../hooks/useSettings';

const MyComponent = () => {
  const { data, isLoading, error } = useGetSettings();
  const updatePersonal = useUpdatePersonalInformation();

  const handleUpdate = async (formData) => {
    try {
      await updatePersonal.mutateAsync(formData);
      // Success handled by hook
    } catch (error) {
      // Error handled by hook
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data?.data?.personal_information?.first_name}</h1>
      {/* Your form here */}
    </div>
  );
};
```

### Direct API Usage
```javascript
import settingsApi from '../services/settingsApi';

// Get settings
const settings = await settingsApi.getSettings();

// Update personal information
const updatedPersonal = await settingsApi.updatePersonalInformation({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com'
});

// Update company details
const updatedCompany = await settingsApi.updateCompanyDetails({
  company_name: 'My Company',
  gst_number: '29ABCDE1234F1Z5'
});

// Change password
await settingsApi.changePassword({
  current_password: 'oldpass',
  new_password: 'newpass',
  confirm_password: 'newpass'
});
```

## Testing

### API Tester Component
Use the `SettingsApiTester` component to test all endpoints:

```javascript
import SettingsApiTester from '../components/SettingsApiTester';

// Add to your route or component
<SettingsApiTester />
```

### Manual Testing with cURL

1. **Get JWT Token**:
```bash
curl -X POST http://localhost:3000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email": "oliva@untitledui.com", "password": "password123"}'
```

2. **Test Settings Endpoints**:
```bash
# Get settings
curl -X GET http://localhost:3000/api/v1/settings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update personal info
curl -X PATCH http://localhost:3000/api/v1/settings/personal_information \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"personal_information": {"first_name": "John", "last_name": "Doe"}}'
```

## Error Handling

### Client-Side Validation
- Password confirmation matching
- Required field validation
- Email format validation (browser native)

### Server-Side Error Handling
- **422 Unprocessable Entity**: Validation errors displayed as toast messages
- **401 Unauthorized**: Authentication errors
- **500 Internal Server Error**: Generic error handling

### Network Error Handling
- Connection timeouts
- Network unavailability
- Request/response interceptors for global error handling

## Configuration

### API Base URL
Update in `src/utils/api.js`:
```javascript
const axiosInstance = axios.create({
  baseURL: 'https://your-api-domain.com', // Change this
  timeout: 5000,
});
```

### Authentication
JWT tokens are automatically included from localStorage:
```javascript
config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
```

## Dependencies

Required packages (already included in package.json):
- `@tanstack/react-query` - Server state management
- `axios` - HTTP client
- `react-toastify` - Toast notifications
- `@mui/material` - UI components

## Best Practices Implemented

1. **Separation of Concerns**: API logic separated from UI components
2. **Custom Hooks**: Reusable hooks for different components
3. **Error Boundaries**: Comprehensive error handling
4. **Loading States**: User feedback during async operations
5. **Optimistic Updates**: Cache updates for better UX
6. **Type Safety**: Consistent data structures
7. **Responsive Design**: Works on all devices

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check if JWT token exists in localStorage
   - Verify token hasn't expired
   - Ensure login API is working

2. **Network Errors**
   - Verify API server is running
   - Check CORS configuration
   - Confirm API base URL is correct

3. **Validation Errors**
   - Check API documentation for required fields
   - Verify data format matches API expectations
   - Review server logs for detailed error messages

### Debug Mode
Enable debug logging by adding to your component:
```javascript
const { data, isLoading, error } = useGetSettings();
console.log('Settings data:', data);
console.log('Loading state:', isLoading);
console.log('Error state:', error);
```

## Future Enhancements

Potential improvements that could be added:
1. **Image Upload**: Avatar image upload functionality
2. **Form Validation**: More comprehensive client-side validation
3. **Undo/Redo**: Action history for settings changes
4. **Real-time Updates**: WebSocket integration for live updates
5. **Offline Support**: PWA capabilities with offline data sync
6. **Audit Trail**: Track settings change history
7. **Bulk Updates**: Update multiple sections at once
8. **Data Export**: Export settings data

## Support

For issues or questions regarding the Settings API integration:
1. Check this documentation first
2. Review the API documentation
3. Test with the SettingsApiTester component
4. Check browser console for error messages
5. Verify network requests in browser dev tools