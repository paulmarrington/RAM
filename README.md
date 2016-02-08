## Development Environment Installation

### Install Docker
* Go to https://docs.docker.com and select your OS from the installation list on the left. It is very painless - even for Windows.
* The installation and familiarisation instructions work smoothly for Windows until you attempt to log in to your docker hub account. This may fail. If it does, follow https://github.com/docker/hub-feedback/ussues/473.
### Source Access
* Create a GitHub account if you do not already have one.
* On Windows or OS X it is beneficial to install the GitHub desktop from https://desktop.github.com/. For Windows is provides also provides a bash shell and many Unix commands so that common shell-scripts can be written. In both cases, the GUI will provide seamless access to GitHub.
* Fork and Clone https://github.com/atogov/RAM. Read https://help.github.com/articles/fork-a-repo/ for instructions. This will give you a repository in your own account that synchronises from the ATO RAM repository. As you make changes, use pull requests to update the main repository.
* Go to the RAM root directory with from a command prompt and type _docker-compose build_ then wait while containers and their contents are downloaded and built. This will take a long time - once per installation. It is also possible to publish the containers to share them between developer platforms.
* To use SourceTree for reviewing / merging pull requests, you need to modifty _.git/config_ file as described [here](https://gist.github.com/piscisaureus/3342247)

## Docker Containers

  * __ubuntu__ -  downloaded from https://hub.docker.com/_/ubuntu/. This is the base for almost all the following containers. We can change this to another Linux distribution (such as Red Hat) and rebuild the rest if needed. This container is never left running.
  * __mongo__ - downloaded from https://hub.docker.com/_/mongo/. This is a base reference container for the mongo containers created for RAM. This container is never left running.
  * __busybox__ - a minimal Linux distribution used as base for data specific containers. It contains useful Unix command to manipulate the data directories directly if needed. This container is never left running.
  * __ram_ubuntu__ - is created from _ubuntu_, adding any common packages that are convenient. Currently that includes curl, unzip and git. This container is never left running.
  * __ram_mongo__ - is created from _mongo_ with any RAM specifics added. This container is kept running, accessing the database in a data-specific container, _ram_mongo_data_.
  * __ram_mongo_data__ - a data container - one for each mongo database. It would be possible to have different copies with different data sets as needed. Use _docker remane_ to move container references around as needed. This container is never left running.
  * __ram_node__ - is created from _ram_ubuntu_ - and includes node, npm and jasmine. It is the base container for microservices and other node-based code. This container is never left running.
  * __ram_jasmine__ - is created from _ram_node_ and is left running. To execute all microservice jasmine specifications from the server, use _docker exec -it ram_jasmine jasmine_.
  * __ram_microservice_register__. One ring to rule them all. It uses the NPM package Redbird to provide a reverse proxy to access all running microservices on a cluster. Redbird in turn relies on http-proxy (a Nodejitsu project) for the reverse proxy. When a container start, the register is informed and creates a path _host:90//service_name_ where the service name has _ram_microservice\__ removed.
  * __ram_microservice_template__. Is the base microservice. It does nothing useful except provide code to be copied to create a new service.
  * __ram_microservice\*__ - all the other microservices in the running docker instance/cluster.

# How to Create a New MicroService
Microservice source is kept in RAM/microservices/. To create a new one, say _fred_, copy the directory _template_ to _fred_ and edit/review the following files:

* __spec/__ is a directory to tell Jasmine how to do it's job. The contents remain unchanged between microservices.
* __Dockerfile__ tells _docker-compose_ how to build the microservice container. It will normally remain unchanged from the template copy. If, however a specific microservice requires additional configuration, it is done here. This can take the form of _apt-get_ for OS packaged, special start-up scripts or other specific details.
* __package.json__ is the first file that requires changing. Correct the microservice name on the first line, the description on the third and the author on the fourth. The first is the only critical change.
* __README.md__ needs to be updated with a description of what a microservice provides. It constitutes core documentation for the system.
* __service.js__ is the service distributor. For each action the service is to provide is a dictionary entry pointing to the function to call. The template version provides a clear example of the functionality.
* __spec.js__ contains the jasmine specification to be run against the code for validation. It can contain multiple describe statements each containing multiple detailed specifications. Change it to exercise the new service.
* __RAM/docker-compose.yml__ needs to be edited.
  * Copy the entry for _microservice_template_
  * Change the name to _microservice_fred_
  * Similarly update the _container_name_, _build_ and _working_directory_ entries.
  * Change the _ports_ entry from _5860:5858_ to _5xxx:5050_ where xxx is next free port.

## The Development Process

* Fork and clone https://github.com/atogov/RAM if you haven't already. This need only be done once per developer.
* For each new microservice:
  * Copy the template microservice and rename it.
  * Update _package.json_
  * Fill in _README.md_ with the definition of the microservice that should be part of the task brief.
  * Edit _service.js_ and add all the actions expected - with minimal content of the form:
    * _action_name: function(packet) { throw "not implemented" }_
  * Edit _spec.js_ and fill in specifications to the best of your knowledge at this time. Each action should have one describe with multiple tests. Add _x_ in front of _describe()_ or _it()_ for all the tests you are not working on and are not complete.
  * Start the service from Docker with
    * _docker-compose up -d_
* For each task:
  * Refresh your clone from RAM or another fork if that is the base you need.
  * Repeat
    * Enable tests you want to work on.
    * Run Jasmine for a service called _nnnnn_. If the optional describe text is provided, only the _describe()_ that matches the text will run. Otherwise all tests in the file execute.
      * _docker exec -it ram_microservice_nnnnn jasmine [optional describe]_
    * If it fails, add code to one of the service actions
    * Restart the service with
      * _docker-compose restart microservice_nnnnn_

## Jasmine from the Client
You may prefer to test your service from a browser. You can then select individual tests as needed. The browser will need to include

* _RAM/microservices/node_modules/ram/service/request.js_
* _RAM/microservices/nnnnn/spec.js_

## Debugging

If your IDE supports remote Node debugging

* Run _docker-machine url default_ and note the IP address
* In your debugger, use this as the URL and _58xx_ as the port.
  * _xx_ is defined in the _docker-compose_ entry for your microservice.

## Library Functions
Library modules are kept in RAM/microservices/node_modules/ram. Add directories under here for code common to a limited set of microservices.

* **RAM/microservices/service/register.js** is used by all services.
* **RAM/microservices/service/request.js** is used by jasmine and all other clients of services.

## Common Commands

* **docker** - displays list of docker commands
* **docker-composer** - display a list of docker composer commands
* **docker-machine** - display a list of docker machine commands

### Starting and Stopping the container suite
    docker-compose up -d  # Start all needed images from docker-compose.yml
    docker-compose stop   # Stop all images run by composer
    docker-compose restart microservice_nnnnn # restart the container
    docker logs --tail=50 -f ram microservice_nnnnn # service stdout & stderr

### Investigate Containers
    docker exec -it ram_nnnnn bash # open shell on container
    docker images  # display all the images known
    docker ps      # display information on running images
    docker-compose ps # display information on images known to the composer

### Clean up Unused Containers (reduces disk space)

    docker-compose rm # remove all containers from composer. Safe in docker
    docker-compose rm microservice_nnnnn # remove from composer. Safe in docker

    # Run these two commands to remove the droppings docker experiments leave
    docker rm $(docker ps -a -q)
    docker rmi -f $(docker images | grep "^<none>" | awk "{print $3}")

### Mongo Admin
    # Spawn a mongo shell in Linux/OS X
    docker run -it --link ram_mongo_1:mongo --rm mongo sh -c 'exec mongo "$MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT/test"'
    # Spawn a mongo shell in Windows
    docker run -it --link ram_mongo_1:mongo --rm mongo sh -c 'exec mongo "%MONGO_PORT_27017_TCP_ADDR%:%$MONGO_PORT_27017_TCP_PORT%/test"'
