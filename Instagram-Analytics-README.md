# Instagram Analytics Dashboard

A comprehensive Instagram analytics tool built with React, Material-UI, and Recharts that provides detailed insights and metrics for Instagram accounts.

## Features

### 📊 Profile Overview
- **Profile Information**: Display of username, full name, profile picture, website, and verification status
- **Key Statistics**: Followers, Following, and Posts count with change indicators
- **Growth Metrics**: Real-time tracking of follower growth and engagement changes

### 📈 Analytics Dashboard
- **Engagement Metrics**: Detailed engagement rate tracking and analysis
- **Performance Indicators**: Average likes, comments, and engagement metrics
- **Growth Tracking**: Weekly and monthly growth statistics
- **Interactive Charts**: Visual representation of performance trends

### 📋 Data Visualization
- **Followers Chart**: Area chart showing follower growth over time
- **Following Chart**: Line chart displaying following patterns
- **Engagement Rate**: Trend analysis of engagement performance
- **Average Likes**: Performance metrics with visual indicators

### 📅 Historical Data
- **Data Table**: Comprehensive historical statistics
- **Date Range**: Daily tracking with day-of-week indicators
- **Export Functionality**: Download historical data for analysis
- **Change Indicators**: Visual representation of positive/negative changes

## Technology Stack

### Frontend Framework
- **React 19.1.0**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development environment
- **Material-UI 7.1.2**: Comprehensive UI component library

### Data Visualization
- **Recharts 2.15.3**: Modern charting library for React
- **Area Charts**: Smooth gradient visualizations
- **Line Charts**: Clean trend indicators
- **Responsive Design**: Charts adapt to different screen sizes

### UI Components
- **Material-UI Cards**: Clean, modern card layouts
- **Data Tables**: Sortable and filterable data presentation
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Custom Theme**: Purple accent theme with Poppins font

## Component Structure

```
src/
├── pages/
│   └── Profile/
│       └── InstagramAnalytics.tsx    # Main analytics component
├── components/
│   ├── Layout.js                     # Main layout wrapper
│   ├── Sidebar.js                    # Navigation sidebar
│   └── Navbar.js                     # Top navigation
└── theme.js                          # Material-UI theme configuration
```

## Key Features Implemented

### 1. Profile Header Section
- Avatar display with fallback
- Verified badge for verified accounts
- Action buttons (Add to Favorites, Export)
- Real-time statistics with change indicators

### 2. Metrics Cards
- **Followers Growth Rate**: 90-day growth percentage
- **Weekly Followers**: Short-term growth tracking
- **Engagement Rate**: User interaction metrics
- **Average Likes**: Content performance indicators
- **Average Comments**: Community engagement metrics
- **Weekly Posts**: Content publishing frequency

### 3. Interactive Charts
- **Responsive Design**: Charts scale with screen size
- **Custom Tooltips**: Detailed information on hover
- **Color-coded Data**: Visual distinction between metrics
- **Time-based X-axis**: Chronological data presentation

### 4. Historical Data Table
- **Date-based Organization**: Chronological data display
- **Change Indicators**: Visual representation of growth/decline
- **Export Functionality**: Data download capabilities
- **Sortable Columns**: Interactive data exploration

## Data Structure

### Profile Data
```typescript
interface ProfileData {
  username: string;
  fullName: string;
  avatar: string;
  website: string;
  verified: boolean;
  joinDate: string;
  followers: number;
  following: number;
  posts: number;
  followersChange: number;
  followingChange: number;
  postsChange: number;
}
```

### Metrics Data
```typescript
interface MetricsData {
  title: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}
```

### Historical Data
```typescript
interface HistoricalData {
  date: string;
  day: string;
  followers: number;
  change: number;
  following: number;
  posts: number;
  engagement: string;
}
```

## Styling and Theme

### Color Scheme
- **Primary Color**: #882AFF (Purple)
- **Success Color**: #4caf50 (Green)
- **Error Color**: #f44336 (Red)
- **Warning Color**: #ff9800 (Orange)
- **Background**: #f6edf8 (Light Purple)

### Typography
- **Font Family**: Poppins (Primary), Arial (Fallback)
- **Font Weights**: Regular (400), Semi-bold (600), Bold (700)
- **Responsive Sizing**: Scales with screen size

## Usage

### Installation
```bash
npm install
```

### Development
```bash
npm start
```

### Build
```bash
npm run build
```

### Access
- Navigate to `http://localhost:3000/`
- Or use the route `/instagram-analytics` for specific access

## Customization

### Adding New Metrics
1. Update the `metricsData` array in `InstagramAnalytics.tsx`
2. Add corresponding icons from `@mui/icons-material`
3. Update the color scheme in the theme configuration

### Modifying Charts
1. Update chart data arrays (`followersChartData`, `engagementChartData`, etc.)
2. Customize chart colors and styling
3. Add new chart types using Recharts components

### Extending Historical Data
1. Update the `historicalData` array
2. Add new columns to the table structure
3. Implement real API integration for live data

## API Integration

The current implementation uses mock data. To integrate with real Instagram API:

1. Replace mock data with API calls
2. Implement authentication (Instagram Basic Display API)
3. Add error handling and loading states
4. Implement real-time data updates

## Future Enhancements

### Planned Features
- **Real-time Data**: Live API integration
- **Multiple Accounts**: Support for multiple Instagram accounts
- **Advanced Analytics**: Deeper insights and comparisons
- **Export Options**: PDF reports and CSV exports
- **Mobile App**: React Native version
- **Dark Mode**: Theme switching capability

### Technical Improvements
- **Performance Optimization**: Lazy loading and memoization
- **Accessibility**: ARIA labels and keyboard navigation
- **Testing**: Unit tests and E2E testing
- **Documentation**: Comprehensive API documentation

## License

This project is created for educational and demonstration purposes. Please ensure compliance with Instagram's API terms of service when implementing real data integration.

---

**Note**: This is a demonstration tool created to replicate the functionality of Instagram analytics platforms. For production use, ensure proper API authentication and compliance with Instagram's terms of service.