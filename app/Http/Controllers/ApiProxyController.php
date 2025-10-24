<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use App\Models\Setting;

class ApiProxyController extends Controller
{
    /**
     * Proxy API requests to external Telegram Bot API
     */
    public function proxy(Request $request, string $endpoint): JsonResponse
    {
        try {
            // Get user's API settings
            $apiUrl = Setting::getValue('api_url', 'http://host.docker.internal:8007/api/v1');
            $apiToken = Setting::getValue('auth_token');

            if (!$apiToken) {
                return response()->json([
                    'error' => 'API token not configured',
                    'message' => 'Please configure your Telegram Bot API token in settings'
                ], 401);
            }

            // Replace localhost with host.docker.internal for Docker environment
            $apiUrl = str_replace('http://localhost:', 'http://host.docker.internal:', $apiUrl);

            // Build the external URL
            $externalUrl = rtrim($apiUrl, '/') . '/' . ltrim($endpoint, '/');

            // Prepare request headers
            $headers = [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => "Bearer {$apiToken}",
            ];

            // Add any custom headers from the original request
            if ($request->header('X-Requested-With')) {
                $headers['X-Requested-With'] = $request->header('X-Requested-With');
            }

            // Make the external request
            $response = Http::withHeaders($headers)
                ->timeout(30)
                ->send(
                    $request->method(),
                    $externalUrl,
                    [
                        'json' => $request->getContent() ? $request->json()->all() : [],
                        'query' => $request->query->all(),
                    ]
                );

            // Return the response with the same status code
            return response()->json(
                $response->json(),
                $response->status()
            );

        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('API Proxy Error: ' . $e->getMessage(), [
                'endpoint' => $endpoint,
                'method' => $request->method(),
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'error' => 'Proxy request failed',
                'message' => 'Unable to connect to external API',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Handle file uploads through proxy
     */
    public function proxyUpload(Request $request, string $endpoint): JsonResponse
    {
        try {
            // Get user's API settings
            $apiUrl = Setting::getValue('api_url', 'http://host.docker.internal:8007/api/v1');
            $apiToken = Setting::getValue('auth_token');

            if (!$apiToken) {
                return response()->json([
                    'error' => 'API token not configured'
                ], 401);
            }

            // Replace localhost with host.docker.internal for Docker environment
            $apiUrl = str_replace('http://localhost:', 'http://host.docker.internal:', $apiUrl);

            $externalUrl = rtrim($apiUrl, '/') . '/' . ltrim($endpoint, '/');

            // Prepare headers
            $headers = [
                'Accept' => 'application/json',
                'Authorization' => "Bearer {$apiToken}",
            ];

            // Handle file uploads
            $files = [];
            foreach ($request->allFiles() as $key => $file) {
                $files[$key] = fopen($file->getPathname(), 'r');
            }

            // Prepare form data
            $data = $request->except(array_keys($request->allFiles()));

            // Make the request with files
            $response = Http::asMultipart()
                ->withHeaders($headers)
                ->timeout(60)
                ->attach(
                    array_map(fn($file, $key) => [
                        'name' => $key,
                        'contents' => $file,
                        'filename' => $request->file($key)->getClientOriginalName()
                    ], $files, array_keys($files))
                )
                ->post($externalUrl, $data);

            // Close file handles
            foreach ($files as $file) {
                if (is_resource($file)) {
                    fclose($file);
                }
            }

            return response()->json(
                $response->json(),
                $response->status()
            );

        } catch (\Exception $e) {
            \Log::error('API Proxy Upload Error: ' . $e->getMessage(), [
                'endpoint' => $endpoint,
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'error' => 'Upload failed',
                'message' => 'Unable to upload file to external API'
            ], 500);
        }
    }
}
