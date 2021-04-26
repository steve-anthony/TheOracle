#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

echo "---------------------------"
echo "THE ORACLE CLI"
echo "---------------------------"

node --version | grep "v" &> /dev/null 
if [ $? == 0 ]; then 
 echo "Node Installed"
else 
 echo "Node not installed"
 exit 1;
fi

docker --version | grep "v" &> /dev/null 
if [ $? == 0 ]; then 
 echo "Docker Installed"
else 
 echo "Docker not installed"
 exit 1;
fi



mkdir -p data/mongo
mkdir -p data/mongolog
mkdir -p data/applog
mkdir -p data/mongoLocal

if [ "$1" = "help" ]; then 
    
    echo "-> mongo start/stop/log : database"
    echo "-> init : installation"
    cd $DIR
    exit 0
fi;

if [ "$1" = "mongo" ]; then 
    
    cd ./conf/mongo 
    if [ "$2" = "start" ]; then 
        docker-compose -f docker-compose-noAuth.yml down
        docker-compose -f docker-compose-noAuth.yml up -d
        exit 0
    fi;

    if [ "$2" = "stop" ]; then 
        docker-compose -f docker-compose-noAuth.yml down
        exit 0
    fi;

    if [ "$2" = "log" ]; then 
        docker-compose -f docker-compose-noAuth.yml logs
        exit 0
    fi;

    cd $DIR
fi;


if [ "$1" = "init" ]; then 

    echo "Installation des dépendances..."
    
    cd ../theoracle-core/
    npm i

    cd ../theoracle-back/
    npm i

    cd ../theoracle-front/
    npm i
       
    echo "Initialisation de la db..."

    cd ../theoracle-core/
    node main.js mongo

    cd $DIR

    echo "Initialisation terminée"

    exit 0
fi;

echo "Commande non reconnu"
cd $DIR

