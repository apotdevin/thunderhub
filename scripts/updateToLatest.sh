#!/bin/sh

UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
    TAG=$(git tag | sort -V | tail -1)
    echo "You are up-to-date on version" $TAG
else
    # fetch latest master
    echo "Pulling latest changes..."
    git fetch
    git pull -p

    # install deps
    echo "Installing dependencies..."
    npm install --quiet

    # build nextjs
    echo "Building application..."
    npm run build

    TAG=$(git tag | sort -V | tail -1)
    echo "Updated to version" $TAG
fi
