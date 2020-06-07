#!/bin/sh

REPO=apotdevin/thunderhub

echo
echo "------------------------------------------"
echo "Building images for" $REPO
echo "------------------------------------------"
echo

git checkout master
git pull

VERSION=$(git describe --tags --abbrev=0 2>&1)

git checkout $VERSION

START=`date +%s`

echo
echo "------------------------------------------"
echo "Building amd64 image for version" $VERSION
echo "------------------------------------------"
echo

docker build --pull -t $REPO:$VERSION-amd64 -f Dockerfile .
docker push $REPO:$VERSION-amd64

ENDAMD=`date +%s`

echo
echo "------------------------------------------"
echo "Building arm32v7 image for version" $VERSION
echo "------------------------------------------"
echo

docker build --pull -t $REPO:$VERSION-arm32v7 -f arm32v7.Dockerfile .
docker push $REPO:$VERSION-arm32v7

ENDARM32=`date +%s`

echo
echo "------------------------------------------"
echo "Building arm64v8 image for version" $VERSION
echo "------------------------------------------"
echo

docker build --pull -t $REPO:$VERSION-arm64v8 -f arm64v8.Dockerfile .
docker push $REPO:$VERSION-arm64v8

ENDARM64=`date +%s`

echo
echo "------------------------------------------"
echo "Creating manifest for version" $VERSION
echo "------------------------------------------"
echo

docker manifest create --amend $REPO:$VERSION $REPO:$VERSION-amd64 $REPO:$VERSION-arm32v7 $REPO:$VERSION-arm64v8
docker manifest annotate $REPO:$VERSION $REPO:$VERSION-amd64 --os linux --arch amd64
docker manifest annotate $REPO:$VERSION $REPO:$VERSION-arm32v7 --os linux --arch arm --variant v7
docker manifest annotate $REPO:$VERSION $REPO:$VERSION-arm64v8 --os linux --arch arm64 --variant v8
docker manifest push $REPO:$VERSION -p

RUNTIME=$((ENDAMD-START))
RUNTIME1=$((ENDARM32-ENDAMD))
RUNTIME2=$((ENDARM64-ENDARM32))

echo
echo "------------------------------------------"
echo "DONE"
echo "------------------------------------------"
echo
echo "Finished building and pushing images for" $REPO:$VERSION
echo
echo "amd64 took" $RUNTIME "seconds"
echo "arm32v7 took" $RUNTIME1 "seconds"
echo "arm64v8 took" $RUNTIME2 "seconds"
echo