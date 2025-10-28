<?php

use App\Http\Controllers\Settings;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('home');

// API Proxy Routes (accessible to all, auth handled in controller)
Route::prefix('api/proxy')->group(function () {
    Route::any('{endpoint}', [App\Http\Controllers\ApiProxyController::class, 'proxy'])
        ->where('endpoint', '.*');
    Route::post('upload/{endpoint}', [App\Http\Controllers\ApiProxyController::class, 'proxyUpload'])
        ->where('endpoint', '.*');
});

// CSRF Token refresh endpoint (accessible to authenticated users)
Route::middleware(['api.auth'])->get('/csrf-token', function () {
    return response()->json([
        'csrf_token' => csrf_token()
    ]);
});

Route::middleware(['api.auth'])->group(function () {
    // Dashboard
    Route::get('dashboard', function () {
        return view('dashboard');
    })->name('dashboard');

    // Tasks
    Route::get('tasks', function () {
        return view('tasks.index');
    })->name('tasks.index');
    Route::get('tasks/create', function () {
        return view('tasks.create');
    })->name('tasks.create');
    Route::get('tasks/{id}/edit', function ($id) {
        return view('tasks.edit', ['id' => $id]);
    })->name('tasks.edit');
    Route::get('tasks/{id}', function ($id) {
        return view('tasks.show', ['id' => $id]);
    })->name('tasks.show');

    // Dealerships
    Route::get('dealerships', function () {
        return view('dealerships.index');
    })->name('dealerships.index');
    Route::get('dealerships/create', function () {
        return view('dealerships.create');
    })->name('dealerships.create');
    Route::get('dealerships/{id}/edit', function ($id) {
        return view('dealerships.edit', ['id' => $id]);
    })->name('dealerships.edit');
    Route::get('dealerships/{id}', function ($id) {
        return view('dealerships.show', ['id' => $id]);
    })->name('dealerships.show');

    // Users Management
    Route::get('users', function () {
        return view('users.index');
    })->name('users.index');
    Route::get('users/create', function () {
        return view('users.create');
    })->name('users.create');
    Route::get('users/{id}/edit', function ($id) {
        return view('users.edit', ['id' => $id]);
    })->name('users.edit');
    Route::get('users/{id}', function ($id) {
        return view('users.show', ['id' => $id]);
    })->name('users.show');

    // Links
    Route::get('links', function () {
        return view('links.index');
    })->name('links.index');

    // Settings
    Route::get('settings/bot-api', [Settings\BotApiController::class, 'edit'])->name('settings.bot-api.edit');

    // API Routes for Settings
    Route::prefix('api/settings')->group(function () {
        Route::get('/', [Settings\BotApiController::class, 'index']);
        Route::get('/{key}', [Settings\BotApiController::class, 'show']);
        Route::put('/{key}', [Settings\BotApiController::class, 'update']);
        Route::delete('/{key}', [Settings\BotApiController::class, 'destroy']);
        Route::post('/bulk', [Settings\BotApiController::class, 'bulkUpdate']);
    });
});

require __DIR__.'/auth.php';
