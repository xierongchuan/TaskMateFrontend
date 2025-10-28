<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class ApiProxyController extends Controller
{
    /**
     * Proxy API requests to external Telegram Bot API
     */
    public function proxy(Request $request, string $endpoint): JsonResponse
    {
        try {
            // Get API URL from configuration
            $apiUrl = config('api.url');

            // Get token from session
            $apiToken = $request->session()->get('api_token');

            // Define endpoints that don't require authentication
            $publicEndpoints = ['register', 'session'];
            $isPublicEndpoint = in_array(trim($endpoint, '/'), $publicEndpoints);

            // Check authentication for protected endpoints
            if (!$isPublicEndpoint && !$apiToken) {
                return response()->json([
                    'error' => 'Authentication required',
                    'message' => 'Please login to access this resource'
                ], 401);
            }

            // Build the external URL
            $externalUrl = rtrim($apiUrl, '/') . '/' . ltrim($endpoint, '/');

            // Prepare request headers
            $headers = [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ];

            // Add authorization header only if we have a token
            if ($apiToken) {
                $headers['Authorization'] = "Bearer {$apiToken}";
            }

            // Add any custom headers from the original request
            if ($request->header('X-Requested-With')) {
                $headers['X-Requested-With'] = $request->header('X-Requested-With');
            }

            // Make the external request
            $response = Http::withHeaders($headers)
                ->timeout(config('api.timeout'))
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
            // Get API URL from configuration
            $apiUrl = config('api.url');

            // Get token from session
            $apiToken = $request->session()->get('api_token');

            if (!$apiToken) {
                return response()->json([
                    'error' => 'Authentication required'
                ], 401);
            }

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
            ]);

            return response()->json([
                'error' => 'Upload failed',
                'message' => 'Unable to upload file to external API'
            ], 500);
        }
    }
}
