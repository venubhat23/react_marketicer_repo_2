# Individual Link Analytics API Documentation

## Overview
This document outlines the API endpoints required to support the Individual Link Analytics feature with comprehensive analytics data, charts, and user interactions.

## Color Palette
- **Primary (Vivid Violet)**: #882AFF
- **Secondary (Navy Blue)**: #091A48  
- **Black**: #0b0b0b
- **White**: #ffffff

## Base URL
```
https://api.marketincer.com/v1
```

## Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer <access_token>
```

---

## 1. Individual Link Analytics

### GET /analytics/links/{shortCode}
Get comprehensive analytics data for a specific short link.

**Parameters:**
- `shortCode` (path): The short code of the link (e.g., "abc123")
- `dateRange` (query, optional): Date range filter ("7d", "30d", "90d", "1y", "all")
- `startDate` (query, optional): Start date (YYYY-MM-DD)
- `endDate` (query, optional): End date (YYYY-MM-DD)

**Request Example:**
```http
GET /analytics/links/abc123?dateRange=30d
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "short_code": "abc123",
    "short_url": "https://app.marketincer.com/r/abc123",
    "long_url": "https://app.marketincer.com/login?utm_source=google&utm_medium=email&utm_campaign=sale&utm_term=background&utm_content=promo1",
    "title": "Social Media Platform",
    "description": "Login page for social media platform",
    "created_at": "2025-07-26T18:25:00Z",
    "tags": [],
    "active": true,
    "total_clicks": 1,
    "metrics": {
      "engagements": 1,
      "last_7_days": 1,
      "weekly_change_percentage": 100,
      "weekly_change_direction": "up"
    },
    "engagement_over_time": [
      {
        "date": "2025-07-26",
        "link_clicks": 0,
        "qr_scans": 0,
        "bitly_clicks": 0
      },
      {
        "date": "2025-07-27", 
        "link_clicks": 0,
        "qr_scans": 0,
        "bitly_clicks": 0
      },
      {
        "date": "2025-07-28",
        "link_clicks": 1,
        "qr_scans": 0,
        "bitly_clicks": 0
      },
      {
        "date": "2025-07-29",
        "link_clicks": 0,
        "qr_scans": 0,
        "bitly_clicks": 0
      }
    ],
    "geographic_data": {
      "countries": [
        {
          "rank": 1,
          "country": "India",
          "country_code": "IN",
          "engagements": 1,
          "percentage": 100
        }
      ],
      "cities": [
        {
          "rank": 1,
          "city": "Mumbai",
          "country": "India",
          "engagements": 1,
          "percentage": 100
        }
      ]
    },
    "referrer_data": [
      {
        "source": "direct",
        "engagements": 1,
        "percentage": 100
      }
    ],
    "device_data": [
      {
        "device_type": "Desktop",
        "engagements": 60,
        "percentage": 60
      },
      {
        "device_type": "Mobile", 
        "engagements": 30,
        "percentage": 30
      },
      {
        "device_type": "Tablet",
        "engagements": 10,
        "percentage": 10
      }
    ],
    "qr_code": {
      "exists": false,
      "url": null,
      "scans": 0
    },
    "bitly_page": {
      "exists": false,
      "url": null,
      "visits": 0
    },
    "change_history": [
      {
        "action": "Created",
        "destination_url": "https://app.marketincer.com/login?utm_source=google&utm_medium=email&utm_campaign=sale&utm_term=background&utm_content=promo1",
        "engagements": 1,
        "date_active_start": "2025-07-26",
        "date_active_end": "Today",
        "timestamp": "2025-07-26T18:25:00Z"
      }
    ]
  }
}
```

---

## 2. QR Code Management

### POST /analytics/links/{shortCode}/qr-code
Create a QR code for the short link.

**Request:**
```json
{
  "size": "300x300",
  "format": "png",
  "style": {
    "foreground_color": "#000000",
    "background_color": "#ffffff",
    "logo": null
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qr_code_url": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A//app.marketincer.com/r/abc123",
    "download_url": "https://api.marketincer.com/v1/qr-codes/abc123/download",
    "expires_at": "2025-08-26T18:25:00Z"
  }
}
```

### GET /analytics/links/{shortCode}/qr-code
Get existing QR code information.

**Response:**
```json
{
  "success": true,
  "data": {
    "exists": true,
    "qr_code_url": "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A//app.marketincer.com/r/abc123",
    "scans": 0,
    "created_at": "2025-07-26T18:25:00Z"
  }
}
```

---

## 3. Bitly Page Management

### POST /analytics/links/{shortCode}/bitly-page
Create a Bitly page for the short link.

**Request:**
```json
{
  "title": "Social Media Platform",
  "description": "Login to our social media platform",
  "theme": "default",
  "custom_domain": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bitly_page_url": "https://bit.ly/pages/abc123",
    "page_id": "page_abc123",
    "visits": 0,
    "created_at": "2025-07-26T18:25:00Z"
  }
}
```

---

## 4. Real-time Analytics

### GET /analytics/links/{shortCode}/realtime
Get real-time analytics data.

**Response:**
```json
{
  "success": true,
  "data": {
    "live_visitors": 0,
    "clicks_last_hour": 0,
    "clicks_today": 1,
    "active_countries": ["India"],
    "top_referrer": "direct",
    "last_updated": "2025-07-29T12:30:00Z"
  }
}
```

---

## 5. Export Analytics

### GET /analytics/links/{shortCode}/export
Export analytics data in various formats.

**Parameters:**
- `format` (query): Export format ("csv", "json", "pdf")
- `dateRange` (query, optional): Date range filter
- `sections` (query, optional): Comma-separated sections to include

**Request Example:**
```http
GET /analytics/links/abc123/export?format=csv&dateRange=30d&sections=clicks,geographic,devices
```

**Response:**
```json
{
  "success": true,
  "data": {
    "download_url": "https://api.marketincer.com/v1/exports/abc123_analytics_20250729.csv",
    "expires_at": "2025-07-30T12:30:00Z",
    "file_size": "2048"
  }
}
```

---

## 6. Link Management

### PUT /analytics/links/{shortCode}
Update link details.

**Request:**
```json
{
  "title": "Updated Social Media Platform",
  "description": "Updated description",
  "tags": ["social", "media", "login"],
  "active": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "short_code": "abc123",
    "title": "Updated Social Media Platform",
    "description": "Updated description", 
    "tags": ["social", "media", "login"],
    "active": true,
    "updated_at": "2025-07-29T12:30:00Z"
  }
}
```

### DELETE /analytics/links/{shortCode}
Delete/deactivate a short link.

**Response:**
```json
{
  "success": true,
  "message": "Link successfully deactivated"
}
```

---

## 7. Bulk Operations

### GET /analytics/links
Get analytics for multiple links.

**Parameters:**
- `page` (query): Page number (default: 1)
- `limit` (query): Items per page (default: 20, max: 100)
- `sort` (query): Sort field ("created_at", "clicks", "title")
- `order` (query): Sort order ("asc", "desc")
- `search` (query): Search term
- `tags` (query): Filter by tags (comma-separated)

**Response:**
```json
{
  "success": true,
  "data": {
    "links": [
      {
        "id": 1,
        "short_code": "abc123",
        "short_url": "https://app.marketincer.com/r/abc123",
        "title": "Social Media Platform",
        "total_clicks": 1,
        "created_at": "2025-07-26T18:25:00Z",
        "active": true
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_items": 1,
      "items_per_page": 20
    }
  }
}
```

---

## 8. Click Tracking

### POST /track/click/{shortCode}
Track a click on the short link (internal use).

**Request:**
```json
{
  "user_agent": "Mozilla/5.0...",
  "ip_address": "192.168.1.1",
  "referrer": "https://google.com",
  "utm_parameters": {
    "utm_source": "google",
    "utm_medium": "email",
    "utm_campaign": "sale"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "click_id": "click_12345",
    "redirect_url": "https://app.marketincer.com/login?utm_source=google&utm_medium=email&utm_campaign=sale&utm_term=background&utm_content=promo1",
    "tracked": true
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "LINK_NOT_FOUND",
    "message": "The requested short link was not found",
    "details": null
  }
}
```

### Common Error Codes:
- `LINK_NOT_FOUND` (404): Short link not found
- `UNAUTHORIZED` (401): Invalid or missing authentication
- `FORBIDDEN` (403): Insufficient permissions
- `VALIDATION_ERROR` (400): Invalid request data
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_SERVER_ERROR` (500): Server error

---

## Rate Limits

- **Analytics endpoints**: 100 requests per minute per user
- **Export endpoints**: 10 requests per hour per user  
- **Management endpoints**: 200 requests per minute per user
- **Tracking endpoints**: 1000 requests per minute per IP

---

## Webhooks (Optional)

### POST /webhooks/analytics
Configure webhooks for real-time analytics events.

**Supported Events:**
- `link.clicked`
- `qr.scanned`
- `page.visited`
- `milestone.reached` (100, 1000, 10000 clicks)

**Webhook Payload Example:**
```json
{
  "event": "link.clicked",
  "timestamp": "2025-07-29T12:30:00Z",
  "data": {
    "short_code": "abc123",
    "click_id": "click_12345",
    "location": {
      "country": "India",
      "city": "Mumbai"
    },
    "device": "Desktop",
    "referrer": "direct"
  }
}
```

---

## SDK Examples

### JavaScript/Node.js
```javascript
const marketincerAnalytics = new MarketincerAnalytics({
  apiKey: 'your-api-key',
  baseURL: 'https://api.marketincer.com/v1'
});

// Get analytics
const analytics = await marketincerAnalytics.getAnalytics('abc123');

// Create QR code
const qrCode = await marketincerAnalytics.createQRCode('abc123', {
  size: '300x300'
});
```

### Python
```python
from marketincer_analytics import MarketincerAnalytics

client = MarketincerAnalytics(api_key='your-api-key')

# Get analytics
analytics = client.get_analytics('abc123')

# Export data
export_url = client.export_analytics('abc123', format='csv')
```

This comprehensive API documentation provides all the necessary endpoints to support the Individual Link Analytics feature with the exact UI requirements specified.