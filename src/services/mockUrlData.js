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
    short_url: 'https://app.marketincer.com/r/abc123',
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
    short_url: 'https://app.marketincer.com/r/react',
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
    short_url: 'https://app.marketincer.com/r/mui-docs',
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
    short_url: 'https://app.marketincer.com/r/js-docs',
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
    short_url: 'https://app.marketincer.com/r/never-gonna',
    short_code: 'never-gonna',
    title: 'Popular Music Video',
    description: 'A classic music video that everyone should watch',
    clicks: 1547,
    active: true,
    created_at: '2025-01-16T11:45:00Z'
  }
];

// Generate mock analytics data
const generateMockAnalytics = (shortCode, totalClicks = 100) => {
  const countries = ['USA', 'India', 'Germany', 'UK', 'Canada', 'Australia', 'France', 'Japan', 'Brazil'];
  const cities = ['New York', 'Mumbai', 'Berlin', 'London', 'Toronto', 'Sydney', 'Paris', 'Tokyo', 'São Paulo'];
  const devices = ['Mobile', 'Desktop', 'Tablet'];
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Opera'];
  const os = ['Windows', 'iOS', 'Android', 'macOS', 'Linux'];
  
  // Generate clicks by country
  const clicksByCountry = {};
  let remainingClicks = totalClicks;
  countries.slice(0, 5).forEach((country, index) => {
    const percentage = index === 0 ? 0.4 : index === 1 ? 0.3 : index === 2 ? 0.2 : 0.05;
    const clicks = Math.floor(totalClicks * percentage);
    clicksByCountry[country] = clicks;
    remainingClicks -= clicks;
  });
  if (remainingClicks > 0) {
    clicksByCountry['Others'] = remainingClicks;
  }
  
  // Generate clicks by device
  const clicksByDevice = {
    'Mobile': Math.floor(totalClicks * 0.6),
    'Desktop': Math.floor(totalClicks * 0.3),
    'Tablet': Math.floor(totalClicks * 0.1)
  };
  
  // Generate clicks by browser
  const clicksByBrowser = {
    'Chrome': Math.floor(totalClicks * 0.7),
    'Safari': Math.floor(totalClicks * 0.15),
    'Firefox': Math.floor(totalClicks * 0.1),
    'Edge': Math.floor(totalClicks * 0.05)
  };
  
  // Generate clicks by day (last 30 days)
  const clicksByDay = {};
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    clicksByDay[dateStr] = Math.floor(Math.random() * (totalClicks / 15)) + 1;
  }
  
  // Generate recent clicks
  const recentClicks = [];
  for (let i = 0; i < 20; i++) {
    recentClicks.push({
      id: i + 1,
      country: countries[Math.floor(Math.random() * countries.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      device_type: devices[Math.floor(Math.random() * devices.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      os: os[Math.floor(Math.random() * os.length)],
      referrer: Math.random() > 0.6 ? 'https://google.com' : Math.random() > 0.3 ? 'https://facebook.com' : 'Direct',
      ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      created_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
    });
  }
  
  return {
    clicks_by_country: clicksByCountry,
    clicks_by_device: clicksByDevice,
    clicks_by_browser: clicksByBrowser,
    clicks_by_day: clicksByDay,
    recent_clicks: recentClicks
  };
};

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
    short_url: `https://app.marketincer.com/r/${shortCode}`,
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
    data: {
      ...newUrl,
      message: "URL shortened successfully"
    }
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
      active,
      updated_at: new Date().toISOString()
    };
    
    return {
      success: true,
      data: {
        ...mockUrls[urlIndex],
        message: "Short URL updated successfully"
      }
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
      data: {
        message: 'Short URL deactivated successfully'
      }
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
    const analytics = generateMockAnalytics(url.short_code, url.clicks);
    return {
      success: true,
      data: {
        ...url,
        analytics: {
          clicks_today: Math.floor(Math.random() * 10),
          clicks_this_week: Math.floor(Math.random() * 50),
          clicks_this_month: url.clicks,
          ...analytics
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

// New Analytics Mock Functions

export const mockGetUrlAnalytics = async (shortCode) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const url = mockUrls.find(url => url.short_code === shortCode);
  if (!url) {
    return {
      success: false,
      message: 'Short URL not found'
    };
  }
  
  const analytics = generateMockAnalytics(shortCode, url.clicks);
  
  return {
    success: true,
    data: {
      short_code: shortCode,
      short_url: url.short_url,
      long_url: url.long_url,
      title: url.title,
      description: url.description,
      total_clicks: url.clicks,
      created_at: url.created_at,
      ...analytics,
      performance_metrics: {
        clicks_today: Math.floor(Math.random() * 10) + 1,
        clicks_this_week: Math.floor(Math.random() * 50) + 10,
        clicks_this_month: url.clicks,
        average_clicks_per_day: (url.clicks / 30).toFixed(1),
        peak_day: {
          date: '2025-01-22',
          clicks: Math.max(...Object.values(analytics.clicks_by_day))
        },
        conversion_rate: (Math.random() * 15 + 5).toFixed(1)
      }
    }
  };
};

// Mock Unified Analytics - All analytics data in one call
export const mockGetUnifiedAnalytics = async (shortCode) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const url = mockUrls.find(u => u.short_code === shortCode);
  if (!url) {
    return {
      success: false,
      error: 'URL not found'
    };
  }

  const analytics = generateMockAnalytics(shortCode, url.clicks);
  
  return {
    success: true,
    data: {
      basic: {
        url: {
          id: url.id,
          title: url.title,
          original_url: url.original_url,
          short_url: url.short_url,
          short_code: shortCode,
          created_at: url.created_at,
          clicks: url.clicks,
          status: url.status
        },
        ...analytics,
        total_clicks: url.clicks,
        today_clicks: Math.max(...Object.values(analytics.clicks_by_day)),
        week_clicks: Object.values(analytics.clicks_by_day).slice(-7).reduce((a, b) => a + b, 0)
      },
      geographic: {
        countries: analytics.countries,
        cities: analytics.cities
      },
      technology: {
        devices: analytics.devices,
        browsers: analytics.browsers,
        operating_systems: analytics.operating_systems || {
          'Windows': Math.floor(url.clicks * 0.45),
          'macOS': Math.floor(url.clicks * 0.25),
          'iOS': Math.floor(url.clicks * 0.15),
          'Android': Math.floor(url.clicks * 0.10),
          'Linux': Math.floor(url.clicks * 0.05)
        }
      },
      conversions: {
        conversion_rate: (Math.random() * 15 + 5).toFixed(2), // 5-20%
        total_conversions: Math.floor(url.clicks * 0.12),
        conversion_sources: {
          'Direct': Math.floor(url.clicks * 0.04),
          'Social Media': Math.floor(url.clicks * 0.03),
          'Email': Math.floor(url.clicks * 0.03),
          'Search': Math.floor(url.clicks * 0.02)
        }
      },
      realtime: {
        active_users: Math.floor(Math.random() * 50 + 10),
        clicks_last_hour: Math.floor(Math.random() * 20 + 5),
        clicks_last_24h: Math.floor(url.clicks * 0.1),
        peak_hour: `${Math.floor(Math.random() * 12 + 1)}:00 ${Math.random() > 0.5 ? 'PM' : 'AM'}`
      }
    }
  };
};

export const mockGetAnalyticsSummary = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const totalClicks = mockUrls.reduce((sum, url) => sum + url.clicks, 0);
  const topUrls = [...mockUrls].sort((a, b) => b.clicks - a.clicks).slice(0, 5);
  
  // Generate aggregated analytics
  const clicksOverTime = {};
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    clicksOverTime[dateStr] = Math.floor(Math.random() * 100) + 10;
  }
  
  return {
    success: true,
    data: {
      user_id: 123,
      total_urls: mockUrls.length,
      total_clicks: totalClicks,
      average_clicks_per_url: (totalClicks / mockUrls.length).toFixed(2),
      top_performing_urls: topUrls.map(url => ({
        short_code: url.short_code,
        short_url: url.short_url,
        long_url: url.long_url,
        clicks: url.clicks,
        created_at: url.created_at
      })),
      clicks_over_time: clicksOverTime,
      device_breakdown: {
        'Mobile': Math.floor(totalClicks * 0.6),
        'Desktop': Math.floor(totalClicks * 0.3),
        'Tablet': Math.floor(totalClicks * 0.1)
      },
      country_breakdown: {
        'USA': Math.floor(totalClicks * 0.4),
        'India': Math.floor(totalClicks * 0.25),
        'Germany': Math.floor(totalClicks * 0.15),
        'Canada': Math.floor(totalClicks * 0.1),
        'UK': Math.floor(totalClicks * 0.1)
      },
      browser_breakdown: {
        'Chrome': Math.floor(totalClicks * 0.7),
        'Safari': Math.floor(totalClicks * 0.15),
        'Firefox': Math.floor(totalClicks * 0.1),
        'Edge': Math.floor(totalClicks * 0.05)
      }
    }
  };
};

export const mockExportAnalytics = async (shortCode, format = 'csv') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const url = mockUrls.find(url => url.short_code === shortCode);
  if (!url) {
    return {
      success: false,
      message: 'Short URL not found'
    };
  }
  
  // Generate mock CSV data
  const csvData = `Date,Time,Country,City,Device,Browser,OS,Referrer,IP Address
2025-01-22,14:30:00,USA,New York,Mobile,Chrome,iOS,https://google.com,192.168.1.100
2025-01-22,13:45:00,India,Mumbai,Desktop,Safari,macOS,Direct,192.168.1.101
2025-01-22,12:15:00,Germany,Berlin,Mobile,Firefox,Android,https://facebook.com,192.168.1.102
2025-01-21,16:20:00,UK,London,Desktop,Chrome,Windows,https://twitter.com,192.168.1.103
2025-01-21,11:30:00,Canada,Toronto,Tablet,Safari,iOS,Direct,192.168.1.104`;
  
  // Create and download file
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url_obj = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url_obj;
  link.setAttribute('download', `analytics-${shortCode}.${format}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url_obj);
  
  return {
    success: true,
    message: 'Analytics exported successfully'
  };
};

export const mockGetUrlPreview = async (shortCode) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const url = mockUrls.find(url => url.short_code === shortCode);
  if (!url) {
    return {
      success: false,
      error: 'Short URL not found or inactive',
      message: 'The requested short URL does not exist or has been deactivated'
    };
  }
  
  return {
    success: true,
    data: {
      short_code: shortCode,
      short_url: url.short_url,
      long_url: url.long_url,
      title: url.title,
      description: `This link will redirect you to: ${url.long_url}`,
      clicks: url.clicks,
      created_at: url.created_at,
      warning: 'You are about to be redirected to an external website. Please verify the URL is safe before proceeding.'
    }
  };
};

export const mockGetUrlInfo = async (shortCode) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const url = mockUrls.find(url => url.short_code === shortCode);
  if (!url) {
    return {
      success: false,
      error: 'Short URL not found',
      message: 'The requested short URL does not exist'
    };
  }
  
  return {
    success: true,
    data: {
      short_code: shortCode,
      short_url: url.short_url,
      long_url: url.long_url,
      title: url.title,
      description: url.description,
      clicks: url.clicks,
      created_at: url.created_at,
      qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url.short_url)}`
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
  mockGetUrlAnalytics,
  mockGetUnifiedAnalytics,
  mockGetAnalyticsSummary,
  mockExportAnalytics,
  mockGetUrlPreview,
  mockGetUrlInfo,
  USE_MOCK_DATA,
  generateMockAnalytics
};