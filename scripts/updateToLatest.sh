#!/bin/sh
# fetch latest master
echo "Checking for changes upstream ..."
git fetch
UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
    TAG=$(git tag | sort -V | tail -1)
    echo "You are up-to-date on version" $TAG
else
    echo "Reseting repository..."
    git reset --hard

    echo "Pulling latest changes..."
    git pull -p

    # install deps
    echo "Installing dependencies..."
    npm install --quiet

    # build nextjs
    echo "Building application..."
    npm run build

    # remove useless deps
    echo "Removing unneccesary modules..."
    npm prune --production

    TAG=$(git tag | sort -V | tail -1)
    echo "Updated to version" $TAG
fi