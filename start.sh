#!/bin/bash

sudo docker-compose up -d  mongo1

sleep 5

docker exec mongo1 /scripts/rs-init.sh

sleep 1

sudo docker-compose up -d nodeserver
