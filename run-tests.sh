#!/bin/bash
set -ev

if [ "$TRAVIS_SECURE_ENV_VARS" == "false" ]; then

    # Force use of jspm registry auth token here due to the following situation:
    # - secure vars not available on pull requests which are classified by travis as untrusted builds
    # - jspm requires github authentication to avoid github rate limiting
    # - normally the github auth token is encrypted and put in .travis.yml however it's not available here
    # - all non upstream repo forks should provide their own JSPM_GITHUB_AUTH_TOKEN in travis environment variables
    jspm config registries.github.auth dHJ1bmdpZTp1eWVuMzQ=

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
