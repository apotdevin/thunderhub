#!/bin/sh

FILE=$1

echo "Creating cookie file for SSO authentication at" $FILE

mkdir -p "${FILE%/*}" 
echo "86AOqw7OfLeBKn0VlOuH5V0E51Qxy9BoXQ8qMDql901mc5GuXvdVRogWrZkuH2nRel5FA9H2Ie4rTLDO" >  "$FILE"

echo "Cookie file created."
echo "Starting ThunderHub server..."

npm run start