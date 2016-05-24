#!/bin/bash
set -ev

rswd="\$(cd \$(dirname "\$0"); pwd)"
export RAM_CONF="\$rswd/backend/conf/conf.js"

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
