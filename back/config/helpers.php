<?php

namespace Helpers;

function env($key): string
{
    $envPath = __DIR__ . '/../.env';
    if (!file_exists($envPath)) {
        throw new \Exception("Failed to open .env file at $envPath");
    }

    $env = parse_ini_file($envPath);
    if ($env === false) {
        throw new \Exception("Failed to parse .env file");
    }

    if (!isset($env[$key])) {
        throw new \Exception("Missing required key '$key' in .env file");
    }

    return (string)$env[$key];
}