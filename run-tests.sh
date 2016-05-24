#!/bin/bash
set -ev

export RAM_CONF=../../../conf/conf.js

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
