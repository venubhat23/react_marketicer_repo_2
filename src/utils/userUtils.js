// Utility functions for managing user data without auth context

/**
 * Get the current user role from localStorage
 * @returns {string} User role or 'influencer' as default
 */
export const getUserRole = () => {
  return localStorage.getItem('userRole') || 'influencer';
};

/**
 * Set user role in localStorage
 * @param {string} role - The user role to set
 */
export const setUserRole = (role) => {
  localStorage.setItem('userRole', role);
};

/**
 * Get user token from localStorage
 * @returns {string|null} User token or null if not found
 */
export const getUserToken = () => {
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = () => {
  return !!getUserToken();
};

/**
 * Clear user data from localStorage (useful for logout)
 */
export const clearUserData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
};

/**
 * Check if user has a specific role
 * @param {string} role - Role to check against
 * @returns {boolean} True if user has the specified role
 */
export const hasRole = (role) => {
  const userRole = getUserRole();
  // Handle case insensitive comparison
  return userRole.toLowerCase() === role.toLowerCase();
};

/**
 * Check if user is admin
 * @returns {boolean} True if user is admin
 */
export const isAdmin = () => {
  const userRole = getUserRole();
  return userRole === 'Admin' || userRole === 'admin';
};

/**
 * Check if user is brand
 * @returns {boolean} True if user is brand
 */
export const isBrand = () => {
  const userRole = getUserRole();
  return userRole === 'Brand' || userRole === 'brand';
};

/**
 * Check if user is influencer
 * @returns {boolean} True if user is influencer
 */
export const isInfluencer = () => {
  const userRole = getUserRole();
  return userRole === 'Influencer' || userRole === 'influencer';
};