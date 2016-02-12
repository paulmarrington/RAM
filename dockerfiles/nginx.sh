#!/bin/bash
cd /ram/frontend
gulp dist
nginx -c /ram/dockerfiles/nginx.conf
tail -f /dev/null
