#!/bin/bash
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates

sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D

sudo cat > /etc/apt/sources.list.d/docker.list << EOF
deb https://apt.dockerproject.org/repo ubuntu-trusty main
EOF

sudo apt-get update
sudo apt-get purge lxc-docker
sudo apt-get install -y linux-image-extra-$(uname -r) docker-engine
sudo usermod -a -G docker ubuntu # so we can run docker as ubuntu

sudo curl -o /usr/local/bin/docker-compose -L "https://github.com/docker/compose/releases/download/1.6.0/docker-compose-Linux-x86_64"
sudo chmod +x /usr/local/bin/docker-compose

cd RAM
sudo docker-compose build
sudo docker-compose up -d
