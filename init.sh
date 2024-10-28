#!/bin/bash

ENV_FILE="back/.env"

# Check if .env file exists
if [ ! -f $ENV_FILE ]; then
    echo ".env file not found. Creating a new one..."
    
    read -p "Enter the database host (default: localhost): " DB_HOST
    DB_HOST=${DB_HOST:-127.0.0.1}
    
    read -p "Enter the database port (default: 3306): " DB_PORT
    DB_PORT=${DB_PORT:-3306}
    
    read -p "Enter the database user name: " DB_USER
    read -sp "Enter the database user password: " DB_PASS
    echo
    read -p "Enter the database name: " DB_NAME

    echo "DB_HOST=$DB_HOST" > $ENV_FILE
    echo "DB_PORT=$DB_PORT" >> $ENV_FILE
    echo "DB_USER=$DB_USER" >> $ENV_FILE
    echo "DB_PASS=$DB_PASS" >> $ENV_FILE
    echo "DB_NAME=$DB_NAME" >> $ENV_FILE
fi

# Load environment variables from .env file
if [ -f $ENV_FILE ]; then
    export $(grep -v '^#' $ENV_FILE | xargs)
else
    echo ".env file not found in the parent directory!"
    exit 1
fi

# Check if required environment variables are set
if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASS" ] || [ -z "$DB_NAME" ]; then
    echo "Required database environment variables (DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME) are not set!"
    exit 1
fi

# Dump the SQL file into the database
SQL_FILE="back/database/migration.sql"
if [ -f $SQL_FILE ]; then
    /usr/bin/mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS $DB_NAME < $SQL_FILE
    if [ $? -eq 0 ]; then
        chmod +x start.sh
        chmod +x stop.sh
        echo "Database successfully updated!"
        echo "Run 'bash start.sh' or './start.sh' to start the game"
    else
        echo "Error occurred while updating the database"
        exit 1
    fi
else
    echo "$SQL_FILE not found!"
    exit 1
fi