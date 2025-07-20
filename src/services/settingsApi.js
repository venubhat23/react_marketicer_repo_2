import AxiosManager from '../utils/api';

// Settings API endpoints
const SETTINGS_ENDPOINTS = {
  GET_SETTINGS: '/api/v1/settings',
  UPDATE_PERSONAL_INFO: '/api/v1/settings/personal_information',
  UPDATE_COMPANY_DETAILS: '/api/v1/settings/company_details',
  CHANGE_PASSWORD: '/api/v1/settings/change_password',
};

// Settings API service
export const settingsApi = {
  // Get all user settings
  getSettings: async () => {
    try {
      const response = await AxiosManager.get(SETTINGS_ENDPOINTS.GET_SETTINGS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update personal information
  updatePersonalInformation: async (personalInfo) => {
    try {
      const response = await AxiosManager.patch(
        SETTINGS_ENDPOINTS.UPDATE_PERSONAL_INFO,
        { personal_information: personalInfo }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update company details
  updateCompanyDetails: async (companyDetails) => {
    try {
      const response = await AxiosManager.patch(
        SETTINGS_ENDPOINTS.UPDATE_COMPANY_DETAILS,
        { company_details: companyDetails }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await AxiosManager.patch(
        SETTINGS_ENDPOINTS.CHANGE_PASSWORD,
        passwordData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default settingsApi;