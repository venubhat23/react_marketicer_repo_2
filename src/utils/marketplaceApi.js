import AxiosManager from './api';

// Marketplace Posts API
export const marketplaceApi = {
  // Get marketplace feed for influencers
  getMarketplaceFeed: (params = {}) => {
    return AxiosManager.get('/api/v1/marketplace_posts', params);
  },

  // Get my marketplace posts for brands/admin
  getMyMarketplacePosts: () => {
    return AxiosManager.get('/api/v1/marketplace_posts/my_posts');
  },

  // Get single marketplace post
  getMarketplacePost: (id) => {
    return AxiosManager.get(`/api/v1/marketplace_posts/${id}`);
  },

  // Create marketplace post
  createMarketplacePost: (postData) => {
    return AxiosManager.post('/api/v1/marketplace_posts', { marketplace_post: postData });
  },

  // Update marketplace post
  updateMarketplacePost: (id, postData) => {
    return AxiosManager.put(`/api/v1/marketplace_posts/${id}`, { marketplace_post: postData });
  },

  // Delete marketplace post
  deleteMarketplacePost: (id) => {
    return AxiosManager.delete(`/api/v1/marketplace_posts/${id}`);
  },

  // Search marketplace posts
  searchMarketplacePosts: (params = {}) => {
    return AxiosManager.get('/api/v1/marketplace_posts/search', params);
  },

  // Get statistics
  getStatistics: () => {
    return AxiosManager.get('/api/v1/marketplace_posts/statistics');
  },

  // Get marketplace insights (admin only)
  getMarketplaceInsights: () => {
    return AxiosManager.get('/api/v1/marketplace_posts/insights');
  },

  // Get recommended posts (influencers only)
  getRecommendedPosts: (limit = 10) => {
    return AxiosManager.get('/api/v1/marketplace_posts/recommended', { limit });
  }
};

// Bids API
export const bidsApi = {
  // Get bids for marketplace post (brands/admin only)
  getBidsForPost: (marketplacePostId) => {
    return AxiosManager.get(`/api/v1/marketplace_posts/${marketplacePostId}/bids`);
  },

  // Create bid (influencers only)
  createBid: (marketplacePostId, bidData) => {
    return AxiosManager.post(`/api/v1/marketplace_posts/${marketplacePostId}/bids`, { bid: bidData });
  },

  // Get single bid
  getBid: (id) => {
    return AxiosManager.get(`/api/v1/bids/${id}`);
  },

  // Update bid (influencers only - own pending bids)
  updateBid: (id, bidData) => {
    return AxiosManager.put(`/api/v1/bids/${id}`, { bid: bidData });
  },

  // Delete bid (influencers only - own pending bids)
  deleteBid: (id) => {
    return AxiosManager.delete(`/api/v1/bids/${id}`);
  },

  // Accept bid (brands/admin only)
  acceptBid: (id) => {
    return AxiosManager.post(`/api/v1/bids/${id}/accept`);
  },

  // Reject bid (brands/admin only)
  rejectBid: (id) => {
    return AxiosManager.post(`/api/v1/bids/${id}/reject`);
  },

  // Get my bids (influencers only)
  getMyBids: () => {
    return AxiosManager.get('/api/v1/bids/my_bids');
  }
};

// Upload API
export const uploadApi = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "https://kitintellect.tech/storage/public/api/upload/aaFacebook",
      {
        method: "POST",
        body: formData,
      }
    );

    return response.json();
  }
};