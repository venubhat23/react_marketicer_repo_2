# Generate with AI API Documentation

## Overview
The `handleGenerateWithAI` function integrates with the Marketincer AI content generation API to automatically create social media post content.

## API Endpoint
```
POST https://api.marketincer.com/api/v1/generate-content
```

## Authentication
- **Type**: Bearer Token
- **Header**: `Authorization: Bearer {token}`
- **Token Source**: Retrieved from `localStorage.getItem("token")`

## Request Format

### Headers
```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE",
  "Content-Type": "application/json"
}
```

### Request Body
```json
{
  "description": "generate note on social media"
}
```

### Sample Request (JavaScript)
```javascript
const handleGenerateWithAI = async () => {
  setGeneratingContent(true);
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "https://api.marketincer.com/api/v1/generate-content",
      {
        description: "generate note on social media"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    // Handle response
    const generatedContent = response.data.content || response.data.message || response.data;
    setPostContent(generatedContent);
    
  } catch (error) {
    console.error("Error generating content:", error);
  } finally {
    setGeneratingContent(false);
  }
};
```

## Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "content": "🚀 Boost your social media presence with engaging content! Here are 5 tips to increase your reach: 1) Post consistently 2) Use relevant hashtags 3) Engage with your audience 4) Share valuable insights 5) Collaborate with others. What's your favorite social media strategy? #SocialMediaTips #DigitalMarketing #ContentCreation",
  "timestamp": "2024-01-15T10:30:00Z",
  "usage": {
    "tokens_used": 150,
    "remaining_credits": 850
  }
}
```

### Alternative Success Response Format
```json
{
  "message": "Looking to elevate your social media game? 📱✨ Start with authentic storytelling, engage genuinely with your community, and don't forget to showcase your brand's personality! Remember: consistency beats perfection every time. #SocialMediaStrategy #BrandBuilding #ContentMarketing",
  "status": "success"
}
```

### Error Response (400 Bad Request)
```json
{
  "error": "Invalid request",
  "message": "Description is required",
  "code": "MISSING_DESCRIPTION"
}
```

### Error Response (401 Unauthorized)
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "code": "INVALID_TOKEN"
}
```

### Error Response (429 Too Many Requests)
```json
{
  "error": "Rate limit exceeded",
  "message": "You have exceeded your API rate limit. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retry_after": 60
}
```

### Error Response (500 Internal Server Error)
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred while generating content",
  "code": "GENERATION_ERROR"
}
```

## Response Handling

The function handles multiple response formats by checking for content in this order:
1. `response.data.content`
2. `response.data.message`  
3. `response.data` (fallback)

## UI Integration

### Button States
- **Default State**: Shows company logo and "Generate with AI" text
- **Loading State**: Shows spinner and "Generating..." text
- **Disabled State**: Button is disabled during content generation

### Logo Implementation
The button now displays the Marketincer company logo instead of the letter "M":
```jsx
<img 
  src="/marketincer.jpg" 
  alt="Marketincer Logo" 
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }}
/>
```

## Error Handling
- Network errors are caught and logged to console
- User receives error toast notification
- Loading state is properly reset in finally block
- Button remains functional after errors

## Usage Notes
- The function sets `generatingContent` state to show loading UI
- Generated content is automatically inserted into the post editor
- Success toast notification is shown when content is generated
- The description parameter is currently hardcoded but can be made dynamic

## Customization Options

### Dynamic Descriptions
To make descriptions dynamic based on user input:
```javascript
const handleGenerateWithAI = async (customDescription = "generate note on social media") => {
  // ... existing code ...
  const response = await axios.post(
    "https://api.marketincer.com/api/v1/generate-content",
    {
      description: customDescription
    },
    // ... rest of config
  );
};
```

### Additional Parameters
The API may support additional parameters:
```json
{
  "description": "generate note on social media",
  "tone": "professional", // casual, professional, friendly
  "length": "medium", // short, medium, long
  "platform": "instagram", // instagram, facebook, twitter, linkedin
  "hashtags": true, // include hashtags
  "emojis": true // include emojis
}
```