import AxiosManager from '../utils/api';

/**
 * Marketplace API Service
 * Complete implementation based on API documentation
 */

// Base endpoints as per API specification
const API_BASE = '/api/v1';

/**
 * MARKETPLACE POSTS ENDPOINTS
 */

// Get Marketplace Feed (Influencers Only)
export const getMarketplaceFeed = async (params = {}) => {
  try {
    const queryParams = {
      category: params.category || '',
      target_audience: params.target_audience || '',
      page: params.page || 1,
      per_page: params.per_page || 10,
      ...params
    };
    
    const response = await AxiosManager.get(`${API_BASE}/marketplace_posts`, queryParams);
    return {
      success: true,
      data: response.data.data || [],
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Error fetching marketplace feed:', error);
    return handleApiResponse(error);
  }
};

// Get My Marketplace Posts (Brands/Admin Only)
export const getMyMarketplacePosts = async () => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/marketplace_posts/my_posts`);
    return {
      success: true,
      data: response.data.data || []
    };
  } catch (error) {
    console.error('Error fetching my marketplace posts:', error);
    return handleApiResponse(error);
  }
};

// Get Single Marketplace Post
export const getMarketplacePost = async (postId) => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/marketplace_posts/${postId}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching marketplace post:', error);
    return handleApiResponse(error);
  }
};

// Create Marketplace Post (Brands/Admin Only)
export const createMarketplacePost = async (postData) => {
  try {
    const payload = {
      marketplace_post: {
        title: postData.title,
        description: postData.description,
        category: postData.category,
        target_audience: postData.targetAudience || postData.target_audience,
        budget: parseFloat(postData.budget?.toString().replace(/[₹,]/g, '') || 0),
        location: postData.location,
        platform: postData.platform,
        languages: postData.languages,
        deadline: postData.deadline,
        tags: postData.tags,
        status: postData.status || 'published',
        brand_name: postData.brand_name || postData.brandName || 'Your Brand',
        media_url: postData.media_url || postData.imageUrl,
        media_type: postData.media_type || (postData.imageUrl ? 'image' : 'text')
      }
    };
    
    const response = await AxiosManager.post(`${API_BASE}/marketplace_posts`, payload);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error creating marketplace post:', error);
    return handleApiResponse(error);
  }
};

// Update Marketplace Post (Brands/Admin Only)
export const updateMarketplacePost = async (postId, postData) => {
  try {
    const payload = {
      marketplace_post: {
        title: postData.title,
        description: postData.description,
        category: postData.category,
        target_audience: postData.targetAudience || postData.target_audience,
        budget: parseFloat(postData.budget?.toString().replace(/[₹,]/g, '') || 0),
        location: postData.location,
        platform: postData.platform,
        languages: postData.languages,
        deadline: postData.deadline,
        tags: postData.tags,
        status: postData.status || 'published',
        brand_name: postData.brand_name || postData.brandName,
        media_url: postData.media_url || postData.imageUrl,
        media_type: postData.media_type || (postData.imageUrl ? 'image' : 'text')
      }
    };
    
    const response = await AxiosManager.put(`${API_BASE}/marketplace_posts/${postId}`, payload);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error updating marketplace post:', error);
    return handleApiResponse(error);
  }
};

// Delete Marketplace Post (Brands/Admin Only)
export const deleteMarketplacePost = async (postId) => {
  try {
    const response = await AxiosManager.delete(`${API_BASE}/marketplace_posts/${postId}`);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error deleting marketplace post:', error);
    return handleApiResponse(error);
  }
};

// Search Marketplace Posts (Influencers Only)
export const searchMarketplacePosts = async (searchParams) => {
  try {
    const queryParams = {
      q: searchParams.q || '',
      category: searchParams.category || '',
      target_audience: searchParams.target_audience || '',
      budget_min: searchParams.budget_min || '',
      budget_max: searchParams.budget_max || '',
      deadline_from: searchParams.deadline_from || '',
      deadline_to: searchParams.deadline_to || '',
      location: searchParams.location || '',
      platform: searchParams.platform || '',
      page: searchParams.page || 1,
      per_page: searchParams.per_page || 10
    };
    
    const response = await AxiosManager.get(`${API_BASE}/marketplace_posts/search`, queryParams);
    return {
      success: true,
      data: response.data.data || [],
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Error searching marketplace posts:', error);
    return handleApiResponse(error);
  }
};

// Get Statistics
export const getMarketplaceStatistics = async () => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/marketplace_posts/statistics`);
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
    const response = await AxiosManager.get(`${API_BASE}/marketplace_posts/insights`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching marketplace insights:', error);
    return handleApiResponse(error);
  }
};

// Get Recommended Posts (Influencers Only)
export const getRecommendedPosts = async (limit = 10) => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/marketplace_posts/recommended`, { limit });
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
 * BIDS ENDPOINTS
 */

// Get Bids for Marketplace Post (Brands/Admin Only)
export const getMarketplacePostBids = async (marketplacePostId) => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/marketplace_posts/${marketplacePostId}/bids`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching marketplace post bids:', error);
    return handleApiResponse(error);
  }
};

// Create Bid (Influencers Only)
export const createBid = async (marketplacePostId, bidData) => {
  try {
    const payload = {
      bid: {
        amount: parseFloat(bidData.amount?.toString().replace(/[₹,]/g, '') || 0),
        message: bidData.message || ''
      }
    };
    
    const response = await AxiosManager.post(`${API_BASE}/marketplace_posts/${marketplacePostId}/bids`, payload);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error creating bid:', error);
    return handleApiResponse(error);
  }
};

// Get Single Bid
export const getBid = async (bidId) => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/bids/${bidId}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching bid:', error);
    return handleApiResponse(error);
  }
};

// Update Bid (Influencers Only - Own Pending Bids)
export const updateBid = async (bidId, bidData) => {
  try {
    const payload = {
      bid: {
        amount: parseFloat(bidData.amount?.toString().replace(/[₹,]/g, '') || 0),
        message: bidData.message || ''
      }
    };
    
    const response = await AxiosManager.put(`${API_BASE}/bids/${bidId}`, payload);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error updating bid:', error);
    return handleApiResponse(error);
  }
};

// Delete Bid (Influencers Only - Own Pending Bids)
export const deleteBid = async (bidId) => {
  try {
    const response = await AxiosManager.delete(`${API_BASE}/bids/${bidId}`);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error deleting bid:', error);
    return handleApiResponse(error);
  }
};

// Accept Bid (Brands/Admin Only)
export const acceptBid = async (bidId) => {
  try {
    const response = await AxiosManager.post(`${API_BASE}/bids/${bidId}/accept`);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error accepting bid:', error);
    return handleApiResponse(error);
  }
};

// Reject Bid (Brands/Admin Only)
export const rejectBid = async (bidId) => {
  try {
    const response = await AxiosManager.post(`${API_BASE}/bids/${bidId}/reject`);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error rejecting bid:', error);
    return handleApiResponse(error);
  }
};

// Get My Bids (Influencers Only)
export const getMyBids = async () => {
  try {
    const response = await AxiosManager.get(`${API_BASE}/bids/my_bids`);
    return {
      success: true,
      data: response.data.data || []
    };
  } catch (error) {
    console.error('Error fetching my bids:', error);
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
        errors: data?.errors || []
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
  return await getMyMarketplacePosts();
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

// Legacy: Update Bid Status
export const updateBidStatus = async (bidId, statusData) => {
  if (statusData.status === 'accepted') {
    return await acceptBid(bidId);
  } else if (statusData.status === 'rejected') {
    return await rejectBid(bidId);
  }
  return { success: false, error: { message: 'Invalid status' } };
};

// Legacy: Get Influencer Bids
export const getInfluencerBids = async () => {
  return await getMyBids();
};

// Legacy: Track Post View
export const trackPostView = async (postId) => {
  try {
    // This would increment view count when influencer views a post
    const response = await AxiosManager.post(`${API_BASE}/marketplace_posts/${postId}/view`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error tracking post view:', error);
    return handleApiResponse(error);
  }
};

// Legacy: Upload Media
export const uploadMedia = async (file, type = 'image') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Use the same endpoint and method as CreatePost (which works)
    const response = await fetch(
      'https://kitintellect.tech/storage/public/api/upload/aaFacebook',
      {
        method: 'POST',
        // Don't set Content-Type header - let browser set it automatically for FormData
        // Don't set Authorization header - the upload endpoint doesn't require it
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
    return handleApiResponse(error);
  }
};

// Legacy: Send Message
export const sendMessage = async (messageData) => {
  try {
    const response = await AxiosManager.post(`${API_BASE}/messages`, messageData);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return handleApiResponse(error);
  }
};

// Legacy: Get Mock Data (fallback)
export const getMockMarketplaceData = () => {
  return {
    posts: [
      {
        id: 1,
        title: "Fashion Brand Collaboration",
        description: "Looking for fashion influencers to promote our new collection...",
        brand_name: "Fashion Co.",
        budget: 5000.00,
        deadline: "2024-02-15",
        location: "Mumbai",
        platform: "Instagram",
        category: "A",
        target_audience: "24–30",
        tags: ["Fashion", "Style"],
        media_url: "https://picsum.photos/400/300?random=1",
        media_type: "image",
        views_count: 125,
        bids_count: 8,
        created_at: "2024-01-15T10:30:00Z",
        user_has_bid: false,
        status: "published"
      }
    ],
    pagination: {
      current_page: 1,
      per_page: 10,
      total_count: 1
    }
  };
};

// Default export with all API functions
const MarketplaceAPI = {
  // New API functions (matching specification)
  getMarketplaceFeed,
  getMyMarketplacePosts,
  getMarketplacePost,
  createMarketplacePost,
  updateMarketplacePost,
  deleteMarketplacePost,
  searchMarketplacePosts,
  getMarketplaceStatistics,
  getMarketplaceInsights,
  getRecommendedPosts,
  
  // Bids
  getMarketplacePostBids,
  createBid,
  getBid,
  updateBid,
  deleteBid,
  acceptBid,
  rejectBid,
  getMyBids,
  
  // Utility
  handleApiError,
  trackPostView,
  uploadMedia,
  sendMessage,
  
  // Legacy functions (for backward compatibility)
  getBrandPosts,
  createPost,
  updatePost,
  deletePost,
  getPostDetails,
  submitBid,
  getPostBids,
  updateBidStatus,
  getInfluencerBids,
  getMockMarketplaceData
};

export default MarketplaceAPI;