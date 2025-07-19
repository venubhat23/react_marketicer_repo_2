/**
 * Filters routes based on user role
 * @param {Array} routes - Array of route objects
 * @param {string} userRole - User's role (admin, influencer, brand)
 * @returns {Array} Filtered routes array
 */
export const getFilteredRoutes = (routes, userRole) => {
  if (!userRole) {
    return routes.filter(route => !route.roles); // Return only routes without role restrictions
  }

  // Normalize the user role to lowercase for comparison
  const normalizedUserRole = userRole.toLowerCase();

  return routes.filter(route => {
    // If route doesn't have roles defined, it's accessible to all
    if (!route.roles || !Array.isArray(route.roles)) {
      return true;
    }

    // Check if user's role is in the route's allowed roles
    const hasAccess = route.roles.some(role => role.toLowerCase() === normalizedUserRole);
    
    // Debug logging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Route: ${route.name}, User Role: ${normalizedUserRole}, Route Roles: ${route.roles}, Access: ${hasAccess}`);
    }
    
    return hasAccess;
  });
};

/**
 * Gets routes that should be visible in the sidebar (type: "collapse")
 * @param {Array} routes - Array of route objects
 * @param {string} userRole - User's role (admin, influencer, brand)
 * @returns {Array} Filtered sidebar routes
 */
export const getSidebarRoutes = (routes, userRole) => {
  const filteredRoutes = getFilteredRoutes(routes, userRole);
  
  // Only return routes that should be displayed in the sidebar
  const sidebarRoutes = filteredRoutes.filter(route => route.type === "collapse");
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log(`Total routes: ${routes.length}, Filtered routes: ${filteredRoutes.length}, Sidebar routes: ${sidebarRoutes.length}`);
    console.log('Sidebar routes:', sidebarRoutes.map(r => r.name));
  }
  
  return sidebarRoutes;
};

/**
 * Test function to verify role-based filtering works correctly
 * @param {Array} routes - Array of route objects
 */
export const testRoleBasedFiltering = (routes) => {
  console.log('=== Testing Role-Based Filtering ===');
  
  const testRoles = ['Admin', 'Influencer', 'Brand'];
  
  testRoles.forEach(role => {
    console.log(`\n--- Testing role: ${role} ---`);
    const sidebarRoutes = getSidebarRoutes(routes, role);
    console.log(`Visible routes for ${role}:`, sidebarRoutes.map(r => r.name));
  });
  
  console.log('\n=== Expected Results ===');
  console.log('Admin should see: Dashboard, Create Post, Contract, Analytics, Social Media');
  console.log('Influencer should see: Dashboard, Create Post, Social Media');
  console.log('Brand should see: Dashboard, Contract, Analytics');
};