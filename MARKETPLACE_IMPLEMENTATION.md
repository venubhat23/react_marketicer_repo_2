# 🛒 Marketplace API Implementation

This document describes the complete implementation of the Marketplace feature according to the provided API documentation.

## 📋 Overview

The marketplace feature allows:
- **Brands/Admins**: Create, manage marketplace posts, and handle bids from influencers
- **Influencers**: Browse marketplace posts and submit bids

## 🏗️ Architecture

### Components Structure
```
src/pages/MarketPlace/
├── MarketplaceModule.js          # Main marketplace component with role-based views
├── CreateMarketplacePost.js      # Create/edit marketplace posts (brands/admins)
├── BidManagement.js              # Manage bids for posts (brands/admins)
├── MarketplacePostDetail.js      # Detailed view of marketplace posts
└── MarketplaceStatistics.js     # Analytics and statistics dashboard

src/services/
└── marketplaceApi.js             # Complete API service implementation
```

### API Service (`src/services/marketplaceApi.js`)

The API service implements all endpoints from the documentation:

#### Marketplace Posts Endpoints
- `getMarketplaceFeed()` - Get marketplace feed for influencers
- `getMyMarketplacePosts()` - Get current user's posts (brands/admins)
- `getMarketplacePost(id)` - Get single marketplace post
- `createMarketplacePost(data)` - Create new marketplace post
- `updateMarketplacePost(id, data)` - Update existing post
- `deleteMarketplacePost(id)` - Delete marketplace post
- `getMarketplaceStatistics()` - Get marketplace analytics

#### Bids Endpoints
- `createBid(data)` - Submit a bid (influencers)
- `getMyBids()` - Get influencer's bids
- `getMarketplacePostBids(postId)` - Get bids for a specific post
- `updateBidStatus(bidId, data)` - Accept/reject bids (brands/admins)

#### Search Endpoints
- `searchMarketplacePosts(query)` - Search marketplace posts

## 🎯 Features Implemented

### 1. Role-Based Access Control
- **Influencers**: Can browse posts and submit bids
- **Brands/Admins**: Can create posts, manage posts, and handle bids
- **Dynamic routing** based on user role

### 2. Marketplace Feed (Influencers)
- **Filtering**: By category, target audience
- **Search**: Full-text search across posts
- **Pagination**: Server-side pagination with controls
- **Post cards** with all relevant information
- **Bid submission** with optional message

### 3. Post Management (Brands/Admins)
- **Create/Edit posts** with comprehensive form
- **Media upload** support (images/videos)
- **Status management** (draft/published)
- **Tag system** for better categorization
- **Form validation** and error handling

### 4. Bid Management (Brands/Admins)
- **Tabbed interface** for bid status filtering
- **Accept/Reject bids** with optional rejection reason
- **Detailed bid information** including influencer profile
- **Real-time updates** when bid status changes

### 5. Post Details View
- **Comprehensive post information** display
- **Media preview** (images/videos)
- **Statistics** (views, bids count)
- **Share functionality** with Web Share API fallback
- **Edit/Delete actions** for post owners
- **Integrated bid management** for brands

### 6. Analytics Dashboard
- **Overview cards** with key metrics
- **Visual progress bars** for status breakdowns
- **Top performing posts** ranking
- **Category breakdown** with visual indicators
- **Responsive design** for all screen sizes

## 🔧 Technical Implementation

### API Integration
- **Consistent error handling** with `handleApiError` utility
- **Loading states** for all async operations
- **Toast notifications** for user feedback
- **Proper HTTP status code handling**

### State Management
- **React hooks** for local state management
- **useEffect** for data fetching and updates
- **Conditional rendering** based on user roles
- **Real-time updates** after actions

### UI/UX Features
- **Material-UI components** for consistent design
- **Responsive grid layouts**
- **Loading indicators** and skeleton screens
- **Form validation** with helpful error messages
- **Accessibility** considerations

### Routing
- **Dynamic routes** based on user roles
- **Protected routes** with authentication
- **Clean URLs** for SEO and user experience
- **Navigation guards** for unauthorized access

## 📱 User Flows

### Influencer Flow
1. **Browse Marketplace** → Filter/Search posts
2. **View Post Details** → Review requirements and budget
3. **Submit Bid** → Enter amount and optional message
4. **Track Bids** → Monitor bid status and responses

### Brand/Admin Flow
1. **Create Post** → Fill form with requirements and budget
2. **Manage Posts** → View, edit, or delete existing posts
3. **Review Bids** → Accept or reject influencer bids
4. **Analytics** → Monitor post performance and statistics

## 🚀 API Endpoints Mapping

### Frontend → Backend Mapping
```javascript
// Marketplace Posts
GET /api/v1/marketplace_posts → getMarketplaceFeed()
GET /api/v1/marketplace_posts/my_posts → getMyMarketplacePosts()
GET /api/v1/marketplace_posts/:id → getMarketplacePost(id)
POST /api/v1/marketplace_posts → createMarketplacePost(data)
PUT /api/v1/marketplace_posts/:id → updateMarketplacePost(id, data)
DELETE /api/v1/marketplace_posts/:id → deleteMarketplacePost(id)

// Bids
POST /api/v1/bids → createBid(data)
GET /api/v1/bids/my_bids → getMyBids()
GET /api/v1/marketplace_posts/:id/bids → getMarketplacePostBids(postId)
PUT /api/v1/bids/:id → updateBidStatus(bidId, data)

// Search & Analytics
GET /api/v1/marketplace_posts/search → searchMarketplacePosts(query)
GET /api/v1/marketplace_posts/statistics → getMarketplaceStatistics()
```

## 🔐 Authentication & Authorization

All API calls include:
- **JWT token** in Authorization header
- **Role-based access control** on frontend
- **Error handling** for unauthorized access
- **Automatic token refresh** (if implemented)

## 📊 Data Models

### Marketplace Post
```javascript
{
  id: number,
  title: string,
  description: string,
  brand_name: string,
  budget: number,
  deadline: string,
  location: string,
  platform: string,
  category: string,
  target_audience: string,
  tags: string[],
  media_url: string,
  media_type: string,
  status: string,
  views_count: number,
  bids_count: number,
  user_has_bid: boolean,
  created_at: string,
  updated_at: string
}
```

### Bid
```javascript
{
  id: number,
  marketplace_post_id: number,
  influencer_name: string,
  influencer_username: string,
  followers_count: number,
  amount: number,
  message: string,
  status: string,
  rejection_reason: string,
  created_at: string
}
```

## 🎨 Styling & Design

- **Consistent color scheme** with primary purple (#882AFF)
- **Material Design principles** with custom enhancements
- **Responsive breakpoints** for mobile, tablet, desktop
- **Smooth animations** and transitions
- **Accessible color contrasts** and focus states

## 🧪 Testing Considerations

The implementation includes:
- **Error boundary** handling
- **Loading state management**
- **Form validation** testing
- **API error handling**
- **Role-based access** validation

## 🔄 Future Enhancements

Potential improvements:
- **Real-time notifications** for bid updates
- **Advanced search filters** (budget range, date range)
- **Bulk bid management** operations
- **Export functionality** for analytics
- **Advanced media handling** with multiple files
- **Chat system** between brands and influencers

## 📋 Setup Instructions

1. **Install dependencies**: `npm install`
2. **Configure API endpoints** in `src/services/marketplaceApi.js`
3. **Set up authentication** in `src/authContext/AuthContext.tsx`
4. **Build the project**: `npm run build`
5. **Start development server**: `npm start`

## 🐛 Troubleshooting

Common issues and solutions:
- **API endpoint mismatch**: Check base URL in API service
- **Authentication errors**: Verify JWT token handling
- **Role-based access**: Ensure user role is properly set
- **File upload issues**: Check media upload configuration

---

This implementation provides a complete, production-ready marketplace feature that follows the API documentation specifications and includes all required functionality for both influencers and brands.