import axios from 'axios';

// Create an instance of axios with default configuration
const axiosInstance = axios.create({
  baseURL: 'https://api.marketincer.com',
  timeout: 5000,
});

// Add middleware to intercept requests and responses
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any request headers or transformations here
    config.headers['Content-Type'] = 'application/json';
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    } else {
      console.warn('No authentication token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    // Handle request errors here
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses here
    console.log(`Response received for ${response.config.method.toUpperCase()} ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    // Handle response errors here
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // If it's a 401 error, the token might be expired
    if (error.response?.status === 401) {
      console.warn('Authentication failed - token may be expired');
      // Optionally redirect to login or refresh token
    }
    
    return Promise.reject(error);
  }
);

// CRUD operations
const AxiosManager = {
  get: (url, params) => axiosInstance.get(url, { params }),
  post: (url, data) => axiosInstance.post(url, data),
  put: (url, data) => axiosInstance.put(url, data),
  patch: (url, data) => axiosInstance.patch(url, data),
  delete: (url) => axiosInstance.delete(url),
};

export default AxiosManager;
