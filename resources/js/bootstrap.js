import axios from "axios";
import Alpine from "alpinejs";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

window.Alpine = Alpine;

// Wait for DOM to be ready before starting Alpine
document.addEventListener('DOMContentLoaded', () => {
    Alpine.start();
});
