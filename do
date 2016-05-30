#!/bin/bash

app="RAM"
me="$(basename "$(test -L "$0" && readlink "$0" || echo "$0")")"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


# prerequisites:
#  brew
#  git
#  nvm
#  npm

nvm install 6.1.0
export PATH=./node_modules/.bin:../node_modules/.bin:$PATH

case "$1" in

# SETUP

  'setup')
    echo ""
    echo "Setting up local workstation ..."
    echo ""
    npm install -g typings
    npm install -g gulp
    npm install -g bower
    echo ""
    ;;

  'deps')
    echo ""
    echo "Downloading dependencies ..."
    ./$me deps:frontend
    ./$me deps:backend
    ./$me deps:test
    echo ""
    ;;

  'deps:frontend')
    echo ""
    echo "Downloading frontend dependencies ..."
    cd frontend
    npm install && bower install && typings install
    echo ""
    ;;

  'deps:backend')
    echo ""
    echo "Downloading backend dependencies ..."
    cd backend
    npm install && typings install
    echo ""
    ;;

  'deps:test')
    echo ""
    echo "Downloading backend dependencies ..."
    cd tests
    npm install && typings install
    echo ""
    ;;

# START

  'start:frontend')
    echo ""
    echo "Starting frontend"
    cd frontend
    gulp serve
    echo ""
    ;;

  'start:backend')
    echo ""
    echo "Starting backend"
    cd backend
    RAM_CONF=$DIR/backend/conf/conf.js gulp serve
    echo ""
    ;;

# TEST

  # run all API tests or, limit to one with --test <test name>
  # e.g.
  #     ./do test:api --test relationshipType.model
  'test:backend')
    echo ""
    echo "Starting tests"
    cd backend
    if [ -z "$3" ]
      then
        gulp test
      else
        gulp test "$2" "$3"
    fi
    echo ""
    ;;

  # run all API tests or, limit to one with --test <test name>
  # e.g.
  #     ./do test:api --test relationshipType.controller
  'test:api')
    echo ""
    echo "Starting tests"
    cd tests
    if [ -z "$3" ]
      then
        gulp test
      else
        gulp test "$2" "$3"
    fi
    echo ""
    ;;

# OTHER

  'clean')
    echo ""
    echo "Cleaning all generated files ..."
    echo ""
    rm -rf $DIR/frontend/dist
    rm -rf $DIR/backend/dist
    rm -rf $DIR/tests/dist
    echo ""
    ;;

  'swagger')
    echo ""
    echo "Opening browser to swagger apis on local server ..."
    echo ""
    open "http://localhost:3000/api-docs/"
    echo ""
    ;;

  'staging')
    echo ""
    echo "Opening browser to staging instance ..."
    echo ""
    open "http://ramvm01.expoctest.com/#/"
    echo ""
    ;;

  'github')
    echo ""
    echo "Opening browser to github repository ..."
    echo ""
    open "https://github.com/atogov/RAM"
    echo ""
    ;;

  'wiki')
    echo ""
    echo "Opening browser to github repository ..."
    echo ""
    open "https://github.com/atogov/RAM/wiki"
    echo ""
    ;;
  *)

# USAGE

    echo -e ""
    echo "Usage:"
    echo ""
    echo "$(tput setaf 5)    $me$(tput sgr0) $(tput setaf 3)<command>$(tput sgr0)"
    echo ""
    echo "Commands:"
    echo ""
    echo "$(tput setaf 3)    setup                                $(tput sgr0)      Setups local workstation"
    echo "$(tput setaf 3)    deps                                 $(tput sgr0)      Download all dependencies"
    echo "$(tput setaf 3)    deps:frontend                        $(tput sgr0)      Download frontend dependencies"
    echo "$(tput setaf 3)    deps:backend                         $(tput sgr0)      Download backend dependencies"
    echo "$(tput setaf 3)    deps:test                            $(tput sgr0)      Download api test dependencies"
    echo ""
    echo "$(tput setaf 3)    test:backend                         $(tput sgr0)      Runs backend tests"
    echo "$(tput setaf 3)    test:api                             $(tput sgr0)      Runs API tests"
    echo ""
    echo "$(tput setaf 3)    start:frontend                       $(tput sgr0)      Starts local frontend server"
    echo "$(tput setaf 3)    start:backend                        $(tput sgr0)      Starts local backend server"
    echo ""
    echo "$(tput setaf 3)    db:drop                              $(tput sgr0)      Drops local database"
    echo "$(tput setaf 3)    db:seed                              $(tput sgr0)      Seeds local database"
    echo ""
    echo "$(tput setaf 3)    clean                                $(tput sgr0)      Cleans all generated files"
    echo "$(tput setaf 3)    swagger                              $(tput sgr0)      Opens browser to swagger apis on local server"
    echo "$(tput setaf 3)    staging                              $(tput sgr0)      Opens browser to staging instance"
    echo "$(tput setaf 3)    github                               $(tput sgr0)      Opens browser to github repository"
    echo "$(tput setaf 3)    wiki                                 $(tput sgr0)      Opens browser to project wiki"
    echo ""
    ;;

esac

