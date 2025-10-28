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

test('api proxy requires authentication', function () {
    $response = $this->get('/api/proxy/users');

    $response->assertRedirect('/login');
});
