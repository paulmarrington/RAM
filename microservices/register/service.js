// Create a docker proxy using redbird
var redbird = require("redbird");
// TODO: change bunyan option to false to increase speed of proxy x10d
var proxy = redbird({port: 80, bunyan: false});
//var proxy = redbird({port: 80, bunyan: {name:"RAM"}});
var docker_proxy = redbird.docker(proxy);

// Register micro-services based on directory
var fs      = require("fs");
var exclusions = {".": true, "..": true, "node_modules": true,
                  "spec": true, "register": true};
fs.readdir("..", (err, files) => {
  if (err) {
    console.log("Error reading microservices directory",err);
    return;
  }
  files.forEach((name) => {
    if (exclusions[name]) { return }
    docker_proxy.register(`microservice_register/${name}`, `ram_microservice_${name}`);
  })
});