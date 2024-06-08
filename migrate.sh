#!/bin/bash

npx sequelize-cli db:migrate --name 20240606105803-create-project.js
npx sequelize-cli db:migrate --name 20240606105804-create-attachment.js
npx sequelize-cli db:migrate --name 20240606105805-create-user.js
npx sequelize-cli db:migrate --name 20240606111330-create-project-member.js
npx sequelize-cli db:migrate --name 20240606111334-create-release.js
npx sequelize-cli db:migrate --name 20240606111433-create-requirement.js
npx sequelize-cli db:migrate --name 20240606111404-create-issue.js
npx sequelize-cli db:migrate --name 20240606111341-create-module.js
npx sequelize-cli db:migrate --name 20240606111345-create-test-plan.js
npx sequelize-cli db:migrate --name 20240606111349-create-test-plan-component.js
npx sequelize-cli db:migrate --name 20240606111352-create-test-case.js
npx sequelize-cli db:migrate --name 20240606111358-create-test-run.js
npx sequelize-cli db:migrate --name 20240606173516-create-release-attachment.js
npx sequelize-cli db:migrate --name 20240606173728-create-issue-attachment.js

npx sequelize-cli db:seed --seed seeders/20240607062303-seed-projects.js
npx sequelize-cli db:seed --seed seeders/20240607062304-seed-attachments.js
npx sequelize-cli db:seed --seed seeders/20240607082719-seed-users.js
npx sequelize-cli db:seed --seed seeders/20240607083234-seed-project-members.js
npx sequelize-cli db:seed --seed seeders/20240607084806-seed-releases.js
npx sequelize-cli db:seed --seed seeders/20240607090720-seed-modules.js
npx sequelize-cli db:seed --seed seeders/20240607090723-seed-requirements.js
npx sequelize-cli db:seed --seed seeders/20240607100435-seed-issues.js
npx sequelize-cli db:seed --seed seeders/20240608015618-seed-test-plans.js
npx sequelize-cli db:seed --seed seeders/20240608025258-seed-test-plan-components.js
npx sequelize-cli db:seed --seed seeders/20240608032109-seed-test-cases.js
npx sequelize-cli db:seed --seed seeders/20240608070016-seed-test-runs.js
npx sequelize-cli db:seed --seed seeders/20240608073642-seed-release-attachments.js
npx sequelize-cli db:seed --seed seeders/20240608084123-seed-issue-attachments.js