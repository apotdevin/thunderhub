#!/bin/sh

REPO=apotdevin/thunderhub

echo
echo
echo "------------------------------------------"
echo "Building images for" $REPO
echo "------------------------------------------"
echo
echo

git checkout master || exit
git pull || exit

VERSION=$(git describe --tags --abbrev=0 2>&1)

git checkout $VERSION || exit

NOT_LATEST=false

echo "Do you want to build images for version" $VERSION "?"
select yn in "Yes" "No" "Specify"; do
    case $yn in
        Yes ) break;;
        Specify) NOT_LATEST=true; break;; 
        No ) exit;;
    esac
done

if [ "$NOT_LATEST" = true ]; then
read -p "Enter the version you want to build: "  VERSION
git checkout $VERSION || exit
fi


START=`date +%s`

echo
echo
echo "------------------------------------------"
echo "Building amd64 image for version" $VERSION
echo "------------------------------------------"
echo
echo

docker build --pull -t $REPO:$VERSION-amd64 -f Dockerfile .
docker push $REPO:$VERSION-amd64

ENDAMD=`date +%s`

echo
echo
echo "------------------------------------------"
echo "Building arm32v7 image for version" $VERSION
echo "------------------------------------------"
echo
echo

docker build --pull -t $REPO:$VERSION-arm32v7 -f arm32v7.Dockerfile .
docker push $REPO:$VERSION-arm32v7

ENDARM32=`date +%s`

echo
echo
echo "------------------------------------------"
echo "Building arm64v8 image for version" $VERSION
echo "------------------------------------------"
echo
echo

docker build --pull -t $REPO:$VERSION-arm64v8 -f arm64v8.Dockerfile .
docker push $REPO:$VERSION-arm64v8

ENDARM64=`date +%s`

echo
echo
echo "------------------------------------------"
echo "Creating manifest for version" $VERSION
echo "------------------------------------------"
echo
echo

docker manifest create --amend $REPO:$VERSION $REPO:$VERSION-amd64 $REPO:$VERSION-arm32v7 $REPO:$VERSION-arm64v8
docker manifest annotate $REPO:$VERSION $REPO:$VERSION-amd64 --os linux --arch amd64
docker manifest annotate $REPO:$VERSION $REPO:$VERSION-arm32v7 --os linux --arch arm --variant v7
docker manifest annotate $REPO:$VERSION $REPO:$VERSION-arm64v8 --os linux --arch arm64 --variant v8
docker manifest push $REPO:$VERSION -p

RUNTIME=$((ENDAMD-START))
RUNTIME1=$((ENDARM32-ENDAMD))
RUNTIME2=$((ENDARM64-ENDARM32))

git checkout master
git pull

echo
echo
echo "------------------------------------------"
echo "DONE"
echo "------------------------------------------"
echo
echo
echo "Finished building and pushing images for" $REPO:$VERSION
echo
echo "amd64 took" $RUNTIME "seconds"
echo "arm32v7 took" $RUNTIME1 "seconds"
echo "arm64v8 took" $RUNTIME2 "seconds"
echo
echo