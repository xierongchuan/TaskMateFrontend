<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SystemSettingsController extends Controller
{
    /**
     * Display the system settings page.
     */
    public function edit()
    {
        $settings = Setting::whereNull('dealership_id')->get()->keyBy('key');

        // Default settings
        $defaults = [
            'shift_1_start_time' => '09:00',
            'shift_1_end_time' => '18:00',
            'shift_2_start_time' => '18:00',
            'shift_2_end_time' => '00:00',
            'late_tolerance_minutes' => '15',
            'tasks_per_page' => '15',
            'auto_archive_days' => '30',
        ];

        foreach ($defaults as $key => $value) {
            if (! $settings->has($key)) {
                $settings[$key] = (object) ['key' => $key, 'value' => $value];
            }
        }

        return view('settings.system', compact('settings'));
    }

    /**
     * Update the system settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'shift_1_start_time' => 'required|date_format:H:i',
            'shift_1_end_time' => 'required|date_format:H:i',
            'shift_2_start_time' => 'required|date_format:H:i',
            'shift_2_end_time' => 'required|date_format:H:i',
            'late_tolerance_minutes' => 'required|integer|min:0|max:60',
            'tasks_per_page' => 'required|integer|min:5|max:100',
            'auto_archive_days' => 'required|integer|min:1|max:365',
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $value,
                    'type' => in_array($key, ['late_tolerance_minutes', 'tasks_per_page', 'auto_archive_days']) ? 'integer' : 'time',
                    'dealership_id' => null,
                ]
            );
        }

        return redirect()->route('settings.system.edit')->with('success', 'Settings updated successfully.');
    }
}
