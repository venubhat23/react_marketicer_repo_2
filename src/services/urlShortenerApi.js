import AxiosManager from '../utils/api';
import {
  mockCreateShortUrl,
  mockGetUserUrls,
  mockUpdateShortUrl,
  mockDeleteShortUrl,
  mockGetUrlDetails,
  mockGetUserDashboard,
  mockGetUrlAnalytics,
  mockGetAnalyticsSummary,
  mockExportAnalytics,
  mockGetUrlPreview,
  mockGetUrlInfo,
  USE_MOCK_DATA
} from './mockUrlData';

/**
 * URL Shortener API Service
 * Complete implementation based on Bitly-like API documentation with comprehensive analytics
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

// Get URL Analytics - Enhanced with comprehensive data
export const getUrlAnalytics = async (shortCode) => {
  if (USE_MOCK_DATA) {
    return mockGetUrlAnalytics(shortCode);
  }
  
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
  if (USE_MOCK_DATA) {
    return mockGetAnalyticsSummary();
  }
  
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
  if (USE_MOCK_DATA) {
    return mockExportAnalytics(shortCode, format);
  }
  
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
  if (USE_MOCK_DATA) {
    // Generate mock data for date range
    return {
      success: true,
      data: {
        short_code: shortCode,
        date_range: { start: startDate, end: endDate },
        total_clicks: Math.floor(Math.random() * 100),
        clicks_by_day: generateMockClicksByDay(startDate, endDate)
      }
    };
  }
  
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
  if (USE_MOCK_DATA) {
    return {
      success: true,
      data: {
        short_code: shortCode,
        live_visitors: Math.floor(Math.random() * 10),
        clicks_last_hour: Math.floor(Math.random() * 20),
        recent_clicks: generateMockRecentClicks(5)
      }
    };
  }
  
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
  if (USE_MOCK_DATA) {
    return mockGetUrlPreview(shortCode);
  }
  
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
  if (USE_MOCK_DATA) {
    return mockGetUrlInfo(shortCode);
  }
  
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
  if (USE_MOCK_DATA) {
    return {
      success: true,
      data: {
        short_code: shortCode,
        conversion_rate: (Math.random() * 20).toFixed(2),
        conversions: Math.floor(Math.random() * 50),
        conversion_by_source: {
          'Direct': Math.floor(Math.random() * 20),
          'Social Media': Math.floor(Math.random() * 15),
          'Email': Math.floor(Math.random() * 10),
          'Search': Math.floor(Math.random() * 5)
        }
      }
    };
  }
  
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
  if (USE_MOCK_DATA) {
    return {
      success: true,
      data: {
        short_code: shortCode,
        clicks_by_country: {
          'USA': Math.floor(Math.random() * 100),
          'India': Math.floor(Math.random() * 80),
          'Germany': Math.floor(Math.random() * 60),
          'UK': Math.floor(Math.random() * 40),
          'Canada': Math.floor(Math.random() * 30)
        },
        clicks_by_city: {
          'New York': Math.floor(Math.random() * 50),
          'Mumbai': Math.floor(Math.random() * 40),
          'Berlin': Math.floor(Math.random() * 30),
          'London': Math.floor(Math.random() * 25),
          'Toronto': Math.floor(Math.random() * 20)
        }
      }
    };
  }
  
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
  if (USE_MOCK_DATA) {
    return {
      success: true,
      data: {
        short_code: shortCode,
        devices: {
          'Mobile': Math.floor(Math.random() * 100),
          'Desktop': Math.floor(Math.random() * 80),
          'Tablet': Math.floor(Math.random() * 20)
        },
        browsers: {
          'Chrome': Math.floor(Math.random() * 120),
          'Safari': Math.floor(Math.random() * 50),
          'Firefox': Math.floor(Math.random() * 30),
          'Edge': Math.floor(Math.random() * 20)
        },
        operating_systems: {
          'Windows': Math.floor(Math.random() * 80),
          'iOS': Math.floor(Math.random() * 60),
          'Android': Math.floor(Math.random() * 70),
          'macOS': Math.floor(Math.random() * 40),
          'Linux': Math.floor(Math.random() * 10)
        }
      }
    };
  }
  
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

// Generate mock clicks by day for date range
const generateMockClicksByDay = (startDate, endDate) => {
  const clicks = {};
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    clicks[dateStr] = Math.floor(Math.random() * 50);
  }
  
  return clicks;
};

// Generate mock recent clicks
const generateMockRecentClicks = (count) => {
  const clicks = [];
  const countries = ['USA', 'India', 'Germany', 'UK', 'Canada'];
  const cities = ['New York', 'Mumbai', 'Berlin', 'London', 'Toronto'];
  const devices = ['Mobile', 'Desktop', 'Tablet'];
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
  const os = ['Windows', 'iOS', 'Android', 'macOS'];
  
  for (let i = 0; i < count; i++) {
    clicks.push({
      id: i + 1,
      country: countries[Math.floor(Math.random() * countries.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      device_type: devices[Math.floor(Math.random() * devices.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      os: os[Math.floor(Math.random() * os.length)],
      referrer: Math.random() > 0.5 ? 'https://google.com' : 'Direct',
      ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      created_at: new Date(Date.now() - Math.random() * 86400000).toISOString()
    });
  }
  
  return clicks;
};

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