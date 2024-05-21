#!/bin/sh

trap "exit" INT

REPO=apotdevin/thunderhub
BASE=base

echo
echo
echo "------------------------------------------"
echo "Building multiarch image for" $REPO
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

# docker buildx create --use

START=`date +%s`

docker buildx create --name mybuilder --use
docker buildx install

docker build \
    --platform linux/amd64,linux/arm64,linux/arm/v7 \
    --tag $REPO:$VERSION \
    --file ./Dockerfile \
    --push ./

END=`date +%s`

echo
echo
echo "Building basepath multiarch image for" $REPO
echo
echo

docker build \
    --build-arg BASE_PATH='/thub' \
    --platform linux/amd64,linux/arm64,linux/arm/v7 \
    --tag $REPO:$BASE-$VERSION \
    --file ./Dockerfile \
    --push ./

ENDBASE=`date +%s`

RUNTIME=$((END-START))
RUNTIME1=$((ENDBASE-END))

echo
echo
echo "------------------------------------------"
echo "DONE"
echo "------------------------------------------"
echo
echo
echo "Finished building and pushing images for" $REPO:$VERSION "and for" $REPO:$BASE-$VERSION
echo
echo "multiarch took" $RUNTIME "seconds"
echo "multiarch base took" $RUNTIME1 "seconds"
echo
echo