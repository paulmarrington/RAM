#!/bin/bash
set -ev

cd frontend
npm install
typings install
jspm install

cd ../backend
npm install
typings install
