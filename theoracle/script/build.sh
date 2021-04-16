#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

rm -rf ../../theoracle/data/dist

cd ../../theoracle-front
npm i
npm run build
mkdir -p ../theoracle/data/dist/
cp -r dist/theoracle-front ../theoracle/data/dist/theoracle-front


cd $DIR
cd ../../theoracle-back
npm i
cp -r ../theoracle-back ../theoracle/data/dist/theoracle-back

cd $DIR
cd ../../theoracle-core
npm i
cp -r ../theoracle-core ../theoracle/data/dist/theoracle-core

cd $DIR

