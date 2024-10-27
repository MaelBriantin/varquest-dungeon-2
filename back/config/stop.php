<?php

$port = 8080;

$command = "lsof -t -i:{$port}";

$output = [];
exec($command, $output);

if (!empty($output)) {
    $pid = $output[0];
    if (posix_kill($pid, SIGTERM)) {
        echo "Server stopped on port {$port}.\n";
    } else {
        echo "Failed to stop server on port {$port}.\n";
    }
} else {
    echo "No server found on port {$port}.\n";
}