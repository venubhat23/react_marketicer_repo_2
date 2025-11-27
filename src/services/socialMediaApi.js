import AxiosManager from '../utils/api';

// Social Media API Service
export const socialMediaApi = {
  // Get all connected social media accounts
  getConnectedAccounts: async () => {
    try {
      const response = await AxiosManager.get('/api/v1/social_accounts');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch connected accounts'
      };
    }
  },

  // Get social media posts from connected accounts
  getSocialMediaPosts: async (filters = {}) => {
    try {
      const params = {
        platform: filters.platform || 'all',
        media_type: filters.mediaType || 'all',
        limit: filters.limit || 50,
        offset: filters.offset || 0
      };

      const response = await AxiosManager.get('/api/v1/social_media/posts', params);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching social media posts:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch social media posts'
      };
    }
  },

  // Get Instagram posts - try multiple endpoints for compatibility
  getInstagramPosts: async (accountId = null) => {
    try {
      const params = accountId ? { account_id: accountId } : {};
      
      // Try the analytics endpoint first (this gives us posts with their media)
      try {
        const analyticsResponse = await AxiosManager.get('/api/v1/instagram_analytics', params);
        if (analyticsResponse.data?.success && analyticsResponse.data?.data) {
          // Extract posts from analytics data
          const allPosts = [];
          analyticsResponse.data.data.forEach(account => {
            if (account.posts && account.posts.length > 0) {
              allPosts.push(...account.posts.map(post => ({
                ...post,
                platform: 'instagram',
                account_name: account.username || account.name,
                account_id: account.id
              })));
            }
            // Also check recent posts
            if (account.recent_posts && account.recent_posts.length > 0) {
              allPosts.push(...account.recent_posts.map(post => ({
                ...post,
                platform: 'instagram',
                account_name: account.username || account.name,
                account_id: account.id
              })));
            }
          });
          
          return {
            success: true,
            data: allPosts
          };
        }
      } catch (analyticsError) {
        console.warn('Analytics endpoint failed, trying posts endpoint:', analyticsError);
      }

      // Fallback to direct posts endpoint
      try {
        const postsResponse = await AxiosManager.get('/api/v1/instagram/posts', params);
        return {
          success: true,
          data: postsResponse.data?.data || postsResponse.data || []
        };
      } catch (postsError) {
        console.warn('Posts endpoint failed, trying without v1:', postsError);
      }

      // Try without v1 prefix (as seen in FullAnalytics)
      const fallbackResponse = await AxiosManager.get('/api/instagram/posts', params);
      return {
        success: true,
        data: fallbackResponse.data?.data || fallbackResponse.data || []
      };
      
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch Instagram posts'
      };
    }
  },

  // Get Facebook posts
  getFacebookPosts: async (accountId = null) => {
    try {
      const params = accountId ? { account_id: accountId } : {};
      
      // Try analytics endpoint first
      try {
        const analyticsResponse = await AxiosManager.get('/api/v1/facebook_analytics', params);
        if (analyticsResponse.data?.success && analyticsResponse.data?.data) {
          const allPosts = [];
          analyticsResponse.data.data.forEach(account => {
            if (account.posts && account.posts.length > 0) {
              allPosts.push(...account.posts.map(post => ({
                ...post,
                platform: 'facebook',
                account_name: account.username || account.name,
                account_id: account.id
              })));
            }
            if (account.recent_posts && account.recent_posts.length > 0) {
              allPosts.push(...account.recent_posts.map(post => ({
                ...post,
                platform: 'facebook',
                account_name: account.username || account.name,
                account_id: account.id
              })));
            }
          });
          
          return {
            success: true,
            data: allPosts
          };
        }
      } catch (analyticsError) {
        console.warn('Facebook analytics endpoint failed:', analyticsError);
      }

      // Fallback to direct posts endpoint
      const response = await AxiosManager.get('/api/v1/facebook/posts', params);
      return {
        success: true,
        data: response.data?.data || response.data || []
      };
    } catch (error) {
      console.error('Error fetching Facebook posts:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch Facebook posts'
      };
    }
  },

  // Get LinkedIn posts
  getLinkedInPosts: async (accountId = null) => {
    try {
      const params = accountId ? { account_id: accountId } : {};
      
      // Try analytics endpoint first
      try {
        const analyticsResponse = await AxiosManager.get('/api/v1/linkedin_analytics', params);
        if (analyticsResponse.data?.success && analyticsResponse.data?.data) {
          const allPosts = [];
          analyticsResponse.data.data.forEach(account => {
            if (account.posts && account.posts.length > 0) {
              allPosts.push(...account.posts.map(post => ({
                ...post,
                platform: 'linkedin',
                account_name: account.username || account.name,
                account_id: account.id
              })));
            }
            if (account.recent_posts && account.recent_posts.length > 0) {
              allPosts.push(...account.recent_posts.map(post => ({
                ...post,
                platform: 'linkedin',
                account_name: account.username || account.name,
                account_id: account.id
              })));
            }
          });
          
          return {
            success: true,
            data: allPosts
          };
        }
      } catch (analyticsError) {
        console.warn('LinkedIn analytics endpoint failed:', analyticsError);
      }

      // Fallback to direct posts endpoint
      const response = await AxiosManager.get('/api/v1/linkedin/posts', params);
      return {
        success: true,
        data: response.data?.data || response.data || []
      };
    } catch (error) {
      console.error('Error fetching LinkedIn posts:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch LinkedIn posts'
      };
    }
  },

  // Get YouTube videos
  getYouTubeVideos: async (accountId = null) => {
    try {
      const params = accountId ? { account_id: accountId } : {};
      const response = await AxiosManager.get('/api/v1/youtube/videos', params);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch YouTube videos'
      };
    }
  },

  // Download media file
  downloadMedia: async (mediaUrl, postId) => {
    try {
      const response = await AxiosManager.post('/api/v1/media/download', {
        media_url: mediaUrl,
        post_id: postId
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error downloading media:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to download media'
      };
    }
  },

  // Bulk download media files
  bulkDownloadMedia: async (postIds) => {
    try {
      const response = await AxiosManager.post('/api/v1/media/bulk-download', {
        post_ids: postIds
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error bulk downloading media:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to bulk download media'
      };
    }
  }
};

// Helper function to combine posts from all platforms
export const getAllPlatformPosts = async (filters = {}) => {
  try {
    console.log('🚀 SocialMediaAPI: Starting getAllPlatformPosts with filters:', filters);
    const platforms = ['instagram', 'facebook', 'linkedin', 'youtube'];
    const promises = [];

    // If specific platform filter is set, only fetch from that platform
    if (filters.platform && filters.platform !== 'all') {
      switch (filters.platform) {
        case 'instagram':
          promises.push(socialMediaApi.getInstagramPosts());
          break;
        case 'facebook':
          promises.push(socialMediaApi.getFacebookPosts());
          break;
        case 'linkedin':
          promises.push(socialMediaApi.getLinkedInPosts());
          break;
        case 'youtube':
          promises.push(socialMediaApi.getYouTubeVideos());
          break;
        default:
          promises.push(socialMediaApi.getSocialMediaPosts(filters));
      }
    } else {
      // Fetch from all platforms
      promises.push(
        socialMediaApi.getInstagramPosts(),
        socialMediaApi.getFacebookPosts(),
        socialMediaApi.getLinkedInPosts(),
        socialMediaApi.getYouTubeVideos()
      );
    }

    const results = await Promise.allSettled(promises);
    const allPosts = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        const posts = result.value.data.posts || result.value.data || [];
        allPosts.push(...posts);
      } else {
        console.warn(`Failed to fetch posts from platform ${index}:`, result.reason);
      }
    });

    // Apply media type filter if specified
    let filteredPosts = allPosts;
    if (filters.mediaType && filters.mediaType !== 'all') {
      filteredPosts = allPosts.filter(post => {
        const hasVideo = post.media_type === 'video' || post.video_url;
        const hasImage = post.media_type === 'image' || post.image_url;
        
        if (filters.mediaType === 'video') return hasVideo;
        if (filters.mediaType === 'image') return hasImage;
        return true;
      });
    }

    // Sort by creation date (newest first)
    filteredPosts.sort((a, b) => {
      const dateA = new Date(a.created_at || a.published_at);
      const dateB = new Date(b.created_at || b.published_at);
      return dateB - dateA;
    });

    return {
      success: true,
      data: filteredPosts
    };
  } catch (error) {
    console.error('Error fetching all platform posts:', error);
    return {
      success: false,
      error: 'Failed to fetch posts from social media platforms'
    };
  }
};

export default socialMediaApi;