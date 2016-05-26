#!/bin/bash
set -ev

if [ $TRAVIS_PULL_REQUEST != "false" ]; then
    echo "THIS IS A PULL REQUEST"
else
    echo "NOT A PULL REQUEST"
fi

dir=$(pwd)
export RAM_CONF=$dir/backend/conf/conf.js
echo $RAM_CONF

cd frontend
npm install
node_modules/.bin/typings install
jspm cc
jspm install -y

cd ../backend
npm install
node_modules/.bin/typings install
gulp ts:compile
gulp serve &
sleep 15

cd ../tests
npm install
gulp test
