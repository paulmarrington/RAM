#!/bin/bash
if [ "$(id -u)" != "0" ]; then
	echo "Sorry, you are not root. Please use sudo bash aws.sh"
	exit 1
fi
apt-get update

## NGINX
apt-get install -y nginx
cat > /etc/nginx/nginx.conf << EOF
# user www-data;

worker_processes  2;
error_log  /var/log/nginx/error.log;
pid        /var/run/nginx.pid;

events {
  worker_connections  1024;
  multi_accept on;
}

http {
  include       /etc/nginx/mime.types;

  access_log  /var/log/nginx/access.log;
 proxy_cache_path  /var/www/cache levels=1:2 keys_zone=my-cache:32m max_size=1000m inactive=600m;
  proxy_temp_path /var/www/cache/tmp;

  sendfile        on;
  #tcp_nopush     on;

  #keepalive_timeout  0;
  keepalive_timeout  65;
  tcp_nodelay        on;

  gzip  on;
  gzip_http_version 1.0;
  gzip_vary on;
  gzip_comp_level 6;
  gzip_proxied any;
  gzip_types text/plain text/css text/javascript application/javascript application/json application/x-javascript text/xml application/xml application/xml+rss;
  gzip_disable "MSIE [1-6]\.(?!.*SV1)";

  server {
    listen   *:80; ## listen for ipv4
    access_log  /var/log/nginx/localhost.access.log;
    root /ram/frontend/dist;
    location /rest/ {
      proxy_pass http://127.0.0.1:8080;
      proxy_set_header   Host             $host;
      proxy_set_header   X-Real-IP        $remote_addr;
      proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }
    location /api-docs {
      proxy_pass http://127.0.0.1:8080;
      proxy_redirect     off;
      server_name_in_redirect off;
      proxy_set_header   Host             $host;
      proxy_set_header   X-Real-IP        $remote_addr;
      proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;

      if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*';
        #
        # Om nom nom cookies
        #
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        #
        # Custom headers and headers various browsers *should* be OK with but aren't
        #
        add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
        #
        # Tell client that this pre-flight info is valid for 20 days
        #
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain charset=UTF-8';
        add_header 'Content-Length' 0;
        return 204;
      }
      if ($request_method = 'POST') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
      }
      if ($request_method = 'GET') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
      }
    }

  }

}
EOF

## NODE
if ! type curl > /dev/null; then
  apt-get install -y curl
fi
export NPM_CONFIG_LOGLEVEL=info
export NODE_VERSION=4.2.6
export NV=$NODE_VERSION
export NVF=node-v$NV-linux-x64.tar.gz

curl -SLO "https://nodejs.org/dist/v$NV/$NVF"
tar -xzf "$NVF" -C /usr/local --strip-components=1
rm "$NVF"

## MongoDB
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
apt-get update
apt-get install -y mongodb-org
service mongod start

# Get initial version of distribution code
mkdir /ram
cd /ram
apt-get install -y unzip
curl -SLO "https://rawgit.com/atogov/RAM/develop/frontend/frontend-dist.zip"
unzip frontend-dist.zip
export $logname=`logname`
if [ $logname ]; then
  chown -R $logname /ram
  sudo su $logname install/npm-packages.sh
fi
