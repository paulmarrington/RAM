#!/bin/bash
set -ev

cd frontend
npm install
typings install
jspm cc
jspm install -y

cd ../backend
npm install
typings install
gulp serve &

cd ../tests
npm install
gulp test
