<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'key',
        'value',
        'type',
    ];

    protected $casts = [
        'value' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function getValue(string $key, mixed $default = null, ?string $userId = null)
    {
        $userId = $userId ?? session()->getId();

        $setting = static::where('user_id', $userId)
            ->where('key', $key)
            ->first();

        if (!$setting) {
            return $default;
        }

        return match ($setting->type) {
            'boolean' => (bool) $setting->value,
            'integer' => (int) $setting->value,
            'float' => (float) $setting->value,
            'json' => json_decode($setting->value, true),
            default => $setting->value,
        };
    }

    public static function setValue(string $key, mixed $value, string $type = 'string', ?string $userId = null)
    {
        $userId = $userId ?? session()->getId();

        $processedValue = match ($type) {
            'boolean' => $value ? 'true' : 'false',
            'json' => json_encode($value),
            default => (string) $value,
        };

        return static::updateOrCreate(
            ['user_id' => $userId, 'key' => $key],
            ['value' => $processedValue, 'type' => $type]
        );
    }

    public static function getBulk(array $keys, ?string $userId = null)
    {
        $userId = $userId ?? session()->getId();

        return static::where('user_id', $userId)
            ->whereIn('key', $keys)
            ->get()
            ->mapWithKeys(function ($setting) {
                return [$setting->key => static::getValue($setting->key, null, $setting->user_id)];
            })
            ->toArray();
    }

    public static function setBulk(array $settings, ?string $userId = null)
    {
        $userId = $userId ?? session()->getId();
        $results = [];

        foreach ($settings as $key => $data) {
            $value = $data['value'] ?? null;
            $type = $data['type'] ?? 'string';

            $results[$key] = static::setValue($key, $value, $type, $userId);
        }

        return $results;
    }
}
