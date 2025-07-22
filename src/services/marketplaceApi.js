import AxiosManager from '../utils/api';

/**
 * Marketplace API Service
 * Complete implementation based on API documentation
 */

// Base endpoints as per API specification
const API_BASE = '/api/v1';

/**
 * USER MANAGEMENT ENDPOINTS
 */

// Get User Profile
export const getUserProfile = async () => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/user/profile`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return handleApiResponse(error);
  }
};

/**
 * MARKETPLACE POSTS ENDPOINTS
 */

// Get Marketplace Feed (Influencers Only)
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
    
    const response = await AxiosManager.get(`${API_BASE}/marketplace/feed`, queryParams);
    return {
      success: true,
      data: response.data.data?.posts || [],
      pagination: response.data.data?.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching marketplace feed:', error);
    return handleApiResponse(error);
  }
};

// Get All Posts by Brand (Brand Only)
export const getMyMarketplacePosts = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      status: params.status || '',
      category: params.category || '',
      ...params
    };
    
    const response = await AxiosManager.get(`${API_BASE}/marketplace/posts`, queryParams);
    return {
      success: true,
      data: response.data.data?.posts || [],
      pagination: response.data.data?.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching my marketplace posts:', error);
    return handleApiResponse(error);
  }
};

// Get Single Marketplace Post
export const getMarketplacePost = async (postId) => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/marketplace/posts/${postId}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching marketplace post:', error);
    return handleApiResponse(error);
  }
};

// Create Marketplace Post (Brands Only)
export const createMarketplacePost = async (postData) => {
  try {
    const payload = {
      title: postData.title,
      description: postData.description,
      type: postData.type || 'Sponsored Post',
      category: postData.category,
      budget: postData.budget?.toString().replace(/[₹,]/g, '') || '0',
      deadline: postData.deadline,
      location: postData.location || '',
      gender_target: postData.gender_target || '',
      requirements: postData.requirements || '',
      image_url: postData.image_url || postData.imageUrl || '',
      video_url: postData.video_url || postData.videoUrl || '',
      status: postData.status || 'published'
    };
    
    const response = await AxiosManager.post(`${API_BASE}/marketplace/posts`, payload);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Post created successfully'
    };
  } catch (error) {
    console.error('Error creating marketplace post:', error);
    return handleApiResponse(error);
  }
};

// Update Marketplace Post (Brands Only)
export const updateMarketplacePost = async (postId, postData) => {
  try {
    const payload = {
      title: postData.title,
      description: postData.description,
      type: postData.type || 'Sponsored Post',
      category: postData.category,
      budget: postData.budget?.toString().replace(/[₹,]/g, '') || '0',
      deadline: postData.deadline,
      location: postData.location || '',
      gender_target: postData.gender_target || '',
      requirements: postData.requirements || '',
      image_url: postData.image_url || postData.imageUrl || '',
      video_url: postData.video_url || postData.videoUrl || '',
      status: postData.status || 'published'
    };
    
    const response = await AxiosManager.put(`${API_BASE}/marketplace/posts/${postId}`, payload);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Post updated successfully'
    };
  } catch (error) {
    console.error('Error updating marketplace post:', error);
    return handleApiResponse(error);
  }
};

// Delete Marketplace Post (Brands Only)
export const deleteMarketplacePost = async (postId) => {
  try {
    const response = await AxiosManager.delete(`${API_BASE}/marketplace/posts/${postId}`);
    return {
      success: true,
      message: response.data.message || 'Post deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting marketplace post:', error);
    return handleApiResponse(error);
  }
};

/**
 * BIDDING SYSTEM ENDPOINTS
 */

// Submit Bid (Influencer Only)
export const createBid = async (postId, bidData) => {
  try {
    const payload = {
      amount: bidData.amount?.toString().replace(/[₹,]/g, '') || '0',
      message: bidData.message || '',
      portfolio_links: bidData.portfolio_links || []
    };
    
    const response = await AxiosManager.post(`${API_BASE}/marketplace/posts/${postId}/bids`, payload);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Bid submitted successfully'
    };
  } catch (error) {
    console.error('Error creating bid:', error);
    return handleApiResponse(error);
  }
};

// Get Bids for Post (Brand Only)
export const getMarketplacePostBids = async (postId, params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      status: params.status || '',
      ...params
    };
    
    const response = await AxiosManager.get(`${API_BASE}/marketplace/posts/${postId}/bids`, queryParams);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching marketplace post bids:', error);
    return handleApiResponse(error);
  }
};

// Update Bid Status (Brand Only)
export const updateBidStatus = async (bidId, statusData) => {
  try {
    const payload = {
      status: statusData.status, // 'accepted' or 'rejected'
      message: statusData.message || ''
    };
    
    const response = await AxiosManager.put(`${API_BASE}/marketplace/bids/${bidId}/status`, payload);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Bid status updated successfully'
    };
  } catch (error) {
    console.error('Error updating bid status:', error);
    return handleApiResponse(error);
  }
};

// Get My Bids (Influencer Only)
export const getMyBids = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      status: params.status || '',
      ...params
    };
    
    const response = await AxiosManager.get(`${API_BASE}/marketplace/bids/my`, queryParams);
    return {
      success: true,
      data: response.data.data?.bids || [],
      pagination: response.data.data?.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching my bids:', error);
    return handleApiResponse(error);
  }
};

/**
 * MESSAGING SYSTEM ENDPOINTS
 */

// Send Message
export const sendMessage = async (messageData) => {
  try {
    const payload = {
      recipient_id: messageData.recipient_id,
      message: messageData.message,
      post_id: messageData.post_id || null,
      type: messageData.type || 'text'
    };
    
    const response = await AxiosManager.post(`${API_BASE}/messages`, payload);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || 'Message sent successfully'
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return handleApiResponse(error);
  }
};

// Get Messages
export const getMessages = async (params = {}) => {
  try {
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 20,
      recipient_id: params.recipient_id || '',
      post_id: params.post_id || '',
      ...params
    };
    
    const response = await AxiosManager.get(`${API_BASE}/messages`, queryParams);
    return {
      success: true,
      data: response.data.data?.messages || [],
      pagination: response.data.data?.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return handleApiResponse(error);
  }
};

/**
 * FILE UPLOAD ENDPOINTS
 */

// Upload Media
export const uploadMedia = async (file, type = 'image') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await AxiosManager.post(`${API_BASE}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      success: true,
      data: {
        url: response.data.data.url,
        type: response.data.data.type,
        size: response.data.data.size,
        filename: response.data.data.filename
      }
    };
  } catch (error) {
    console.error('Error uploading media:', error);
    return handleApiResponse(error);
  }
};

/**
 * ANALYTICS & TRACKING ENDPOINTS
 */

// Track Post View
export const trackPostView = async (postId) => {
  try {
    const response = await AxiosManager.post(`${API_BASE}/marketplace/posts/${postId}/view`);
    return {
      success: true,
      message: response.data.message || 'View tracked successfully'
    };
  } catch (error) {
    console.error('Error tracking post view:', error);
    return handleApiResponse(error);
  }
};

// Get Post Analytics (Brand Only)
export const getPostAnalytics = async (postId) => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/marketplace/posts/${postId}/analytics`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching post analytics:', error);
    return handleApiResponse(error);
  }
};

// Get Marketplace Statistics
export const getMarketplaceStatistics = async () => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/marketplace/statistics`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching marketplace statistics:', error);
    return handleApiResponse(error);
  }
};

// Get Marketplace Insights (Admin Only)
export const getMarketplaceInsights = async () => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/marketplace/insights`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching marketplace insights:', error);
    return handleApiResponse(error);
  }
};

// Get Recommended Posts (Influencer Only)
export const getRecommendedPosts = async (limit = 10) => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/marketplace/posts/recommended`, { limit });
    return {
      success: true,
      data: response.data.data || []
    };
  } catch (error) {
    console.error('Error fetching recommended posts:', error);
    return handleApiResponse(error);
  }
};

/**
 * SEARCH ENDPOINTS
 */

// Search Marketplace Posts
export const searchMarketplacePosts = async (searchParams) => {
  try {
    const queryParams = {
      q: searchParams.q || '',
      category: searchParams.category || '',
      location: searchParams.location || '',
      budget_min: searchParams.budget_min || '',
      budget_max: searchParams.budget_max || '',
      sort_by: searchParams.sort_by || 'created_at',
      order: searchParams.order || 'desc',
      page: searchParams.page || 1,
      limit: searchParams.limit || 12
    };
    
    const response = await AxiosManager.get(`${API_BASE}/marketplace/feed`, queryParams);
    return {
      success: true,
      data: response.data.data?.posts || [],
      pagination: response.data.data?.pagination || {}
    };
  } catch (error) {
    console.error('Error searching marketplace posts:', error);
    return handleApiResponse(error);
  }
};

/**
 * UTILITY FUNCTIONS
 */

// Handle API Response
const handleApiResponse = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    return {
      success: false,
      error: {
        status,
        message: data?.message || data?.error || getErrorMessage(status),
        errors: data?.errors || [],
        details: data?.details || []
      }
    };
  } else if (error.request) {
    return {
      success: false,
      error: {
        status: 0,
        message: 'Network error. Please check your internet connection.',
        errors: []
      }
    };
  } else {
    return {
      success: false,
      error: {
        status: 0,
        message: error.message || 'An unexpected error occurred',
        errors: []
      }
    };
  }
};

// Get Error Message by Status Code
const getErrorMessage = (status) => {
  switch (status) {
    case 400:
      return 'Invalid request data';
    case 401:
      return 'Authentication required. Please log in.';
    case 403:
      return 'Access denied. You don\'t have permission to perform this action.';
    case 404:
      return 'Resource not found';
    case 422:
      return 'Validation errors occurred';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'An unexpected error occurred';
  }
};

// Handle API Error (Legacy function for backward compatibility)
export const handleApiError = (error) => {
  const response = handleApiResponse(error);
  return response.error?.message || 'An unexpected error occurred';
};

/**
 * LEGACY FUNCTIONS (for backward compatibility with existing code)
 */

// Legacy: Get Brand Posts
export const getBrandPosts = async (params = {}) => {
  return await getMyMarketplacePosts(params);
};

// Legacy: Create Post
export const createPost = async (postData) => {
  return await createMarketplacePost(postData);
};

// Legacy: Update Post
export const updatePost = async (postId, postData) => {
  return await updateMarketplacePost(postId, postData);
};

// Legacy: Delete Post
export const deletePost = async (postId) => {
  return await deleteMarketplacePost(postId);
};

// Legacy: Get Post Details
export const getPostDetails = async (postId) => {
  return await getMarketplacePost(postId);
};

// Legacy: Submit Bid
export const submitBid = async (postId, bidData) => {
  return await createBid(postId, bidData);
};

// Legacy: Get Post Bids
export const getPostBids = async (postId) => {
  return await getMarketplacePostBids(postId);
};

// Legacy: Get Influencer Bids
export const getInfluencerBids = async () => {
  return await getMyBids();
};

// Legacy: Accept Bid
export const acceptBid = async (bidId) => {
  return await updateBidStatus(bidId, { status: 'accepted' });
};

// Legacy: Reject Bid
export const rejectBid = async (bidId, reason = '') => {
  return await updateBidStatus(bidId, { status: 'rejected', message: reason });
};

// Get Mock Data (fallback for development)
export const getMockMarketplaceData = () => {
  return {
    posts: [
      {
        id: 1,
        title: "Fashion Brand Collaboration",
        description: "Looking for fashion influencers to promote our new collection. Must have good engagement rate and style aesthetic that matches our brand.",
        type: "Sponsored Post",
        category: "Fashion",
        budget: "₹15,000",
        deadline: "2024-02-15",
        location: "Mumbai",
        gender_target: "Female",
        requirements: "10K+ followers, Fashion niche, Mumbai based preferred",
        image_url: "https://picsum.photos/400/300?random=1",
        video_url: "",
        status: "published",
        views: 125,
        bids_count: 8,
        brand: {
          id: "brand_1",
          name: "Fashion Co.",
          avatar: "https://picsum.photos/50/50?random=1",
          verified: true
        },
        created_at: "2024-01-15T10:30:00Z",
        has_user_bid: false,
        user_bid_amount: null
      },
      {
        id: 2,
        title: "Tech Product Review",
        description: "Need honest reviews for our latest smartphone. Looking for tech influencers with authentic audience.",
        type: "Product Review",
        category: "Technology",
        budget: "₹25,000",
        deadline: "2024-02-20",
        location: "Bangalore",
        gender_target: "Any",
        requirements: "Tech niche, 20K+ followers, Previous review experience",
        image_url: "https://picsum.photos/400/300?random=2",
        video_url: "",
        status: "published",
        views: 89,
        bids_count: 12,
        brand: {
          id: "brand_2",
          name: "TechGuru",
          avatar: "https://picsum.photos/50/50?random=2",
          verified: true
        },
        created_at: "2024-01-16T14:20:00Z",
        has_user_bid: true,
        user_bid_amount: "₹20,000"
      }
    ],
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: 2,
      items_per_page: 12
    }
  };
};

// Default export with all API functions
const MarketplaceAPI = {
  // User Management
  getUserProfile,
  
  // Marketplace Posts
  getMarketplaceFeed,
  getMyMarketplacePosts,
  getMarketplacePost,
  createMarketplacePost,
  updateMarketplacePost,
  deleteMarketplacePost,
  searchMarketplacePosts,
  getRecommendedPosts,
  
  // Bidding System
  createBid,
  getMarketplacePostBids,
  updateBidStatus,
  getMyBids,
  
  // Messaging
  sendMessage,
  getMessages,
  
  // File Upload
  uploadMedia,
  
  // Analytics & Tracking
  trackPostView,
  getPostAnalytics,
  getMarketplaceStatistics,
  getMarketplaceInsights,
  
  // Utility
  handleApiError,
  
  // Legacy functions (for backward compatibility)
  getBrandPosts,
  createPost,
  updatePost,
  deletePost,
  getPostDetails,
  submitBid,
  getPostBids,
  getInfluencerBids,
  acceptBid,
  rejectBid,
  getMockMarketplaceData
};

export default MarketplaceAPI;