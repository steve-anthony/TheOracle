#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

# image docker pour node
mkdir -p ../data/mongo
mkdir -p ../data/mongolog
mkdir -p ../data/applog

# image docker pour node
cd ../../theoracle/conf/node
docker build -t node-docker .

# build frontend
cd $DIR
rm -rf ../../theoracle/data/dist

cd ../../theoracle-front
npm i
ng build
mkdir -p ../theoracle/data/dist/theoracle-front/dist
cp -r dist/theoracle-front/* ../theoracle/data/dist/theoracle-front/dist
cp -r ../theoracle/conf/front/theoracle-front.js ../theoracle/data/dist/theoracle-front
cp -r ../theoracle/conf/front/package.json ../theoracle/data/dist/theoracle-front
cd ../theoracle/data/dist/theoracle-front
npm i 

# build backend
cd $DIR
cd ../../theoracle-back
npm i
cp -r ../theoracle-back ../theoracle/data/dist/theoracle-back

# build core
cd $DIR
cd ../../theoracle-core
npm i
cp -r ../theoracle-core ../theoracle/data/dist/theoracle-core

cd $DIR

