<?php

$options = getopt("b::");
$background = isset($options['b']);

$command = 'php -S localhost:8080 back/public/index.php';
$output = [];
$returnVar = 0;

if ($background) {
    exec($command . ' > /dev/null 2>&1 &', $output, $returnVar);
} else {
    exec($command, $output, $returnVar);
}

if ($returnVar !== 0) {
    echo "Failed to start server\n";
}

$port = 8080;
$documentRoot = __DIR__ . '/back/public/index.php';

if (!$background) {
    exec("php -S localhost:{$port} -t " . dirname($documentRoot), $output, $return_var);
} else {
    echo "Server started at http://localhost:{$port}\n";
}