<?php

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('register screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('dashboard requires authentication', function () {
    $response = $this->get('/dashboard');

    $response->assertRedirect('/login');
});

test('api proxy requires authentication for protected endpoints', function () {
    $response = $this->get('/api/proxy/users');

    $response->assertStatus(401);
    $response->assertJson([
        'error' => 'Authentication required',
    ]);
});

test('api proxy allows access to public endpoints', function () {
    // The /register and /session endpoints are public
    // They should not require authentication from the proxy
    // but will be validated by the external API
    $response = $this->post('/api/proxy/register', [
        'login' => 'testuser',
        'password' => 'testpassword123',
    ]);

    // We expect this to fail at the external API level (not 401 from proxy)
    // The proxy should forward the request without requiring auth
    $response->assertStatus(500); // Connection error since API is not running in tests
});
