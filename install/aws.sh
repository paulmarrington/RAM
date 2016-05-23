#!/bin/bash
if [ "$(id -u)" != "0" ]; then
	echo "Sorry, you are not root. Please use sudo bash aws.sh"
	exit 1
fi
apt-get update

## NGINX
apt-get install -y nginx
mkdir /var/www
chmod 777 /var/www

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
    root /ram/frontend;
    location /api/ {
      proxy_pass http://127.0.0.1:3000;
      proxy_set_header   Host             \$host;
      proxy_set_header   X-Real-IP        \$remote_addr;
      proxy_set_header   X-Forwarded-For  \$proxy_add_x_forwarded_for;
    }
  }
}
EOF

## NODE
if ! type curl > /dev/null; then
  apt-get install -y curl
fi
export NPM_CONFIG_LOGLEVEL=info
export NODE_VERSION=6.1.0
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
mkdir /data /data/db
chmod 777 /data /data/db
service mongod start

# Create RAM update script
mkdir /ram /ram/frontend /ram/backend /ram/log
cd /ram
cat > update.sh << EOF
  #!/bin/bash
  # Usage: update.sh tag
  # Can be branch name (default develop), tag name or hash tag
  # The latter is gained by going to a comits page
  # and press the button for copying hash.
  export ramrel="\${1:-develop}"
  rm -f *end-dist.tar.gz
  cd /ram/frontend
  curl -SLO "https://rawgit.com/atogov/RAM/\$ramrel/frontend/frontend-dist.tar.gz"
  tar -xzf frontend-dist.tar.gz
  if [ $? -ne 0 ]; then
    printf "\n\n$ramrel is not a valid tag/branch/hash for atogov/RAM\n\n"
    exit 1
  fi
  npm install
  cd /ram/backend
  curl -SLO "https://rawgit.com/atogov/RAM/\$ramrel/backend/backend-dist.tar.gz"
  tar -xzf backend-dist.tar.gz
  npm install
  
  cd /ram/backend
  pm restart all
EOF
chmod +x update.sh

npm install -g pm2
pm2 completion install

/ram/update.sh develop
chown -R ubuntu /ram
chgrp -R ubuntu /ram

export logname=`logname`
if [ $logname ]; then
  chown -R $logname /ram
fi

cd /ram/backend
nginx
pm2 start pm2.json
