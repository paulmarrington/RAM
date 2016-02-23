Important: make sure you have the latest node version installed [5.6 or higher](https://nodejs.org/en/), open a terminal and check the version by __node --version__

To install dependencies:

     cd backend
     npm install
     tsd install
     npm install -g nodemon (useful for development)
To run, make sure you provide RAM_CONF in aboslute path format:

     SET RAM_CONF=c:/Users/ProjectFolder/conf/myConf.js
     node backend/typescript/server.js


