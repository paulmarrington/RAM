#!/bin/bash
set -ev

dir=$(PWD)
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
gulp serve &

cd ../tests
npm install
gulp test
