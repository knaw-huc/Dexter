#!/bin/bash

VERSION=$(npm pkg get version | tr -d \")

docker build -t dexter-frontend:${VERSION} -f deploy/Dockerfile-deploy .
