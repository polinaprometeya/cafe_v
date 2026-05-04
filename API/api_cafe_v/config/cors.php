<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | This config enables browser-based apps (e.g. React dev server on :3000)
    | to call the Laravel API on :8000.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Adjust as needed for your environments. Include the exact origin the browser
    // sends (scheme + host + port). Expo / Metro dev (web) is often :8081, not :3000.
    // Set CORS_ALLOWED_ORIGINS in .env as comma-separated extra origins.
    'allowed_origins' => array_values(array_unique(array_merge(
        [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:8081',
            'http://127.0.0.1:8081',
            'http://localhost:19000',
            'http://127.0.0.1:19000',
            'http://localhost:19006',
            'http://127.0.0.1:19006',
        ],
        array_filter(array_map('trim', explode(',', (string) env('CORS_ALLOWED_ORIGINS', ''))))
    ))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Set to true only if you use cookie-based auth across origins.
    'supports_credentials' => false,
];

