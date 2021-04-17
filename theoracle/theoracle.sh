#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

echo "---------------------------"
echo "THE ORACLE CLI"
echo "---------------------------"

if [ "$1" = "mongo" ]; then 
    
    cd ./conf/mongo 
    if [ "$2" = "start" ]; then 
        docker-compose down
        docker-compose up -d
        exit 0
    fi;

    if [ "$2" = "stop" ]; then 
        docker-compose down
        exit 0
    fi;

    cd $DIR
fi;


if [ "$1" = "front" ]; then 
    
    cd ./conf/front 
    if [ "$2" = "start" ]; then 
        docker-compose down
        docker-compose up -d
        exit 0
    fi;

    if [ "$2" = "stop" ]; then 
        docker-compose down
        exit 0
    fi;

    cd $DIR
fi;


if [ "$1" = "back" ]; then 
    
    cd ./conf/back 
    if [ "$2" = "start" ]; then 
        docker-compose down
        docker-compose up -d
        exit 0
    fi;

    if [ "$2" = "stop" ]; then 
        docker-compose down
        exit 0
    fi;

    cd $DIR
fi;

echo "Commande non recconue."
cd $DIR

