# Marketplace Feature - Backend API Specifications

## Overview
This document outlines the backend API requirements for the marketplace feature implementation, including endpoints, request/response structures, and database schema considerations.

## User Roles
- **Brand**: Can create, manage, and view marketplace posts; can view bids from influencers
- **Influencer**: Can view marketplace feed, submit bids, and message brands

## API Endpoints

### 1. Authentication & User Management

#### Get User Profile
```
GET /api/v1/user/profile
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "brand|influencer",
    "avatar": "https://example.com/avatar.jpg",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Marketplace Posts Management (Brand)

#### Get All Posts by Brand
```
GET /api/v1/marketplace/posts
Headers: Authorization: Bearer <token>
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
  - status: string (optional: "published|draft|pending|expired")
  - category: string (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post_id",
        "title": "Instagram Reel for Fashion Brand",
        "description": "Looking for fashion influencers...",
        "type": "Sponsored Post",
        "category": "Fashion",
        "budget": "₹10,000",
        "deadline": "2024-02-01",
        "status": "published",
        "location": "Mumbai",
        "gender_target": "Female",
        "requirements": "Must have 10K+ followers",
        "image_url": "https://example.com/image.jpg",
        "video_url": "https://example.com/video.mp4",
        "views": 150,
        "bids_count": 5,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 50,
      "items_per_page": 10
    }
  }
}
```

#### Create New Post
```
POST /api/v1/marketplace/posts
Headers: Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Instagram Reel for Fashion Brand",
  "description": "Looking for fashion influencers to create engaging reels",
  "type": "Sponsored Post",
  "category": "Fashion",
  "budget": "₹10,000",
  "deadline": "2024-02-01",
  "location": "Mumbai",
  "gender_target": "Female",
  "requirements": "Must have 10K+ followers and good engagement rate",
  "image_url": "https://example.com/image.jpg",
  "video_url": "https://example.com/video.mp4",
  "status": "published"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "post_id",
    "title": "Instagram Reel for Fashion Brand",
    "status": "published",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### Update Post
```
PUT /api/v1/marketplace/posts/:post_id
Headers: Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** (Same as create post)

**Response:**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "id": "post_id",
    "updated_at": "2024-01-15T11:30:00Z"
  }
}
```

#### Delete Post
```
DELETE /api/v1/marketplace/posts/:post_id
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

### 3. Marketplace Feed (Influencer)

#### Get Marketplace Feed
```
GET /api/v1/marketplace/feed
Headers: Authorization: Bearer <token>
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 12)
  - category: string (optional)
  - location: string (optional)
  - budget_min: number (optional)
  - budget_max: number (optional)
  - sort_by: string (default: "created_at", options: "created_at|deadline|budget|views")
  - order: string (default: "desc", options: "asc|desc")
```

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post_id",
        "title": "Instagram Reel for Fashion Brand",
        "description": "Looking for fashion influencers...",
        "type": "Sponsored Post",
        "category": "Fashion",
        "budget": "₹10,000",
        "deadline": "2024-02-01",
        "location": "Mumbai",
        "gender_target": "Female",
        "image_url": "https://example.com/image.jpg",
        "video_url": "https://example.com/video.mp4",
        "views": 150,
        "brand": {
          "id": "brand_id",
          "name": "StyleCo",
          "avatar": "https://example.com/brand-avatar.jpg"
        },
        "created_at": "2024-01-15T10:30:00Z",
        "has_user_bid": false,
        "user_bid_amount": null
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 60,
      "items_per_page": 12
    }
  }
}
```

#### Get Single Post Details
```
GET /api/v1/marketplace/posts/:post_id
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "post_id",
    "title": "Instagram Reel for Fashion Brand",
    "description": "Looking for fashion influencers...",
    "type": "Sponsored Post",
    "category": "Fashion",
    "budget": "₹10,000",
    "deadline": "2024-02-01",
    "location": "Mumbai",
    "gender_target": "Female",
    "requirements": "Must have 10K+ followers",
    "image_url": "https://example.com/image.jpg",
    "video_url": "https://example.com/video.mp4",
    "views": 150,
    "brand": {
      "id": "brand_id",
      "name": "StyleCo",
      "avatar": "https://example.com/brand-avatar.jpg",
      "verified": true
    },
    "created_at": "2024-01-15T10:30:00Z",
    "has_user_bid": false,
    "user_bid_amount": null,
    "bids_count": 5
  }
}
```

### 4. Bidding System

#### Submit Bid (Influencer)
```
POST /api/v1/marketplace/posts/:post_id/bids
Headers: Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": "₹5,000",
  "message": "I'm the perfect fit for this campaign because...",
  "portfolio_links": [
    "https://instagram.com/mypost1",
    "https://youtube.com/myvideo1"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bid submitted successfully",
  "data": {
    "id": "bid_id",
    "amount": "₹5,000",
    "status": "pending",
    "created_at": "2024-01-15T12:00:00Z"
  }
}
```

#### Get Bids for Post (Brand)
```
GET /api/v1/marketplace/posts/:post_id/bids
Headers: Authorization: Bearer <token>
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
  - status: string (optional: "pending|accepted|rejected")
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bids": [
      {
        "id": "bid_id",
        "amount": "₹5,000",
        "message": "I'm the perfect fit for this campaign...",
        "status": "pending",
        "influencer": {
          "id": "influencer_id",
          "name": "Influencer Name",
          "avatar": "https://example.com/avatar.jpg",
          "followers_count": 15000,
          "engagement_rate": 4.5,
          "social_profiles": {
            "instagram": "@influencer_handle",
            "youtube": "youtube.com/c/influencer"
          }
        },
        "portfolio_links": [
          "https://instagram.com/mypost1",
          "https://youtube.com/myvideo1"
        ],
        "created_at": "2024-01-15T12:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_items": 15,
      "items_per_page": 10
    }
  }
}
```

#### Update Bid Status (Brand)
```
PUT /api/v1/marketplace/bids/:bid_id/status
Headers: Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "accepted|rejected",
  "message": "We'd love to work with you!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bid status updated successfully",
  "data": {
    "id": "bid_id",
    "status": "accepted",
    "updated_at": "2024-01-15T13:00:00Z"
  }
}
```

### 5. Messaging System

#### Send Message
```
POST /api/v1/messages
Headers: Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "recipient_id": "user_id",
  "message": "Hi! I'm interested in your campaign...",
  "post_id": "post_id",
  "type": "text|image|file"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": "message_id",
    "created_at": "2024-01-15T14:00:00Z"
  }
}
```

### 6. File Upload

#### Upload Media
```
POST /api/v1/upload
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [binary data]
type: "image|video|document"
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://example.com/uploads/file.jpg",
    "type": "image",
    "size": 1024000,
    "filename": "original-filename.jpg"
  }
}
```

### 7. Analytics & Tracking

#### Track Post View
```
POST /api/v1/marketplace/posts/:post_id/view
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "View tracked successfully"
}
```

#### Get Post Analytics (Brand)
```
GET /api/v1/marketplace/posts/:post_id/analytics
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "views": 150,
    "bids_count": 5,
    "messages_count": 3,
    "view_analytics": {
      "daily_views": [
        {"date": "2024-01-15", "views": 50},
        {"date": "2024-01-16", "views": 75},
        {"date": "2024-01-17", "views": 25}
      ]
    }
  }
}
```

## Database Schema

### Tables Required

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('brand', 'influencer')),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### marketplace_posts
```sql
CREATE TABLE marketplace_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    budget VARCHAR(50) NOT NULL,
    deadline DATE NOT NULL,
    location VARCHAR(100),
    gender_target VARCHAR(20),
    requirements TEXT,
    image_url TEXT,
    video_url TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'pending', 'expired')),
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### bids
```sql
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES marketplace_posts(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    portfolio_links JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    brand_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, influencer_id)
);
```

#### messages
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES marketplace_posts(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'text' CHECK (type IN ('text', 'image', 'file')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### post_views
```sql
CREATE TABLE post_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES marketplace_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);
```

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Request validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Access denied
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_SERVER_ERROR`: Server error

## Authentication & Authorization

### JWT Token Structure
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "role": "brand|influencer",
  "exp": 1640995200
}
```

### Rate Limiting
- POST endpoints: 60 requests per minute
- GET endpoints: 120 requests per minute
- File upload: 10 requests per minute

## Real-time Features (WebSocket)

### Events for Real-time Updates
1. `new_bid_received` - Brand receives notification of new bid
2. `bid_status_updated` - Influencer receives bid status update
3. `new_message` - User receives new message
4. `post_viewed` - Brand receives view notification

## Implementation Notes

1. **File Storage**: Use cloud storage (AWS S3, Google Cloud Storage) for images and videos
2. **Image Processing**: Implement image optimization and multiple size variants
3. **Search**: Implement full-text search for posts using Elasticsearch or similar
4. **Caching**: Use Redis for caching frequently accessed data
5. **Notifications**: Implement push notifications for mobile apps
6. **Analytics**: Consider using analytics services for detailed tracking

## Security Considerations

1. **Input Validation**: Validate all inputs server-side
2. **File Upload**: Validate file types and sizes, scan for malware
3. **Rate Limiting**: Implement proper rate limiting
4. **CORS**: Configure CORS policies appropriately
5. **SQL Injection**: Use parameterized queries
6. **XSS Protection**: Sanitize user inputs
7. **HTTPS**: Enforce HTTPS for all endpoints

This API specification provides a comprehensive foundation for implementing the marketplace feature backend system.