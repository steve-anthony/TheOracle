#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR


cd conf/mongo 
docker-compose down
docker-compose up -d


cd $DIR

