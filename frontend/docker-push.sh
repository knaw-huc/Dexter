#!/bin/bash

VERSION=$(npm pkg get version | tr -d \")
DOCKER_DOMAIN=registry.diginfra.net/tt

docker push ${DOCKER_DOMAIN}/dexter-frontend:${VERSION}
