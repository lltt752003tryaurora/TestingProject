#!/bin/bash

npx sequelize-cli db:migrate --env development-2
npx sequelize-cli db:seed:all --env development-2