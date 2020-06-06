#!/bin/sh

REPO=apotdevin/thunderhub
VERSION=0.7.1

docker build --pull -t $REPO:$VERSION-amd64 -f Dockerfile .
docker push $REPO:$VERSION-amd64

docker build --pull -t $REPO:$VERSION-arm32v7 -f arm32v7.Dockerfile .
docker push $REPO:$VERSION-arm32v7

docker build --pull -t $REPO:$VERSION-arm32v7 -f arm64v8.Dockerfile .
docker push $REPO:$VERSION-arm64v8

docker manifest create --amend $REPO:$VERSION $REPO:$VERSION-amd64 $REPO:$VERSION-arm32v7 $REPO:$VERSION-arm64v8
docker manifest annotate $REPO:$VERSION $REPO:$VERSION-amd64 --os linux --arch amd64
docker manifest annotate $REPO:$VERSION $REPO:$VERSION-arm32v7 --os linux --arch arm --variant v7
docker manifest annotate $REPO:$VERSION $REPO:$VERSION-arm64v8 --os linux --arch arm64 --variant v8
docker manifest push $REPO:$VERSION -p