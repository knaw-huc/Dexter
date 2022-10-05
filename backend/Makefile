all: help
TAG := dexter-backend
DOCKER_REGISTRY := registry.diginfra.net
DOCKER_DOMAIN := $(DOCKER_REGISTRY)/tt
VERSION = $(shell cat .make/.version)

.make:
	mkdir -p .make

.make/.version: .make pom.xml
	mvn help:evaluate -Dexpression=project.version -q -DforceStdout > .make/.version

server/target/dexter-server-$(VERSION): .make/.version $(shelld find server/src -type f) pom.xml server/pom.xml
	mvn --projects server --also-make package

.POHNY: build
build: .make/.version server/target/dexter-server-$(VERSION).jar

.PHONY: build-server
build-server: .make/.version server/target/dexter-server-$(VERSION).jar

.PHONY: run-server
run-server: build-server
	java -jar server/target/dexter-server-$(VERSION).jar server config.yml

.make/.docker: .make deploy/dexter-server/Dockerfile-multistage
	docker build -t $(TAG):$(VERSION) -f deploy/dexter-server/Dockerfile-multistage .
	@touch $@

.PHONY: docker-image
docker-image: .make/.docker

.make/.push-server: build deploy/dexter-server/Dockerfile
	docker build -t $(TAG):$(VERSION) --platform=linux/amd64 -f deploy/dexter-server/Dockerfile .
	docker tag $(TAG):$(VERSION) $(DOCKER_DOMAIN)/$(TAG):$(VERSION)
	docker push $(DOCKER_DOMAIN)/$(TAG):$(VERSION)
	@touch $@

.PHONY: push
push: .make/.push-server

.PHONY: clean
clean:
	rm -rf .make
	mvn clean

.PHONY: version-update
version-update:
	mvn versions:set && mvn versions:commit && find . -name dependency-reduced-pom.xml -delete

.PHONY: help
help:
	@echo "make-tools for $(TAG)"
	@echo "Please use 'make <target>' where <target> is one of:"
	@echo "  build           to test and build the project"
	@echo "  build-server    to test and build the project"
	@echo "  run-server      to start the server app (hit ^C to stop server)"
	@echo "  docker-image    to build the docker image of the app"
	@echo "  push            to push the linux/amd64 docker image to $(DOCKER_REGISTRY)"
	@echo "  clean           to remove generated files"
	@echo "  version-update  to update the project version"
