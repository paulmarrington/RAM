#!/bin/bash
set -ev

env | grep FOO

echo JSPM_GITHUB_AUTH_TOKEN is $JSPM_GITHUB_AUTH_TOKEN
jspm config registries.github.remote https://github.jspm.io
jspm config registries.github.auth $JSPM_GITHUB_AUTH_TOKEN
jspm config registries.github.maxRepoSize 100
jspm config registries.github.handler jspm-github

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
