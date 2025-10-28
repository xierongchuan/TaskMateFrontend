/**
 * Frontend Authentication Guard
 *
 * This module provides client-side route protection by checking authentication status
 * and redirecting unauthenticated users to login page.
 */

import apiClient from "./api-client";

/**
 * Check if current route requires authentication
 */
function requiresAuth() {
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const currentPath = window.location.pathname;

  // Check if current path is public
  return !publicPaths.some((path) => {
    if (path === "/") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  });
}

/**
 * Check authentication and redirect if necessary
 */
function checkAuth() {
  // Only check auth for protected routes
  if (!requiresAuth()) {
    return;
  }

  // Check if user is authenticated
  if (!apiClient.isAuthenticated()) {
    // Save the intended destination
    const intendedUrl = window.location.pathname + window.location.search;
    if (intendedUrl !== "/login") {
      sessionStorage.setItem("intended_url", intendedUrl);
    }

    // Redirect to login
    window.location.href = "/login";
    return;
  }
}

/**
 * Redirect to intended URL after login
 */
function redirectAfterLogin() {
  const intendedUrl = sessionStorage.getItem("intended_url");
  sessionStorage.removeItem("intended_url");

  if (intendedUrl && intendedUrl !== "/login") {
    window.location.href = intendedUrl;
  } else {
    window.location.href = "/dashboard";
  }
}

/**
 * Redirect authenticated users away from auth pages
 */
function redirectIfAuthenticated() {
  const authPaths = ["/login", "/register"];
  const currentPath = window.location.pathname;

  if (authPaths.includes(currentPath) && apiClient.isAuthenticated()) {
    window.location.href = "/dashboard";
  }
}

// Run auth check on page load
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  redirectIfAuthenticated();
});

// Export functions for use in other modules
export { checkAuth, redirectAfterLogin, redirectIfAuthenticated, requiresAuth };
