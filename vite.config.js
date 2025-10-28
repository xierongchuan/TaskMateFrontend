import { defineConfig, loadEnv } from "vite";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [
            laravel({
                input: ["resources/css/app.css", "resources/js/app.js"],
                refresh: true,
            }),
            tailwindcss(),
        ],
        define: {
            // Make API_URL available to frontend JavaScript
            'import.meta.env.VITE_API_URL': JSON.stringify(
                env.VITE_API_URL || env.API_URL || 'http://localhost:8007/api/v1'
            ),
        },
    };
});
