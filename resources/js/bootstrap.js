import axios from "axios";
import Alpine from "alpinejs";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

window.Alpine = Alpine;

// Wait for DOM to be ready and API client to be available before starting Alpine
function startAlpineWhenReady() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Wait a bit for API client to initialize
            setTimeout(() => Alpine.start(), 50);
        });
    } else {
        // DOM is already ready
        setTimeout(() => Alpine.start(), 50);
    }
}

startAlpineWhenReady();
