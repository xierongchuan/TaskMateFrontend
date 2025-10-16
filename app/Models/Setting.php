<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Setting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'key',
        'value',
        'type',
        'description',
        'dealership_id',
    ];

    /**
     * Get the dealership that owns the setting.
     */
    public function dealership(): BelongsTo
    {
        return $this->belongsTo(Dealership::class);
    }

    /**
     * Get the value attribute with proper type casting.
     */
    public function getValueAttribute($value)
    {
        return match ($this->type) {
            'integer' => (int) $value,
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'json' => json_decode($value, true),
            default => $value,
        };
    }

    /**
     * Set the value attribute with proper type casting.
     */
    public function setValueAttribute($value): void
    {
        $this->attributes['value'] = match ($this->type) {
            'json' => json_encode($value),
            'boolean' => $value ? '1' : '0',
            default => (string) $value,
        };
    }
}
