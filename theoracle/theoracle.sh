#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

echo "---------------------------"
echo "THE ORACLE CLI"
echo "---------------------------"


if [ "$1" = "help" ]; then 
    
    echo "-> mongo start/stop : database"
    echo "-> app start/stop : front & back"
    echo "-> front start/stop : front"
    echo "-> back start/stop : back"
    echo "-> stats : statistiques"
    echo "-> build : build du projet"
    echo "-> udpate : maj du projet pour la prod"
    cd $DIR
    exit 0
fi;

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

    if [ "$2" = "log" ]; then 
        docker-compose logs
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

    if [ "$2" = "log" ]; then 
        docker-compose logs 
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

    if [ "$2" = "log" ]; then 
        docker-compose logs
        exit 0
    fi;

    cd $DIR
fi;


if [ "$1" = "core" ]; then 
    

    cd ./conf/core 
    if [ "$2" = "start" ]; then 
        docker-compose down
        docker-compose up -d
        exit 0
    fi;

    if [ "$2" = "stop" ]; then 
        docker-compose down
        exit 0
    fi;

    if [ "$2" = "log" ]; then 
        docker-compose logs 
        exit 0
    fi;

    cd $DIR
fi;


if [ "$1" = "app" ]; then 
    

    if [ "$2" = "start" ]; then 
        ./theoracle.sh front start
        ./theoracle.sh back start
        exit 0
    fi;

    if [ "$2" = "stop" ]; then 
        ./theoracle.sh front stop
        ./theoracle.sh back stop
        exit 0
    fi;

    cd $DIR
fi;

if [ "$1" = "stats" ]; then 

    docker stats --all --format "table {{.Name}}\t{{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

    cd $DIR
    exit 0
fi;



if [ "$1" = "build" ]; then 
    
    cd script
    ./build.sh

    cd $DIR
    exit 0
fi;


if [ "$1" = "update" ]; then 
    
   
    ./theoracle.sh front stop
    ./theoracle.sh back stop

    cd ..
    git pull origin develop
    cd theoracle

    ./theoracle.sh build

    cd $DIR
    exit 0
fi;

echo "Commande non reconnu"
cd $DIR

