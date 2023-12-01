### CONFIGURATION
There is a dump of a sql database (/database/varquest_dungeon_2)

Once the base is installed, modify the database connection data in the file back/controllers/Controller.php.

There are 4 connection constants:

```
const SERVER_NAME = 'local server address';
const DB_NAME = 'database name';
const USERNAME = 'MySQL user name';
const PASSWORD = 'associated password';
```


Run the command php -S localhost:8080 /back/router/api.php from the root of the folder.

Open the file /front/index.html with a web browser.

If a different port and/or IP than localhost:8080 are used to run the backend, change the value of the "ip" constant in the file /front/js/config.js.

*Well, that's the theory... I really should take the time to update these instructions...*

### NOTES

This game is a school project completed in 2 weeks, so... some serious issues persist. But it was a good way to learn some programming concepts.
