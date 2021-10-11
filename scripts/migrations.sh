#!/bin/sh

node node_modules/.bin/db-migrate up --config ./scripts/util/database.json -e $1
