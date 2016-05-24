#!/bin/bash
set -ev

cd frontend
npm install
typings install
./node_modules/.bin/jspm cc
./node_modules/.bin/jspm install -y

cd ../backend
npm install
typings install

cd ../tests
npm install
jasmine
