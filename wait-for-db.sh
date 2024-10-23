#!/bin/bash

until nc -z -v -w30 db 3306
do
  echo "Waiting for database connection..."
  sleep 5
done
echo "Database is up - executing command"
exec "$@"