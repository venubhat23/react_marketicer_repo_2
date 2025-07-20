import AxiosManager from '../utils/api';

// Settings API endpoints
const SETTINGS_ENDPOINTS = {
  GET_SETTINGS: '/api/v1/settings',
  UPDATE_PERSONAL_INFO: '/api/v1/settings/personal_information',
  UPDATE_COMPANY_DETAILS: '/api/v1/settings/company_details',
  CHANGE_PASSWORD: '/api/v1/settings/change_password',
};

// Validation helpers
const validatePersonalInfo = (personalInfo) => {
  const errors = [];
  
  if (!personalInfo.first_name?.trim()) {
    errors.push('First name is required');
  }
  
  if (!personalInfo.last_name?.trim()) {
    errors.push('Last name is required');
  }
  
  if (!personalInfo.email?.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (personalInfo.phone_number && !/^\+\d{1,4}\s?\(\d{3}\)\s?\d{3}-\d{4}$/.test(personalInfo.phone_number.replace(/\s/g, ''))) {
    // Allow flexible phone format but encourage the standard format
  }
  
  return errors;
};

const validateCompanyDetails = (companyDetails) => {
  const errors = [];
  
  if (!companyDetails.company_name?.trim()) {
    errors.push('Company name is required');
  }
  
  if (companyDetails.gst_number && !/^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/.test(companyDetails.gst_number)) {
    errors.push('Please enter a valid GST number (e.g., 29ABCDE1234F1Z5)');
  }
  
  if (companyDetails.company_website && !/^https?:\/\/.+\..+/.test(companyDetails.company_website)) {
    errors.push('Please enter a valid website URL');
  }
  
  return errors;
};

const validatePasswordData = (passwordData) => {
  const errors = [];
  
  if (!passwordData.current_password) {
    errors.push('Current password is required');
  }
  
  if (!passwordData.new_password) {
    errors.push('New password is required');
  } else if (passwordData.new_password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (passwordData.new_password !== passwordData.confirm_password) {
    errors.push("Password confirmation doesn't match");
  }
  
  return errors;
};

// Settings API service
export const settingsApi = {
  // Get all user settings
  getSettings: async () => {
    try {
      const response = await AxiosManager.get(SETTINGS_ENDPOINTS.GET_SETTINGS);
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error.response?.data || error;
    }
  },

  // Update personal information
  updatePersonalInformation: async (personalInfo) => {
    // Client-side validation
    const validationErrors = validatePersonalInfo(personalInfo);
    if (validationErrors.length > 0) {
      throw { message: 'Validation failed', errors: validationErrors };
    }

    try {
      const response = await AxiosManager.patch(
        SETTINGS_ENDPOINTS.UPDATE_PERSONAL_INFO,
        { personal_information: personalInfo }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating personal information:', error);
      throw error.response?.data || error;
    }
  },

  // Update company details
  updateCompanyDetails: async (companyDetails) => {
    // Client-side validation
    const validationErrors = validateCompanyDetails(companyDetails);
    if (validationErrors.length > 0) {
      throw { message: 'Validation failed', errors: validationErrors };
    }

    try {
      const response = await AxiosManager.patch(
        SETTINGS_ENDPOINTS.UPDATE_COMPANY_DETAILS,
        { company_details: companyDetails }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating company details:', error);
      throw error.response?.data || error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    // Client-side validation
    const validationErrors = validatePasswordData(passwordData);
    if (validationErrors.length > 0) {
      throw { message: 'Validation failed', errors: validationErrors };
    }

    try {
      const response = await AxiosManager.patch(
        SETTINGS_ENDPOINTS.CHANGE_PASSWORD,
        passwordData
      );
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error.response?.data || error;
    }
  },
};

export default settingsApi;