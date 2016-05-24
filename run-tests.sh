#!/bin/bash
set -ev

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
