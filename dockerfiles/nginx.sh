#!/bin/bash
nginx -c /ram/dockerfiles/nginx.conf
tail -f /dev/null
