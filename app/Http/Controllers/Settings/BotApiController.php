<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class BotApiController extends Controller
{
    /**
     * Show the form for editing the bot API settings.
     */
    public function edit()
    {
        return view('settings.bot-api');
    }

    /**
     * Get all settings for the authenticated user (session-based).
     */
    public function index(Request $request): JsonResponse
    {
        // Use session ID as user_id for settings
        $sessionId = $request->session()->getId();
        $settings = Setting::where('user_id', $sessionId)->get();

        return response()->json([
            'data' => $settings
        ]);
    }

    /**
     * Get specific setting by key.
     */
    public function show(Request $request, string $key): JsonResponse
    {
        // Use session ID as user_id for settings
        $sessionId = $request->session()->getId();
        $setting = Setting::where('user_id', $sessionId)
            ->where('key', $key)
            ->first();

        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        return response()->json(['data' => $setting]);
    }

    /**
     * Update or create a setting.
     */
    public function update(Request $request, string $key): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'value' => 'required|string',
            'type' => 'sometimes|string|in:string,integer,float,boolean,json'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Use session ID as user_id for settings
        $sessionId = $request->session()->getId();
        $setting = Setting::setValue(
            $key,
            $request->input('value'),
            $request->input('type', 'string'),
            $sessionId
        );

        return response()->json(['data' => $setting]);
    }

    /**
     * Bulk update settings.
     */
    public function bulkUpdate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'required',
            'settings.*.type' => 'sometimes|string|in:string,integer,float,boolean,json'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $settingsData = [];
        foreach ($request->input('settings') as $setting) {
            $settingsData[$setting['key']] = [
                'value' => $setting['value'],
                'type' => $setting['type'] ?? 'string'
            ];
        }

        // Use session ID as user_id for settings
        $sessionId = $request->session()->getId();
        $results = Setting::setBulk($settingsData, $sessionId);

        return response()->json(['data' => array_values($results)]);
    }

    /**
     * Delete a setting.
     */
    public function destroy(Request $request, string $key): JsonResponse
    {
        // Use session ID as user_id for settings
        $sessionId = $request->session()->getId();
        $setting = Setting::where('user_id', $sessionId)
            ->where('key', $key)
            ->first();

        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        $setting->delete();

        return response()->json(['message' => 'Setting deleted successfully']);
    }
}
