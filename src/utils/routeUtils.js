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
    return route.roles.some(role => role.toLowerCase() === normalizedUserRole);
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
  return filteredRoutes.filter(route => route.type === "collapse");
};