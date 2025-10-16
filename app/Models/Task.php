<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'comment',
        'creator_id',
        'dealership_id',
        'appear_date',
        'deadline',
        'recurrence',
        'task_type',
        'response_type',
        'tags',
        'is_active',
        'postpone_count',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'appear_date' => 'datetime',
            'deadline' => 'datetime',
            'tags' => 'array',
            'is_active' => 'boolean',
            'postpone_count' => 'integer',
        ];
    }

    /**
     * Get the creator of the task.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * Get the dealership that owns the task.
     */
    public function dealership(): BelongsTo
    {
        return $this->belongsTo(Dealership::class);
    }

    /**
     * Get the users assigned to this task.
     */
    public function assignedUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'task_assignments')
            ->withTimestamps();
    }

    /**
     * Get the assignments for the task.
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(TaskAssignment::class);
    }

    /**
     * Get the responses for the task.
     */
    public function responses(): HasMany
    {
        return $this->hasMany(TaskResponse::class);
    }
}
