<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'login',
        'full_name',
        'telegram_id',
        'phone',
        'role',
        'company_id',
        'dealership_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's initials
     */
    public function initials(): string
    {
        return Str::of($this->name)
            ->explode(' ')
            ->map(fn (string $name) => Str::of($name)->substr(0, 1))
            ->implode('');
    }

    /**
     * Get the company that owns the user.
     */
    public function company(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the dealership that owns the user.
     */
    public function dealership(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Dealership::class);
    }

    /**
     * Get the tasks created by the user.
     */
    public function createdTasks(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Task::class, 'creator_id');
    }

    /**
     * Get the tasks assigned to the user.
     */
    public function assignedTasks(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'task_assignments')
            ->withTimestamps();
    }

    /**
     * Get the task responses for the user.
     */
    public function taskResponses(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(TaskResponse::class);
    }

    /**
     * Get the shifts for the user.
     */
    public function shifts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Shift::class);
    }

    /**
     * Get the links created by the user.
     */
    public function createdLinks(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Link::class, 'creator_id');
    }
}
