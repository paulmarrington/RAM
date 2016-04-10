# APIs

 1. [Back-end APIs](docs/api.md)

# Architecture

![System Architecture](https://raw.githubusercontent.com/atogov/RAM/develop/docs/images/system-architecture.png)

# High level system functionality - User UI Flow

![High Level Functionality ](https://raw.githubusercontent.com/atogov/RAM/develop/docs/images/ui-flow.png)

# Useful resources:
 1. [Development Environment](docs/environment.md)

## Development Environment Installation

* Create a (GitHub)[http://github.com] account if you do not already have one.
* Log in to your GitHub account
* Go to https://github.com/atogov/RAM
* Select the _Fork_ button from the top right
  * If you have not yet created a fork, you will be given that option now
    * Read https://help.github.com/articles/fork-a-repo/ for instructions. This will give you a repository in your own account that synchronises from the ATO RAM repository. As you make changes, use pull requests to update the main repository. Don't forget to merge from ATO before creating a pull request back.

### Windows
* Download the Github downloader/installer
  * Click on https://github-windows.s3.amazonaws.com/GitHubSetup.exe
  * and accept the download to save it
  * Once downloaded, run the exe
* The GitHub GUI should open once install is complete
  * Change shell to Bash
    * Select the tool icon on the top right
    * Selection _Options..._ from the menu
    * In the _Default shell_ section, choose **Git Bash**
* While there configure your GitHub account, clone path, etc
    * Close the options
    * To use SourceTree for reviewing / merging pull requests, you need to modify _.git/config_ file as described [here](https://gist.github.com/piscisaureus/3342247). In short, add the following:
        [remote "atogov"]
            fetch = +refs/pull/\*/head:refs/remotes/origin/pr/\*
* Run a git bash shell
  * from the GitHub GUI client
    * Select the tool icon on the top right
    * Selection _Open in Git Shell_ from the menu
  * curl -SLO https://raw.githubusercontent.com/atogov/RAM/develop/install/ram-dev-win.sh
  * ./ram-dev-win.sh _your-github-name_
    * Clones a local copy of your FORK of RAM
    * Uses _npm/tsd/jspm_ to install dependencies
    * Installs MongoDB
    * Installs Node
    * Installs Visual Studio Code

## AWS Install

* Each server requires its own configuration file. Template configuration file at _conf/conf.js_. You must set an environment variable called *RAM_CONF* pointing to the absolute path of your configuration file.
Once you set your *RAM_CONF* environment variable you can run the server by calling _gulp serve_.

* SSH to the server
  * curl -SLO https://raw.githubusercontent.com/atogov/RAM/develop/install/aws.sh
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

### From the Server

SSH to the server and run _/ram/update.sh hhhhhh_ where **hhhhhh** is the hash of the commit you want to run. It can also be a tag or branch name. If not supplied, _develop_ is used.

### From the UI (Dev env only)

From a browser run http://ramvm01.expoctest.com/dev. Enter a branch/tag/hash and press the appropriate button.

## The Development Process

* Fork and clone https://github.com/atogov/RAM if you haven't already. This need only be done once per developer.
* Open Git Shell
* Run _./ram.sh backend server&_
* Run _./ram.sh frontend server&_
* Wait patentially. Eventually a browser page will open
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
