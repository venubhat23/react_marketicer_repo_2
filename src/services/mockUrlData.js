/**
 * Mock Data for URL Shortener Testing
 * This file provides mock data and functions for testing the URL shortener
 * when the actual API is not available
 */

// Mock URLs data
const mockUrls = [
  {
    id: 1,
    long_url: 'https://example.com/very-long-url-path-that-needs-shortening',
    short_url: 'https://short.ly/abc123',
    short_code: 'abc123',
    title: 'Example Website',
    description: 'This is an example website for testing',
    clicks: 45,
    active: true,
    created_at: '2025-01-20T10:00:00Z'
  },
  {
    id: 2,
    long_url: 'https://github.com/facebook/react',
    short_url: 'https://short.ly/react',
    short_code: 'react',
    title: 'React GitHub Repository',
    description: 'Official React.js repository on GitHub',
    clicks: 128,
    active: true,
    created_at: '2025-01-19T15:30:00Z'
  },
  {
    id: 3,
    long_url: 'https://mui.com/material-ui/getting-started/overview/',
    short_url: 'https://short.ly/mui-docs',
    short_code: 'mui-docs',
    title: 'Material-UI Documentation',
    description: 'Getting started with Material-UI components',
    clicks: 73,
    active: true,
    created_at: '2025-01-18T09:15:00Z'
  },
  {
    id: 4,
    long_url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    short_url: 'https://short.ly/js-docs',
    short_code: 'js-docs',
    title: 'JavaScript MDN Docs',
    description: 'Complete JavaScript documentation and tutorials',
    clicks: 92,
    active: false,
    created_at: '2025-01-17T14:20:00Z'
  },
  {
    id: 5,
    long_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    short_url: 'https://short.ly/never-gonna',
    short_code: 'never-gonna',
    title: 'Popular Music Video',
    description: 'A classic music video that everyone should watch',
    clicks: 1547,
    active: true,
    created_at: '2025-01-16T11:45:00Z'
  }
];

// Generate a random short code
const generateShortCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Mock API functions
export const mockCreateShortUrl = async (longUrl, title = '', description = '') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const shortCode = generateShortCode();
  const newUrl = {
    id: mockUrls.length + 1,
    long_url: longUrl,
    short_url: `https://short.ly/${shortCode}`,
    short_code: shortCode,
    title: title || 'Untitled',
    description: description || '',
    clicks: 0,
    active: true,
    created_at: new Date().toISOString()
  };
  
  mockUrls.unshift(newUrl); // Add to beginning of array
  
  return {
    success: true,
    data: newUrl
  };
};

export const mockGetUserUrls = async (userId, page = 1) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    data: {
      user_id: userId,
      total_links: mockUrls.length,
      total_clicks: mockUrls.reduce((sum, url) => sum + url.clicks, 0),
      page: page,
      per_page: 20,
      urls: mockUrls
    }
  };
};

export const mockUpdateShortUrl = async (urlId, title, description, active = true) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const urlIndex = mockUrls.findIndex(url => url.id === urlId);
  if (urlIndex !== -1) {
    mockUrls[urlIndex] = {
      ...mockUrls[urlIndex],
      title,
      description,
      active
    };
    
    return {
      success: true,
      data: mockUrls[urlIndex]
    };
  }
  
  return {
    success: false,
    message: 'URL not found'
  };
};

export const mockDeleteShortUrl = async (urlId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const urlIndex = mockUrls.findIndex(url => url.id === urlId);
  if (urlIndex !== -1) {
    mockUrls.splice(urlIndex, 1);
    return {
      success: true,
      message: 'URL deleted successfully'
    };
  }
  
  return {
    success: false,
    message: 'URL not found'
  };
};

export const mockGetUrlDetails = async (urlId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const url = mockUrls.find(url => url.id === urlId);
  if (url) {
    return {
      success: true,
      data: {
        ...url,
        analytics: {
          clicks_today: Math.floor(Math.random() * 10),
          clicks_this_week: Math.floor(Math.random() * 50),
          clicks_this_month: url.clicks,
          clicks_by_country: {
            'USA': Math.floor(url.clicks * 0.4),
            'India': Math.floor(url.clicks * 0.3),
            'Germany': Math.floor(url.clicks * 0.2),
            'Others': Math.floor(url.clicks * 0.1)
          },
          clicks_by_device: {
            'Mobile': Math.floor(url.clicks * 0.6),
            'Desktop': Math.floor(url.clicks * 0.3),
            'Tablet': Math.floor(url.clicks * 0.1)
          },
          clicks_by_browser: {
            'Chrome': Math.floor(url.clicks * 0.7),
            'Safari': Math.floor(url.clicks * 0.2),
            'Firefox': Math.floor(url.clicks * 0.1)
          }
        }
      }
    };
  }
  
  return {
    success: false,
    message: 'URL not found'
  };
};

export const mockGetUserDashboard = async (userId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const totalClicks = mockUrls.reduce((sum, url) => sum + url.clicks, 0);
  const recentUrls = mockUrls.slice(0, 3);
  const topUrls = [...mockUrls].sort((a, b) => b.clicks - a.clicks).slice(0, 3);
  
  return {
    success: true,
    data: {
      user_id: userId,
      total_urls: mockUrls.length,
      total_clicks: totalClicks,
      urls_created_this_month: mockUrls.filter(url => {
        const created = new Date(url.created_at);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length,
      recent_urls: recentUrls,
      top_performing_urls: topUrls
    }
  };
};

// Environment flag to use mock data
export const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || !process.env.REACT_APP_API_URL;

export default {
  mockUrls,
  mockCreateShortUrl,
  mockGetUserUrls,
  mockUpdateShortUrl,
  mockDeleteShortUrl,
  mockGetUrlDetails,
  mockGetUserDashboard,
  USE_MOCK_DATA
};