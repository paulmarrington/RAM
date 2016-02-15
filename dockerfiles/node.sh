#!/bin/bash
cd /ram/frontend
bower install --allow-root
gulp dist
tail -f /dev/null
