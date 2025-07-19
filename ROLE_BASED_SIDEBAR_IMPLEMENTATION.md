# Role-Based Sidebar Implementation

This implementation provides a dynamic sidebar that shows/hides navigation items based on the user's role (`admin`, `influencer`, `brand`).

## 🎯 Features

- **Dynamic Route Filtering**: Sidebar automatically filters navigation items based on user role
- **Role-Based Access Control**: Each route can specify which roles are allowed to access it
- **Responsive Design**: Collapsible sidebar with smooth animations
- **Persistent State**: Sidebar state (open/closed) is saved to localStorage
- **Visual Feedback**: Active route highlighting and role badge display

## 📁 Files Created/Modified

### New Files:
- `src/utils/routeUtils.js` - Utility functions for filtering routes
- `src/components/DynamicSidenav.js` - Dynamic sidebar component
- `src/components/DashboardLayout.js` - Layout wrapper with sidebar
- `src/routes-demo.js` - Simplified routes configuration for demo
- `src/layouts/` - Demo layout components (dashboard, media, analytics, etc.)

### Modified Files:
- `src/authContext/AuthContext.jsx` - Enhanced to store full user data
- `src/pages/Login.js` - Updated to store user data with role
- `src/App.tsx` - Added demo routes and DashboardLayout integration

## 🔧 How It Works

### 1. Authentication Enhancement

The `AuthContext` now stores the complete user data from the login response:

```javascript
// Login response structure
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "role": "Admin",
    "id": 4,
    "first_name": null,
    // ... other user fields
  }
}

// AuthContext stores both token and user data
const login = (token, userData) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userData', JSON.stringify(userData));
  setUser({ token, ...userData });
};
```

### 2. Route Configuration

Each route in the configuration includes a `roles` array:

```javascript
{
  type: "collapse",
  name: "Media",
  key: "media",
  icon: <Icon fontSize="small">perm_media</Icon>,
  route: "/media",
  component: <ProtectedRoute><Media /></ProtectedRoute>,
  roles: ["admin", "influencer"] // Only admin and influencer can see this
}
```

### 3. Dynamic Filtering

The `routeUtils.js` provides filtering functions:

```javascript
export const getSidebarRoutes = (routes, userRole) => {
  const filteredRoutes = getFilteredRoutes(routes, userRole);
  return filteredRoutes.filter(route => route.type === "collapse");
};
```

### 4. Sidebar Rendering

The `DynamicSidenav` component automatically filters and renders only allowed routes:

```javascript
const { user } = useAuth();
const filteredRoutes = getSidebarRoutes(routes, user?.role);
```

## 👥 Role-Based Visibility

| Role           | Accessible Pages                                              |
|----------------|---------------------------------------------------------------|
| **Admin**      | Dashboard, Calendar, Media, Explore, Analytics, Reports, Invoice |
| **Influencer** | Dashboard, Calendar, Media, Analytics, Reports, Invoice       |
| **Brand**      | Dashboard, Explore, Analytics, Invoice                        |

## 🚀 Usage

### 1. Wrap Protected Routes with DashboardLayout

```javascript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  </ProtectedRoute>
} />
```

### 2. Configure Route Roles

Add the `roles` array to any route in `routes-demo.js`:

```javascript
{
  type: "collapse",
  name: "New Feature",
  key: "new-feature",
  icon: <Icon fontSize="small">new_releases</Icon>,
  route: "/new-feature",
  component: <ProtectedRoute><NewFeature /></ProtectedRoute>,
  roles: ["admin"] // Only admin can access
}
```

### 3. Login with Role Data

Ensure your login function passes both token and user data:

```javascript
const res = await axios.post("https://api.marketincer.com/api/v1/login", form);
login(res.data.token, res.data.user); // Pass both token and user data
```

## 🎨 Customization

### Sidebar Styling

Modify `DynamicSidenav.js` to customize appearance:

```javascript
sx={{
  bgcolor: '#091a48', // Change background color
  width: isOpen ? 240 : 80, // Adjust widths
  // ... other styles
}}
```

### Add New Roles

1. Update the `roles` array in route configurations
2. The filtering logic automatically handles new roles

### Custom Route Types

Add new route types by modifying the filter in `getSidebarRoutes`:

```javascript
return filteredRoutes.filter(route => 
  route.type === "collapse" || route.type === "custom-type"
);
```

## 🔍 Testing Different Roles

To test different roles, you can temporarily modify the login response or create test accounts with different roles:

1. **Admin Role**: Should see all pages
2. **Influencer Role**: Should not see "Explore" page
3. **Brand Role**: Should not see "Calendar", "Media", or "Reports" pages

## 📝 Notes

- The sidebar state (open/collapsed) persists across browser sessions
- Role names are case-insensitive in the filtering logic
- Routes without `roles` defined are accessible to all authenticated users
- The role badge is displayed at the bottom of the sidebar when expanded

## 🔄 Integration with Existing App

To integrate with your existing application:

1. Replace `routes-demo.js` with your actual routes configuration
2. Add `roles` arrays to each route that needs role-based access
3. Update the imports in `DynamicSidenav.js` to use your routes file
4. Wrap your protected routes with `DashboardLayout`

This implementation provides a flexible, scalable solution for role-based navigation that can be easily extended and customized.