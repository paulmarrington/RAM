# Table of Contents:
 1. [System Architecture](docs/architecture.md)
 1. [Development Environment](docs/environment.md)

## Development Environment Installation

### Source Access
* Create a GitHub account if you do not already have one.
* Fork and Clone https://github.com/atogov/RAM. Read https://help.github.com/articles/fork-a-repo/ for instructions. This will give you a repository in your own account that synchronises from the ATO RAM repository. As you make changes, use pull requests to update the main repository. Don't forget to merge from ATO before creating a pull request back.
* To use SourceTree for reviewing / merging pull requests, you need to modify _.git/config_ file as described [here](https://gist.github.com/piscisaureus/3342247). In short, add the following:
    [remote "atogov"]
        fetch = +refs/pull/\*/head:refs/remotes/origin/pr/\*

## AWS Install

* SSH to the server
  * curl -SLO https://raw.githubusercontent.com/atogov/RAM/master/install/aws.sh
  * **sudo bash aws-init.sh**
    * creates /etc/nginx/nginx.conf
    * installs NGINX
    * installs Nodejs
    * installs MongoDB
    * creates /ram/update.sh
    * runs /ram/update.sh
      * downloads and unpacks latest copy of RAM from GitHub
      * _npm update_ to update dependencies
      * restart RAM server

## AWS Update

### From the Server

SSH to the server and run _/ram/update.sh hhhhhh_ where **hhhhhh** is the hash of the commit you want to run. It can also be a tag or branch name. If not supplied, _develop_ is used.

### From the UI (Dev env only)

From a browser run http://ramvm01.expoctest.com/reset?from=hhhhhh. As above, the parameter is optional and can be a branch, tag or hash. It defaults to _develop_.

## The Development Process

* Fork and clone https://github.com/atogov/RAM if you haven't already. This need only be done once per developer.
* For each task:
  * Refresh your clone from RAM or another fork if that is the base you need.
  * Repeat...
    * Enable tests you want to work on.
    * Run Jasmine for a service called _nnnnn_. If the optional describe text is provided, only the _describe()_ that matches the text will run. Otherwise all tests in the file execute.
    * If it fails, add code to one of the service actions

## Jasmine from the Client
You may prefer to test your service from a browser. You can then select individual tests as needed. The browser will need to include

* _RAM/microservices/node_modules/ram/service/request.js_
* _RAM/microservices/nnnnn/spec.js_

## PM2 - Production Process Manager

Full use has yet to be explored. For development the watch can be set to restart on file changes. To do this we need to set up environments so that it only does so on development. This is a matter of setting and using environent variable within _ecosystem.json_.

## favicon.ico
Credit for creation of icon to [Alexandr Cherkinsky](https://thenounproject.com/cherkinskiy/)
