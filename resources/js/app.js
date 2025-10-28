import "./bootstrap";
import "./api-client";
import "./auth-guard";

// Ensure Alpine.js initializes after API client
document.addEventListener("DOMContentLoaded", () => {
  if (!window.apiClientReady) {
    console.warn("API client not ready when DOM loaded, waiting...");
    setTimeout(() => {
      if (!window.apiClientReady) {
        console.error("API client still not ready after delay");
      }
    }, 500);
  }
});
