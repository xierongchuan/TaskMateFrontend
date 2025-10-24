<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
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
     * Get all settings for the authenticated user.
     */
    public function index(): JsonResponse
    {
        $settings = Setting::where('user_id', Auth::id())->get();

        return response()->json([
            'data' => $settings
        ]);
    }

    /**
     * Get specific setting by key.
     */
    public function show(string $key): JsonResponse
    {
        $setting = Setting::where('user_id', Auth::id())
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

        $setting = Setting::setValue(
            $key,
            $request->input('value'),
            $request->input('type', 'string')
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

        $results = Setting::setBulk($settingsData);

        return response()->json(['data' => array_values($results)]);
    }

    /**
     * Delete a setting.
     */
    public function destroy(string $key): JsonResponse
    {
        $setting = Setting::where('user_id', Auth::id())
            ->where('key', $key)
            ->first();

        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        $setting->delete();

        return response()->json(['message' => 'Setting deleted successfully']);
    }
}
