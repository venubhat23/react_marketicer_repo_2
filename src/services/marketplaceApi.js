import AxiosManager from '../utils/api';

/**
 * Marketplace API Service
 * Handles all marketplace-related API calls
 */

// Base endpoints
const MARKETPLACE_ENDPOINTS = {
  POSTS: '/api/v1/marketplace/posts',
  FEED: '/api/v1/marketplace/feed',
  BIDS: '/api/v1/marketplace/posts',
  MESSAGES: '/api/v1/messages',
  UPLOAD: '/api/v1/upload',
  USER_PROFILE: '/api/v1/user/profile',
  ANALYTICS: '/api/v1/marketplace/posts'
};

/**
 * Authentication & User Management
 */
export const getUserProfile = async () => {
  try {
    const response = await AxiosManager.get(MARKETPLACE_ENDPOINTS.USER_PROFILE);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Marketplace Posts Management (Brand)
 */

// Get all posts by brand
export const getBrandPosts = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      status: params.status || '',
      category: params.category || '',
      ...params
    };
    
    const response = await AxiosManager.get(MARKETPLACE_ENDPOINTS.POSTS, queryParams);
    return response.data;
  } catch (error) {
    console.error('Error fetching brand posts:', error);
    throw error;
  }
};

// Create new post
export const createPost = async (postData) => {
  try {
    const response = await AxiosManager.post(MARKETPLACE_ENDPOINTS.POSTS, postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Update post
export const updatePost = async (postId, postData) => {
  try {
    const response = await AxiosManager.put(`${MARKETPLACE_ENDPOINTS.POSTS}/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Delete post
export const deletePost = async (postId) => {
  try {
    const response = await AxiosManager.delete(`${MARKETPLACE_ENDPOINTS.POSTS}/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

/**
 * Marketplace Feed (Influencer)
 */

// Get marketplace feed
export const getMarketplaceFeed = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 12,
      category: params.category || '',
      location: params.location || '',
      budget_min: params.budget_min || '',
      budget_max: params.budget_max || '',
      sort_by: params.sort_by || 'created_at',
      order: params.order || 'desc',
      ...params
    };
    
    const response = await AxiosManager.get(MARKETPLACE_ENDPOINTS.FEED, queryParams);
    return response.data;
  } catch (error) {
    console.error('Error fetching marketplace feed:', error);
    throw error;
  }
};

// Get single post details
export const getPostDetails = async (postId) => {
  try {
    const response = await AxiosManager.get(`${MARKETPLACE_ENDPOINTS.POSTS}/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post details:', error);
    throw error;
  }
};

/**
 * Bidding System
 */

// Submit bid (Influencer)
export const submitBid = async (postId, bidData) => {
  try {
    const response = await AxiosManager.post(`${MARKETPLACE_ENDPOINTS.BIDS}/${postId}/bids`, bidData);
    return response.data;
  } catch (error) {
    console.error('Error submitting bid:', error);
    throw error;
  }
};

// Get bids for post (Brand)
export const getPostBids = async (postId, params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      status: params.status || '',
      ...params
    };
    
    const response = await AxiosManager.get(`${MARKETPLACE_ENDPOINTS.BIDS}/${postId}/bids`, queryParams);
    return response.data;
  } catch (error) {
    console.error('Error fetching post bids:', error);
    throw error;
  }
};

// Update bid status (Brand)
export const updateBidStatus = async (bidId, statusData) => {
  try {
    const response = await AxiosManager.put(`/api/v1/marketplace/bids/${bidId}/status`, statusData);
    return response.data;
  } catch (error) {
    console.error('Error updating bid status:', error);
    throw error;
  }
};

// Get influencer's own bids (Influencer)
export const getInfluencerBids = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 20,
      status: params.status || '',
      ...params
    };
    
    const response = await AxiosManager.get(
      '/api/v1/marketplace/influencer/bids',
      { params: queryParams }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching influencer bids:', error);
    throw error;
  }
};

/**
 * Messaging System
 */

// Send message
export const sendMessage = async (messageData) => {
  try {
    const response = await AxiosManager.post(MARKETPLACE_ENDPOINTS.MESSAGES, messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get conversation messages
export const getMessages = async (recipientId, params = {}) => {
  try {
    const queryParams = {
      recipient_id: recipientId,
      page: params.page || 1,
      limit: params.limit || 50,
      ...params
    };
    
    const response = await AxiosManager.get(MARKETPLACE_ENDPOINTS.MESSAGES, queryParams);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

/**
 * File Upload
 */

// Upload media
export const uploadMedia = async (file, type = 'image') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    // Use the existing upload endpoint from CreateMarketplacePost
    const response = await fetch(
      'https://kitintellect.tech/storage/public/api/upload/aaFacebook',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    
    return {
      success: true,
      data: {
        url: data.url,
        type: type,
        size: file.size,
        filename: file.name
      }
    };
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};

/**
 * Analytics & Tracking
 */

// Track post view
export const trackPostView = async (postId) => {
  try {
    const response = await AxiosManager.post(`${MARKETPLACE_ENDPOINTS.POSTS}/${postId}/view`);
    return response.data;
  } catch (error) {
    console.error('Error tracking post view:', error);
    throw error;
  }
};

// Get post analytics (Brand)
export const getPostAnalytics = async (postId) => {
  try {
    const response = await AxiosManager.get(`${MARKETPLACE_ENDPOINTS.ANALYTICS}/${postId}/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post analytics:', error);
    throw error;
  }
};

/**
 * Search and Filter Utilities
 */

// Search posts with filters
export const searchPosts = async (searchParams) => {
  try {
    const isInfluencerFeed = searchParams.view === 'influencer';
    const endpoint = isInfluencerFeed ? MARKETPLACE_ENDPOINTS.FEED : MARKETPLACE_ENDPOINTS.POSTS;
    
    const response = await AxiosManager.get(endpoint, searchParams);
    return response.data;
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};

/**
 * Batch Operations
 */

// Batch update post statuses
export const batchUpdatePostStatus = async (postIds, status) => {
  try {
    const response = await AxiosManager.patch('/api/v1/marketplace/posts/batch-update', {
      post_ids: postIds,
      status: status
    });
    return response.data;
  } catch (error) {
    console.error('Error batch updating posts:', error);
    throw error;
  }
};

// Batch delete posts
export const batchDeletePosts = async (postIds) => {
  try {
    const response = await AxiosManager.delete('/api/v1/marketplace/posts/batch-delete', {
      data: { post_ids: postIds }
    });
    return response.data;
  } catch (error) {
    console.error('Error batch deleting posts:', error);
    throw error;
  }
};

/**
 * Statistics and Insights
 */

// Get marketplace statistics
export const getMarketplaceStats = async () => {
  try {
    const response = await AxiosManager.get('/api/v1/marketplace/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching marketplace stats:', error);
    throw error;
  }
};

// Get user activity insights
export const getUserActivityInsights = async (params = {}) => {
  try {
    const response = await AxiosManager.get('/api/v1/marketplace/insights', params);
    return response.data;
  } catch (error) {
    console.error('Error fetching user insights:', error);
    throw error;
  }
};

/**
 * Error Handling Utilities
 */

// Handle API errors with user-friendly messages
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.error?.message || 'Invalid request data';
      case 401:
        return 'Authentication required. Please log in.';
      case 403:
        return 'Access denied. You don\'t have permission to perform this action.';
      case 404:
        return 'Resource not found';
      case 409:
        return data.error?.message || 'Resource already exists';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.error?.message || 'An unexpected error occurred';
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your internet connection.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred';
  }
};

/**
 * Mock Data for Development (fallback when API is not available)
 */
export const getMockMarketplaceData = () => {
  return {
    posts: [
      {
        id: 1,
        title: "Instagram Reel for Fashion Brand",
        type: "Sponsored Post",
        status: "Published",
        dateCreated: "2024-01-15",
        views: 150,
        description: "Looking for fashion influencers to create engaging reels showcasing our new collection",
        budget: "₹10,000",
        deadline: "2024-02-01",
        category: "A",
        targetAudience: "18–24",
        location: "Mumbai",
        platform: "Instagram",
        languages: "Hindi, English",
        tags: "Fashion, Style, Trendy",
        imageUrl: "https://picsum.photos/400/300?random=1",
        brand: "StyleCo",
        bids_count: 5
      },
      {
        id: 2,
        title: "Product Review - Tech Gadget",
        type: "Product Review",
        status: "Published",
        dateCreated: "2024-01-12",
        views: 89,
        description: "Need tech reviewers for our latest smartphone accessory",
        budget: "₹5,000",
        deadline: "2024-01-30",
        category: "B",
        targetAudience: "24–30",
        location: "Delhi",
        platform: "YouTube",
        languages: "English",
        tags: "Tech, Review, Gadgets",
        imageUrl: "https://picsum.photos/400/300?random=2",
        brand: "TechCorp",
        bids_count: 3
      }
    ],
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: 2,
      items_per_page: 10
    }
  };
};

// Default export with all API functions
const MarketplaceAPI = {
  // User Management
  getUserProfile,
  
  // Posts Management
  getBrandPosts,
  createPost,
  updatePost,
  deletePost,
  getPostDetails,
  
  // Feed
  getMarketplaceFeed,
  
  // Bidding
  submitBid,
  getPostBids,
  updateBidStatus,
  getInfluencerBids,
  
  // Messaging
  sendMessage,
  getMessages,
  
  // File Upload
  uploadMedia,
  
  // Analytics
  trackPostView,
  getPostAnalytics,
  
  // Search & Filter
  searchPosts,
  
  // Batch Operations
  batchUpdatePostStatus,
  batchDeletePosts,
  
  // Statistics
  getMarketplaceStats,
  getUserActivityInsights,
  
  // Utilities
  handleApiError,
  getMockMarketplaceData
};

export default MarketplaceAPI;