<?php

use Illuminate\Support\Facades\Route;

// Public routes (no authentication required on backend)
// Authentication is handled on frontend via JavaScript

Route::get('/', function () {
    return view('welcome');
})->name('home');

// Auth pages (login, register, etc.)
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::get('/register', function () {
    return view('auth.register');
})->name('register');

Route::get('/forgot-password', function () {
    return view('auth.forgot-password');
})->name('password.request');

Route::get('/reset-password/{token}', function ($token) {
    return view('auth.reset-password', ['token' => $token]);
})->name('password.reset');

// Dashboard
Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

// Tasks
Route::get('/tasks', function () {
    return view('tasks.index');
})->name('tasks.index');

Route::get('/tasks/create', function () {
    return view('tasks.create');
})->name('tasks.create');

Route::get('/tasks/{id}/edit', function ($id) {
    return view('tasks.edit', ['id' => $id]);
})->name('tasks.edit');

Route::get('/tasks/{id}', function ($id) {
    return view('tasks.show', ['id' => $id]);
})->name('tasks.show');

// Dealerships
Route::get('/dealerships', function () {
    return view('dealerships.index');
})->name('dealerships.index');

Route::get('/dealerships/create', function () {
    return view('dealerships.create');
})->name('dealerships.create');

Route::get('/dealerships/{id}/edit', function ($id) {
    return view('dealerships.edit', ['id' => $id]);
})->name('dealerships.edit');

Route::get('/dealerships/{id}', function ($id) {
    return view('dealerships.show', ['id' => $id]);
})->name('dealerships.show');

// Users Management
Route::get('/users', function () {
    return view('users.index');
})->name('users.index');

Route::get('/users/create', function () {
    return view('users.create');
})->name('users.create');

Route::get('/users/{id}/edit', function ($id) {
    return view('users.edit', ['id' => $id]);
})->name('users.edit');

Route::get('/users/{id}', function ($id) {
    return view('users.show', ['id' => $id]);
})->name('users.show');

// Links
Route::get('/links', function () {
    return view('links.index');
})->name('links.index');

// Settings
Route::get('/settings/profile', function () {
    return view('settings.profile');
})->name('settings.profile.edit');

Route::get('/settings/password', function () {
    return view('settings.password');
})->name('settings.password.edit');

Route::get('/settings/appearance', function () {
    return view('settings.appearance');
})->name('settings.appearance.edit');

Route::get('/settings/system', function () {
    return view('settings.system');
})->name('settings.system.edit');

Route::get('/settings/bot-api', function () {
    return view('settings.bot-api');
})->name('settings.bot-api.edit');
