#!/bin/bash

BASEDIR=$(dirname "$0")
GIT_BRANCH=`git branch | grep "* " | cut -c 3-`;
USER_NAME=`git config --get user.name`;
USER_EMAIL=`git config --get user.email`;

if [ ! "$1" ]
then
    echo "Name of the folder (if not necessary press enter)"
    read -p  "Please enter a folder name: " FOLDER_NAME
else
    FOLDER_NAME=$1;
fi

if [ ! "$2" ]
then
    echo "Controller Name must be camelCase.ts"
    read -p  "Please enter a controller name: " CONTROLLER_NAME
    CONTROLLER_NAME="$(tr '[:lower:]' '[:upper:]' <<< ${CONTROLLER_NAME:0:1})${CONTROLLER_NAME:1}"
else
    CONTROLLER_NAME=$2;
fi

if [[ "$CONTROLLER_NAME" == *.ts ]]
then
    CONTROLLER_NAME=$CONTROLLER_NAME
else
    CONTROLLER_NAME="$CONTROLLER_NAME.ts"
fi

if [ -z "$FOLDER_NAME" ]
then
    FILE_NAME="$BASEDIR/../../app/api/$CONTROLLER_NAME"
else
    FILE_NAME="$BASEDIR/../../app/api/$FOLDER_NAME/$CONTROLLER_NAME"
fi

DIR="$BASEDIR/../../app/api/$FOLDER_NAME/";

if [ ! -d "$DIR" ]
then
    mkdir -p $DIR
fi

echo -e "//**************************************************************\n//* API CONTROLLER: $CONTROLLER_NAME\n//**************************************************************\n//* AUTHOR: $USER_NAME <$USER_EMAIL>\n//* BRANCH: $GIT_BRANCH\n//**************************************************************\n" > $FILE_NAME;
cat $BASEDIR/../../core/api/api_controller_template/ApiController.ts >> $FILE_NAME;

CONTROLLER_CLASS_NAME=${CONTROLLER_NAME%.ts}
ex -s -c "%s/ApiControllerNameWillBeUpdatedAutomatically/$CONTROLLER_CLASS_NAME/|x" $FILE_NAME

echo "New api controller $CONTROLLER_CLASS_NAME created!";
echo code $FILE_NAME;