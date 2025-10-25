import axios from "axios";
import Alpine from "alpinejs";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

window.Alpine = Alpine;

// Wait for DOM and API client to be ready before starting Alpine
function startAlpine() {
    // Check if API client is ready
    if (window.apiClientReady) {
        Alpine.start();
        console.log('Alpine.js started with API client ready');
    } else {
        // Wait a bit and try again
        setTimeout(() => {
            if (window.apiClientReady) {
                Alpine.start();
                console.log('Alpine.js started after API client ready');
            } else {
                console.warn('Starting Alpine.js without API client');
                Alpine.start();
            }
        }, 100);
    }
}

// Wait for DOM to be ready before starting Alpine
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAlpine);
} else {
    startAlpine();
}
