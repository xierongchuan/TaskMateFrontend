<?php

return [
    /*
    |--------------------------------------------------------------------------
    | External API Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for the external TaskMate Telegram
    | Bot API. The frontend communicates with this API through a proxy system.
    |
    */

    'url' => env('API_URL', 'http://localhost:8007/api/v1'),
    'timeout' => env('API_TIMEOUT', 30),
];
