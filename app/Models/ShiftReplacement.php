<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShiftReplacement extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'shift_id',
        'replacing_user_id',
        'replaced_user_id',
        'reason',
    ];

    /**
     * Get the shift that owns the replacement.
     */
    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    /**
     * Get the user who is replacing.
     */
    public function replacingUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'replacing_user_id');
    }

    /**
     * Get the user who is being replaced.
     */
    public function replacedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'replaced_user_id');
    }
}
