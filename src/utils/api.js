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
    config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses here
    return response;
  },
  (error) => {
    // Handle response errors here
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
