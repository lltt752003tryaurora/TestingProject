#!/bin/bash

npx sequelize-cli db:migrate --name 20240607060438-create-project.js
npx sequelize-cli db:migrate --name 20240606105804-create-user.js
npx sequelize-cli db:migrate --name 20240606111330-create-project-member.js
npx sequelize-cli db:migrate --name 20240606111334-create-release.js
npx sequelize-cli db:migrate --name 20240606111433-create-requirement.js
npx sequelize-cli db:migrate --name 20240606111404-create-issue.js


npx sequelize-cli db:seed --seed seeders/20240607062303-seed-projects.js
npx sequelize-cli db:seed --seed seeders/20240607082719-seed-users.js
npx sequelize-cli db:seed --seed seeders/20240607083234-seed-project-members.js
npx sequelize-cli db:seed --seed seeders/20240607084806-seed-releases.js
npx sequelize-cli db:seed --seed seeders/20240607090723-seed-requirements.js
npx sequelize-cli db:seed --seed seeders/20240607100435-seed-issues.js