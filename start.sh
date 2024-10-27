#!/bin/bash
php back/config/run.php -b
xdg-open front/index.html

echo "Game started in your browser"
echo "Run 'bash stop.sh' to stop all the processes related to the game"