#!/bin/bash

# This script allows to export the application into a zip file.
# To use the script, simply run `./zip.sh myzip` where myzip is the name of the generated zip file.
# The zip file is created at the same location as the folder containing this file.
# You can also put a sencond argument to specify the folder to zip.
dirname=${PWD##*/}
if [[ -z $1 ]]; then
   zip -r ../$dirname . -x "./node_modules/*" -x "*.git*" -x "./forepaas/*"  -x "./production/*"
else
   if [[ -z $2 ]]; then
      zip -r ../$1 . -x "./node_modules/*" -x "*.git*" -x "./forepaas/*" -x "./production/*"
   else
      cd $2 && zip -r ../$1 . -x "./node_modules/*" -x "*.git*" -x "./forepaas/*" -x "./production/*"
   fi
fi