<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DealershipController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\Settings;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Tasks
    Route::resource('tasks', TaskController::class);

    // Dealerships
    Route::resource('dealerships', DealershipController::class);

    // Users Management
    Route::resource('users', UserManagementController::class);

    // Links
    Route::get('links', [LinkController::class, 'index'])->name('links.index');
    Route::post('links', [LinkController::class, 'store'])->name('links.store');
    Route::put('links/{link}', [LinkController::class, 'update'])->name('links.update');
    Route::delete('links/{link}', [LinkController::class, 'destroy'])->name('links.destroy');

    // Settings
    Route::get('settings/profile', [Settings\ProfileController::class, 'edit'])->name('settings.profile.edit');
    Route::put('settings/profile', [Settings\ProfileController::class, 'update'])->name('settings.profile.update');
    Route::delete('settings/profile', [Settings\ProfileController::class, 'destroy'])->name('settings.profile.destroy');
    Route::get('settings/password', [Settings\PasswordController::class, 'edit'])->name('settings.password.edit');
    Route::put('settings/password', [Settings\PasswordController::class, 'update'])->name('settings.password.update');
    Route::get('settings/appearance', [Settings\AppearanceController::class, 'edit'])->name('settings.appearance.edit');
    Route::get('settings/system', [Settings\SystemSettingsController::class, 'edit'])->name('settings.system.edit');
    Route::put('settings/system', [Settings\SystemSettingsController::class, 'update'])->name('settings.system.update');
});

require __DIR__.'/auth.php';
