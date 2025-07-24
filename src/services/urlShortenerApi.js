import AxiosManager from '../utils/api';
import {
  mockCreateShortUrl,
  mockGetUserUrls,
  mockUpdateShortUrl,
  mockDeleteShortUrl,
  mockGetUrlDetails,
  mockGetUserDashboard,
  USE_MOCK_DATA
} from './mockUrlData';

/**
 * URL Shortener API Service
 * Complete implementation based on Bitly-like API documentation
 */

// Base endpoints as per API specification
const API_BASE = '/api/v1';

/**
 * CORE URL SHORTENING ENDPOINTS
 */

// Create Short URL
export const createShortUrl = async (longUrl, title = '', description = '') => {
  if (USE_MOCK_DATA) {
    return mockCreateShortUrl(longUrl, title, description);
  }
  
  try {
    const requestData = {
      short_url: {
        long_url: longUrl,
        title: title,
        description: description
      }
    };
    
    const response = await AxiosManager.post(`${API_BASE}/shorten`, requestData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error creating short URL:', error);
    return handleApiResponse(error);
  }
};

// Get User URLs with pagination
export const getUserUrls = async (userId, page = 1) => {
  if (USE_MOCK_DATA) {
    return mockGetUserUrls(userId, page);
  }
  
  try {
    const response = await AxiosManager.get(`${API_BASE}/users/${userId}/urls`, {
      page: page
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching user URLs:', error);
    return handleApiResponse(error);
  }
};

// Get Single URL Details
export const getUrlDetails = async (urlId) => {
  if (USE_MOCK_DATA) {
    return mockGetUrlDetails(urlId);
  }
  
  try {
    const response = await AxiosManager.get(`${API_BASE}/short_urls/${urlId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching URL details:', error);
    return handleApiResponse(error);
  }
};

// Update Short URL
export const updateShortUrl = async (urlId, title, description, active = true) => {
  if (USE_MOCK_DATA) {
    return mockUpdateShortUrl(urlId, title, description, active);
  }
  
  try {
    const requestData = {
      short_url: {
        title: title,
        description: description,
        active: active
      }
    };
    
    const response = await AxiosManager.put(`${API_BASE}/short_urls/${urlId}`, requestData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating short URL:', error);
    return handleApiResponse(error);
  }
};

// Delete/Deactivate URL
export const deleteShortUrl = async (urlId) => {
  if (USE_MOCK_DATA) {
    return mockDeleteShortUrl(urlId);
  }
  
  try {
    const response = await AxiosManager.delete(`${API_BASE}/short_urls/${urlId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error deleting short URL:', error);
    return handleApiResponse(error);
  }
};

/**
 * DASHBOARD & ANALYTICS ENDPOINTS
 */

// Get User Dashboard
export const getUserDashboard = async (userId) => {
  if (USE_MOCK_DATA) {
    return mockGetUserDashboard(userId);
  }
  
  try {
    const response = await AxiosManager.get(`${API_BASE}/users/${userId}/dashboard`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    return handleApiResponse(error);
  }
};

// Get URL Analytics
export const getUrlAnalytics = async (shortCode) => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/analytics/${shortCode}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching URL analytics:', error);
    return handleApiResponse(error);
  }
};

// Get Analytics Summary
export const getAnalyticsSummary = async () => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/analytics/summary`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return handleApiResponse(error);
  }
};

// Export Analytics
export const exportAnalytics = async (shortCode) => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/analytics/${shortCode}/export`, {
      responseType: 'blob'
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error exporting analytics:', error);
    return handleApiResponse(error);
  }
};

/**
 * PUBLIC ENDPOINTS (No Auth Required)
 */

// URL Preview
export const getUrlPreview = async (shortCode) => {
  try {
    const response = await AxiosManager.get(`/r/${shortCode}/preview`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching URL preview:', error);
    return handleApiResponse(error);
  }
};

// URL Info (with QR code)
export const getUrlInfo = async (shortCode) => {
  try {
    const response = await AxiosManager.get(`/r/${shortCode}/info`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching URL info:', error);
    return handleApiResponse(error);
  }
};

/**
 * UTILITY FUNCTIONS
 */

// Handle API Response Errors
const handleApiResponse = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      success: false,
      error: data.error || 'API Error',
      message: data.message || 'An error occurred',
      errors: data.errors || [],
      statusCode: status
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      error: 'Network Error',
      message: 'No response from server',
      errors: ['Network connection failed']
    };
  } else {
    // Something else happened
    return {
      success: false,
      error: 'Unknown Error',
      message: error.message || 'An unexpected error occurred',
      errors: [error.message || 'Unknown error']
    };
  }
};

// Validate URL format
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Generate QR Code URL
export const generateQRCodeUrl = (shortUrl, size = '200x200') => {
  const encodedUrl = encodeURIComponent(shortUrl);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodedUrl}`;
};

// Copy to clipboard utility
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculate days since creation
export const daysSinceCreation = (dateString) => {
  const created = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default {
  createShortUrl,
  getUserUrls,
  getUrlDetails,
  updateShortUrl,
  deleteShortUrl,
  getUserDashboard,
  getUrlAnalytics,
  getAnalyticsSummary,
  exportAnalytics,
  getUrlPreview,
  getUrlInfo,
  isValidUrl,
  generateQRCodeUrl,
  copyToClipboard,
  formatDate,
  daysSinceCreation
};