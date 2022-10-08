FROM openjdk:18.0.2-slim-buster

RUN apt update \
    && apt install -y curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /apps/dexter

COPY ./server/target/dexter-server-*.jar /apps/dexter/dexter-server.jar
COPY ./deploy/dexter-server/entrypoint.sh entrypoint.sh
COPY ./config.yml config.yml
COPY ./db db/migration

EXPOSE 8080

ENTRYPOINT ["./entrypoint.sh"]