#!/bin/bash
set -ev

dir=$(pwd)
export RAM_CONF=$dir/backend/conf/conf.js

echo RAM_CONF is $RAM_CONF

cd frontend
npm install
node_modules/.bin/typings install
jspm cc
jspm install -y

cd ../backend
npm install
node_modules/.bin/typings install
RAM_CONF=$dir/backend/conf/conf.js gulp serve &

cd ../tests
npm install
gulp test
