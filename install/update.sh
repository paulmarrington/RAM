#!/bin/bash
# Usage: update.sh tag
# Can be branch name (default develop), tag name or hash tag
# The latter is gained by going to a comits page
# and press the button for copying hash.
export ramrel=${1:-develop}
curl -SLO "https://rawgit.com/atogov/RAM/$ramrel/frontend/frontend-dist.zip"
unzip frontend-dist.zip
https://raw.githubusercontent.com/atogov/RAM/1e2cc6f3b00d521e3fbcd520a118996e45d4e0fb/frontent/frontend-dist.zip
cd /ram/frontend
npm update
cd /ram/backend
npm update

cd /ram/backend
pm2 restart
