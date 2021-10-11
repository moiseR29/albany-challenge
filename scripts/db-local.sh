#!/bin/sh

if [ ! -x "$(command -v docker)" ]; then
  echo "No tenes instalado docker"
  echo "Necesitas docker para poder inicar la db"
  exit 1
fi

docker run --name albany-database -p 5432:5432 -e POSTGRES_PASSWORD=challenge -e POSTGRES_USER=albany -e POSTGRES_DB=dev -d postgres
