#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

mkdir -p ../data/applog

cd ../runner
npm i
node theoracle-app.js

cd $DIR

