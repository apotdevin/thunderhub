#!/bin/sh

FILE=$1

echo "Creating cookie file for SSO authentication at" $FILE

mkdir -p "`dirname "$FILE"`" 
head -c 64 /dev/urandom | xxd -p -c 128 >  "$FILE.tmp"
mv "$FILE.tmp" "$FILE"

echo "Cookie file created."
echo "Starting ThunderHub server..."

npm run start
