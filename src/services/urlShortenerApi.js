import AxiosManager from '../utils/api';

/**
 * URL Shortener API Service
 * Complete implementation using real API endpoints at https://api.marketincer.com
 */

// Base endpoints as per API specification
const API_BASE = '/api/v1';

/**
 * CORE URL SHORTENING ENDPOINTS
 */

// Create Short URL
export const createShortUrl = async (longUrl, title = '', description = '') => {
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
export const getUserUrls = async (userId, page = 1, perPage = 20) => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/users/${userId}/urls`, {
      params: {
        page: page,
        per_page: perPage
      }
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

// Get URL Analytics - Enhanced with comprehensive data
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

// Get Analytics Summary - Aggregated analytics for all user's URLs
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

// Export Analytics - Download CSV file
export const exportAnalytics = async (shortCode, format = 'csv') => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/analytics/${shortCode}/export`, {
      responseType: 'blob',
      params: { format }
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `analytics-${shortCode}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return {
      success: true,
      message: 'Analytics exported successfully'
    };
  } catch (error) {
    console.error('Error exporting analytics:', error);
    return handleApiResponse(error);
  }
};

// Get Analytics by Date Range
export const getAnalyticsByDateRange = async (shortCode, startDate, endDate) => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/analytics/${shortCode}/range`, {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching analytics by date range:', error);
    return handleApiResponse(error);
  }
};

// Get Real-time Analytics
export const getRealTimeAnalytics = async (shortCode) => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/analytics/${shortCode}/realtime`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching real-time analytics:', error);
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

// URL Redirection (for tracking)
export const trackUrlClick = async (shortCode, clickData = {}) => {
  try {
    const response = await AxiosManager.post(`/r/${shortCode}/track`, {
      ...clickData,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      referrer: document.referrer
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error tracking URL click:', error);
    return handleApiResponse(error);
  }
};

/**
 * ADVANCED ANALYTICS ENDPOINTS
 */

// Get Conversion Analytics
export const getConversionAnalytics = async (shortCode) => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/analytics/${shortCode}/conversions`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching conversion analytics:', error);
    return handleApiResponse(error);
  }
};

// Get Geographic Analytics
export const getGeographicAnalytics = async (shortCode) => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/analytics/${shortCode}/geographic`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching geographic analytics:', error);
    return handleApiResponse(error);
  }
};

// Get Technology Analytics (Devices, Browsers, OS)
export const getTechnologyAnalytics = async (shortCode) => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/analytics/${shortCode}/technology`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching technology analytics:', error);
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

// Format number with commas
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Calculate percentage
export const calculatePercentage = (part, total) => {
  if (total === 0) return 0;
  return ((part / total) * 100).toFixed(1);
};

// Get time period labels
export const getTimePeriodLabel = (period) => {
  const labels = {
    'today': 'Today',
    'yesterday': 'Yesterday',
    'week': 'This Week',
    'month': 'This Month',
    'year': 'This Year',
    'all': 'All Time'
  };
  return labels[period] || period;
};

// Export all functions
export default {
  // Core URL functions
  createShortUrl,
  getUserUrls,
  getUrlDetails,
  updateShortUrl,
  deleteShortUrl,
  
  // Dashboard & Analytics
  getUserDashboard,
  getUrlAnalytics,
  getAnalyticsSummary,
  exportAnalytics,
  getAnalyticsByDateRange,
  getRealTimeAnalytics,
  
  // Public endpoints
  getUrlPreview,
  getUrlInfo,
  trackUrlClick,
  
  // Advanced Analytics
  getConversionAnalytics,
  getGeographicAnalytics,
  getTechnologyAnalytics,
  
  // Utilities
  isValidUrl,
  generateQRCodeUrl,
  copyToClipboard,
  formatDate,
  daysSinceCreation,
  formatNumber,
  calculatePercentage,
  getTimePeriodLabel
};