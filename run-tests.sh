#!/bin/bash
set -ev

PWD=$(pwd)
export RAM_CONF=$PWD/backend/conf/conf-localhost.js

cd frontend
npm install
if [ "$TRAVIS_SECURE_ENV_VARS" == "false" ]; then

    # Force use of jspm registry auth token here due to the following situation:
    # - secure vars not available on pull requests which are classified by travis as untrusted builds
    # - jspm requires github authentication to avoid github rate limiting
    # - normally the github auth token is encrypted and put in .travis.yml however it's not available here
    # - all non upstream repo forks should provide their own JSPM_GITHUB_AUTH_TOKEN in travis environment variables

    echo "Secure environment variables not available. Probably a pull request. Using default auth key."

    # auth key owned by @sundriver - public_repo only
    node_modules/.bin/jspm config registries.github.auth c3VuZHJpdmVyOjI4NTU3ZjlkNzdhZGU4YjJhODk3NDQyOTEyMzU5NDY0ZDBjMjkwYmE=

fi
node_modules/.bin/typings install
node_modules/.bin/jspm -v
node_modules/.bin/jspm cc
node_modules/.bin/jspm install -y

cd ..

./ram deps:backend

if ./ram test:backend;
then
    echo Backend tests completed successfully
else
    echo Backend tests failed
    exit 1
fi


./ram deps:test

./ram db:seed
./ram start:backend &
sleep 30


if ./ram test:api;
then
    echo API tests completed successfully
else
    echo API tests failed
    exit 1
fi
