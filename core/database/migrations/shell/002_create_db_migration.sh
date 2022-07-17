#!/bin/bash
if [ ! "$1" ]
then
    read -p  "Please enter a migration name: " MIG_NAME
else
    MIG_NAME=$1;
fi

if [ -x "$(command -v code)" ]; then
    node ../../../../node_modules/db-migrate/bin/db-migrate create $MIG_NAME --config "../../../../database.json" --migrations-dir "../../../../core/database/migrations/db_migrate/development_migrations/"  --migration-table "migrations" --env development --force-exit
fi
