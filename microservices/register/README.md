# Microservice Discovery Service

Nothing comes for free. Microservices can be about as loosely coupled as you can imagine. On the flip-side, how can we know if a service is available? The answer is a reverse proxy. This proxy provides a single interface for a server or server cluster to the outside world using either http or https. Whenever a microservice container starts the proxy is told to add an entry with the same name as the service. In short

  * Redbird uses Dolphin to listen to Docker
  * A service named ram_microservice_xxx starts
    * All services think they are serving on port 80
    * Docker will export port 80 as some other unique port
  * Redbird creates a route
    * http(s)://host/ram_microservice_xxx points to port 80 on the service
  * A second service named ram_microservice_xxx starts
    * Redbird will round-robin load balance between the services
  * One of the services above exits or crashes
    * Redbird will de-register the route
    
The discovery service includes code within RAM to drive the Redbird proxy. The system can use node clusters to provide discovery service redundancy and automatic thread restart.

## Possible Extensions

  * Ask a newly attached service for configuration details.
  * Add a dynamic component to load balancing.
    * Start a new service while current ones are busy
    * Services stop if not used for a period of time
