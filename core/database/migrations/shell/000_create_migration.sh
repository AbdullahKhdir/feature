#!/bin/bash
if [ ! "$1" ]
then
    read -p  "Please enter a migration name: " MIG_NAME
else
    MIG_NAME=$1;
fi

BASEDIR=$(dirname "$0")
FILE_NAME="$BASEDIR/../sql/$(date +""%Y%m%d_%H%M%S"")_$MIG_NAME.sql"
GIT_BRANCH=`git branch | grep "* " | cut -c 3-`;
USER_NAME=`git config --get user.name`;
USER_EMAIL=`git config --get user.email`;

echo "-- $MIG_NAME" > $FILE_NAME;
echo "-- @author $USER_NAME <$USER_EMAIL>" >> $FILE_NAME;
echo "-- @branch $GIT_BRANCH" >> $FILE_NAME;
echo "" >> $FILE_NAME;

echo "Neue Migration: $FILE_NAME";

if [ -x "$(command -v code)" ]; then
    code $FILE_NAME;
fi
