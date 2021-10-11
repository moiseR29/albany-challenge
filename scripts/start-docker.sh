#!/bin/sh

docker build -t albany-docker . && docker run --name albany-challenge -p 8080:8080 --link albany-database -d albany-docker 