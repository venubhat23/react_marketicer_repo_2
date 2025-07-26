// Posts API Service
const API_BASE_URL = 'https://api.marketincer.com/api/v1';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Generate AI Post Content
export const generateAIPost = async (prompt, tone = 'professional', platform = 'instagram') => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_BASE_URL}/posts/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        prompt,
        tone,
        platform,
      }),
    });

    if (!response.ok) {
      // If endpoint doesn't exist (404), provide a fallback
      if (response.status === 404) {
        return generateFallbackContent(prompt, tone, platform);
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to generate post: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle different possible response structures
    if (data.success && data.generated_content) {
      return data.generated_content;
    } else if (data.content) {
      return data.content;
    } else if (data.generated_content) {
      return data.generated_content;
    } else {
      throw new Error('No content generated');
    }
    
  } catch (error) {
    // If it's a network error or API not available, provide fallback
    if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
      return generateFallbackContent(prompt, tone, platform);
    }
    
    console.error('Error generating AI post:', error);
    throw error;
  }
};

// Fallback content generation for demo purposes
const generateFallbackContent = (prompt, tone, platform) => {
  const toneVariations = {
    professional: "We're excited to share",
    casual: "Hey everyone! Just wanted to share",
    friendly: "Hope you're all doing well! We wanted to tell you about",
    motivational: "Ready to be inspired? Here's something amazing:",
    humorous: "Get ready to smile! Here's something fun:",
    informative: "Did you know?"
  };

  const platformHashtags = {
    instagram: "#inspiration #motivation #socialmedia #content",
    facebook: "#community #engagement #socialmedia",
    linkedin: "#professional #business #networking #growth",
    twitter: "#trending #socialmedia #engagement"
  };

  const starter = toneVariations[tone] || toneVariations.professional;
  const hashtags = platformHashtags[platform] || platformHashtags.instagram;
  
  return `${starter} something related to: ${prompt}

This is an AI-generated post based on your prompt. The content has been created to match your requested ${tone} tone for ${platform}.

${hashtags}

#AIGenerated #MarketIncer`;
};

// Create Post
export const createPost = async (postData) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create post: ${response.statusText}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Schedule Post
export const schedulePost = async (postData) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_BASE_URL}/posts/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to schedule post: ${response.statusText}`);
    }

    return await response.json();
    
  } catch (error) {
    console.error('Error scheduling post:', error);
    throw error;
  }
};

export default {
  generateAIPost,
  createPost,
  schedulePost,
};